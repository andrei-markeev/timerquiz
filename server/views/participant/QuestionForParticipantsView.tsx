import { stringify } from "querystring";
import { createElement, InlineCSSRule } from "../../../lib/templates";
import { BlueAnswerButton, GreenAnswerButton, RedAnswerButton, YellowAnswerButton } from "../../components/AnswerButton";
import { ButtonCss, RedButtonCss, GreenButtonCss, BlueButtonCss, YellowButtonCss } from "../../components/Button";
import { CountDown } from "../../components/CountDown";
import { Page } from "../../components/Page";
import { Refresh } from "../../components/Refresh";

interface QuestionForParticipantsViewParams {
    quiz: Quiz;
    participantId: string;
    question: Question;
    userAgent: string;
}

export function QuestionForParticipantsView({ quiz, participantId, question, userAgent }: QuestionForParticipantsViewParams) {
    const cssRules = [ ButtonCss, RedButtonCss, GreenButtonCss, BlueButtonCss, YellowButtonCss, CountDown, QuestionForParticipantsView ];
    const ajaxBody = stringify({ pin: quiz.pinCode, participantId, ajax: true });
    return <Page title={ quiz.name } userAgent={ userAgent } cssRules={ cssRules }>
        <CountDown questionStartMs={ quiz.questionStartMs } secondsToThink={ question.secondsToThink } />
        <form method="POST">
            <h1>{ question.text }</h1>
            <input type="hidden" name="pin" value={ quiz.pinCode || "" } />
            <input type="hidden" name="participantId" value={ participantId } />
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
            <Refresh ms={ 12000 } ajax={ { url: "/play", body: ajaxBody, state: "Question" } } />
        </form>
    </Page>;
}
QuestionForParticipantsView.css = [
    ["table", {
        width: "100%",
        border: "none"
    }],
    ["tr", {
        height: "50px"
    }],
    ["td", {
        width: "50%",
        height: "inherit",
        position: "relative"
    }],
    ["img", {
        width: "45vw",
        maxWidth: "100%",
        height: "auto"
    }],
    [".btn", {
        whiteSpace: "normal",
        height: "100%"
    }]
] as InlineCSSRule[];
