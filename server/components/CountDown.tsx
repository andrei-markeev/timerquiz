import { relative } from "path";
import { createElement, InlineCSSRule } from "../../lib/templates";

interface CountDownParams {
    secondsToThink: number;
    questionStartMs: number;
}
export function CountDown({ secondsToThink, questionStartMs }: CountDownParams) {
    return <div class="count-down script-only">
        <div id="fill"></div>
        <div id="seconds-left"></div>
        <script>{
            `var textEl = document.getElementById("seconds-left");`
            + `var fillEl = document.getElementById("fill");`
            + `var secondsPassed = Math.floor((Date.now() - ${questionStartMs}) / 1000);`
            + `var counter = Math.max(0, ${secondsToThink} - secondsPassed);`
            + `var interval = setInterval(function() { if (counter === 0) clearInterval(interval); else { counter--; textEl.innerHTML = counter.toString(); fillEl.style.height = (100 * counter / ${secondsToThink}) + "%"; } }, 1000);`
        }</script>
    </div>;
}

CountDown.css = [
    [".count-down", {
        float: "right",
        width: "60px",
        height: "60px",
        borderRadius: "100%",
        position: "relative",
        overflow: "hidden"
    }],
    ["#fill", {
        backgroundColor: "#45bf72",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "100%"
    }],
    ["#seconds-left", {
        fontSize: "30px",
        fontWeight: "bold",
        color: "#F00",
        mixBlendMode: "darken",
        textAlign: "center",
        marginTop: "12px"
    }],
] as InlineCSSRule[];