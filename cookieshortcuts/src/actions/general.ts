import { Game } from "../aliases";
import Keybind from "../keybind";
import { notify } from "../menu/ui";
import Storage from "../storage";

export default {
    autoclicker: (cps: number) => {
        if (Game.Has("Shimmering veil [off]") && Storage.prefs["protectVeil"]) {
            notify("Shimmering veil is on");
            return;
        }

        if (Storage.autoclickerInterval == null) {
            Game.ClickCookie(null, 0);
            Storage.callFromAutoClicker = true;
            Storage.autoclickerInterval = setInterval(() => {
                Game.ClickCookie(null, 0);
                Storage.callFromAutoClicker = true;
            }, 1000 / cps);

            const keyUp = (e: KeyboardEvent) => {
                for (const shortcutPair of Storage.keybinds["general.autoclicker"]) {
                    if (shortcutPair && Keybind.prototype.match.call(shortcutPair[0], e)) {
                        clearInterval(Storage.autoclickerInterval!);
                        Storage.autoclickerInterval = null;
                        document.removeEventListener("keyup", keyUp);
                    }
                }
            };

            document.addEventListener("keyup", keyUp);
        }
    },
    clickGoldenCookie: (all: boolean, wrath: boolean) => {
        if (Game.Has("Shimmering veil [off]") && Storage.prefs["protectVeil"]) {
            notify("Shimmering veil is on");
            return;
        }

        for (const shimmer of [...Game.shimmers]) {
            if (
                shimmer.wrath != 1 || // is golden cookie
                wrath || // click wrath setting is on
                shimmer.force === "cookie storm drop" || // is cookie storm drop
                Game.shimmerTypes[shimmer.type].chain // is chain cookie
            ) {
                shimmer.pop();
                if (!all) {
                    return;
                }
            }
        }
    },
    clickFortuneCookie: () => {
        if (Game.TickerEffect && Game.TickerEffect.type === "fortune") {
            Game.tickerL.click();
        }
    },
    popWrinkler: (fattest: boolean) => {
        if (!(Game.wrinklers as any[]).some((wrinkler) => wrinkler.phase === 2)) {
            notify("You don't have any wrinklers");
            return;
        }

        if (fattest) {
            Game.wrinklers.reduce(
                function (highest: any, current: any) {
                    return current.sucked > highest.sucked && (current.type === 0 || !Storage.prefs["protectShiny"])
                        ? current
                        : highest;
                },
                { sucked: -Infinity },
            ).hp = -10;
        } else {
            // pop all
            Game.wrinklers.forEach((wrinkler: any) => {
                if (wrinkler.phase === 2 && (wrinkler.type === 0 || !Storage.prefs["protectShiny"])) wrinkler.hp = -10;
            });
        }
    },
    save: () => {
        Storage.allowDefault = true;
        Game.toSave = true;
    },
    exportSave: () => {
        Game.ExportSave();
    },
    exportSaveToFile: () => {
        Game.FileSave();
    },
    exportSaveToClipboard: () => {
        navigator.clipboard.writeText(Game.WriteSave(1));
        Game.Notify("Save exported to clipboard", "", undefined, true);
    },
    importSave: () => {
        Storage.allowDefault = true;
        Game.ImportSave();
    },
    importSaveFromFile: () => {
        var input = document.createElement("input");
        input.type = "file";
        input.addEventListener("change", (e) => Game.FileLoad(e));
        input.click();
    },
    importSaveFromClipboard: async () => {
        const save = await navigator.clipboard.readText();
        if (!Game.LoadSave(save)) {
            notify("Invalid save string");
        }
    },
    ascend: (force: boolean, skipAnimation: boolean) => {
        if (Game.AscendTimer === 0) {
            if (!Game.OnAscend) {
                Game.Ascend(force);
                if (skipAnimation) Game.AscendTimer = Game.AscendDuration;
            } else {
                Game.Reincarnate(force);
                if (skipAnimation) Game.ReincarnateTimer = Game.ReincarnateDuration;
            }
        }
    },
    options: () => {
        Game.ShowMenu("prefs");
    },
    info: () => {
        Game.ShowMenu("log");
    },
    stats: () => {
        Game.ShowMenu("stats");
    },
};
