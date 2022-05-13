import { stringify } from "querystring";
import { createElement } from "../../../lib/templates";
import { Page } from "../../components/Page";
import { Refresh } from "../../components/Refresh";

interface PleaseWaitViewParams {
    userAgent: string;
    quiz: Quiz;
    participantId: string;
    lastAnswerCorrect: boolean;
}

export function PleaseWaitView({ userAgent, quiz, participantId, lastAnswerCorrect }: PleaseWaitViewParams) {
    const ajaxBody = stringify({ pin: quiz.pinCode, participantId, ajax: true });
    return <Page title="Please wait..." userAgent={ userAgent }>
        <form id="form" method="POST" action="/play">
            { lastAnswerCorrect ? <h2>YES! You got it right!</h2> : <h2>Oops, that was wrong...</h2> }
            <div class="script-only">Please wait...</div>
            <input type="hidden" name="pin" value={ quiz.pinCode || "" } />
            <input type="hidden" name="participantId" value={ participantId } />
            <Refresh ms={ 3000 } ajax={ { url: "/play", body: ajaxBody, state: "Wait" } } />
        </form>
    </Page>
}