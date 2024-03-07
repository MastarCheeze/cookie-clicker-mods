type Callback = () => void;

export abstract class Component {
    id: string = "";
    class: string[] = [];
    style: string = "";
    visible = true;
    writeCallback = new CallbackModule();
    private _parent: Component | null = null;
    private _children: Component[] = [];

    constructor() {
        this.write = ((target) => {
            return function (this: Component) {
                this.writeCallback.call();
                if (this.visible) {
                    const html = target.call(this);

                    const element = html.querySelector("[set-element]");
                    if (element) element.removeAttribute("set-element");

                    // set id
                    const idElement = element || html.querySelector("[set-id]");
                    if (idElement) {
                        if (this.id) {
                            idElement.setAttribute("id", this.id);
                        }
                        idElement.removeAttribute("set-id");
                    }

                    // set class
                    const classesElement = element || html.querySelector("[set-class]");
                    if (classesElement) {
                        if (this.class.length > 0) {
                            classesElement.classList.add(...this.class);
                        }
                        classesElement.removeAttribute("set-class");
                    }

                    // set style
                    const styleElement = element || html.querySelector("[set-style]");
                    if (styleElement) {
                        if (this.style && styleElement instanceof HTMLElement) {
                            styleElement.style.cssText += this.style;
                        }
                        styleElement.removeAttribute("set-style");
                    }

                    // add children
                    const containerElement = html.querySelector("[set-container]");
                    if (containerElement) {
                        for (const child of this.children) {
                            containerElement.appendChild(child.write.call(child));
                        }
                        containerElement.removeAttribute("set-container");
                    }

                    return html;
                } else {
                    return new DocumentFragment(); // return nothing
                }
            };
        })(this.write);
    }

    setId(value: string) {
        this.id = value;
        return this;
    }

    addClass(...classes: string[]) {
        this.class.push(...classes);
        return this;
    }

    addStyle(value: string) {
        this.style += value;
        return this;
    }

    abstract write(): DocumentFragment;

    get parent() {
        return this._parent;
    }

    get children() {
        return this._children;
    }
    add(...children: Component[]) {
        for (const child of children) {
            this._children.push(child);
            child._parent = this;
        }
        return this;
    }
    remove(...children: Component[]) {
        for (const child of children) {
            const i = this._children.indexOf(child);
            if (i > -1) {
                this._children.splice(i, 1);
            }
        }
        return this;
    }
}

export class CallbackModule {
    private _callbacks: Callback[] = [];

    attach(...callbacks: Callback[]) {
        this._callbacks.push(...callbacks);
        return this;
    }

    remove(...children: Callback[]) {
        for (const child of children) {
            let i = 0;
            while (i !== -1) {
                i = this._callbacks.indexOf(child);
                if (i !== -1) {
                    this._callbacks.splice(i, 1);
                }
            }
        }
        return this;
    }
    get callbacks() {
        return [...this._callbacks];
    }

    call() {
        for (const callback of this.callbacks) {
            callback();
        }
    }
}

export class ValueModule<T> {
    private _value: T;

    constructor(initialValue: T) {
        this._value = initialValue;
    }

    private getter() {
        return this._value;
    }
    private setter(value: T) {
        this._value = value;
    }
    attachGetterSetter(getter: (this: this) => T, setter: (this: this, value: T) => void) {
        this.getter = getter.bind(this);
        this.setter = setter.bind(this);
        return this;
    }

    get _(): T {
        return this.getter();
    }
    set _(value: T) {
        this.setter(value);
    }
}
