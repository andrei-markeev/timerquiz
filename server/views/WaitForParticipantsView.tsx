import { stringify } from "querystring";
import { createElement } from "../../lib/templates";
import { BlueButtonCss, ButtonCss } from "../components/Button";
import { Page } from "../components/Page";
import { Refresh } from "../components/Refresh";

interface WaitForParticipantsViewParams {
    quiz: Quiz;
    userAgent: string;
}

export function WaitForParticipantsView({ quiz, userAgent }: WaitForParticipantsViewParams) {
    const cssRules = [ ButtonCss, BlueButtonCss ];
    return <Page title={ quiz.name + " - Waiting for participants" } userAgent={ userAgent } cssRules={ cssRules }>
        <form method="GET" action="/present"></form>
        <h1>Game PIN: { quiz.pinCode }</h1>
        <p>List of participants:</p>
        <ol>
            { quiz.participants.map(p => <li>{ p.name }</li>) }
        </ol>
        <form method="POST">
            <input type="hidden" name="quizId" value={ quiz._id.toHexString() } />
            <input type="hidden" name="action" value="start" />
            <input class="btn btn-blue" type="submit" value="Start the game!" />
        </form>
        <Refresh
            message="Please refresh the page periodically."
            ms={ 3000 }
            ajax={ { url: "/present", body: stringify({ action: "refresh" }), state: quiz.participants.map(p => p.id).join(",") } }
        />
    </Page>;
}