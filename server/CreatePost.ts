import { generateCsrfToken, validateCsrfToken } from "../lib/CsrfToken";
import { NonceType, QuizStatus } from "../lib/Db";
import { connectToDatabase } from "../lib/DbUtils";
import { EndpointError, PostEndpointParams } from "../lib/Endpoint";
import { isNonEmptyString } from "../lib/Validators";
import { CreateView } from "./views/editor/CreateView";

interface CreatePostParams {
    quizName: string;
}

export async function createPost({ body, user, userAgent }: PostEndpointParams<CreatePostParams>) {
    if (!user)
        throw new EndpointError(403, "Access denied");

    const db = await connectToDatabase();

    if (!isNonEmptyString(body.quizName)) {
        const csrfToken = await generateCsrfToken(db, NonceType.CreateQuizCsrf);
        return CreateView({ userAgent, csrfToken, error: "Please enter the name of the quiz!" });
    }

    await validateCsrfToken(db, NonceType.CreateQuizCsrf, body.csrfToken);

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
