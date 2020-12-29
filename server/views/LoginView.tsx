import { createElement, InlineCSSRule } from "../../lib/templates";
import { ButtonCss, DefaultButtonCss } from "../components/Button";
import { ButtonsPanel } from "../components/ButtonsPanel";
import { Page } from "../components/Page";

interface LoginViewParams {
    userAgent: string;
    host: string;
    nonceId: string;
    error?: string;
}

export function LoginView({ host, userAgent, error, nonceId }: LoginViewParams) {
    const protocol = host === "localhost:3000" ? "http://" : "https://";
    const cssRules = [ ButtonCss, DefaultButtonCss, ButtonsPanel, LoginView ];
    return <Page title="Log in" userAgent={ userAgent } cssRules={ cssRules }>
        <form method="GET" action="https://accounts.google.com/o/oauth2/v2/auth">
            <h1>Log in</h1>
            { !!error && <div class="error">{ error }</div> }
            <p>
                Authentication is OAuth-based so your password is never exposed to Timer Quiz.
                Timer Quiz only receives and stores your numeric Google ID so that it can identify you and your quizzes aren't lost.
                Timer Quiz doesn't have access to your email, name or any other info.
            </p>
            <p>
                If you don't have a Timer Quiz account yet, it will be automatically created.
                You can delete it any time - all associated information is completely purged from the system.
                We don't store any backups.
            </p>
            <input type="hidden" name="response_type" value="code" />
            <input type="hidden" name="access_type" value="online" />
            <input type="hidden" name="client_id" value={ process.env.GOOGLE_APP_ID } />
            <input type="hidden" name="state" value={ nonceId } />
            <input type="hidden" name="scope" value="openid" />
            <input type="hidden" name="redirect_uri" value={ protocol + host + "/api/user/google" } />
            <ButtonsPanel>
                <input class="btn btn-default" type="submit" value="Log in with Google"></input>
                { " " }
                <a class="btn btn-default" href="/privacy.html">Privacy Policy</a>
                { " " }
                <a class="btn btn-default" href="/">Back</a>
            </ButtonsPanel>
        </form>
    </Page>;
}
LoginView.css = [
    ['.error', {
        color: "red"
    }]
] as InlineCSSRule[];
