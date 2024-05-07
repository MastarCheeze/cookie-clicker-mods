// Shows the worth of the current amount of cookies in bank in time

(() => {
    function formatTime(time) {
        let secs = Math.round(time) % 60;
        let mins = Math.floor(time / 60) % 60;
        let hours = Math.floor(time / 3600) % 24;
        let days = Math.floor(time / 3600 / 24) % 365;
        let years = Math.floor(time / 3600 / 24 / 365);

        if (years !== 0) {
            return `${years} year${years - 1 ? "s" : ""}` + (days ? ` ${days} day${days - 1 ? "s" : ""}` : "");
        } else if (days !== 0) {
            return `${days} day${days - 1 ? "s" : ""}` + (hours ? ` ${hours} hour${hours - 1 ? "s" : ""}` : "");
        } else if (hours !== 0) {
            return `${hours} hour${hours - 1 ? "s" : ""}` + (mins ? ` ${mins} minute${mins - 1 ? "s" : ""}` : "");
        } else {
            return `${mins} minute${mins - 1 ? "s" : ""}` + (secs ? ` ${secs} second${secs - 1 ? "s" : ""}` : "");
        }
    }

    Game.registerHook("draw", () => {
        let el = l("cookies");
        let text = formatTime(Game.cookies / (Game.cookiesPs * (1 - Game.cpsSucked))) + " worth of cps";
        let index = el.innerHTML.indexOf(`<div id="cookiesPerSecond"`);
        el.innerHTML =
            el.innerHTML.slice(0, index) +
            `<div style="font-size: 50%; padding-bottom: 5px;">${text}</div>` +
            el.innerHTML.slice(index);
    });
})();
