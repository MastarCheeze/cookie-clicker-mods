import { Text, Dropdown, NumberInput } from "../base/menu/component";
import { Collapsible, Shortcut, TitleShortcut } from "./component";
import Storage from "../storage";
import { assignParam } from "./helpers";

export default (() => {
    const collapsible = new Collapsible("🤨 Cheats");
    collapsible.writeCallback.attach(() => (collapsible.visible = Boolean(Storage.prefs["cheats"])));
    return collapsible;
})().add(
    new Shortcut("cheats.cookies", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Cookies").write());

        const action = new Dropdown(["Gain", "Set to"] as const);
        assignParam(action, params, 0);
        frag.appendChild(action.write());

        const amount = new NumberInput(0, undefined, true);
        assignParam(amount, params, 1);
        frag.appendChild(amount.write());

        return [frag];
    }),
    new Shortcut("cheats.lumps", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Sugar lumps").write());

        const action = new Dropdown(["Gain", "Set to"] as const);
        assignParam(action, params, 0);
        frag.appendChild(action.write());

        const amount = new NumberInput(0, undefined, true);
        assignParam(amount, params, 1);
        frag.appendChild(amount.write());

        return [frag];
    }),
    new Shortcut("cheats.heavenlyChips", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Heavenly chips").write());

        const action = new Dropdown(["Gain", "Set to"] as const);
        assignParam(action, params, 0);
        frag.appendChild(action.write());

        const amount = new NumberInput(0, undefined, true);
        assignParam(amount, params, 1);
        frag.appendChild(amount.write());

        return [frag];
    }),
    new TitleShortcut("cheats.openSesame", "Open sesame", "Opens the debug console."),
    new TitleShortcut("cheats.ruinTheFun", "Ruin the fun", "Unlocks everything."),
    new TitleShortcut(
        "cheats.party",
        "PARTY",
        "EPILEPSY/SEIZURE WARNING: BRIGHT, FLASHING, COLORFUL LIGHTS AND VIGOROUS SHAKING ARE INCLUDED",
    ),
);
