import { EndpointParams } from "../lib/Endpoint";
import { ConfirmPurgeView } from "./views/ConfirmPurgeView";

interface LogoutParams {
    allDevices?: any;
    action?: any;
}

export async function logout({ params, db, user, userAgent, usedToken, validTokens }: EndpointParams<LogoutParams>) {
    if (user) {
        if (params.action === "confirmPurge") {
            return ConfirmPurgeView({ userAgent });
        } else if (params.action === "purge") {
            const quizzes = await db.Quizzes.find({ ownerUserId: user._id }, { projection: { _id: 1 } }).toArray();
            for (const quiz of quizzes) {
                await db.Questions.deleteMany({ quizId: quiz._id });
            }
            await db.Quizzes.deleteMany({ ownerUserId: user._id });
            await db.Users.deleteOne({ _id: user._id });
        } else {
            const updatedTokens = params.allDevices ? [] : validTokens.filter(t => t !== usedToken);
            await db.Users.updateOne({ _id: user._id }, { $set: { loginTokens: updatedTokens } })
        }
    }
    return { redirectTo: "/" }
}