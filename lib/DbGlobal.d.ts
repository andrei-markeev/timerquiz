import { ObjectId } from "mongodb";
import { NonceType, QuizStatus } from "./Db";

declare global {

    interface User {
        _id: ObjectId;
        googleId: string;
        loginTokens: StampedToken[];
    }

    interface StampedToken {
        hashedToken: string;
        when: Date
        csrfToken: string;
    }

    interface Quiz {
        _id: ObjectId;
        ownerUserId: ObjectId;
        name: string;
        pinCode: string | null;
        status: QuizStatus;
        questionId: ObjectId | null;
        questionStartMs: number;
        participants: { id: string, name: string, score: number, answeredMs: number, lastScoreAdd: number }[];
    }

    interface Question {
        _id: ObjectId;
        quizId: ObjectId;
        text: string;
        answers: string[];
        correctAnswer: number;
        secondsToThink: number;
        order: number;
    }

    interface Nonce {
        _id: ObjectId;
        type: NonceType;
        when: Date;
    }
}