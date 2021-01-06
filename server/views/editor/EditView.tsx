import { createElement, InlineCSSRule } from "../../../lib/templates";
import { BlueButtonCss, ButtonCss, DefaultButtonCss, RedButtonCss } from "../../components/Button";
import { ButtonsPanel } from "../../components/ButtonsPanel";
import { EditQuestion } from "../../components/EditQuestion";
import { InlineEdit } from "../../components/InlineEdit";
import { Page } from "../../components/Page";

interface EditViewParams {
    userAgent: string;
    quiz: Quiz;
    questions: Question[]
}

export function EditView({ userAgent, quiz, questions }: EditViewParams) {
    const cssRules = [ ButtonCss, DefaultButtonCss, RedButtonCss, BlueButtonCss, EditQuestion, InlineEdit, ButtonsPanel, EditView ];
    return <Page userAgent={ userAgent } title={ quiz.name + " - Edit" } cssRules={ cssRules }>
        <div class="quiz-name">
            <form method="POST">
                <input type="hidden" name="quizId" value={ quiz._id.toHexString() } />
                <InlineEdit name="name">
                    <h1>{ quiz.name }</h1>
                    <span>
                        <input type="text" name="quizName" value={ quiz.name } />
                        { " " }
                        <button class="btn btn-blue" name="action" value="setName">Save</button>
                    </span>
                </InlineEdit>
            </form>
        </div>
        <ol>
        { questions.map(q => 
            <li>
                <form method="POST">
                    <input type="hidden" name="quizId" value={ quiz._id.toHexString() } />
                    <InlineEdit name={ "question" + q._id.toHexString() }>
                        <span>{ q.text }</span>
                        <EditQuestion question={ q }>
                            <button class="btn btn-blue" name="editQuestion" value={ q._id.toHexString() }>Save</button>
                            { " " }
                            <button class="btn btn-red" name="deleteQuestion" value={ q._id.toHexString() }>Delete</button>
                        </EditQuestion>
                    </InlineEdit>
                </form>
            </li>
        ) }
        </ol>
        <ButtonsPanel>
            <a class="btn btn-default" href={ "/edit?quizId=" + quiz._id.toHexString() + "&action=showAddQuestionForm" } >Add new question</a>
            { " "}
            <a class="btn btn-red" href={ "/edit?quizId=" + quiz._id.toHexString() + "&action=confirmDelete" } >Delete quiz</a>
            { " "}
            <a class="btn btn-default" href={ "/" } >Back to dashboard</a>
        </ButtonsPanel>
    </Page>;
}

EditView.css = [
    ["li", {
        marginTop: "10px",
        marginBottom: "18px"
    }],
    [".inline-edit h1", {
        display: "inline"
    }],
    [".inline-edit", {
        marginBottom: "18px"
    }],
    [".inline-edit .view.btn.btn-default", {
        display: "inline-block",
        marginTop: "3px"
    }],
    ['.view.btn.btn-default[for="inline-edit-name"]', {
        verticalAlign: "bottom"
    }]
] as InlineCSSRule[];
