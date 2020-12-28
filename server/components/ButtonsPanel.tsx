import { createElement, InlineCSSRule } from "../../lib/templates";

export function ButtonsPanel(_params: any, children: any[]) {
    return (
        <div class="buttons-panel">
            { children }
        </div>
    );
}
ButtonsPanel.css = [
    {
        media: "only screen and (max-width: 450px)",
        styles: [
            [".buttons-panel .btn", {
                display: "block",
                marginBottom: "10px"
            }],
            [".buttons-panel input.btn, .buttons-panel button.btn", {
                width: "100%",
                boxSizing: "border-box"
            }]
        ]
    }
] as InlineCSSRule[];
