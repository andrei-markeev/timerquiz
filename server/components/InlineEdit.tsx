import { createElement, InlineCSSRule } from "../../lib/templates";

export function InlineEdit({ name }: { name: string }, children: any[]) {
    const id = "inline-edit-" + name;
    return <div class="inline-edit">
        <input id={ id } type="checkbox" />
        <span class="view">{ children[0] }{" "}</span>
        <span class="edit">{ children[1] }{" "}</span>
        <label class="view btn btn-default" for={ id }>Edit</label>
        <label class="edit btn btn-default" for={ id }>Cancel</label>
    </div>;
}

InlineEdit.css = [
    [".inline-edit > input[type=\"checkbox\"]", {
        display: "none",
    }],
    [".inline-edit > input[type=\"checkbox\"] ~ .view", {
        display: "inline"
    }],
    [".inline-edit > input[type=\"checkbox\"] ~ .edit", {
        display: "none"
    }],
    [".inline-edit > input[type=\"checkbox\"]:checked ~ .view", {
        display: "none"
    }],
    [".inline-edit > input[type=\"checkbox\"]:checked ~ .edit", {
        display: "inline"
    }]
] as InlineCSSRule[];