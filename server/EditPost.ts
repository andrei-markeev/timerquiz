import { ObjectId } from "mongodb";
import { EndpointError, PostEndpointParams } from "../lib/Endpoint";
import { isObjectIdHexString } from "../lib/Validators";
import { addQuestion } from "./actions/editor/AddQuestion";
import { deleteQuestion } from "./actions/editor/DeleteQuestion";
import { editQuestion } from "./actions/editor/EditQuestion";
import { setQuizName } from "./actions/editor/SetQuizName";

interface EditParams {
    quizId: string;
    deleteQuestion: string;
    editQuestion: string;
    action: string;
}

export async function editPost({ body, db, user, userAgent }: PostEndpointParams<EditParams>) {
    if (!user)
        throw new EndpointError(403, "Access denied");

    if (!isObjectIdHexString(body.quizId))
        throw new EndpointError(400, "Invalid request");

    const quizId = new ObjectId(body.quizId);
    const quiz = await db.Quizzes.findOne({ _id: quizId, ownerUserId: user._id });
    if (!quiz)
        throw new EndpointError(404, "Quiz not found");

    const questions = await db.Questions.find({ quizId }).toArray();

    if (body.deleteQuestion)
        return await deleteQuestion({ body, db, userAgent, quiz, questions });

    if (body.editQuestion)
        return await editQuestion({ body, db, userAgent, quiz, questions });

    if (body.action === "setName")
        return await setQuizName({ body: body as any, db, userAgent, quiz, questions });

    if (body.action === "addQuestion")
        return addQuestion({ body: body as any, db, userAgent, quiz, questions });

    if (body.action === "deleteQuiz") {
        await db.Quizzes.deleteOne({ _id: quiz._id });
        await db.Questions.deleteMany({ quizId: quiz._id });
        return { redirectTo: "/" };
    }

    throw new EndpointError(400, "Invalid request");
}