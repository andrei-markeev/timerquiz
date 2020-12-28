import { createElement, InlineCSSRule } from "../../lib/templates";
import { ButtonCss, BlueButtonCss } from "../components/Button";
import { Page } from "../components/Page";

interface ScoreViewParams {
    quiz: Quiz;
    userAgent: string,
}

export function ScoreView({ quiz, userAgent }: ScoreViewParams) {
    console.log("ScoreView", quiz.participants);
    const cssRules = [ ScoreView, ButtonCss, BlueButtonCss ];
    return <Page title={ quiz.name } userAgent={ userAgent } cssRules={ cssRules }>
        <form method="POST">
            <input type="hidden" name="action" value="nextQuestion" />
            <h1>Scores</h1>
            <ol>
                { quiz.participants.sort((a, b) => b.score - a.score).map(p => <li>
                    { p.name + " - " + p.score }
                </li>) }
            </ol>
            <input class="btn btn-blue" type="submit" value="Continue" />
        </form>
    </Page>;
}
ScoreView.css = [
] as InlineCSSRule[];
