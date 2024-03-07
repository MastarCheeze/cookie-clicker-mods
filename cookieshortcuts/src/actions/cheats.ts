import { Game } from "../base/loader";
import { notify } from "../menu/ui";
import Storage from "../storage";
import applyDecorator from "./applydecorator";

const cheats = {
    cookies: (action: "Gain" | "Set to", amount: number) => {
        if (action === "Gain") {
            Game.cookies += amount;
        } else if (action === "Set to") {
            Game.cookies = amount;
        }
    },
    lumps: (action: "Gain" | "Set to", amount: number) => {
        if (action === "Gain") {
            Game.lumps += amount;
        } else if (action === "Set to") {
            Game.lumps = amount;
        }
    },
    heavenlyChips: (action: "Gain" | "Set to", amount: number) => {
        if (action === "Gain") {
            Game.heavenlyChips += amount;
        } else if (action === "Set to") {
            Game.heavenlyChips = amount;
        }
    },
    openSesame: () => {
        Game.OpenSesame();
    },
    ruinTheFun: () => {
        Game.RuinTheFun();
    },
    party: () => {
        Game.PARTY = true;
    },
};

applyDecorator(cheats, (target) => (...args) => {
    if (!Storage.prefs.cheats) {
        notify("You don't have cheats enabled");
        return;
    }
    return target(...args);
});

export default cheats;
