import { QuizStatus } from "../lib/Db";
import { EndpointParams } from "../lib/Endpoint";
import { EnterPinView } from "./views/EnterPinView";
import { WaitForQuizToStartView } from "./views/participant/WaitForQuizToStartView";

interface JoinParams {
    pin?: string;
    name?: string;
}

export async function join({ params, db, userAgent }: EndpointParams<JoinParams>) {
    if (!params.pin)
        return EnterPinView({ userAgent });

    if (!/^[0-9]{6}$/.test(params.pin))
        return EnterPinView({ userAgent, error: "PIN incorrect!" });

    if (!params.name || !/^[A-Za-z0-9 \.\:\@\-]+$/.test(params.name))
        return EnterPinView({ userAgent, error: "Please enter your name! (latin letters)" })

    const quiz = await db.Quizzes.findOne({ pinCode: params.pin });
    if (!quiz || quiz.status !== QuizStatus.Open)
        return EnterPinView({ userAgent, error: "PIN incorrect!" });

    const participantId = Math.random().toString(32).substr(2);
    await db.Quizzes.updateOne({ _id: quiz._id }, { $push: { participants: { id: participantId, name: params.name, score: 0, answeredMs: 0 } } });

    return WaitForQuizToStartView({ quiz, userAgent, participantId });
}
