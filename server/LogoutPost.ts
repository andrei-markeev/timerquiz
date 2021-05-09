import { connectToDatabase } from "../lib/DbUtils";
import { EndpointError, PostEndpointParams } from "../lib/Endpoint";

interface LogoutParams {
    action: string;
}

export async function logoutPost({ body, user, usedToken }: PostEndpointParams<LogoutParams>) {
    if (!user || !usedToken)
        throw new EndpointError(403, "Access denied!");

    const db = await connectToDatabase();
    if (usedToken.csrfToken !== body.csrfToken)
        throw new EndpointError(403, "Security validation failed!");

    if (body.action !== "purge")
        throw new EndpointError(400, "Invalid request!");

    const quizzes = await db.Quizzes.find({ ownerUserId: user._id }, { projection: { _id: 1 } }).toArray();
    for (const quiz of quizzes) {
        await db.Questions.deleteMany({ quizId: quiz._id });
    }
    await db.Quizzes.deleteMany({ ownerUserId: user._id });
    await db.Users.deleteOne({ _id: user._id });
    return { redirectTo: "/" };

}