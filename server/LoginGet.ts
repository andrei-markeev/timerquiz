import { NonceType } from "../lib/Db";
import { GetEndpointParams } from "../lib/Endpoint";
import { LoginView } from "./views/LoginView";

export async function loginGet({ db, host, userAgent }: GetEndpointParams) {
    const result = await db.Nonces.insertOne({ type: NonceType.GoogleOAuth, when: new Date() });
    const nonceId = result.insertedId.toHexString();
    return LoginView({ host, userAgent, nonceId });
}
