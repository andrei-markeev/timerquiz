import { createElement, InlineCSSRule } from "../../../lib/templates";
import { ButtonCss, DefaultButtonCss, RedButtonCss } from "../../components/Button";
import { Page } from "../../components/Page";

interface ConfirmDeleteViewParams {
    userAgent: string;
    quiz: Quiz;
}

export function ConfirmDeleteView({ userAgent, quiz }: ConfirmDeleteViewParams) {
    const cssRules = [ ConfirmDeleteView, ButtonCss, DefaultButtonCss, RedButtonCss ];
    return <Page userAgent={ userAgent } title={ "Delete quiz" } cssRules={ cssRules }>
        <form method="POST" action="delete">
            <h1>Delete quiz {quiz.name}</h1>
            <p>Are you sure want to delete quiz {quiz.name}? This action cannot be undone!</p>
            <input type="hidden" name="quizId" value={ quiz._id.toHexString() } />
            <input type="submit" class="btn btn-red" value="Delete" />
            { " " }
            <a class="btn btn-default" href={ "/edit?quizId=" + quiz._id.toHexString() }>Cancel</a>
        </form>
    </Page>;
}

ConfirmDeleteView.css = [
    [".spacer", {
        height: "20px"
    }]
] as InlineCSSRule[];