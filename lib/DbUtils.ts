import { MongoClient, Db, WithoutId } from "mongodb";
import url from "url";

let cachedDb: Db | null = null;
export async function connectToDatabase() {
    if (!cachedDb) {
        console.time("DbConnect");
        if (!process.env.MONGO_URL)
            throw new Error("MONGO_URL is not defined!");
        const dbname = url.parse(process.env.MONGO_URL).pathname?.substr(1);
        if (!dbname)
            throw new Error("Invalid MONGO_URL: db name is missing!");
        const client = await MongoClient.connect(process.env.MONGO_URL);
        const db = await client.db(dbname);
        cachedDb = db;
        console.timeEnd("DbConnect");
    }
    return {
        Questions: cachedDb.collection<WithoutId<Question>>("questions"),
        Quizzes: cachedDb.collection<WithoutId<Quiz>>("quizzes"),
        Users: cachedDb.collection<WithoutId<User>>("user"),
        Nonces: cachedDb.collection<WithoutId<Nonce>>("nonce")
    }
}
