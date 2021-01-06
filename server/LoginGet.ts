import { NonceType } from "../lib/Db";
import { connectToDatabase } from "../lib/DbUtils";
import { GetEndpointParams } from "../lib/Endpoint";
import { LoginView } from "./views/LoginView";

export async function loginGet({ host, userAgent }: GetEndpointParams) {
    const db = await connectToDatabase();
    const result = await db.Nonces.insertOne({ type: NonceType.GoogleOAuth, when: new Date() });
    const nonceId = result.insertedId.toHexString();
    return LoginView({ host, userAgent, nonceId });
}
