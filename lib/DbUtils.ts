import { MongoClient, Db } from "mongodb";
import url from "url";

let cachedDb: Db | null = null;
export async function connectToDatabase() {
    if (!cachedDb) {
        if (!process.env.MONGO_URL)
            throw new Error("MONGO_URL is not defined!");
        const dbname = url.parse(process.env.MONGO_URL).pathname?.substr(1);
        if (!dbname)
            throw new Error("Invalid MONGO_URL: db name is missing!");
        const client = await MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = await client.db(dbname);
        cachedDb = db;
    }
    return {
        Questions: cachedDb.collection<Question>("questions"),
        Quizzes: cachedDb.collection<Quiz>("quizzes"),
        Users: cachedDb.collection<User>("user"),
        Nonces: cachedDb.collection<Nonce>("nonce")
    }
}
