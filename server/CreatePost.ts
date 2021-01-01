import { QuizStatus } from "../lib/Db";
import { EndpointError, PostEndpointParams } from "../lib/Endpoint";
import { isNonEmptyString } from "../lib/Validators";
import { CreateView } from "./views/editor/CreateView";

interface CreatePostParams {
    quizName: string;
}

export async function createPost({ body, db, user, userAgent }: PostEndpointParams<CreatePostParams>) {
    if (!user)
        throw new EndpointError(403, "Access denied");

    if (!isNonEmptyString(body.quizName))
        return CreateView({ userAgent, error: "Please enter the name of the quiz!" });

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
