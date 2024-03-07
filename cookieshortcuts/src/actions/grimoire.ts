import { Game, Grimoire } from "../base/loader";
import { notify } from "../menu/ui";
import Storage from "../storage";
import applyDecorator from "./applydecorator";

const spellIndexMap = [
    "Conjure Baked Goods",
    "Force the Hand of Fate",
    "Stretch Time",
    "Spontaneous Edifice",
    "Haggler's Charm",
    "Summon Crafty Pixies",
    "Gambler's Fever Dream",
    "Resurrect Abomination",
    "Diminish Ineptitude",
] as const;

const grimoire = {
    cast: (spell: (typeof spellIndexMap)[number]) => {
        const spellId = spellIndexMap.indexOf(spell);
        if (Grimoire.getSpellCost(Grimoire.spellsById[spellId]) > Grimoire.magic) {
            notify("Not enough magic to cast this spell");
            return;
        }
        Grimoire.castSpell(Grimoire.spellsById[spellId]);
    },
};

applyDecorator(grimoire, (target) => (...args) => {
    if (Game.Objects["Wizard tower"].level < 1) {
        notify("You don't have Grimoire unlocked yet");
        return;
    }
    if (Game.Objects["Wizard tower"].amount < 1) {
        notify("You don't have any Wizard towers");
        return;
    }
    return target(...args);
});

export default grimoire;
