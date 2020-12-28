import { createElement, inlineCSS, InlineCSSRule } from "../../lib/templates";
import { CenteredPanel } from "./CenteredPanel";

interface PageParams {
    title: string;
    userAgent: string;
    cssRules?: { css: InlineCSSRule[] }[];
}

export function Page({ title, userAgent, cssRules }: PageParams, children: string[]) {
    const msIE = +(userAgent.match(/; MSIE ([1-9\.]+);/)?.[1] || 0);
    const moz = +(userAgent.match(/^Mozilla\/([0-9\.]+) /)?.[1] || 0);
    const cssSupported = (!moz || moz >= 5) && (!msIE || msIE >= 7);
    const css = inlineCSS(Page, CenteredPanel, ...(cssRules || []));
    return (
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.2, maximum-scale=5.0" />
                <meta name="description" content="Participate in a quiz or create your own" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <title>{ title }</title>
                { cssSupported && <style>{ css }</style>}
            </head>
            <body>
                <CenteredPanel>
                    { children }
                </CenteredPanel>
            </body>
        </html>
    )
}
Page.css = [
    ["body", {
        backgroundColor: "#f2f3f4",
        fontSize: "20px",
        fontFamily: "sans-serif",
        fontWeight: 300
    }],
    ['input[type="text"], select, textarea', {
        fontSize: "20px",
        fontFamily: "sans-serif",
        fontWeight: 300
    }]
] as InlineCSSRule[];
