import { ObjectId } from "mongodb";
import { QuizDb } from "../../../lib/Db";
import { EndpointError } from "../../../lib/Endpoint";
import { isInteger, isNonEmptyString, isObjectIdHexString } from "../../../lib/Validators";
import { EditView } from "../../views/editor/EditView";

interface EditQuestionParams {
    body: {
        editQuestion?: any;
        questionText?: any;
        answer0?: any;
        answer1?: any;
        answer2?: any;
        answer3?: any;
        correct?: any;
        order?: any;
        secondsToThink?: any;
    };
    db: QuizDb;
    userAgent: string;
    quiz: Quiz;
    questions: Question[];
}

export async function editQuestion({ body, db, userAgent, quiz, questions }: EditQuestionParams) {
    if (!isObjectIdHexString(body.editQuestion)
        || !isNonEmptyString(body.questionText)
        || !isNonEmptyString(body.answer0)
        || !isNonEmptyString(body.answer1)
        || !isNonEmptyString(body.answer2)
        || !isNonEmptyString(body.answer3)
        || !isInteger(body.correct)
        || !isInteger(body.order)
        || !isInteger(body.secondsToThink))
    {
        throw new EndpointError(400, "Invalid request");
    }

    const secondsToThink = Math.min(Math.max(15, +body.secondsToThink), 300);

    const questionId = new ObjectId(body.editQuestion);
    const questionIndex = questions.findIndex(q => q._id.equals(questionId));
    if (questionIndex === -1)
        throw new EndpointError(404, "Question not found");

    const updateFields: Partial<Question> = {
        text: body.questionText,
        answers: [ body.answer0, body.answer1, body.answer2, body.answer3 ],
        correctAnswer: +body.correct,
        secondsToThink,
        order: +body.order
    };
    await db.Questions.updateOne({ _id: questionId, quizId: quiz._id }, { $set: updateFields });

    questions[questionIndex] = { ...questions[questionIndex], ...updateFields };

    return EditView({ userAgent, quiz, questions });
}