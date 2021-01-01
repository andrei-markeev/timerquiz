import { ObjectId } from "mongodb";
import { QuizDb } from "../../../lib/Db";
import { EndpointError } from "../../../lib/Endpoint";
import { isObjectIdHexString } from "../../../lib/Validators";
import { EditView } from "../../views/editor/EditView";

interface DeleteQuestionParams {
    body: {
        deleteQuestion?: any;
    };
    db: QuizDb;
    userAgent: string;
    quiz: Quiz;
    questions: Question[];
}

export async function deleteQuestion({ body, db, userAgent, quiz, questions }: DeleteQuestionParams) {
    if (!isObjectIdHexString(body.deleteQuestion))
        throw new EndpointError(400, "Invalid request");

    const questionId = new ObjectId(body.deleteQuestion);
    const questionIndex = questions.findIndex(q => q._id.equals(questionId));
    if (questionIndex === -1)
        throw new EndpointError(404, "Question not found");

    await db.Questions.deleteOne({ _id: questionId, quizId: quiz._id });

    questions.splice(questionIndex, 1);

    return EditView({ userAgent, quiz, questions });
}