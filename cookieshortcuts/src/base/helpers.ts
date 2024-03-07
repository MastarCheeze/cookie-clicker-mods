export const w = unsafeWindow as any;
export const $ = document.querySelector.bind(document);

export function fragmentFromString(str: string) {
    const template = document.createElement("template");
    template.innerHTML = str.trim();
    return template.content;
}

export function elementFromString(str: string) {
    const template = document.createElement("template");
    template.innerHTML = str.trim();
    const element = template.content.firstChild;
    if (!(element instanceof HTMLElement)) throw new Error(`Invalid html string '${str}'`);
    return element;
}

console.log(window, unsafeWindow);
