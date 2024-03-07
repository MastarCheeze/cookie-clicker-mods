import { $ } from "./base/helpers";
import Storage from "./storage";
import build from "./menu/menu";
import load, { Game } from "./base/loader";
import Keybind from "./keybind";
import Actions from "./actions/actions";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// FUTURE export/load keymappings to/from string
class Mod {
    id = Storage.id;
    name = Storage.name;

    init() {
        // listen for and trigger keyboard shortcuts
        function keyDown(e: KeyboardEvent) {
            let shortcutName: keyof typeof Actions;
            const toRun: [number, keyof typeof Actions, any[]][] = [];
            for (shortcutName in Actions) {
                for (const shortcutPair of Storage.keybinds[shortcutName]) {
                    if (shortcutPair == null) continue;
                    const [keybind] = shortcutPair;

                    if (keybind == null) continue;
                    if (Keybind.prototype.match.call(keybind, e)) {
                        toRun.push([shortcutPair[1], shortcutName, shortcutPair[2]]);
                    }
                }
            }

            toRun.sort((a, b) => a[0] - b[0]); // sort smallest to largest
            (async () => {
                let lastOrder = -100;
                for (const [order, shortcutName, args] of toRun) {
                    (Actions[shortcutName] as any)(...args);
                    if (order != lastOrder) await sleep(150);
                    lastOrder = order;
                }
            })();
        }
        document.addEventListener("keydown", keyDown, false);

        // remove the default game keybinds ctrl+s and ctrl+o by countering them
        window.addEventListener("keydown", (e) => {
            if (Storage.allowDefault) {
                Storage.allowDefault = false;
                return;
            }

            if (!Game.OnAscend && Game.AscendTimer == 0) {
                if (e.ctrlKey && e.keyCode == 83) {
                    Game.toSave = false; // prevent save
                } else if (e.ctrlKey && e.keyCode == 79) {
                    Game.ClosePrompt(); // close load save
                }
            }
        });

        // override click cookie to prevent clicks when autoclicking is enabled
        $("#bigCookie")!.removeEventListener("click", Game.ClickCookie, false);
        const oldFunc = Game.ClickCookie;
        Game.ClickCookie = function (e: PointerEvent, amount: number, autoclicker: boolean) {
            if (Game.autoclickerInterval == null || autoclicker) return oldFunc(e, amount);
        };
        if (!Game.mods.CookieMonster) {
            // Cookie monster already overrides big cookie click event
            $("#bigCookie")!.addEventListener("click", Game.ClickCookie, false);
        }
    }

    delayedInit() {
        build();
    }

    save() {
        const save = JSON.stringify(Storage.saveObj);
        return save;
    }

    load(str: string) {
        let parsed;
        try {
            parsed = JSON.parse(str);
        } catch (error) {
            console.warn(`${name} - Unable to load settings. Reverting to defaults.`);
            return;
        }

        Storage.saveObj = parsed;
        Game.UpdateMenu();
    }

    exposed = Storage.exposed;
}

load(new Mod());
