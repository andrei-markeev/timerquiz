import { createElement, InlineCSSRule } from "../../../lib/templates";
import { BlueButtonCss, ButtonCss, DefaultButtonCss } from "../../components/Button";
import { Page } from "../../components/Page";

interface CreateViewParams {
    userAgent: string;
    error?: string;
}

export function CreateView({ userAgent, error }: CreateViewParams) {
    const cssRules = [ CreateView, ButtonCss, DefaultButtonCss, BlueButtonCss ];
    return <Page userAgent={ userAgent } title={ "Create a new quiz" } cssRules={ cssRules }>
        <form method="POST">
            <h1>Create a new quiz</h1>
            <div>
                <label for="quizName">Enter name of the quiz</label>
                { !!error && <div class="error">{ error }</div> }
                <input type="text" name="quizName" value="" />
            </div>
            <input type="hidden" name="action" value="create" />
            <div class="spacer" />
            <input type="submit" class="btn btn-blue" value="Next" />
            { " " }
            <a class="btn btn-default" href="/">Cancel</a>
        </form>
    </Page>;
}

CreateView.css = [
    ["label", {
        marginRight: "8px"
    }],
    [".spacer", {
        height: "20px"
    }]
] as InlineCSSRule[];