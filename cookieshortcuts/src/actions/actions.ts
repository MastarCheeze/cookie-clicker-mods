import general from "./general";
import upgrades from "./upgrades";
import buildings from "./buildings";
import krumblor from "./krumblor";
import santa from "./santa";
import garden from "./garden";
import market from "./market";
import pantheon from "./pantheon";
import grimoire from "./grimoire";
import cheats from "./cheats";
import others from "./others";

function addPrefix<TPrefix extends string, T>(
    prefix: TPrefix,
    object: T,
): { [Key in keyof T as `${TPrefix}${string & Key}`]: T[Key] } {
    const newObj: { [key: string]: any } = {};
    for (const key in object) {
        newObj[prefix + key] = object[key];
    }
    return newObj as ReturnType<typeof addPrefix<TPrefix, T>>;
}

export default {
    ...addPrefix("general.", general),
    ...addPrefix("upgrades.", upgrades),
    ...addPrefix("buildings.", buildings),
    ...addPrefix("krumblor.", krumblor),
    ...addPrefix("santa.", santa),
    ...addPrefix("garden.", garden),
    ...addPrefix("market.", market),
    ...addPrefix("pantheon.", pantheon),
    ...addPrefix("grimoire.", grimoire),
    ...addPrefix("cheats.", cheats),
    ...addPrefix("others.", others),
};
