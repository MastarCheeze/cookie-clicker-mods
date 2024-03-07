import { w, elementFromString, fragmentFromString } from "../helpers";
import { CallbackModule, Component, ValueModule } from "./componentbase";

export let css = "";
function tickSound() {
    w.PlaySound("snd/tick.mp3");
}
function updateMenu() {
    w.Game.UpdateMenu.call(w.Game);
}

export class WrapperComponent extends Component {
    frag: DocumentFragment;

    constructor(value: DocumentFragment | HTMLElement | string) {
        super();
        if (value instanceof DocumentFragment) {
            this.frag = value;
        } else if (value instanceof HTMLElement) {
            this.frag = new DocumentFragment();
            this.frag.appendChild(value);
        } else if (typeof value === "string") {
            this.frag = fragmentFromString(value);
        } else {
            throw new Error(`Invalid argument '${value}'`);
        }
    }

    write(): DocumentFragment {
        return this.frag;
    }
}

export class StaticHTMLComponent extends Component {
    constructor(public str: string) {
        super();
    }

    write(): DocumentFragment {
        return fragmentFromString(this.str);
    }
}

// grouping components
export class Listing extends StaticHTMLComponent {
    constructor() {
        super(`<div set-element set-container class="listing"></div>`);
    }
}

export class Collapsible extends Component {
    static {
        css += `
            .collapsibleButton {
                cursor: pointer;
                display: inline-block;
                height: 14px;
                width: 14px;
                border-radius: 7px;
                text-align: center;
                background-color: rgb(192, 192, 192);
                color: black;
                font-size: 13px;
                vertical-align: middle;
            }
        `;
    }

    value: ValueModule<boolean>;

    constructor(public text: string, public size = 16) {
        super();
        this.value = new ValueModule(true);
    }

    protected triggerCallbackFunc() {
        this.value._ = !this.value._;
        updateMenu();
        tickSound();
    }

    write(): DocumentFragment {
        const frag = new DocumentFragment();

        const header = elementFromString(`
            <div set-id class="title" style="font-size: ${this.size}px; margin-bottom: 0px;">
                ${this.text}
            </div>
        `);
        const button = elementFromString(`<span class="collapsibleButton">${this.value._ ? "-" : "+"}</span>`);
        button.addEventListener("click", this.triggerCallbackFunc.bind(this));
        header.appendChild(button);

        const collapsible = elementFromString("<div set-class set-style set-container></div>");
        if (!this.value._) collapsible.style.cssText += "display: none !important;";

        frag.appendChild(header);
        frag.appendChild(collapsible);

        return frag;
    }
}

// standalone components
export class Text extends Component {
    constructor(public text: string, public size: number = 14) {
        super();
    }

    write(): DocumentFragment {
        return fragmentFromString(`
            <div set-element style="display: inline-block; font-size: ${this.size}px; vertical-align: middle;">${this.text}</div>
        `);
    }
}

export class Label extends Component {
    constructor(public text: string) {
        super();
    }

    write(): DocumentFragment {
        return fragmentFromString(`<label set-element>${this.text}</label>`);
    }
}

export class Button extends Component {
    triggerCallback = new CallbackModule();

    constructor(public text: string, public active = true, public enabled = true) {
        super();
    }

    protected triggerCallbackFunc() {
        this.triggerCallback.call();
        updateMenu();
        tickSound();
    }

    write(): DocumentFragment {
        const button = elementFromString(
            `<a set-element class="smallFancyButton option">${this.text}</a>`,
        ) as HTMLLinkElement;
        if (!this.active) button.classList.add("off");

        if (this.enabled) {
            button.addEventListener("click", this.triggerCallbackFunc.bind(this));
        } else {
            button.disabled = true;
        }

        const frag = new DocumentFragment();
        frag.appendChild(button);
        return frag;
    }
}

export class ToggleButton extends Button {
    value: ValueModule<number>;

    protected triggerCallbackFunc(): void {
        this.value._ = (this.value._ + 1) % this.texts.length;
        this.triggerCallback.call();
        updateMenu();
        tickSound();
    }

    constructor(public texts: string[], public active = true, public enabled = true) {
        super(texts[0], active, enabled);
        this.value = new ValueModule(0);
    }

    write(): DocumentFragment {
        this.text = this.texts[this.value._];
        return super.write();
    }
}

export class OnOffButton extends Button {
    value: ValueModule<boolean>;

    protected triggerCallbackFunc(): void {
        this.value._ = !this.value._;
        this.triggerCallback.call();
        updateMenu();
        tickSound();
    }

    constructor(public labelText: string, public enabled = true) {
        super(labelText + (false ? w.ON : w.OFF), false, enabled);
        this.value = new ValueModule(false);
    }

    write(): DocumentFragment {
        this.text = this.labelText + (this.value._ ? w.ON : w.OFF);
        this.active = Boolean(this.value._);
        return super.write();
    }
}

export class Dropdown<T extends string[]> extends Component {
    triggerCallback = new CallbackModule();
    value: ValueModule<T[number]>;

    constructor(options: T, altValues?: undefined, enabled?: boolean);
    constructor(options: string[], altValues: T, enabled?: boolean);
    constructor(public options: T, public altValues?: T, public enabled = true) {
        super();
        this.value = new ValueModule(this.altValues?.[0] ?? this.options[0]);
    }

    protected triggerCallbackFunc(): void {
        this.triggerCallback.call();
        updateMenu();
        tickSound();
    }

    write(): DocumentFragment {
        const frag = new DocumentFragment();

        const dropdown = elementFromString(`<select set-element></select>`) as HTMLSelectElement;
        if (this.enabled) {
            dropdown.addEventListener("change", () => {
                this.value._ = dropdown.value;
                this.triggerCallbackFunc.call(this);
            });
        } else {
            dropdown.disabled = true;
        }

        if (!(this.altValues ?? this.options).includes(this.value._))
            this.value._ = this.altValues?.[0] ?? this.options[0];
        for (const [i, option] of this.options.entries()) {
            dropdown.appendChild(
                elementFromString(`
                    <option
                        value="${this.altValues?.[i] ?? option}"
                        ${this.value._ === (this.altValues?.[i] ?? option) ? "selected" : ""}>
                        ${option}
                    </option>
                `),
            );
        }

        frag.appendChild(dropdown);
        return frag;
    }
}

export class NumberInput extends Component {
    triggerCallback = new CallbackModule();
    value: ValueModule<number>;

    constructor(public min?: number, public max?: number, public wholeNumber = true, public enabled = true) {
        super();
        this.value = new ValueModule(0);
    }

    protected triggerCallbackFunc(): void {
        this.triggerCallback.call();
        updateMenu();
        tickSound();
    }

    write(): DocumentFragment {
        const frag = new DocumentFragment();
        const input = elementFromString(`
            <input set-element type="number">
        `) as HTMLInputElement;

        if (isNaN(this.value._) || !isFinite(this.value._)) this.value._ = this.min ?? 0; // reset if invalid
        if (this.min != null && this.value._ < this.min) this.value._ = this.min; // reset if out of range
        if (this.max != null && this.value._ > this.max) this.value._ = this.max; // reset if out of range
        if (!Number.isInteger(this.value._)) this.value._ = Math.floor(this.value._); // floor if float
        if (this.enabled) {
            if (this.min != null) input.min = this.min.toString();
            if (this.max != null) input.max = this.max.toString();
            input.addEventListener("change", () => {
                this.value._ = parseFloat(input.value);
                this.triggerCallbackFunc.call(this);
            });
        } else {
            input.disabled = true;
        }
        input.value = this.value._.toString();
        frag.appendChild(input);
        return frag;
    }
}

export class Slider extends Component {
    triggerCallback = new CallbackModule();
    value: ValueModule<number>;

    constructor(
        public title: string,
        public valueText: string,
        public min: number,
        public max: number,
        public step: number,
        public enabled = true,
    ) {
        super();
        this.value = new ValueModule(0);
    }

    protected triggerCallbackFunc() {
        this.triggerCallback.call();
        tickSound();
        updateMenu();
    }

    write(): DocumentFragment {
        const frag = new DocumentFragment();
        const container = elementFromString(
            `<div set-element class="sliderBox" style="margin: 2px 4px 2px 0px;"></div>`,
        );
        const title = elementFromString(`<div class="smallFancyButton" style="float: left;">${this.title}</div>`);
        const displayText = this.valueText.replace("[$]", this.value._.toString());
        const valueText = elementFromString(`<div class="smallFancyButton" style="float: right;">${displayText}</div>`);
        const slider = elementFromString(`
            <input
                class="slider"
                style="clear: both;"
                type="range"
                min="${this.min}"
                max="${this.max}"
                step="${this.step}"
                value="${this.value}"/>
        `) as HTMLInputElement;
        slider.value = this.value._.toString();

        if (this.enabled) {
            const updateValue = () => {
                this.value._ = parseFloat(slider.value);
                const displayText = this.valueText.replace("[$]", this.value._.toString());
                valueText.textContent = displayText;
            };
            slider.addEventListener("change", () => {
                updateValue();
                this.triggerCallbackFunc.call(this);
            });
            slider.addEventListener("input", updateValue);
        } else {
            slider.disabled = true;
        }

        container.appendChild(title);
        container.appendChild(valueText);
        container.appendChild(slider);

        frag.appendChild(container);
        return frag;
    }
}
