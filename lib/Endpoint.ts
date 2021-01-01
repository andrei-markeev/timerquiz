import { ServerResponse } from "http";
import { QuizDb } from "./Db";
import { connectToDatabase } from "./DbUtils";
import { ObjectId } from "mongodb";
import { ServerSideHtml } from "./templates";
import { createHash } from "crypto";

interface EndpointParamsBase {
    db: QuizDb;
    userAgent: string;
    host: string;
    user: User | null;
    usedToken: StampedToken | null;
    validTokens: StampedToken[];
}
export interface PostEndpointParams<B> extends EndpointParamsBase {
    body: Untrusted<B>;
}

export interface GetEndpointParams<Q = never> extends EndpointParamsBase {
    query: Untrusted<Q>;
}

type Untrusted<T> = {
    [P in keyof T]?: any;
};

type EndpointResponse = ServerSideHtml | {
    redirectTo?: string;
    setCookies?: string[];
    text?: string;
};

export function createEndpoint<B, Q>(options: {
    post?: (params: PostEndpointParams<B>) => Promise<EndpointResponse>,
    get?: (params: GetEndpointParams<Q>) => Promise<EndpointResponse>,
}) {
    return async function(request: PreprocessedRequest, response: ServerResponse) {
        console.time("Endpoint");
        try {
            const host = request.headers.host!;
            const userId = request.cookies.userId;
            const token = request.cookies.token;
            const userAgent = request.headers["user-agent"] || "";

            const body = request.body;
            const query = request.query;

            let user: User | null = null;
            console.time("DbConnect");
            const db = await connectToDatabase();
            console.timeEnd("DbConnect");

            console.time("Auth");
            let usedToken: StampedToken | null = null;
            let validTokens: StampedToken[] = [];
            if (userId) {
                user = await db.Users.findOne({ _id: new ObjectId(userId) });
                if (user) {
                    const minDate = new Date();
                    minDate.setDate(minDate.getDate() - 90);
                    validTokens = user.loginTokens.filter(t => t.when > minDate);
                    if (validTokens.length !== user.loginTokens.length) {
                        await db.Users.updateOne({ _id: user._id }, { $set: { loginTokens: validTokens } })
                    }
                    const hash = createHash('sha256');
                    hash.update(token);
                    const hashedToken = hash.digest('base64');
                    usedToken = validTokens.find(t => t.hashedToken === hashedToken) || null;
                }
                if (!usedToken)
                    user = null;
            }
            console.timeEnd("Auth");
    
            console.time("Handler");
            let result
            if (request.method === "POST" && options.post)
                result = await options.post({ body, db, user, userAgent, host, usedToken, validTokens });
            else if (request.method === "GET" && options.get)
                result = await options.get({ query, db, user, userAgent, host, usedToken, validTokens });
            else
                throw new EndpointError(400, "Invalid request");
            console.timeEnd("Handler");

            if ("html" in result) {
                response.writeHead(200, { "Content-Type": "text/html" });
                response.end("<!DOCTYPE html>\n" + result.html);
            } else if ("text" in result) {
                response.writeHead(200, { "Content-Type": "text/plain" });
                response.end(result.text);
            } else {

                const headers: any = { "Location": result.redirectTo };

                if ("setCookies" in result && result.setCookies) {
                    headers["Set-Cookie"] = result.setCookies;
                }

                response.writeHead(302, headers);
                response.end();
            }
        } catch(e) {
            let code = 500;
            let message = "Internal server error";
            if (e instanceof EndpointError) {
                code = e.code;
                message = e.message;
            } else
                console.warn(e);

            response.writeHead(code, { "Content-Type": "text/plain" });
            response.end(message);
        }
        console.timeEnd("Endpoint");
    }
}

export class EndpointError extends Error {
    constructor(public code: number, text: string) {
        super(text);
    }
}