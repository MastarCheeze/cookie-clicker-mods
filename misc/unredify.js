// Makes red coloured text lighter
// i think im colourblind

(() => {
    const style = document.createElement("style");
    document.body.appendChild(style);

    function addCss(rule) {
        style.innerText += rule + "\n";
    }

    addCss(".price.disabled, .disabled .price { color: #faa0a0; }"); // store unaffordable cookies text
    addCss("#cookiesPerSecond.wrinkled { color: #faa0a0; }"); // wrinkled cps text
    addCss(".red, b.red { color: #f87171; }");
    addCss(".bankSymbolDown { color: #f87171; }");
})();
