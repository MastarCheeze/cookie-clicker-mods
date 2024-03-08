import mod from "./mod";

const w = window as any;

const gameReadyInterval = setInterval(() => {
    if (w.Game === undefined || w.Game.ready === undefined || !w.Game.ready) return;

    w.Game.registerMod(mod.id, mod);
    w.Game.Notify(`${mod.name} loaded!`, "", undefined, true);

    clearInterval(gameReadyInterval);

    const modsReadyInterval = setInterval(() => {
        for (const mod of Object.values(w.Game.mods)) {
            if ((mod as any).init !== 0) return;
        }
        mod.delayedInit!();
        clearInterval(modsReadyInterval);
    }, 100);

    w.mod = mod; // DEBUG
}, 100);
