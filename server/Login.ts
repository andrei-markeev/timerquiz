import { NonceType } from "../lib/Db";
import { EndpointParams } from "../lib/Endpoint";
import { LoginView } from "./views/LoginView";

export async function login({ db, host, userAgent }: EndpointParams<{}>) {
    const result = await db.Nonces.insertOne({ type: NonceType.GoogleOAuth, when: new Date() });
    const nonceId = result.insertedId.toHexString();
    return LoginView({ host, userAgent, nonceId });
}