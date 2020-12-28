import { createElement } from "../../lib/templates";

export function TextOrImage({ value }: { value: string }) {
    if (value.indexOf("https://") === 0 || /^\/uploads\/[a-z0-9_-]+\.(jpg|png|gif)$/.test(value))
        return <img src={ value } alt="answer as image" />;
    else
        return value;
}