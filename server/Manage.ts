import { QuizStatus } from "../lib/Db";
import { EndpointError, EndpointParams } from "../lib/Endpoint";
import { DashboardView } from "./views/DashboardView";
import { WaitForParticipantsView } from "./views/WaitForParticipantsView";

interface StartParams {
    start: string;
    stop: string;
}

export async function manage({ params, db, user, userAgent }: EndpointParams<StartParams>) {
    if (!user)
        throw new EndpointError(403, "Access denied");

    if (params.start && typeof params.start !== "string")
        throw new EndpointError(400, "Invalid request");
    if (params.stop && typeof params.stop !== "string")
        throw new EndpointError(400, "Invalid request");
    if (params.start && params.stop || !params.start && !params.stop)
        throw new EndpointError(400, "Invalid request");

    const quizId = params.start || params.stop;
    const quizzes = await db.Quizzes.find({ ownerUserId: user._id }).toArray();
    const quiz = quizzes.find(q => q._id.equals(quizId));
    if (!quiz)
        throw new EndpointError(404, "Quiz not found");

    if (params.start) {
        if (quizzes.some(q => q.status === QuizStatus.Started || q.status === QuizStatus.Open))
            throw new EndpointError(400, "You already have a started quiz!");

        const min = 100000;
        const max = 999999;
        const pin = Math.floor(Math.random() * (max - min + 1) + min).toString();

        const updateFields = {
            pinCode: pin,
            participants: [],
            status: QuizStatus.Open,
            questionId: null
        };
        await db.Quizzes.updateOne({ _id: quiz._id }, { $set: updateFields });

        const updatedQuiz = { ...quiz, ...updateFields };

        return WaitForParticipantsView({ quiz: updatedQuiz, userAgent });

    } else {

        if (quiz.status !== QuizStatus.Closed) {
            await db.Quizzes.updateOne({ _id: quiz._id }, { $set: { status: QuizStatus.Closed } });

            quiz.status = QuizStatus.Closed;
        }

        return DashboardView({ user, quizzes, userAgent });
    }
}
