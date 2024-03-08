import actions from "../actions/actions";
import { elementFromString } from "../base/menu/stringtohtml";
import * as Base from "../base/menu/component";
import Keybind from "../keybind";
import Storage from "../storage";
import { ExtractKeysByValue } from "../types";
import { showShortcutEditor } from "./ui";

type TPrefs = typeof Storage.defaultPrefs;
type TKeybinds = typeof Storage.defaultKeybinds;

export let css = "";

export class Collapsible extends Base.Collapsible {
    static count = 0;
    count: number;

    constructor(public text: string, public size = 16, header = false) {
        super(text, size);
        this.count = Collapsible.count++;
        this.value.attachGetterSetter(
            () => Storage.collapsibles[this.count],
            (value) => (Storage.collapsibles[this.count] = value),
        );
        if (this.value._ === undefined) {
            this.value._ = false;
        }
        this.addStyle("margin-bottom: 12px;");
        if (!header) this.addStyle("display: flex; flex-direction: column; gap: 8px;");
    }
}

type BooleanPrefs = ExtractKeysByValue<TPrefs, boolean>;
type NumberPrefs = ExtractKeysByValue<TPrefs, number>;
export class PrefButton extends Base.Listing {
    button: Base.ToggleButton | Base.OnOffButton;

    constructor(prefName: BooleanPrefs, text: string, label?: string);
    constructor(prefName: NumberPrefs, text: string[], label?: string);
    constructor(
        public readonly prefName: BooleanPrefs | NumberPrefs,
        text: string | string[],
        public label?: string,
        defaultValue = 0,
    ) {
        if (!(prefName in Storage.defaultPrefs)) throw new Error(`Preference '${prefName}' does not exist`);
        super();

        if (typeof text === "string") {
            this.button = new Base.OnOffButton(text);
            this.button.value.attachGetterSetter(
                () => Storage.prefs[this.prefName as BooleanPrefs],
                (value) => (Storage.prefs[this.prefName as BooleanPrefs] = value),
            );
        } else {
            this.button = new Base.ToggleButton(text);
            this.button.value.attachGetterSetter(
                () => Storage.prefs[this.prefName as NumberPrefs],
                // @ts-expect-error this is here because there is currently no number prefs
                (value) => (Storage.prefs[this.prefName as NumberPrefs] = value),
            );
        }
        this.add(this.button);

        if (label) this.add(new Base.Label(label));
    }
}

// trim all undefineds from the end of an array
function arrayTrimEnd(array: any[]) {
    let i;
    for (i = array.length; i >= 0; i--) {
        if (array[i] != null) break;
    }
    array.splice(i + 1);
}

css += `
    p * {
        margin-right: 5px;
    }
`;

export class Shortcut<T extends keyof TKeybinds> extends Base.Listing {
    constructor(
        public readonly shortcutName: T,
        public readonly writeContent: (params: NonNullable<TKeybinds[T][number]>[2]) => DocumentFragment[],
    ) {
        if (!(shortcutName in Storage.defaultKeybinds)) throw new Error(`Shortcut '${shortcutName}' does not exist`);
        super();
    }

    private writeRow(i: number): DocumentFragment {
        const shortcutPair = Storage.keybinds[this.shortcutName][i];

        if (!shortcutPair) return new DocumentFragment();
        const [keybind, args] = shortcutPair;

        const container = new Base.Listing();
        container.addStyle("display: flex;");

        // left div
        const leftDiv = elementFromString(`<div></div>`);
        const p = elementFromString(`<p style="text-indent: 0px;"></p>`);
        leftDiv.appendChild(p);

        // if (i !== 0) leftDiv.appendChild(new Base.Text("📋&nbsp;").write());
        for (const frag of this.writeContent(shortcutPair[2])) {
            p.appendChild(frag);
        }

        // right div
        const rightDiv = elementFromString(
            `<div style="text-align: right; padding-left: 16px; margin-left: auto; flex: 1 0 auto;"></div>`,
        );
        const keybindDisplay = elementFromString(`
                <div
                    class="smallFancyButton"
                    style="display: inline; padding-right: 8px; font-size: 12px; vertical-align: middle; pointer-events: none;">
                    ${keybind != null ? Keybind.prototype.toString.call(keybind) : "Not set"}
                </div>
            `);
        rightDiv.appendChild(keybindDisplay);

        const editButton = new Base.Button("✎");
        editButton.addStyle("width: 10px; padding: 4px 5px; text-align: center;");
        editButton.triggerCallback.attach(() => showShortcutEditor(shortcutPair));
        rightDiv.appendChild(editButton.write());

        if (Storage.prefs.runButtons) {
            const run = new Base.Button("▶");
            run.addStyle("width: 10px; padding: 4px 5px; text-align: center;");
            run.triggerCallback.attach(() => (actions[this.shortcutName] as any).apply(undefined, shortcutPair[2]));
            rightDiv.appendChild(run.write());
        }

        if (Storage.prefs.advanced) {
            const order = new Base.NumberInput(-99, 99);
            order.value._ = shortcutPair[1];
            order.triggerCallback.attach(() => (shortcutPair[1] = order.value._));
            order.addStyle("margin-right: 4px;");
            rightDiv.appendChild(order.write());

            if (i === 0) {
                // original shortcut, duplicate button
                const duplicateButton = new Base.Button("＋");
                duplicateButton.addStyle("width: 12px; padding: 4px 5px; text-align: center;");
                duplicateButton.triggerCallback.attach(() =>
                    Storage.keybinds[this.shortcutName].splice(1, 0, [
                        null,
                        Storage.defaultKeybinds[this.shortcutName][0]![1],
                        [...Storage.defaultKeybinds[this.shortcutName][0]![2]],
                    ]),
                );
                rightDiv.appendChild(duplicateButton.write());
            } else {
                // duplicated shortcut, remove button
                const removeButton = new Base.Button("－");
                removeButton.addStyle("width: 12px; padding: 4px 5px; text-align: center;");
                removeButton.triggerCallback.attach(() => {
                    Storage.keybinds[this.shortcutName][i] = null;
                    if (i === Storage.keybinds[this.shortcutName].length - 1)
                        arrayTrimEnd(Storage.keybinds[this.shortcutName]);
                });
                rightDiv.appendChild(removeButton.write());
            }
        }

        container.add(new Base.WrapperComponent(leftDiv), new Base.WrapperComponent(rightDiv));
        return container.write();
    }

    write(): DocumentFragment {
        const frag = new DocumentFragment();
        for (let i = 0; i < Storage.keybinds[this.shortcutName].length; i++) {
            frag.appendChild(this.writeRow(i));
        }
        return frag;
    }
}

export class TitleShortcut<T extends keyof TKeybinds> extends Shortcut<T> {
    constructor(
        public readonly shortcutName: T,
        public readonly text: string,
        public readonly label?: string,
        writeContent: (params: NonNullable<TKeybinds[T][number]>[2]) => DocumentFragment[] = () => [],
    ) {
        super(shortcutName, (params) => {
            const frag = new DocumentFragment();
            const div = elementFromString("<div></div>");
            div.appendChild(new Base.Text(this.text).write());
            if (this.label) div.appendChild(new Base.Label(this.label).write());
            frag.appendChild(div);
            return [frag, ...writeContent(params)];
        });
    }
}
