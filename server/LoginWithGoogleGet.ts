import { ObjectId } from "mongodb";
import { EndpointError, GetEndpointParams } from "../lib/Endpoint";
import { decode } from "jws";
import axios from "@andrei-markeev/axios-mini";
import { createHash, randomBytes } from "crypto";
import { stringify } from "querystring";
import { isObjectIdHexString } from "../lib/Validators";
import { connectToDatabase } from "../lib/DbUtils";

interface OAuthRedirectQuery {
    state: string;
    code: string;
}

interface GoogleOAuthResponse {
    access_token: string;
    id_token: string;
}

export async function loginWithGoogleGet({ query, host }: GetEndpointParams<OAuthRedirectQuery>) {
    if (!isObjectIdHexString(query.state))
        throw new EndpointError(400, "Invalid request");
    const db = await connectToDatabase();
    const nonce = await db.Nonces.findOne({ _id: new ObjectId(query.state) });
    if (!nonce)
        throw new EndpointError(403, "Security validation failed");

    await db.Nonces.deleteOne({ _id: nonce._id });

    let protocol = host === "localhost:3000" ? "http://" : "https://";
    let hostUrl = protocol + host;

    let response = await axios.post<GoogleOAuthResponse>(
        `https://oauth2.googleapis.com/token`,
        stringify({
            grant_type: 'authorization_code',
            code: query.code as string,
            client_id: process.env.GOOGLE_APP_ID,
            client_secret: process.env.GOOGLE_APP_SECRET,
            redirect_uri: hostUrl + "/api/user/google"
        }),
        {
            headers: { 
                "content-type": "application/x-www-form-urlencoded"
            }
        }
    );
    if (response.status >= 400) {
        console.error("OAuth flow failed. Google returned", response);
        throw new EndpointError(500, "Internal server error");
    }

    var accessToken = response.data.access_token;
    var identityJWT = response.data.id_token;

    if (!accessToken) {
        console.log(response.data);
        console.log(response.headers);
        throw new EndpointError(403, "Access denied");
    }

    let decoded = decode(identityJWT);
    if (!decoded) {
        console.log('Payload could not be decoded!', identityJWT);
        throw new EndpointError(500, "Internal server error");
    }
    let userGoogleId = decoded.payload.sub.toLowerCase();

    console.log("Google user logged in:", userGoogleId);

    const user = await db.Users.findOne({ googleId: userGoogleId });
    let userId;
    if (!user) {
        const result = await db.Users.insertOne({
            googleId: userGoogleId,
            loginTokens: []
        });
        userId = result.insertedId;
    } else
        userId = user._id;

    const token = randomBytes(64).toString("hex");
    const hash = createHash('sha256');
    hash.update(token);
    const hashedToken = hash.digest('base64');

    const csrfToken = randomBytes(16).toString("hex");

    await db.Users.updateOne({ _id: userId }, { $push: { loginTokens: { hashedToken, csrfToken, when: new Date() } } });

    return { redirectTo: "/", setCookies: [ `userId=${userId}; path=/; HttpOnly`, `token=${token}; path=/; HttpOnly` ] };
}