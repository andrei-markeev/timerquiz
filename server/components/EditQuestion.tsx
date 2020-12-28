import { createElement, InlineCSSRule } from "../../lib/templates";

export function EditQuestion({ question }: { question: Question | "new" }, children: any[]) {
    return <span class="edit-question">
        <table>
            <tr>
                <td colspan={ 2 }>
                    <label for="questionText">Question</label>
                    <textarea name="questionText" cols={ 80 }>{ question === "new" ? "" : question.text }</textarea>
                </td>
            </tr>
            <tr>
                <td colspan={ 2 }>
                    <label for="questionText">Time to think </label>
                    <select name="secondsToThink">
                        <option value="15" selected={ question !== "new" && question.secondsToThink === 20 }>15 seconds</option>
                        <option value="20" selected={ question !== "new" && question.secondsToThink === 20 }>20 seconds</option>
                        <option value="30" selected={ question === "new" || question.secondsToThink === 30 }>30 seconds</option>
                        <option value="45" selected={ question !== "new" && question.secondsToThink === 45 }>45 seconds</option>
                        <option value="60" selected={ question !== "new" && question.secondsToThink === 60 }>1 minute</option>
                        <option value="90" selected={ question !== "new" && question.secondsToThink === 90 }>1 minute 30 seconds</option>
                        <option value="120" selected={ question !== "new" && question.secondsToThink === 120 }>2 minutes</option>
                        <option value="180" selected={ question !== "new" && question.secondsToThink === 180 }>3 minutes</option>
                        <option value="300" selected={ question !== "new" && question.secondsToThink === 300 }>5 minutes</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>
                    <input title="Is correct answer?" type="radio" name="correct" value="0" checked={ question === "new" ? undefined : question.correctAnswer === 0 } />
                    { " " }
                    <label for="answer1">Answer 1</label>
                    <input type="text" name="answer0" value={ question === "new" ? "" : question.answers[0] } />
                </td>
                <td>
                    <input title="Is correct answer?" type="radio" name="correct" value="1" checked={ question === "new" ? undefined : question.correctAnswer === 1 } />
                    { " " }
                    <label for="answer2">Answer 2</label>
                    <input type="text" name="answer1" value={ question === "new" ? "" : question.answers[1] } />
                </td>
            </tr>
            <tr>
                <td>
                    <input title="Is correct answer?" type="radio" name="correct" value="2" checked={ question === "new" ? undefined : question.correctAnswer === 2 } />
                    { " " }
                    <label for="answer3">Answer 3</label>
                    <input type="text" name="answer2" value={ question === "new" ? "" : question.answers[2] } />
                </td>
                <td>
                    <input title="Is correct answer?" type="radio" name="correct" value="3" checked={ question === "new" ? undefined : question.correctAnswer === 3 } />
                    { " " }
                    <label for="answer4">Answer 4</label>
                    <input type="text" name="answer3" value={ question === "new" ? "" : question.answers[3] } />
                </td>
            </tr>
        </table>
        { question !== "new" && <input type="hidden" name="order" value={ question.order } /> }
        { children }
    </span>;
}

EditQuestion.css = [
    ['.edit-question input[type="text"]', {
        width: "95%",
        maxWidth: "300px",
        display: "block"
    }],
    ['.edit-question textarea', {
        width: "95%",
        maxWidth: "720px",
        display: "block"
    }],
    [".edit-question table", {
        marginBottom: "10px"
    }],
    {
        media: "only screen and (max-width: 450px)",
        styles: [
            [".edit-question table td", {
                display: "block"
            }]
        ]
    }
] as InlineCSSRule[];