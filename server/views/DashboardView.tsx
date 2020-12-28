import { QuizStatus } from "../../lib/Db";
import { createElement, InlineCSSRule } from "../../lib/templates";
import { BlueButtonCss, ButtonCss, DefaultButtonCss, GreenButtonCss, RedButtonCss } from "../components/Button";
import { Page } from "../components/Page";

interface DashboardViewParams {
    user: User;
    quizzes: Quiz[];
    userAgent: string;
}

export function DashboardView({ user, quizzes, userAgent }: DashboardViewParams) {
    const cssRules = [ DashboardView, ButtonCss, DefaultButtonCss, BlueButtonCss, GreenButtonCss, RedButtonCss ];
    return <Page title={ "Quiz Dashboard" } userAgent={ userAgent } cssRules={ cssRules }>
        <h1>Welcome! <a class="btn btn-default" href="/logout">Log out</a></h1>
        <p>List of your quizzes</p>
        <form method="POST" action="/manage">
            <ol>
                { quizzes.map(q => <li>
                    <a class="btn btn-default" href={ "/edit?quizId=" + q._id.toHexString() }>{ q.name }</a>
                    { " " }
                    <sup>{ q.status }</sup>
                    { " " }
                    { q.status === QuizStatus.Closed ?
                        <button class="btn btn-blue" name="start" value={ q._id.toHexString() }>Play</button>
                    :
                        <span>
                            <a class="btn btn-green" href={ "/present" }>Back to quiz</a>
                            { " " }
                            <button class="btn btn-red" name="stop" value={ q._id.toHexString() }>Abort</button>
                        </span>
                    }
                </li>) }
            </ol>
        </form>
        <a class="btn btn-default" href="/create">Create a new quiz</a>
    </Page>;
}
DashboardView.css = [
] as InlineCSSRule[];

