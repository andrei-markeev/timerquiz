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
                    { p.name + " - " + p.score } { p.lastScoreAdd > 0 && <span class="score-add">+{ p.lastScoreAdd }</span> }
                </li>) }
            </ol>
            <input class="btn btn-blue" type="submit" value="Continue" />
        </form>
    </Page>;
}
ScoreView.css = [
    [".score-add", {
        display: "inline-block",
        color: "#118a59",
        animationName: "score-add",
        animationDuration: "2s",
        animationIterationCount: "infinite",
        animationTimingFunction: "cubic-bezier(0.280, 0.840, 0.420, 1)"
    }],
    {
        keyframes: "score-add",
        steps: [
            ["0%", { transform: "scale(1,1) translateY(0)" }],
            ["10%", { transform: "scale(1.1,.9) translateY(0)" }],
            ["30%", { transform: "scale(.9,1.1) translateY(-12px)" }],
            ["50%", { transform: "scale(1.05,.95) translateY(0)" }],
            ["57%", { transform: "scale(1,1) translateY(-3px)" }],
            ["64%", { transform: "scale(1,1) translateY(0)" }],
            ["100%", { transform: "scale(1,1) translateY(0)" }]
        ]
    }
] as InlineCSSRule[];
