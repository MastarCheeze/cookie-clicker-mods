type TAction = (...args: any[]) => void;

// apply decorator to all methods in object
export default function applyDecorator(object: { [key: string]: TAction }, decorator: (target: TAction) => TAction) {
    let shortcutName: keyof typeof object;
    for (shortcutName in object) {
        if (!(object[shortcutName] instanceof Function)) continue;

        const oldFunc = object[shortcutName];
        object[shortcutName] = decorator(oldFunc).bind(object);
    }
    return object;
}
