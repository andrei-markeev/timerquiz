import { QuizStatus } from "../lib/Db";
import { EndpointError, EndpointParams } from "../lib/Endpoint";
import { CreateView } from "./views/editor/CreateView";

interface CreateParams {
    quizName?: string;
}

export async function create({ params, db, user, userAgent }: EndpointParams<CreateParams>) {
    if (!user)
        throw new EndpointError(403, "Access denied");

    if (params.quizName && params.quizName.length <= 0)
        return CreateView({ userAgent, error: "Please enter the name of the quiz!" });

    if (!params.quizName)
        return CreateView({ userAgent });

    if (typeof params.quizName !== "string")
        throw new EndpointError(400, "Invalid request");

    const result = await db.Quizzes.insertOne({
        name: params.quizName,
        ownerUserId: user._id,
        pinCode: null,
        participants: [],
        questionId: null,
        questionStartMs: 0,
        status: QuizStatus.Closed
    });

    return { redirectTo: "/edit?quizId=" + result.insertedId.toHexString() };

}