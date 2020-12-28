import { ObjectId } from "mongodb";
import { EndpointError, EndpointParams } from "../lib/Endpoint";

interface DeleteParams {
    quizId: string;
}

export async function deleteQuiz({ params, db, user }: EndpointParams<DeleteParams>) {
    if (!user)
        throw new EndpointError(403, "Access denied");

    if (!params.quizId || typeof params.quizId !== "string" || !/^[A-Fa-f0-9]+$/.test(params.quizId))
        throw new EndpointError(400, "Invalid request");

    const quizId = new ObjectId(params.quizId);

    const result = await db.Quizzes.deleteOne({ _id: quizId, ownerUserId: user._id });

    if (result.deletedCount !== 1)
        throw new EndpointError(404, "Quiz not found");

    await db.Questions.deleteMany({ quizId });

    return { redirectTo: "/" };

}