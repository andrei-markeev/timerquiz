import { createElement, InlineCSSRule } from "../../lib/templates";

export function CenteredPanel(_params: any, children: any[]) {
    return (
        <div class="centered-panel">
            { children }
        </div>
    );
}
CenteredPanel.css = [
    [".centered-panel", {
        maxWidth: "720px",
        width: "90vw",
        margin: "10px auto"
    }]
] as InlineCSSRule[];
