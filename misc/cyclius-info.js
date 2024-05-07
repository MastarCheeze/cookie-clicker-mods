// Shows the current Cyclius bonuses for all slots in the tooltip

(() => {
    const Pantheon = Game.Objects.Temple.minigame;

    Object.defineProperty(Pantheon.gods.ages, "desc1", {
        get: () => {
            const bonus = 15 * Math.sin((Date.now() / 1000 / (60 * 60 * 3)) * Math.PI * 2);
            const increasing = Math.cos((Date.now() / 1000 / (60 * 60 * 3)) * Math.PI * 2) >= 0;

            let text = "Effect cycles over 3 hours. Currently at ";
            text += `<span class="${bonus >= 0 ? "green" : "red"}">`;
            text += `${bonus > 0 ? "+" : ""}${bonus.toFixed(2)}%`;
            text += "</span>";
            text += `<span class="${increasing ? "green" : "red"}">`;
            text += increasing ? "▲" : "▼";
            text += "</span>";
            return text;
        },
    });
    Object.defineProperty(Pantheon.gods.ages, "desc2", {
        get: () => {
            const bonus = 15 * Math.sin((Date.now() / 1000 / (60 * 60 * 12)) * Math.PI * 2);
            const increasing = Math.cos((Date.now() / 1000 / (60 * 60 * 12)) * Math.PI * 2) >= 0;

            let text = "Effect cycles over 12 hours. Currently at ";
            text += `<span class="${bonus >= 0 ? "green" : "red"}">`;
            text += `${bonus > 0 ? "+" : ""}${bonus.toFixed(2)}%`;
            text += "</span>";
            text += `<span class="${increasing ? "green" : "red"}">`;
            text += increasing ? "▲" : "▼";
            text += "</span>";
            return text;
        },
    });
    Object.defineProperty(Pantheon.gods.ages, "desc3", {
        get: () => {
            const bonus = 15 * Math.sin((Date.now() / 1000 / (60 * 60 * 24)) * Math.PI * 2);
            const increasing = Math.cos((Date.now() / 1000 / (60 * 60 * 24)) * Math.PI * 2) >= 0;

            let text = "Effect cycles over 24 hours. Currently at ";
            text += `<span class="${bonus >= 0 ? "green" : "red"}">`;
            text += `${bonus > 0 ? "+" : ""}${bonus.toFixed(2)}%`;
            text += "</span>";
            text += `<span class="${increasing ? "green" : "red"}">`;
            text += increasing ? "▲" : "▼";
            text += "</span>";
            return text;
        },
    });
})();
