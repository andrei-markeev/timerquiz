import { QuizStatus } from "../lib/Db";
import { connectToDatabase } from "../lib/DbUtils";
import { EndpointError, GetEndpointParams } from "../lib/Endpoint";
import { QuestionView } from "./views/QuestionView";
import { ScoreView } from "./views/ScoreView";
import { WaitForParticipantsView } from "./views/WaitForParticipantsView";

export async function presentGet({ userAgent, user }: GetEndpointParams) {
    if (!user)
        return { redirectTo: "/login" };

    const db = await connectToDatabase();
    const quiz = await db.Quizzes.findOne({ status: { $in: [QuizStatus.Open, QuizStatus.Started] }, ownerUserId: user._id });
    if (!quiz)
        throw new EndpointError(404, "Quiz not found!");

    if (quiz.status === QuizStatus.Open)
        return WaitForParticipantsView({ quiz, userAgent });

    if (quiz.status !== QuizStatus.Started)
        throw new EndpointError(500, "Internal server error");

    if (!quiz.questionId)
        throw new EndpointError(500, "Internal server error");

    if (quiz.participants.every(p => p.answeredMs > quiz.questionStartMs))
        return ScoreView({ quiz, userAgent });

    const question = await db.Questions.findOne({ _id: quiz.questionId });
    if (!question)
        throw new EndpointError(404, "Question not found!");

    if (Date.now() - quiz.questionStartMs > question.secondsToThink * 1000)
        return ScoreView({ quiz, userAgent });

    return QuestionView({ quiz, question, userAgent });
}
