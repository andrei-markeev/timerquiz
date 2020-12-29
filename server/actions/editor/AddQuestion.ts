import { QuizDb } from "../../../lib/Db";
import { EndpointError } from "../../../lib/Endpoint";
import { EditView } from "../../views/editor/EditView";

interface AddQuestionParams {
    params: {
        questionText: any;
        answer0: any;
        answer1: any;
        answer2: any;
        answer3: any;
        correct: any;
        secondsToThink: any;
    };
    db: QuizDb;
    userAgent: string;
    quiz: Quiz;
    questions: Question[];
}

export async function addQuestion({ params, db, userAgent, quiz, questions }: AddQuestionParams) {
    if (typeof params.questionText !== "string"
        || typeof params.answer0 !== "string"
        || typeof params.answer1 !== "string"
        || typeof params.answer2 !== "string"
        || typeof params.answer3 !== "string"
        || typeof params.correct !== "string"
        || typeof params.secondsToThink !== "string"
        || !params.questionText
        || !params.answer0
        || !params.answer1
        || !params.answer2
        || !params.answer3
        || !params.correct
        || !params.secondsToThink
        || isNaN(+params.correct)
        || isNaN(+params.secondsToThink))
    {
        throw new EndpointError(400, "Invalid request");
    }

    const secondsToThink = Math.min(Math.max(15, +params.secondsToThink), 300);

    const newQuestion = {
        quizId: quiz._id,
        text: params.questionText,
        answers: [ params.answer0, params.answer1, params.answer2, params.answer3 ],
        correctAnswer: +params.correct,
        secondsToThink,
        order: questions.length
    };

    const result = await db.Questions.insertOne(newQuestion);
    questions.push({ _id: result.insertedId, ...newQuestion });

    return EditView({ userAgent, quiz, questions });
}