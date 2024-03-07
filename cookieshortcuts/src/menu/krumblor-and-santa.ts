import { Text, ToggleButton, Dropdown } from "../base/menu/component";
import { Collapsible, Shortcut, TitleShortcut } from "./component";
import { assignParam, assignParamIntToBool } from "./helpers";

export default new Collapsible("🎄 Krumblor and Santa").add(
    new Shortcut("krumblor.setAura", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Set Krumblor aura to").write());

        const aura = new Dropdown([
            "No aura",
            "Breath of Milk",
            "Dragon Cursor",
            "Elder Battalion",
            "Reaper of Fields",
            "Earth Shatterer",
            "Master of the Armory",
            "Fierce Hoarder",
            "Dragon God",
            "Arcane Aura",
            "Dragonflight",
            "Ancestral Metamorphosis",
            "Unholy Dominion",
            "Epoch Manipulator",
            "Mind Over Matter",
            "Radiant Appetite",
            "Dragon's Fortune",
            "Dragon's Curve",
            "Reality Bending",
            "Dragon Orbs",
            "Supreme Intellect",
            "Dragon Guts",
        ] as const);
        assignParam(aura, params, 0);
        frag.appendChild(aura.write());

        frag.appendChild(new Text("in").write());

        const slot = new ToggleButton(["Primary slot", "Secondary slot"]);
        slot.addStyle("width: 85px;");
        assignParamIntToBool(slot, params, 1);
        frag.appendChild(slot.write());

        return [frag];
    }),
    new TitleShortcut("krumblor.upgrade", "Upgrade Krumblor"),
    new TitleShortcut("krumblor.pet", "Pet Krumblor"),
    new TitleShortcut("santa.upgrade", "Upgrade Santa"),
);
