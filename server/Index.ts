import { GetEndpointParams } from "../lib/Endpoint";
import { DashboardView } from "./views/DashboardView";
import { IndexView } from "./views/IndexView";

export async function index({ db, userAgent, user }: GetEndpointParams) {
    if (user) {
        const quizzes = await db.Quizzes.find({ ownerUserId: user._id }).toArray();
        return DashboardView({ userAgent, quizzes, user });
    } else {
        return IndexView({ userAgent });
    }
}
