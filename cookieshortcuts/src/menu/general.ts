import { Text, OnOffButton, ToggleButton, Slider, Listing, Label } from "../base/menu/component";
import { Collapsible, PrefButton, Shortcut, TitleShortcut } from "./component";
import { assignParam, assignParamIntToBool, warning } from "./helpers";

export default new Collapsible("🍪 General").add(
    new PrefButton(
        "protectVeil",
        "Protect shimmering veil",
        "Prevents some shortcuts from running to protect the shimmering veil.",
    ),
    new PrefButton("protectShiny", "Protect shiny wrinklers"),
    new TitleShortcut("general.autoclicker", "Click big cookie", undefined, (params) => {
        const slider = new Slider("Click speed", "[$] CPS", 5, 20, 0.1);
        assignParam(slider, params, 0);
        return [slider.write()];
    }),
    new Shortcut("general.clickGoldenCookie", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Click golden cookie").write());

        const amount = new ToggleButton(["One GC", "All GCs"]);
        amount.addStyle("width: 75px;");
        assignParamIntToBool(amount, params, 0);
        frag.appendChild(amount.write());

        const wrath = new OnOffButton("Wrath");
        wrath.addStyle("width: 75px;");
        assignParam(wrath, params, 1);
        frag.appendChild(wrath.write());

        return [frag];
    }),
    new Listing().add(
        new Label(
            "Also clicks wrath type cookie storm drops and chain cookies regardless of wrath setting, and reindeer.",
        ),
    ),
    new TitleShortcut("general.clickFortuneCookie", "Click fortune cookie"),

    new Listing().add(new Label("Click fortune cookies on the news ticker.")),
    new Shortcut("general.popWrinkler", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Pop").write());

        const which = new ToggleButton(["All", "Fattest"]);
        which.addStyle("width: 45px;");
        assignParamIntToBool(which, params, 0);
        frag.appendChild(which.write());

        frag.appendChild(new Text("wrinkler").write());

        return [frag];
    }),
    new TitleShortcut("general.save", "Save game"),
    new TitleShortcut("general.exportSave", "Export save", "Opens the export save menu"),
    new TitleShortcut("general.exportSaveToFile", "Export save to file"),
    new TitleShortcut(
        "general.exportSaveToClipboard",
        "Export save to clipboard",
        "Copies the save string to your clipboard",
    ),
    new TitleShortcut("general.importSave", "Import save", "Opens the import save menu"),
    new TitleShortcut("general.importSaveFromFile", "Import save from file"),
    new TitleShortcut(
        "general.importSaveFromClipboard",
        "Import save from clipboard",
        "Imports a game from the save string on your clipboard",
    ),
    new Shortcut("general.ascend", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Ascend/reincarcenate").write());

        const button = new OnOffButton(`${warning} Skip menu`);
        button.addStyle("width: 100px;");
        assignParam(button, params, 0);
        frag.appendChild(button.write());

        return [frag];
    }),
    new TitleShortcut("general.options", "Options menu"),
    new TitleShortcut("general.info", "Info menu"),
    new TitleShortcut("general.stats", "Stats menu"),
);
