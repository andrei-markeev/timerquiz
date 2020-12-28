import { stringify } from "querystring";
import { createElement, InlineCSSRule } from "../../../lib/templates";
import { ButtonCss, DefaultButtonCss } from "../../components/Button";
import { Page } from "../../components/Page";
import { Refresh } from "../../components/Refresh";

interface WaitForQuizToStartViewParams {
    quiz: Quiz;
    userAgent: string;
    participantId: string;
}

export function WaitForQuizToStartView({ quiz, userAgent, participantId }: WaitForQuizToStartViewParams) {
    const cssRules = [ WaitForQuizToStartView, ButtonCss, DefaultButtonCss ];
    const ajaxBody = stringify({ pin: quiz.pinCode, participantId, ajax: true });
    return <Page title={ quiz.name } userAgent={ userAgent } cssRules={ cssRules }>
        <form id="form" method="POST" action="/play">
            <input type="hidden" name="participantId" value={ participantId } />
            <input type="hidden" name="pin" value={ quiz.pinCode || "" } />
            <h1>You've joined {quiz.name}!</h1>
            <p>You should now see your name on the presenter's screen! Please wait until the quiz starts.</p>
            <Refresh ms={ 3000 } ajax={ { url: "/play", body: ajaxBody, state: "Lobby" } } />
        </form>
    </Page>;
}

WaitForQuizToStartView.css = [
] as InlineCSSRule[];