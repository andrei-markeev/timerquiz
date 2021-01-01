import { IncomingMessage } from "http";

declare global {

    type PreprocessedRequest = IncomingMessage & {
        query: any;
        cookies: { [key: string]: string; };
        body: any;
    }

    /** Date in format "YYYY-MM-DD" */
    type ISODateString = string & { __isoDate: never };

}