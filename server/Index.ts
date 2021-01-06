import { connectToDatabase } from "../lib/DbUtils";
import { GetEndpointParams } from "../lib/Endpoint";
import { DashboardView } from "./views/DashboardView";
import { IndexView } from "./views/IndexView";

export async function index({ userAgent, user }: GetEndpointParams) {
    if (user) {
        const db = await connectToDatabase();
        const quizzes = await db.Quizzes.find({ ownerUserId: user._id }).toArray();
        return DashboardView({ userAgent, quizzes, user });
    } else {
        return IndexView({ userAgent });
    }
}
