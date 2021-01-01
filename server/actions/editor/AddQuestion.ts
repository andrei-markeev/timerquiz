import { QuizDb } from "../../../lib/Db";
import { EndpointError } from "../../../lib/Endpoint";
import { isNonEmptyString, isInteger } from "../../../lib/Validators";
import { EditView } from "../../views/editor/EditView";

interface AddQuestionParams {
    body: {
        questionText?: any;
        answer0?: any;
        answer1?: any;
        answer2?: any;
        answer3?: any;
        correct?: any;
        secondsToThink?: any;
    };
    db: QuizDb;
    userAgent: string;
    quiz: Quiz;
    questions: Question[];
}

export async function addQuestion({ body, db, userAgent, quiz, questions }: AddQuestionParams) {
    if (!isNonEmptyString(body.questionText)
        || !isNonEmptyString(body.answer0)
        || !isNonEmptyString(body.answer1)
        || !isNonEmptyString(body.answer2)
        || !isNonEmptyString(body.answer3)
        || !isInteger(body.correct)
        || !isInteger(body.secondsToThink))
    {
        throw new EndpointError(400, "Invalid request");
    }

    const secondsToThink = Math.min(Math.max(15, +body.secondsToThink), 300);

    const newQuestion = {
        quizId: quiz._id,
        text: body.questionText,
        answers: [ body.answer0, body.answer1, body.answer2, body.answer3 ],
        correctAnswer: +body.correct,
        secondsToThink,
        order: questions.length
    };

    const result = await db.Questions.insertOne(newQuestion);
    questions.push({ _id: result.insertedId, ...newQuestion });

    return EditView({ userAgent, quiz, questions });
}