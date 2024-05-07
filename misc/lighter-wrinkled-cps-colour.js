// Makes the wrinkled cps text a lighter shade of red
// i think im colourblind

(() => {
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(".wrinkled { color: #FAA0A0 !important; }"));

    const head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(style);
})();
