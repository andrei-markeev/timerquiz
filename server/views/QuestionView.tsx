import { stringify } from "querystring";
import { createElement, InlineCSSRule } from "../../lib/templates";
import { BlueAnswerButton, GreenAnswerButton, RedAnswerButton, YellowAnswerButton } from "../components/AnswerButton";
import { ButtonCss, RedButtonCss, GreenButtonCss, BlueButtonCss, YellowButtonCss } from "../components/Button";
import { Page } from "../components/Page";
import { Refresh } from "../components/Refresh";

interface QuestionViewParams {
    quiz: Quiz;
    question: Question;
    userAgent: string,
}

export function QuestionView({ quiz, question, userAgent }: QuestionViewParams) {
    const cssRules = [ QuestionView, ButtonCss, RedButtonCss, GreenButtonCss, BlueButtonCss, YellowButtonCss ];
    return <Page title={ quiz.name } userAgent={ userAgent } cssRules={ cssRules }>
        <form method="GET" action="/present"></form>
        <h1>{ question.text }</h1>
        <table>
            <tr>
                <td><RedAnswerButton question={ question } answerNo={ 0 } /></td>
                <td><BlueAnswerButton question={ question } answerNo={ 1 } /></td>
            </tr>
            <tr>
                <td><YellowAnswerButton question={ question } answerNo={ 2 } /></td>
                <td><GreenAnswerButton question={ question } answerNo={ 3 } /></td>
            </tr>
        </table>
        <Refresh
            message="Please refresh the page periodically."
            ms={ 3000 }
            ajax={ { url: "/present", body: stringify({ action: "refresh" }), state: "Question" } }
        />
    </Page>;
}
QuestionView.css = [
    ["table", {
        width: "100%",
        border: "none",
        tableLayout: "fixed"
    }],
    ["td", {
        width: "50%"
    }],
    ["img", {
        width: "45vw",
        height: "auto"
    }]
] as InlineCSSRule[];
