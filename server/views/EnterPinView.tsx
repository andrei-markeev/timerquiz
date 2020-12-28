import { createElement, InlineCSSRule } from "../../lib/templates";
import { ButtonCss, BlueButtonCss, DefaultButtonCss } from "../components/Button";
import { Page } from "../components/Page";

interface EnterPinViewParams {
    userAgent: string;
    error?: string;
}

export function EnterPinView({ userAgent, error }: EnterPinViewParams) {
    const cssRules = [ ButtonCss, BlueButtonCss, DefaultButtonCss, EnterPinView ];
    return <Page title="Join a quiz" userAgent={ userAgent } cssRules={ cssRules }>
        <form method="POST">
            <h1>Join a quiz</h1>
            { !!error && <div class="error">{ error }</div> }
            <div class="form-row">
                <label for="pin">Quiz PIN code: </label><input type="text" name="pin"></input>
            </div>
            <div class="form-row">
                <label for="name">Your name: </label><input type="text" name="name"></input>
            </div>
            <div>
                <input class="btn btn-blue" type="submit" value="Join!" />
                { " " }
                <a href="/" class="btn btn-default">Back to home</a>
            </div>
        </form>
    </Page>;
}
EnterPinView.css = [
    ['.error', {
        color: "red"
    }],
    ['label', {
        display: "inline-block",
        width: "140px"
    }],
    ['.form-row', {
        marginBottom: "15px"
    }],
    ['.btn', {
        marginTop: "20px"
    }]
] as InlineCSSRule[];
