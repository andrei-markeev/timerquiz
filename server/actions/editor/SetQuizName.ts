import { QuizDb } from "../../../lib/Db";
import { EndpointError } from "../../../lib/Endpoint";
import { EditView } from "../../views/editor/EditView";

interface SetQuizNameParams {
    body: { quizName?: any };
    db: QuizDb;
    userAgent: string;
    quiz: Quiz;
    questions: Question[];
}

export async function setQuizName({ body, db, userAgent, quiz, questions }: SetQuizNameParams) {
    if (typeof body.quizName !== "string" || !body.quizName)
        throw new EndpointError(400, "Invalid request");

    await db.Quizzes.updateOne({ _id: quiz._id }, { $set: { name: body.quizName } });

    quiz.name = body.quizName;

    return EditView({ userAgent, quiz, questions });
}