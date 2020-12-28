import { createElement, InlineCSSRule } from "../../lib/templates";
import { ButtonCss, BlueButtonCss, DefaultButtonCss } from "../components/Button";
import { ButtonsPanel } from "../components/ButtonsPanel";
import { Page } from "../components/Page";

interface IndexViewParams {
    userAgent: string;
}

export function IndexView({ userAgent }: IndexViewParams) {
    const cssRules = [ ButtonCss, BlueButtonCss, DefaultButtonCss, ButtonsPanel, IndexView ];
    return <Page title="Timer Quiz" userAgent={ userAgent } cssRules={ cssRules }>
        <form method="POST">
            <h1>Timer Quiz</h1>
            <p>
                Timer Quiz is a simple application that allows you to create a quiz and share it with participants,
                who then can compete by answering questions - the faster you answer, the more points you get.
                Time to give an answer is limited.
            </p>
            <p>
                <ButtonsPanel>
                    <a class="btn btn-blue" href="/join">Join a quiz</a>
                    {" "}
                    <a class="btn btn-default" href="/login">Sign in / Sign up</a>
                    {" "}
                    <a class="btn btn-default" href="/privacy.html">Privacy Policy</a>
                </ButtonsPanel>
            </p>
        </form>
    </Page>;
}
IndexView.css = [
    ["body", {
        minHeight: "100%"
    }],
    [".btn", {
        marginBottom: "10px"
    }]
] as InlineCSSRule[];
