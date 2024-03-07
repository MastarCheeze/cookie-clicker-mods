export default class Keybind {
    ctrl: boolean = false;
    shift: boolean = false;
    alt: boolean = false;
    code?: string;

    constructor(...keys: string[]) {
        if (
            keys.includes("Ctrl") ||
            keys.includes("Control") ||
            keys.includes("ControlLeft") ||
            keys.includes("ControlRight")
        ) {
            this.ctrl = true;
        }
        if (keys.includes("Shift") || keys.includes("ShiftLeft") || keys.includes("ShiftRight")) {
            this.shift = true;
        }
        if (keys.includes("Alt") || keys.includes("AltLeft") || keys.includes("AltRight")) {
            this.alt = true;
        }
        const firstNotModifierKey = keys.filter(
            (key) =>
                ![
                    "Ctrl",
                    "Control",
                    "ControlLeft",
                    "ControlRight",
                    "Shift",
                    "ShiftLeft",
                    "ShiftRight",
                    "Alt",
                    "AltLeft",
                    "AltRight",
                ].includes(key),
        )[0];
        if (firstNotModifierKey) this.code = firstNotModifierKey;
    }

    match(obj: any) {
        return (
            this.ctrl === obj.ctrlKey &&
            this.shift === obj.shiftKey &&
            this.alt === obj.altKey &&
            (this.code == null || this.code === obj.code)
        );
    }

    toString() {
        const displayKeys = [];

        if (this.ctrl) displayKeys.push("Ctrl");
        if (this.shift) displayKeys.push("Shift");
        if (this.alt) displayKeys.push("Alt");
        if (this.code) {
            displayKeys.push(Keybind.codeMap[this.code] ?? this.code);
        }
        return displayKeys.join(" + ");
    }

    static codeMap: { [key: string]: string } = Object.freeze({
        Backquote: "`",
        Digit1: "1",
        Digit2: "2",
        Digit3: "3",
        Digit4: "4",
        Digit5: "5",
        Digit6: "6",
        Digit7: "7",
        Digit8: "8",
        Digit9: "9",
        Digit0: "0",
        Minus: "-",
        Equal: "=",
        KeyA: "A",
        KeyB: "B",
        KeyC: "C",
        KeyD: "D",
        KeyE: "E",
        KeyF: "F",
        KeyG: "G",
        KeyH: "H",
        KeyI: "I",
        KeyJ: "J",
        KeyK: "K",
        KeyL: "L",
        KeyM: "M",
        KeyN: "N",
        KeyO: "O",
        KeyP: "P",
        KeyQ: "Q",
        KeyR: "R",
        KeyS: "S",
        KeyT: "T",
        KeyU: "U",
        KeyV: "V",
        KeyW: "W",
        KeyX: "X",
        KeyY: "Y",
        KeyZ: "Z",
        BracketLeft: "[",
        BracketRight: "]",
        Backslash: "\\",
        Semicolon: ";",
        Quote: "'",
        Comma: ",",
        Period: ".",
        Slash: "/",
        ArrowUp: "↑",
        ArrowDown: "↓",
        ArrowLeft: "←",
        ArrowRight: "→",
    });
}
