import { Collection, WithoutId } from "mongodb";

export interface QuizDb {
    Users: Collection<WithoutId<User>>;
    Quizzes: Collection<WithoutId<Quiz>>;
    Questions: Collection<WithoutId<Question>>;
    Nonces: Collection<WithoutId<Nonce>>;
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
