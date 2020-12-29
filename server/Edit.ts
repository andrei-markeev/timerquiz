import { ObjectId } from "mongodb";
import { EndpointError, EndpointParams } from "../lib/Endpoint";
import { addQuestion } from "./actions/editor/AddQuestion";
import { deleteQuestion } from "./actions/editor/DeleteQuestion";
import { editQuestion } from "./actions/editor/EditQuestion";
import { setQuizName } from "./actions/editor/SetQuizName";
import { AddNewQuestionView } from "./views/editor/AddNewQuestionView";
import { ConfirmDeleteView } from "./views/editor/ConfirmDeleteView";
import { EditView } from "./views/editor/EditView";

interface EditParams {
    quizId: any;
    deleteQuestion: any;
    editQuestion: any;
    action: any;
}

export async function edit({ params, db, user, userAgent }: EndpointParams<EditParams>) {
    if (!user)
        throw new EndpointError(403, "Access denied");

    if (!params.quizId || typeof params.quizId !== "string" || !/^[A-Fa-f0-9]+$/.test(params.quizId))
        throw new EndpointError(400, "Invalid request");

    const quizId = new ObjectId(params.quizId);
    const quiz = await db.Quizzes.findOne({ _id: quizId, ownerUserId: user._id });
    if (!quiz)
        throw new EndpointError(404, "Quiz not found");

    const questions = await db.Questions.find({ quizId }).toArray();
   
    if (params.deleteQuestion)
        return await deleteQuestion({ params, db, userAgent, quiz, questions });

    if (params.editQuestion)
        return await editQuestion({ params: params as any, db, userAgent, quiz, questions });

    switch (params.action) {
        case "setName":
            return await setQuizName({ params: params as any, db, userAgent, quiz, questions });
        case "showAddQuestionForm":
            return AddNewQuestionView({ userAgent, quiz });
        case "addQuestion":
            return addQuestion({ params: params as any, db, userAgent, quiz, questions });
        case "confirmDelete":
            return ConfirmDeleteView({ userAgent, quiz });
        case "deleteQuiz":
            await db.Quizzes.deleteOne({ _id: quiz._id });
            await db.Questions.deleteMany({ quizId: quiz._id });
            return { redirectTo: "/" };
    }

    if (questions.length === 0)
        return AddNewQuestionView({ userAgent, quiz });

    return EditView({ userAgent, quiz, questions });
}