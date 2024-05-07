// Shows the current Cyclius bonuses for all slots in the tooltip

(() => {
    const Pantheon = Game.Objects.Temple.minigame;

    Object.defineProperty(Pantheon.gods.ages, "desc1", {
        get: () => {
            const bonus = 0.15 * Math.sin((Date.now() / 1000 / (60 * 60 * 3)) * Math.PI * 2) * 100;
            return `Effect cycles over 3 hours. Currently at ${bonus > 0 ? "+" : ""}${bonus.toFixed(2)}%`;
        },
    });
    Object.defineProperty(Pantheon.gods.ages, "desc2", {
        get: () => {
            const bonus = 0.15 * Math.sin((Date.now() / 1000 / (60 * 60 * 12)) * Math.PI * 2) * 100;
            return `Effect cycles over 12 hours. Currently at ${bonus > 0 ? "+" : ""}${bonus.toFixed(2)}%`;
        },
    });
    Object.defineProperty(Pantheon.gods.ages, "desc3", {
        get: () => {
            const bonus = 0.15 * Math.sin((Date.now() / 1000 / (60 * 60 * 24)) * Math.PI * 2) * 100;
            return `Effect cycles over 24 hours. Currently at ${bonus > 0 ? "+" : ""}${bonus.toFixed(2)}%`;
        },
    });
})();
