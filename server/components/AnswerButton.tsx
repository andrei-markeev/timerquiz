import { createElement } from "../../lib/templates";
import { TextOrImage } from "./TextOrImage";

export function RedAnswerButton({ question, answerNo }: { question: Question, answerNo: number }) {
    return (
        <button class={ "btn btn-red btn-block" } name="answer" value={ answerNo }>
            <TextOrImage value={ question.answers[answerNo] } />
        </button>
    );
}

export function GreenAnswerButton({ question, answerNo }: { question: Question, answerNo: number }) {
    return (
        <button class={ "btn btn-green btn-block" } name="answer" value={ answerNo }>
            <TextOrImage value={ question.answers[answerNo] } />
        </button>
    );
}

export function YellowAnswerButton({ question, answerNo }: { question: Question, answerNo: number }) {
    return (
        <button class={ "btn btn-yellow btn-block" } name="answer" value={ answerNo }>
            <TextOrImage value={ question.answers[answerNo] } />
        </button>
    );
}

export function BlueAnswerButton({ question, answerNo }: { question: Question, answerNo: number }) {
    return (
        <button class={ "btn btn-blue btn-block" } name="answer" value={ answerNo }>
            <TextOrImage value={ question.answers[answerNo] } />
        </button>
    );
}
