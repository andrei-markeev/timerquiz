import { QuizStatus } from "../lib/Db";
import { EndpointError, EndpointParams } from "../lib/Endpoint";
import { QuestionView } from "./views/QuestionView";
import { ScoreView } from "./views/ScoreView";
import { WaitForParticipantsView } from "./views/WaitForParticipantsView";

interface PresentParams {
    action?: string;
}

export async function present({ params, db, userAgent, user }: EndpointParams<PresentParams>) {
    if (!user)
        return { redirectTo: "/login" };

    const quiz = await db.Quizzes.findOne({ status: { $in: [QuizStatus.Open, QuizStatus.Started] }, ownerUserId: user._id });
    if (!quiz)
        throw new EndpointError(404, "Quiz not found!");

    if (quiz.status === QuizStatus.Open && params.action === "start") {
        const firstQuestion = await db.Questions.findOne({ quizId: quiz._id }, { sort: { order: 1 } });
        if (!firstQuestion)
            throw new EndpointError(404, "First question not found!");

        await db.Quizzes.updateOne({ _id: quiz._id }, { $set: {
            status: QuizStatus.Started,
            questionId: firstQuestion._id,
            questionStartMs: Date.now()
        } });

        return QuestionView({ quiz, question: firstQuestion, userAgent });
    }

    if (quiz.status === QuizStatus.Open) {
        if (params.action === "refresh")
            return { text: quiz.participants.map(p => p.id).join(",") };
        else
            return WaitForParticipantsView({ quiz, userAgent });
    }
    
    if (quiz.status !== QuizStatus.Started)
        throw new EndpointError(500, "Internal server error");

    if (!quiz.questionId)
        throw new EndpointError(500, "Internal server error");

    const questionId = quiz.questionId;

    if (params.action === "nextQuestion") {
        const questions = await db.Questions.find({ quizId: quiz._id }, { sort: { order: 1 } }).toArray();
        const index = questions.findIndex(q => q._id.equals(questionId));
        if (index === -1)
            throw new EndpointError(404, "Question not found!");

        if (!questions[index + 1]) {
            await db.Quizzes.updateOne({ _id: quiz._id }, { $set: {
                status: QuizStatus.Closed
            } });
            return { redirectTo: "/" };
        } else {
            await db.Quizzes.updateOne({ _id: quiz._id }, { $set: {
                questionId: questions[index + 1]._id,
                questionStartMs: Date.now()
            } });
            return QuestionView({ quiz, question: questions[index + 1], userAgent });
        }
    }

    if (quiz.participants.every(p => p.answeredMs > quiz.questionStartMs)) {
        if (params.action === "refresh")
            return { text: "Wait" };
        else
            return ScoreView({ quiz, userAgent });
    }

    const question = await db.Questions.findOne({ _id: quiz.questionId });
    if (!question)
        throw new EndpointError(404, "Question not found!");

    if (Date.now() - quiz.questionStartMs > question.secondsToThink * 1000) {
        if (params.action === "refresh")
            return { text: "Wait" };
        else
            return ScoreView({ quiz, userAgent });
    }

    if (params.action === "refresh")
        return { text: "Question" };
    else
        return QuestionView({ quiz, question, userAgent });
}