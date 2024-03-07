import { Text, OnOffButton, Dropdown } from "../base/menu/component";
import { Collapsible, Shortcut, TitleShortcut } from "./component";
import { assignParam, warning } from "./helpers";

export default new Collapsible("⬆️ Upgrades").add(
    new TitleShortcut("upgrades.buyAll", "Buy all upgrades"),
    new Shortcut("upgrades.switchSeason", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Season switcher").write());

        const action = new Dropdown(["Toggle", "Switch on", "Switch off"] as const);
        assignParam(action, params, 0);
        frag.appendChild(action.write());

        const seasons = ["Christmas", "Halloween", "Valentine's day", "Business day", "Easter"];
        if (action.value._ === "Switch off") seasons.push("Any season");
        const season = new Dropdown(seasons as unknown as (typeof params)[1][]);
        assignParam(season, params, 1);
        frag.appendChild(season.write());

        return [frag];
    }),
    new Shortcut("upgrades.goldenSwitch", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Golden switch").write());

        const action = new Dropdown(["Toggle", "Switch on", "Switch off"] as const);
        assignParam(action, params, 0);
        frag.appendChild(action.write());

        return [frag];
    }),
    new Shortcut("upgrades.shimmeringVeil", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Shimmering veil").write());

        const action = new Dropdown(["Toggle", "Switch on", "Switch off"] as const);
        assignParam(action, params, 0);
        frag.appendChild(action.write());

        return [frag];
    }),
    new Shortcut("upgrades.sugarFrenzy", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Sugar frenzy").write());

        const force = new OnOffButton(`${warning} Skip menu`);
        force.addStyle("width: 100px");
        assignParam(force, params, 0);
        frag.appendChild(force.write());

        return [frag];
    }),
);
