import { Collection } from "mongodb";

export interface QuizDb {
    Users: Collection<User>;
    Quizzes: Collection<Quiz>;
    Questions: Collection<Question>;
    Nonces: Collection<Nonce>;
}

export enum QuizStatus {
    Closed = "closed",
    Open = "open",
    Started = "started"
}




export enum NonceType {
    GoogleOAuth = 1,
    CreateQuizCsrf = 2,
    DeleteAccountCsrf = 3
}
