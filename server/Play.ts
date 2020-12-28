import { QuizStatus } from "../lib/Db";
import { EndpointError, EndpointParams } from "../lib/Endpoint";
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

export async function play({ params, db, userAgent }: EndpointParams<PlayParams>) {
    if (!params.participantId)
        throw new EndpointError(400, "Bad request");

    if (!/^[a-z0-9]{9,}$/.test(params.participantId))
        throw new EndpointError(400, "Bad request");

    if (!/^[0-9]{6}$/.test(params.pin))
        throw new EndpointError(400, "Bad request");

    if (params.ajax && params.answer != null)
        throw new EndpointError(400, "Bad request");

    const quiz = await db.Quizzes.findOne({ pinCode: params.pin });
    if (!quiz)
        throw new EndpointError(404, "Page not found");

    const participantIndex = quiz.participants.findIndex(p => p.id === params.participantId);
    if (participantIndex === -1)
        throw new EndpointError(404, "Page not found");

    const participant = quiz.participants[participantIndex];

    if (quiz.status === QuizStatus.Closed) {
        if (params.ajax)
            return { text: "Ended" };
        else
            return QuizEndedView({ quiz, userAgent, score: participant.score, place: participantIndex + 1 })
    }

    if (quiz.status === QuizStatus.Open) {
        if (params.ajax)
            return { text: "Lobby" };
        else
            return WaitForQuizToStartView({ quiz, participantId: params.participantId, userAgent });
    }

    if (!quiz.questionId || participant.answeredMs > quiz.questionStartMs) {
        if (params.ajax)
            return { text: "Wait" };
        else
            return PleaseWaitView({ userAgent, quiz, participantId: params.participantId });
    }

    const question = await db.Questions.findOne({ _id: quiz.questionId });
    if (!question)
        throw new EndpointError(404, "Question not found!");

    if (Date.now() - quiz.questionStartMs > question.secondsToThink * 1000) {
        if (params.ajax)
            return { text: "Wait" };
        else
            return PleaseWaitView({ userAgent, quiz, participantId: params.participantId });
    }

    if (params.answer == null) {
        if (params.ajax)
            return { text: "Question" };
        else
            return QuestionForParticipantsView({ quiz, question, participantId: params.participantId, userAgent });
    }

    if (params.ajax)
        throw new EndpointError(400, "Invalid request!");

    const now = Date.now();
    if (question.correctAnswer === +params.answer)
        participant.score += Math.floor(300 + 0.7 * Math.max(0, question.secondsToThink * 1000 - (now - quiz.questionStartMs)) / question.secondsToThink);

    await db.Quizzes.updateOne({ _id: quiz._id, "participants.id": participant.id }, {
        $set: { "participants.$.score": participant.score, "participants.$.answeredMs": now },
    })
    return PleaseWaitView({ userAgent, quiz, participantId: params.participantId });
}
