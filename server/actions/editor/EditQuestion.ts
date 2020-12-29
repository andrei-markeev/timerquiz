import { ObjectId } from "mongodb";
import { QuizDb } from "../../../lib/Db";
import { EndpointError } from "../../../lib/Endpoint";
import { EditView } from "../../views/editor/EditView";

interface EditQuestionParams {
    params: {
        editQuestion: any;
        questionText: any;
        answer0: any;
        answer1: any;
        answer2: any;
        answer3: any;
        correct: any;
        order: any;
        secondsToThink: any;
    };
    db: QuizDb;
    userAgent: string;
    quiz: Quiz;
    questions: Question[];
}

export async function editQuestion({ params, db, userAgent, quiz, questions }: EditQuestionParams) {
    if (typeof params.editQuestion !== "string"
        || typeof params.questionText !== "string"
        || typeof params.answer0 !== "string"
        || typeof params.answer1 !== "string"
        || typeof params.answer2 !== "string"
        || typeof params.answer3 !== "string"
        || typeof params.correct !== "string"
        || typeof params.order !== "string"
        || typeof params.secondsToThink !== "string"
        || !params.questionText
        || !params.answer0
        || !params.answer1
        || !params.answer2
        || !params.answer3
        || !params.correct
        || !params.secondsToThink
        || !params.order
        || isNaN(+params.correct)
        || isNaN(+params.secondsToThink)
        || isNaN(+params.order))
    {
        throw new EndpointError(400, "Invalid request");
    }

    const secondsToThink = Math.min(Math.max(15, +params.secondsToThink), 300);

    const questionId = new ObjectId(params.editQuestion);
    const questionIndex = questions.findIndex(q => q._id.equals(questionId));
    if (questionIndex === -1)
        throw new EndpointError(404, "Question not found");

    const updateFields: Partial<Question> = {
        text: params.questionText,
        answers: [ params.answer0, params.answer1, params.answer2, params.answer3 ],
        correctAnswer: +params.correct,
        secondsToThink,
        order: +params.order
    };
    await db.Questions.updateOne({ _id: questionId, quizId: quiz._id }, { $set: updateFields });

    questions[questionIndex] = { ...questions[questionIndex], ...updateFields };

    return EditView({ userAgent, quiz, questions });
}