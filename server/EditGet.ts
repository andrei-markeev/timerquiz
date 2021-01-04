import { ObjectId } from "mongodb";
import { EndpointError, GetEndpointParams } from "../lib/Endpoint";
import { isObjectIdHexString } from "../lib/Validators";
import { AddNewQuestionView } from "./views/editor/AddNewQuestionView";
import { ConfirmDeleteView } from "./views/editor/ConfirmDeleteView";
import { EditView } from "./views/editor/EditView";

interface EditQuery {
    quizId: string;
    action: string;
}

export async function editGet({ query,  db, user, userAgent }: GetEndpointParams<EditQuery>) {
    if (!user)
        throw new EndpointError(403, "Access denied");

    if (!isObjectIdHexString(query.quizId))
        throw new EndpointError(400, "Invalid request");

    const quizId = new ObjectId(query.quizId);
    const quiz = await db.Quizzes.findOne({ _id: quizId, ownerUserId: user._id });
    if (!quiz)
        throw new EndpointError(404, "Quiz not found");

    if (query.action === "showAddQuestionForm")
        return AddNewQuestionView({ userAgent, quiz });
    else if (query.action === "confirmDelete")
        return ConfirmDeleteView({ userAgent, quiz });
    else if (query.action)
        throw new EndpointError(400, "Invalid request");

    const questions = await db.Questions.find({ quizId }).toArray();
    if (questions.length === 0)
        return AddNewQuestionView({ userAgent, quiz, first: true });
    else
        return EditView({ userAgent, quiz, questions });
}