import { createElement } from "../../../lib/templates";
import { ButtonCss, DefaultButtonCss } from "../../components/Button";
import { Page } from "../../components/Page";

interface QuizEndedViewParams {
    quiz: Quiz;
    userAgent: string;
    score: number;
    place: number;
}

export function QuizEndedView({ quiz, userAgent, score, place }: QuizEndedViewParams) {
    const cssRules = [ ButtonCss, DefaultButtonCss ];
    return <Page title={ quiz.name } userAgent={ userAgent } cssRules={ cssRules }>
        <h1>{quiz.name} has ended</h1>
        <p>Thank you for participating!</p>
        <p>You've earned { score } points and ended up on the { place + nth(place) } place!</p>
        <p>
            Now you can
            { " " }
            <a href="/join" class="btn btn-default">Join another quiz</a>
            { " or " }
            <a href="/login" class="btn btn-default">Sign up / sign in</a>
            { " " }
            to create your own quiz
        </p>
    </Page>;
}

function nth(number: number) {
    const lastDigit = number % 10;
    if (lastDigit === 1)
        return "st";
    else if (lastDigit === 2)
        return "nd";
    else if (lastDigit === 2)
        return "rd";
    else
        return "th";
}