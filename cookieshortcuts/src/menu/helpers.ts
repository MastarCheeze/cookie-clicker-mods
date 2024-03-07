import type { ValueModule } from "../base/menu/componentbase";

export const warning = "<span title='This setting makes drastic changes. Use at your own risk.'>⚠️</dfn>";
export const notRecommended =
    "<span title='This setting is not recommended as it alters the gameplay and makes the game less enjoyable.'>👎🏻</dfn>";
export const cheat = "<span title='This setting is a cheat.'>🛠️</dfn>";

export function assignParam<TParams extends any[], TIdx extends number>(
    object: { value: ValueModule<TParams[TIdx]> },
    params: TParams,
    i: TIdx,
) {
    object.value.attachGetterSetter(
        () => params[i],
        (value) => (params[i] = value),
    );
}

export function assignParamIntToBool<TParams extends any[], TIdx extends number>(
    object: { value: ValueModule<number> },
    params: TParams,
    i: TIdx,
) {
    object.value.attachGetterSetter(
        () => Number(params[i]),
        (value) => (params[i] = Boolean(value)),
    );
}
