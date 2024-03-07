import { $ } from "../base/helpers";
import { Game } from "../base/loader";
import Keybind from "../keybind";
import Storage from "../storage";
import { TKeybind, TShortcutPair } from "../types";

export function notify(text: string) {
    if (Storage.prefs["verbose"]) Game.Notify(text, "", undefined, 1.5);
}

export function showShortcutEditor(shortcutPair: TShortcutPair) {
    const strPath = `Game.mods["${Storage.id}"].exposed`;

    const pressedKeys: string[] = [];
    const capturedKeys: string[] = [];
    let currentKeybind: TKeybind | null = null;

    // keyboard input events
    Storage.exposed.shortcutEditorKeyDown = function (e: KeyboardEvent) {
        e.stopPropagation();
        e.preventDefault();

        if (e.metaKey) {
            $("#shortcutEditorDisplay")!.textContent = "The Cmd key is not supported";
            currentKeybind = null;
            return;
        }
        if (e.repeat === true) return;

        if (!pressedKeys.includes(e.code)) pressedKeys.push(e.code);
        capturedKeys.length = 0;
        capturedKeys.push(...pressedKeys);

        // display sorted input shortcut on prompt
        currentKeybind = new Keybind(...capturedKeys);
        $("#shortcutEditorDisplay")!.textContent = Keybind.prototype.toString.call(currentKeybind);
    };
    Storage.exposed.shortcutEditorKeyUp = function (e: KeyboardEvent) {
        e.stopPropagation();
        e.preventDefault();

        // remove from pressed keys
        const index = pressedKeys.indexOf(e.code);
        if (index > -1) pressedKeys.splice(index, 1);
    };
    document.addEventListener("keydown", Storage.exposed.shortcutEditorKeyDown, true);
    document.addEventListener("keyup", Storage.exposed.shortcutEditorKeyUp, true);

    Storage.exposed.shortcutEditorSave = function () {
        shortcutPair[0] = currentKeybind;
    };
    Storage.exposed.shortcutEditorClear = function () {
        shortcutPair[0] = null;
    };

    currentKeybind = shortcutPair[0];
    const initialStr = shortcutPair[0] != null ? Keybind.prototype.toString.call(shortcutPair[0]) : "&nbsp;";
    const prompt = `
        <noClose>
        <h3>Edit Keyboard Shortcut</h3>
        <div class="block" style="padding-bottom:15px;">
            Press desired key combination<br><br>
            <span id="shortcutEditorDisplay">${initialStr}</span>
        </div>
    `;
    const resetAndClose = `
        document.removeEventListener('keydown', ${strPath}.shortcutEditorKeyDown, true);
        document.removeEventListener('keyup', ${strPath}.shortcutEditorKeyUp, true);
        Game.ClosePrompt();
    `;
    Game.Prompt(prompt, [
        ["Save", resetAndClose + `${strPath}.shortcutEditorSave(); Game.UpdateMenu();`, "float: right;"],
        ["Clear", resetAndClose + `${strPath}.shortcutEditorClear(); Game.UpdateMenu();`, "float: right;"],
        ["Cancel", resetAndClose, "float: right;"],
    ]);
}
