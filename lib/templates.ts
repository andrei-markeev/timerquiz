import { Properties } from "csstype";

export interface ServerSideHtml {
    html: string
}

type ChildElement = FlatChildElement | ChildElement[];
type FlatChildElement = ServerSideHtml | string | number;

export function createElement(tag: string | Function, props: { [key: string]: string | boolean }, ...children: ChildElement[]): ServerSideHtml {
    if (typeof tag === "string") {
        const innerHTML = children ? flatten(children)
            .map(c =>
                typeof c === "number" ? c.toString() :
                typeof c === "string" ? escapeHtml(c) :
                c.html)
            .join("") : "";
        return { html: `<${tag}${props ? mapPropsToAttributes(props) : ""}>${innerHTML}</${tag}>` };
    } else {
        return tag(props, children);
    }
}

function mapPropsToAttributes(props: { [key: string]: string | boolean }) {
    return Object.keys(props).filter(k => props[k] !== false).map(k => ` ${k}="${escapeHtmlAttribute(props[k])}"`).join("")
}

function flatten(arr: ChildElement[]): FlatChildElement[] {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, [] as any[]);
}

function escapeHtml(unsafe: string) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function escapeHtmlAttribute(unsafe: boolean | string) {
    if (unsafe === true)
        return "";
    else if (unsafe === false)
        return undefined;
    else if (unsafe == null || typeof unsafe === "number")
        return unsafe;
    else
        return unsafe.replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

type SingleRule = readonly [ Readonly<string>, Readonly<Properties> ];
type MediaQuery = { media: string, styles: Readonly<SingleRule[]> }
export type InlineCSSRule = SingleRule | MediaQuery;

function isMediaQuery(rule: InlineCSSRule): rule is MediaQuery {
    return "media" in rule;
}

function singleRuleToString(rule: SingleRule) {
    const [selector, style] = rule;
    const def = [];
    for (const key in style) {
        const name = key.replace(/([A-Z])/g, u => "-" + u.toLowerCase());
        const value = (<any>style)[key];
        def.push(`${name}:${value};`);
    }
    return selector + " { " + def.join("")  + " } ";
}

export function inlineCSS(...objs: { css?: InlineCSSRule[] }[]) {
    let rules: InlineCSSRule[] = [];
    for (const obj of objs) {
        if (obj.css)
            rules = rules.concat(obj.css);
    }

    let result = "";
    for (const rule of rules) {
        if (isMediaQuery(rule)) {
            result += "@media " + rule.media + " {" + rule.styles.map(s => singleRuleToString(s)).join("") + "} ";
        } else
            result += singleRuleToString(rule);
    }
    return result;
}
