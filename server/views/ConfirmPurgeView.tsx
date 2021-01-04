import { createElement, InlineCSSRule } from "../../lib/templates";
import { ButtonCss, DefaultButtonCss, RedButtonCss } from "../components/Button";
import { Page } from "../components/Page";

interface ConfirmPurgeViewParams {
    userAgent: string;
    csrfToken: string;
}

export function ConfirmPurgeView({ userAgent, csrfToken }: ConfirmPurgeViewParams) {
    const cssRules = [ ConfirmPurgeView, ButtonCss, DefaultButtonCss, RedButtonCss ];
    return <Page userAgent={ userAgent } title={ "Delete account" } cssRules={ cssRules }>
        <form method="POST">
            <h1>Delete account</h1>
            <p>Are you sure want to delete your account? All your quizzes will also be lost. This action cannot be undone!</p>
            <input type="hidden" name="action" value="purge" />
            <input type="hidden" name="csrfToken" value={ csrfToken } />
            <input type="submit" class="btn btn-red" value="Delete my account" />
            { " " }
            <a class="btn btn-default" href="/">Cancel</a>
        </form>
    </Page>;
}

ConfirmPurgeView.css = [
    [".spacer", {
        height: "20px"
    }]
] as InlineCSSRule[];