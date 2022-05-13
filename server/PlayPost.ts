import { QuizStatus } from "../lib/Db";
import { connectToDatabase } from "../lib/DbUtils";
import { EndpointError, PostEndpointParams } from "../lib/Endpoint";
import { isGamePin, isParticipantId } from "../lib/Validators";
import { PleaseWaitView } from "./views/participant/PleaseWaitView";
import { QuestionForParticipantsView } from "./views/participant/QuestionForParticipantsView";
import { QuizEndedView } from "./views/participant/QuizEndedView";
import { WaitForQuizToStartView } from "./views/participant/WaitForQuizToStartView";

interface PlayParams {
    pin: string;
    participantId: string;
    answer?: string;
    ajax?: boolean;
}

export async function playPost({ body, userAgent }: PostEndpointParams<PlayParams>) {
    if (!isParticipantId(body.participantId))
        throw new EndpointError(400, "Bad request");

    if (!isGamePin(body.pin))
        throw new EndpointError(400, "Bad request");

    if (body.ajax && body.answer != null)
        throw new EndpointError(400, "Bad request");

    const db = await connectToDatabase();
    const quiz = await db.Quizzes.findOne({ pinCode: body.pin });
    if (!quiz)
        throw new EndpointError(404, "Page not found");

    const participantIndex = quiz.participants.findIndex(p => p.id === body.participantId);
    if (participantIndex === -1)
        throw new EndpointError(404, "Page not found");

    const participant = quiz.participants[participantIndex];

    if (quiz.status === QuizStatus.Closed) {
        if (body.ajax)
            return { text: "Ended" };
        else
            return QuizEndedView({ quiz, userAgent, score: participant.score, place: participantIndex + 1 })
    }

    if (quiz.status === QuizStatus.Open) {
        if (body.ajax)
            return { text: "Lobby" };
        else
            return WaitForQuizToStartView({ quiz, participantId: body.participantId, userAgent });
    }

    if (!quiz.questionId || participant.answeredMs > quiz.questionStartMs) {
        if (body.ajax)
            return { text: "Wait" };
        else
            return PleaseWaitView({ userAgent, quiz, participantId: body.participantId, lastAnswerCorrect: participant.lastScoreAdd > 0 });
    }

    const question = await db.Questions.findOne({ _id: quiz.questionId });
    if (!question)
        throw new EndpointError(404, "Question not found!");

    if (Date.now() - quiz.questionStartMs > question.secondsToThink * 1000) {
        if (body.ajax)
            return { text: "Wait" };
        else
            return PleaseWaitView({ userAgent, quiz, participantId: body.participantId, lastAnswerCorrect: participant.lastScoreAdd > 0 });
    }

    if (body.answer == null) {
        if (body.ajax)
            return { text: "Question" };
        else
            return QuestionForParticipantsView({ quiz, question, participantId: body.participantId, userAgent });
    }

    if (body.ajax)
        throw new EndpointError(400, "Invalid request!");

    const now = Date.now();
    const isAnswerCorrect = question.correctAnswer === +body.answer;
    const scoreAdd = isAnswerCorrect ? Math.floor(300 + 0.7 * Math.max(0, question.secondsToThink * 1000 - (now - quiz.questionStartMs)) / question.secondsToThink) : 0;

    await db.Quizzes.updateOne({ _id: quiz._id, "participants.id": participant.id }, {
        $set: {
            "participants.$.score": participant.score + scoreAdd,
            "participants.$.answeredMs": now,
            "participants.$.lastScoreAdd": scoreAdd
        }
    })
    return PleaseWaitView({ userAgent, quiz, participantId: body.participantId, lastAnswerCorrect: isAnswerCorrect });
}
