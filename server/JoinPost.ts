import { QuizStatus } from "../lib/Db";
import { PostEndpointParams } from "../lib/Endpoint";
import { isGamePin, isNonEmptyString } from "../lib/Validators";
import { EnterPinView } from "./views/EnterPinView";
import { WaitForQuizToStartView } from "./views/participant/WaitForQuizToStartView";

interface JoinParams {
    pin: string;
    name: string;
}

export async function joinPost({ body, db, userAgent }: PostEndpointParams<JoinParams>) {
    if (!isGamePin(body.pin))
        return EnterPinView({ userAgent, error: "PIN incorrect!" });

    if (!isNonEmptyString(body.name) || !/^[A-Za-z0-9 \.\:\@\-!\?]+$/.test(body.name))
        return EnterPinView({ userAgent, error: "Please enter your name! (latin letters)" })

    const quiz = await db.Quizzes.findOne({ pinCode: body.pin });
    if (!quiz || quiz.status !== QuizStatus.Open)
        return EnterPinView({ userAgent, error: "PIN incorrect!" });

    const participantId = Math.random().toString(32).substr(2);
    await db.Quizzes.updateOne({ _id: quiz._id }, { $push: { participants: { id: participantId, name: body.name, score: 0, answeredMs: 0 } } });

    return WaitForQuizToStartView({ quiz, userAgent, participantId });
}
