// ==UserScript==
// @name         What Lump Did I Harvest
// @include      /https?://orteil.dashnet.org/cookieclicker/
// @include      /https?://cookieclicker.ee/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashnet.org
// ==/UserScript==

const readyCheck = setInterval(() => {
    const Game = unsafeWindow.Game;

    if (typeof Game !== "undefined" && typeof Game.ready !== "undefined" && Game.ready) {
        Game.LoadMod("https://mastarcheeze.github.io/cookie-clicker-mods/whatlumpdidiharvest/main.js");
        clearInterval(readyCheck);
    }
}, 1000);
