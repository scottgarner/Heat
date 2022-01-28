"use strict";

{
    const params = (new URL(document.location)).searchParams;
    const demo = params.get("demo") || false;
    const clear = params.get("clear") || false;

    if ((!window.obsstudio && !clear) || demo) document.body.classList.add("demo");
}