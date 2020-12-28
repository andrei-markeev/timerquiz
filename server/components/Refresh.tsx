import { createElement } from "../../lib/templates";

interface RefreshParams {
    ms: number;
    ajax: {
        url: string;
        body: string;
        state: string;
    },
    message?: string
}

export function Refresh({ ms, ajax, message }: RefreshParams) {
    return <div>
        <script>
            { { html:
                `if (window.XMLHttpRequest) {`
                    + `setInterval(function() {`
                        + `var xhr = new XMLHttpRequest();`
                        + `xhr.open("POST", "${ajax.url}");`
                        + `xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');`
                        + `xhr.onload = function() { if (xhr.response !== "${ajax.state}") document.forms[0].submit(); };`
                        + `xhr.send("${ajax.body}");`
                    + `}, ${ms})`
                + `} else {`
                    + `setTimeout(function() { document.forms[0].submit(); }, ${ms})`
                + `}`
            } }
        </script>
        <noscript>
            <style>{ `.script-only { display: none; }` }</style>
            <p>{ message || "Please refresh the page when next question appears on presenter's screen!" }</p>
            <input type="submit" value="Refresh" />
        </noscript>
    </div>

}