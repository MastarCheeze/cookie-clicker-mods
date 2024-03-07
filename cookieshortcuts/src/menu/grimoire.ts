import { Dropdown, Text } from "../base/menu/component";
import { Collapsible, Shortcut } from "./component";
import { assignParam } from "./helpers";

const spells = [
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

export default new Collapsible("🧙‍♂️ Grimoire").add(
    new Shortcut("grimoire.cast", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Cast").write());

        const spell = new Dropdown([...spells]);
        assignParam(spell, params, 0);
        frag.appendChild(spell.write());

        return [frag];
    }),
);
