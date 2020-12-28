import { ObjectId } from "mongodb";
import { EndpointError, EndpointParams } from "../lib/Endpoint";
import { AddNewQuestionView } from "./views/editor/AddNewQuestionView";
import { ConfirmDeleteView } from "./views/editor/ConfirmDeleteView";
import { EditView } from "./views/editor/EditView";

interface EditParams {
    quizId?: string;
    action?: string;
    editQuestion?: string;
    deleteQuestion?: string;
    quizName?: string;
    questionText?: string;
    correct?: string;
    answer0?: string;
    answer1?: string;
    answer2?: string;
    answer3?: string;
    order?: string;
    secondsToThink?: string;
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

    if (params.action === "setName") {
        if (typeof params.quizName !== "string" || !params.quizName)
            throw new EndpointError(400, "Invalid request");

        await db.Quizzes.updateOne({ _id: quizId }, { $set: { name: params.quizName } });

        quiz.name = params.quizName;

        return EditView({ userAgent, quiz, questions });
    }

    if (params.action === "addQuestion") {
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
            quizId,
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
   
    if (questions.length === 0 || params.action === "showAddQuestionForm")
        return AddNewQuestionView({ userAgent, quiz });

    if (params.editQuestion) {
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
        await db.Questions.updateOne({ _id: questionId, quizId }, { $set: updateFields });

        questions[questionIndex] = { ...questions[questionIndex], ...updateFields };
    }

    if (params.deleteQuestion) {
        if (typeof params.deleteQuestion !== "string" || !params.deleteQuestion)
            throw new EndpointError(400, "Invalid request");

        const questionId = new ObjectId(params.deleteQuestion);
        const questionIndex = questions.findIndex(q => q._id.equals(questionId));
        if (questionIndex === -1)
            throw new EndpointError(404, "Question not found");

        await db.Questions.deleteOne({ _id: questionId, quizId });

        questions.splice(questionIndex, 1);
    }

    if (params.action === "confirmDelete")
        return ConfirmDeleteView({ userAgent, quiz });

    return EditView({ userAgent, quiz, questions });
}