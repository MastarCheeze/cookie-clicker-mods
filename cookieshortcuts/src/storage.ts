import { w } from "./base/helpers";
import Keybind from "./keybind";
import { TImmutable, TMutable, TKeybind } from "./types";
import type Actions from "./actions/actions";

type TKeybinds = {
    [Key in keyof typeof Actions]: ([TKeybind | null, number, Parameters<(typeof Actions)[Key]>] | null)[];
};

class Storage {
    readonly id = "CookieShortcuts";
    readonly name = "Cookie Shortcuts";
    private defaultOrder = 0;

    // set defaults
    private readonly tempPrefs = {
        protectVeil: true,
        protectShiny: true,
        verbose: true,
        runButtons: false,
        advanced: false,
        cheats: false,
    };
    private readonly tempKeybinds = (<T extends TKeybinds>(obj: T) => obj)({
        "general.autoclicker": [[new Keybind("Space"), this.defaultOrder, [10]]],
        "general.clickGoldenCookie": [[new Keybind("."), this.defaultOrder, [true, false]]],
        "general.clickFortuneCookie": [[new Keybind("."), this.defaultOrder, []]],
        "general.popWrinkler": [[null, this.defaultOrder, [true]]],
        "general.save": [[new Keybind("Ctrl", "KeyS"), this.defaultOrder, []]],
        "general.exportSave": [[null, this.defaultOrder, []]],
        "general.exportSaveToFile": [[null, this.defaultOrder, []]],
        "general.exportSaveToClipboard": [[new Keybind("Ctrl", "KeyE"), this.defaultOrder, []]],
        "general.importSave": [[new Keybind("Ctrl", "KeyO"), this.defaultOrder, []]],
        "general.importSaveFromFile": [[null, this.defaultOrder, []]],
        "general.importSaveFromClipboard": [[null, this.defaultOrder, []]],
        "general.ascend": [[null, this.defaultOrder, [false, true]]],
        "general.options": [[null, this.defaultOrder, []]],
        "general.info": [[null, this.defaultOrder, []]],
        "general.stats": [[null, this.defaultOrder, []]],
        "upgrades.buyAll": [[null, this.defaultOrder, []]],
        "upgrades.switchSeason": [[null, this.defaultOrder, ["Toggle", "Christmas"]]],
        "upgrades.goldenSwitch": [[null, this.defaultOrder, ["Toggle"]]],
        "upgrades.shimmeringVeil": [[null, this.defaultOrder, ["Toggle"]]],
        "upgrades.sugarFrenzy": [[null, this.defaultOrder, [false]]],
        "buildings.building": [[null, this.defaultOrder, ["Buy", "1", 0, "Cursor", false]]],
        "krumblor.setAura": [[null, this.defaultOrder, ["No aura", false]]],
        "krumblor.upgrade": [[null, this.defaultOrder, []]],
        "krumblor.pet": [[null, this.defaultOrder, []]],
        "santa.upgrade": [[null, this.defaultOrder, []]],
        "garden.seed": [[null, this.defaultOrder, [true, false, "Baker's wheat", 1, 1, true, true, false]]],
        "garden.freeze": [[null, this.defaultOrder, ["Toggle"]]],
        "garden.changeSoil": [[null, this.defaultOrder, ["Dirt"]]],
        "garden.convert": [[null, this.defaultOrder, [false]]],
        "market.good": [[null, this.defaultOrder, ["Buy", "1", 0, "CRL", false]]],
        "market.loan": [[null, this.defaultOrder, ["1st loan"]]],
        "market.hireBroker": [[null, this.defaultOrder, []]],
        "market.upgradeOffice": [[null, this.defaultOrder, []]],
        "pantheon.slot": [[null, this.defaultOrder, [true, "Holobore", "Jade", "Cancel", "Jade"]]],
        "grimoire.cast": [[null, this.defaultOrder, ["Conjure Baked Goods"]]],
        "cheats.cookies": [[null, this.defaultOrder, ["Set to", 1e72]]],
        "cheats.lumps": [[null, this.defaultOrder, ["Set to", 1e9]]],
        "cheats.heavenlyChips": [[null, this.defaultOrder, ["Set to", 1e18]]],
        "cheats.openSesame": [[null, this.defaultOrder, []]],
        "cheats.ruinTheFun": [[null, this.defaultOrder, []]],
        "cheats.party": [[null, this.defaultOrder, []]],
        "others.wipeSave": [[null, this.defaultOrder, [false]]],
        "others.resetDefaults": [[null, this.defaultOrder, []]],
    });
    readonly defaultPrefs: TImmutable<typeof this.tempPrefs> = structuredClone(this.tempPrefs);
    readonly defaultKeybinds: TImmutable<TKeybinds> = structuredClone(this.tempKeybinds);

    public prefs: TMutable<typeof this.tempPrefs> = structuredClone(this.defaultPrefs);
    public keybinds: TMutable<TKeybinds> = structuredClone(this.defaultKeybinds);
    public collapsibles: boolean[] = [];

    public autoclickerInterval: ReturnType<typeof setInterval> | null = null; // id of auto clicker setinterval
    public allowDefault = false; // used for overriding the default game keybinds ctrl+s and ctrl+o

    constructor() {
        Object.seal(this.prefs);
        Object.seal(this.keybinds);
    }

    get saveObj() {
        return {
            prefs: this.prefs,
            keybinds: this.keybinds,
            collapsibles: this.collapsibles,
        };
    }
    set saveObj(value: any) {
        this.prefs = { ...this.prefs, ...value["prefs"] };
        this.keybinds = { ...this.keybinds, ...value["keybinds"] };
        this.collapsibles = value["collapsibles"];
    }

    resetAllToDefaults = () => {
        Object.assign(this.prefs, structuredClone(this.defaultPrefs));
        Object.assign(this.keybinds, structuredClone(this.defaultKeybinds));
    };

    // exposed functions for keybind editor for string callbacks
    exposed: {
        shortcutEditorKeyUp?: (e: KeyboardEvent) => void;
        shortcutEditorKeyDown?: (e: KeyboardEvent) => void;
        shortcutEditorSave?: () => void;
        shortcutEditorClear?: () => void;
    } = {};
}

const instance = new Storage();
export default instance;
w.Storage = instance;
