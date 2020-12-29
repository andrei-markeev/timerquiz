import { QuizDb } from "../../../lib/Db";
import { EndpointError } from "../../../lib/Endpoint";
import { EditView } from "../../views/editor/EditView";

interface SetQuizNameParams {
    params: { quizName: string };
    db: QuizDb;
    userAgent: string;
    quiz: Quiz;
    questions: Question[];
}

export async function setQuizName({ params, db, userAgent, quiz, questions }: SetQuizNameParams) {
    if (typeof params.quizName !== "string" || !params.quizName)
        throw new EndpointError(400, "Invalid request");

    await db.Quizzes.updateOne({ _id: quiz._id }, { $set: { name: params.quizName } });

    quiz.name = params.quizName;

    return EditView({ userAgent, quiz, questions });
}