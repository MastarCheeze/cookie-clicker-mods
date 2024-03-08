import { Collapsible, css } from "./component";
import Storage from "../storage";
import general from "./general";
import upgrades from "./upgrades";
import buildings from "./buildings";
import krumblor from "./krumblor-and-santa";
import market from "./market";
import garden from "./garden";
import pantheon from "./pantheon";
import grimoire from "./grimoire";
import cheats from "./cheats";
import others from "./others";
import { injectCss, injectMenu } from "../base/menu/injector";
import { elementFromString } from "../base/menu/stringtohtml";

export default function build() {
    const menu = new Collapsible(Storage.name, 22, undefined);
    menu.add(general, upgrades, buildings, krumblor, garden, market, pantheon, grimoire, cheats, others);
    injectMenu(menu);
    injectCss(css);
}
