import http from 'http';
import path from 'path';
import fs from 'fs';
import url from 'url';
import querystring from 'querystring';
import nowConfig from './now.json';

function preprocessRequest(request: http.IncomingMessage, response: http.ServerResponse) {
    console.log(request.method, request.url);

    const cookies: { [key: string]: string } = {};
    if (request.headers.cookie) {
        for (const cookie of request.headers.cookie.split(';')) {
            const match = cookie.match(/^\s*([^=]+)=\s*(.*?)\s*$/);
            if (match)
                cookies[match[1]] = match[2];
        }
    }
    const parsedUrl = url.parse(request.url || "/");
    const preprocessed = request as PreprocessedRequest;
    preprocessed.url = parsedUrl.pathname!;
    preprocessed.query = querystring.parse(parsedUrl.query || "");
    preprocessed.cookies = cookies;
    preprocessed.body = null;

    if (request.method == 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data;

            if (body.length > 100000) {
                response.writeHead(500);
                response.end('Internal server error');
                request.connection.destroy();
            }
        });

        request.on('end', function () {
            if (request.headers["content-type"] === "application/x-www-form-urlencoded")
                preprocessed.body = querystring.parse(body);
            else if (request.headers["content-type"] === "application/json")
                preprocessed.body = JSON.parse(body);
            else
                preprocessed.body = body;

            matchRoute(preprocessed, response);
        });
    } else
        matchRoute(preprocessed, response);
}

function matchRoute(request: PreprocessedRequest, response: http.ServerResponse) {
    const url = request.url;
    if (!url)
        return;

    var filePath = './public/' + url.replace(/^[\.\/\\]+/, "");
    if (filePath.endsWith('/')) {
        filePath += 'index.html';
    }
    fs.exists(filePath, (exists) => {
        if (exists)
            return getStaticFile(filePath, response);

        for (const rewrite of nowConfig.rewrites) {
            if (rewrite.source === url) {
                require(path.join(__dirname, rewrite.destination)).default(request, response);
                return;
            }

            const paramNamesMatch = rewrite.source.match(/\/:[A-Za-z_]+/g);
            if (paramNamesMatch) {
                const regex = new RegExp(rewrite.source.replace(/\/:[A-Za-z_]+/g, "/([^/]+)"));
                const match = url.match(regex);
                if (match) {
                    let i = 1;
                    while (match[i]) {
                        console.log(paramNamesMatch[i - 1].slice(2), match[i]);
                        request.query[paramNamesMatch[i - 1].slice(2)] = match[i];
                        i++;
                    }
                    require(path.join(__dirname, rewrite.destination)).default(request, response);
                    return;
                }
            }
        }
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end("File not found");
    });

}

function getStaticFile(filePath: string, response: http.ServerResponse) {
    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes: { [ext: string]: string } = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end("File not found");
            }
            else {
                response.writeHead(500);
                response.end('Internal server error');
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}

if (fs.existsSync('.env')) {
    let data = fs.readFileSync('.env', 'utf8');
    for (let line of data.split(/[\r\n]+/)) {
        const index = line.indexOf('=');
        if (index == -1 || /^#/.test(line))
            continue;
        const key = line.substr(0, index);
        console.log("Loaded environment variable: " + key);
        if (line.substr(index + 1, 1) === '"')
            process.env[key] = line.slice(index + 2, -1);
        else
            process.env[key] = line.substr(index + 1);
    }
}

http.createServer(preprocessRequest).listen(3000);
