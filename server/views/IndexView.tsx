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
            <h1>How does it work?</h1>
            <h3>Step 1: Sign up</h3>
            <p class="description">
                We don't store your email, phone or any other personal data. Not even name.
                You don't need to remember a password (because it's "Login with Google" button).
                You can completely purge your data from the system at any moment - no trace left.
            </p>
            <div class="screenshots">
                <img src="/login_screen.png" alt="log in screen" />
                <img src="/delete_account.png" alt="delete account" />
            </div>
            <h3>Step 2: Create a quiz</h3>
            <p class="description">
                Add questions and answers, mark the right answer, choose how much time participants will have to think about this question.
            </p>
            <div class="screenshots">
                <img src="/add_question.png" alt="add a question" />
                <img src="/list_of_questions.png" alt="list of questions" />
            </div>
            <h3>Step 3: Start quiz and share PIN code with the players</h3>
            <p class="description">
                Press "Play" next to the quiz. Give your friends the PIN code and ask them to join the quiz at <a href="https://timerquiz.vercel.app">https://timerquiz.vercel.app</a>.
                It works best when you're in the conf call together and you're sharing your screen.
            </p>
            <div class="screenshots">
                <img src="/dashboard.png" alt="list of quizzes and the Play button" />
                <img src="/pin_code.png" alt="pin code" />
            </div>
            <h3>Step 4: Players join</h3>
            <p class="description">
                Players enter the quiz PIN code and a name. You don't need to sign up in order to participate.
                Timer Quiz works on any device, in any browser! For example, Internet Explorer and Lynx (text browser).
            </p>
            <div class="screenshots">
                <img src="/join_quiz.png" alt="joining a quiz" />
                <img src="/lobby.png" alt="in the lobby" />
            </div>
            <h3>Step 5: Play!</h3>
            <p class="description">
                After everybody joined, press "Start the game"! Now the fun begins!
            </p>
            <div class="screenshots">
                <img src="/answering.png" alt="answering a question" />
                <img src="/scores.png" alt="scores of participants" />
            </div>
            <h3>Step 6: Results!</h3>
            <p class="description">
                Score is calculated based on the time spent thinking. The faster player answers, the more points he gets.
                Maximum is 1000 points if you answered right away, and minimum is 300 points if you answered in the very last second...
            </p>
            <div class="screenshots">
                <img src="/low_time.png" alt="time ticking" />
                <img src="/quiz_ended.png" alt="results of the quiz" />
            </div>
        </form>
    </Page>;
}
IndexView.css = [
    ["body", {
        minHeight: "100%"
    }],
    [".btn", {
        marginBottom: "10px"
    }],
    ["img", {
        maxWidth: "45%",
        marginTop: "10px",
        marginBottom: "10px",
        marginRight: "10px",
        display: "inline-block",
        verticalAlign: "top"
    }]
] as InlineCSSRule[];
