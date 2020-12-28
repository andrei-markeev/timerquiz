import { ObjectId } from "mongodb";
import { EndpointError, EndpointParams } from "../lib/Endpoint";
import { decode } from "jws";
import axios from "axios";
import { createHash, randomBytes } from "crypto";
import { stringify } from "querystring";

interface OAuthRedirectQueryString {
    state: string;
    code: string;
}

interface GoogleOAuthResponse {
    access_token: string;
    id_token: string;
}

export async function loginWithGoogle({ params, db, host }: EndpointParams<OAuthRedirectQueryString>) {
    const nonce = await db.Nonces.findOne({ _id: new ObjectId(params.state) });
    if (!nonce)
        throw new EndpointError(403, "Security validation failed");

    await db.Nonces.deleteOne({ _id: nonce._id });

    let protocol = host === "localhost:3000" ? "http://" : "https://";
    let hostUrl = protocol + host;

    let response = await axios.post<GoogleOAuthResponse>(
        `https://oauth2.googleapis.com/token`,
        stringify({
            grant_type: 'authorization_code',
            code: params.code as string,
            client_id: process.env.GOOGLE_APP_ID,
            client_secret: process.env.GOOGLE_APP_SECRET,
            redirect_uri: hostUrl + "/api/user/google"
        }),
        {
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );

    var accessToken = response.data.access_token;
    var identityJWT = response.data.id_token;

    if (!accessToken) {
        console.log(response.data);
        console.log(response.headers);
        throw new EndpointError(403, "Access denied");
    }

    let decoded = decode(identityJWT);
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

    await db.Users.updateOne({ _id: userId }, { $push: { loginTokens: { hashedToken, when: new Date() } } });

    return { redirectTo: "/", setCookies: [ `userId=${userId}; path=/; HttpOnly`, `token=${token}; path=/; HttpOnly` ] };
}