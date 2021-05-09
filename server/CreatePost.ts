import { QuizStatus } from "../lib/Db";
import { connectToDatabase } from "../lib/DbUtils";
import { EndpointError, PostEndpointParams } from "../lib/Endpoint";
import { isNonEmptyString } from "../lib/Validators";
import { CreateView } from "./views/editor/CreateView";

interface CreatePostParams {
    quizName: string;
}

export async function createPost({ body, user, usedToken, userAgent }: PostEndpointParams<CreatePostParams>) {
    if (!user || !usedToken)
        throw new EndpointError(403, "Access denied");

    const db = await connectToDatabase();

    if (!isNonEmptyString(body.quizName)) {
        return CreateView({ userAgent, csrfToken: usedToken.csrfToken, error: "Please enter the name of the quiz!" });
    }

    if (usedToken.csrfToken !== body.csrfToken)
        throw new EndpointError(403, "Security validation failed!");

    const result = await db.Quizzes.insertOne({
        name: body.quizName,
        ownerUserId: user._id,
        pinCode: null,
        participants: [],
        questionId: null,
        questionStartMs: 0,
        status: QuizStatus.Closed
    });

    return { redirectTo: "/edit?quizId=" + result.insertedId.toHexString() };

}
