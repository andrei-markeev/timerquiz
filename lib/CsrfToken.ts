import { ObjectId } from "mongodb";
import { NonceType, QuizDb } from "./Db";
import { EndpointError } from "./Endpoint";
import { isObjectIdHexString } from "./Validators";

export async function generateCsrfToken(db: QuizDb, type: NonceType) {
    const result = await db.Nonces.insertOne({ type, when: new Date() });
    return result.insertedId.toHexString();
}

export async function validateCsrfToken(db: QuizDb, type: NonceType, value: any) {
    if (!isObjectIdHexString(value))
        throw new EndpointError(403, "Security validation failed");
    const nonceId = new ObjectId(value);
    const nonce = await db.Nonces.findOne({ _id: nonceId, type });
    if (!nonce)
        throw new EndpointError(403, "Security validation failed");
    if (nonce.when.getTime() + 3600 * 1000 < Date.now())
        throw new EndpointError(403, "Page security token expired. Please go back, refresh the page and try again.");
    await db.Nonces.deleteOne({ _id: nonceId });
}
