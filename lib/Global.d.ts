import { IncomingMessage } from "http";

declare global {

    type PreprocessedRequest<T> = IncomingMessage & {
        query: T;
        cookies: { [key: string]: string; };
        body: T;
    }

    /** Date in format "YYYY-MM-DD" */
    type ISODateString = string & { __isoDate: never };

}