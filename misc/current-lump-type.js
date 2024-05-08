// Shows the current growing lump type in the sugar lump tooltip

(() => {
    Game.lumpTooltip = (function (old) {
        return (...params) => {
            let html = old(...params);

            html = html.slice(0, -6); // remove </div> tag
            let lumpTypeHtml = ["Normal", "Bifurcated", "Golden", "Meaty", "Caramelized"][Game.lumpCurrentType];
            html += `<div class="line"></div>This lump is <b>${lumpTypeHtml}</b></div>`;

            return html;
        };
    })(Game.lumpTooltip);
})();
