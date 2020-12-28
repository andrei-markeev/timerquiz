import { createElement, InlineCSSRule } from "../../../lib/templates";
import { BlueButtonCss, ButtonCss, DefaultButtonCss } from "../../components/Button";
import { EditQuestion } from "../../components/EditQuestion";
import { Page } from "../../components/Page";

interface AddNewQuestionViewParams {
    userAgent: string;
    quiz: Quiz;
    first?: boolean;
}

export function AddNewQuestionView({ userAgent, quiz, first }: AddNewQuestionViewParams) {
    const cssRules = [ ButtonCss, DefaultButtonCss, BlueButtonCss, EditQuestion, AddNewQuestionView ];
    return <Page userAgent={ userAgent } title={ quiz.name + " - Add a new question" } cssRules={ cssRules }>
        <form method="POST">
            <h1>{ quiz.name }</h1>
            <h4>{ first ? "Add your first question" : "Add a new question" }</h4>
            <EditQuestion question="new" />
            <input type="hidden" name="quizId" value={ quiz._id.toHexString() } />
            <input type="hidden" name="action" value="addQuestion" />
            <div class="spacer" />
            <input class="btn btn-blue" type="submit" value="Add" />
            { " " }
            { !first && <a class="btn btn-default" href={ "/edit?quizId=" + quiz._id.toHexString() }>Cancel</a> }
        </form>
    </Page>;
}

AddNewQuestionView.css = [
    [".edit-question", {
        display: "block",
        marginBottom: "15px"
    }]
] as InlineCSSRule[];