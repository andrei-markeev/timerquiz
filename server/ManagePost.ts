import { QuizStatus } from "../lib/Db";
import { connectToDatabase } from "../lib/DbUtils";
import { EndpointError, PostEndpointParams } from "../lib/Endpoint";
import { isObjectIdHexString } from "../lib/Validators";
import { DashboardView } from "./views/DashboardView";
import { WaitForParticipantsView } from "./views/WaitForParticipantsView";

interface StartParams {
    start: string;
    stop: string;
}

export async function managePost({ body, user, userAgent }: PostEndpointParams<StartParams>) {
    if (!user)
        throw new EndpointError(403, "Access denied");

    if (body.start && !isObjectIdHexString(body.start))
        throw new EndpointError(400, "Invalid request");
    if (body.stop && !isObjectIdHexString(body.stop))
        throw new EndpointError(400, "Invalid request");
    if (body.start && body.stop || !body.start && !body.stop)
        throw new EndpointError(400, "Invalid request");

    const quizId = body.start || body.stop;
    const db = await connectToDatabase();
    const quizzes = await db.Quizzes.find({ ownerUserId: user._id }).toArray();
    const quiz = quizzes.find(q => q._id.equals(quizId));
    if (!quiz)
        throw new EndpointError(404, "Quiz not found");

    if (body.start) {
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
