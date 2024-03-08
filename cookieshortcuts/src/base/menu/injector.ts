import { elementFromString } from "./stringtohtml";
import { Component } from "./componentbase";
import { css as componentCss } from "./component";

const w = window as any;

export function injectMenu(menu: Component) {
    if (w.Game === undefined) throw new Error("Game not found.");

    // override Game.UpdateMenu
    w.Game.UpdateMenu = ((target) => {
        return function (this: any, ...args: any[]) {
            const retVal = target.apply(this, args);
            writeMenu(menu);
            return retVal;
        };
    })(w.Game.UpdateMenu);

    // Prevents the options menu from updating by set time interval.
    // This is to prevent dropdown menus from disappearing.
    // Getters/setters make sure the logic is always wrapping around the original function
    // no matter how many times and when it is modified by other mods,
    let updateMenu = w.Game.UpdateMenu.bind(w.Game);
    Object.defineProperty(w.Game, "UpdateMenu", {
        get() {
            if (
                w.Game.onMenu === "prefs" &&
                new Error().stack?.includes("Game.Logic") // hacky way to figure out if function is called by Game.Logic (menu update because of set time interval)
            ) {
                return () => undefined;
            }
            return updateMenu;
        },
        set(value) {
            updateMenu = value;
        },
    });
}

function writeMenu(menu: Component) {
    // find place to insert menu
    const blocks = document.getElementsByClassName("block");
    let settingsBlock;
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].textContent?.search(w.loc("Settings")) === 0) {
            settingsBlock = blocks[i];
        }
    }
    if (settingsBlock === undefined) return;

    // create menu
    const block = elementFromString(`<div class="block" style="padding: 0px; margin: 8px 4px;"></div>`);
    const subsection = elementFromString(`<div class="subsection" style="padding: 0px;"></div>`);
    block.appendChild(subsection);
    subsection.appendChild(menu.write());

    // insert menu
    settingsBlock.after(block);
}

export function injectCss(css: string) {
    if (w.Game === undefined) throw new Error("Game not found.");

    // add css
    const style = document.createElement("style");
    document.head.appendChild(style);
    style.appendChild(document.createTextNode(componentCss + css));
}
