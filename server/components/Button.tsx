import { InlineCSSRule } from "../../lib/templates";

export const ButtonCss = { css: [
    [".btn", {
        display: "inline-block",
        padding: "6px 12px",
        margin: 0,
        fontSize: "20px",
        fontWeight: "normal",
        lineHeight: 1.428571429,
        textAlign: "center",
        whiteSpace: "nowrap",
        verticalAlign: "middle",
        cursor: "pointer",
        backgroundImage: "none",
        border: "1px solid transparent",
        borderRadius: "4px",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none"
    }],
    [".btn:focus, .btn:hover", {
        color: "#333333",
        textDecoration: "none"
    }],
    [".btn:active", {
        outline: 0,
        WebkitBoxShadow: "inset 0 3px 5px rgba(0, 0, 0, 0.125)",
        boxShadow: "inset 0 3px 5px rgba(0, 0, 0, 0.125)"
    }],
    [".btn[disabled], fieldset[disabled] .btn", {
        pointerEvents: "none",
        cursor: "not-allowed",
        opacity: "0.65",
        filter: "alpha(opacity=65)",
        WebkitBoxShadow: "none",
        boxShadow:  "none",
    }],
    [".btn-block", {
        display: "block",
        width: "100%",
        paddingRight: 0,
        paddingLeft: 0,
    }],
    [".btn-block + .btn-block", {
        marginTop: "5px"
    }],
    ["input[type=\"submit\"].btn-block, input[type=\"reset\"].btn-block, input[type=\"button\"].btn-block", {
        width: "100%"
    }]
] as InlineCSSRule[]};

export const DefaultButtonCss = { css: 
    buttonColorCss("default","#333333",{ bg: "#ffffff", active: "#ebebeb" },{ border: "#cccccc", active: "#adadad" })
    .concat(buttonColorDarkModeCss("default","#ffffff",{ bg: "#505050", active: "#606060" },{ border: "#aaaaaa", active: "#8d8d8d" }))
};
export const RedButtonCss = { css: buttonColorCss("red","#ffffff",{ bg: "#ff4b2f", active: "#ff573d" },{ border: "#d94129", active: "#d94c36" }) };
export const YellowButtonCss = { css: buttonColorCss("yellow","#333333",{ bg: "#ffe400", active: "#ffe71c" },{ border: "#e3cb00", active: "#e3cd17" }) };
export const GreenButtonCss = { css: buttonColorCss("green","#ffffff",{ bg: "#14A76C", active: "#21b077" },{ border: "#118a59", active: "#1b9463" }) };
export const BlueButtonCss = { css: buttonColorCss("blue","#ffffff",{ bg: "#123C69", active: "#20538a" },{ border: "#0e2f52", active: "#15375c" }) };

function buttonColorCss(name: string, color: string, bgColor: { bg: string, active: string}, borderColor: { border: string, active: string}) {
    return [
        [`.btn-${name}`, {
            color: color,
            backgroundColor: bgColor.bg,
            borderColor: borderColor.border,
        }],
        [`.btn-${name}:hover, .btn-${name}:focus, .btn-${name}:active`, {
            color: color,
            backgroundColor: bgColor.active,
            borderColor: borderColor.active
        }],
        [`.btn-${name}[disabled], fieldset[disabled] .btn-${name}, .btn-${name}[disabled]:hover, fieldset[disabled] .btn-${name}:hover, .btn-${name}[disabled]:focus, fieldset[disabled] .btn-${name}:focus, .btn-${name}[disabled]:active, fieldset[disabled] .btn-${name}:active`, {
            backgroundColor: bgColor.bg,
            borderColor: borderColor.border
        }]
    ] as InlineCSSRule[];
}

function buttonColorDarkModeCss(name: string, color: string, bgColor: { bg: string, active: string}, borderColor: { border: string, active: string}) {
    return [
        {
            media: "(prefers-color-scheme: dark)",
            styles: buttonColorCss(name, color, bgColor, borderColor)
        }
    ] as InlineCSSRule[];
}
