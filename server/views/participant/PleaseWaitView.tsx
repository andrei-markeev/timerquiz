import { stringify } from "querystring";
import { createElement } from "../../../lib/templates";
import { Page } from "../../components/Page";
import { Refresh } from "../../components/Refresh";

interface PleaseWaitViewParams {
    userAgent: string;
    quiz: Quiz;
    participantId: string;
}

export function PleaseWaitView({ userAgent, quiz, participantId }: PleaseWaitViewParams) {
    const ajaxBody = stringify({ pin: quiz.pinCode, participantId, ajax: true });
    return <Page title="Please wait..." userAgent={ userAgent }>
        <form id="form" method="POST" action="/play">
            <h3 class="script-only">Please wait...</h3>
            <input type="hidden" name="pin" value={ quiz.pinCode || "" } />
            <input type="hidden" name="participantId" value={ participantId } />
            <Refresh ms={ 3000 } ajax={ { url: "/play", body: ajaxBody, state: "Wait" } } />
        </form>
    </Page>
}