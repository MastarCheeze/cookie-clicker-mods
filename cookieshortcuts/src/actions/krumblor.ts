import { $ } from "../aliases";
import { Game } from "../aliases";
import { notify } from "../menu/ui";
import applyDecorator from "./applydecorator";

const auraLevelRequiredMap = {
    "No aura": 0,
    "Breath of Milk": 5,
    "Dragon Cursor": 6,
    "Elder Battalion": 7,
    "Reaper of Fields": 8,
    "Earth Shatterer": 9,
    "Master of the Armory": 10,
    "Fierce Hoarder": 11,
    "Dragon God": 12,
    "Arcane Aura": 13,
    "Dragonflight": 14,
    "Ancestral Metamorphosis": 15,
    "Unholy Dominion": 16,
    "Epoch Manipulator": 17,
    "Mind Over Matter": 18,
    "Radiant Appetite": 19,
    "Dragon's Fortune": 20,
    "Dragon's Curve": 21,
    "Reality Bending": 22,
    "Dragon Orbs": 23,
    "Supreme Intellect": 24,
    "Dragon Guts": 25,
} as const;

const krumblor = {
    setAura: (aura: keyof typeof auraLevelRequiredMap, slot: boolean) => {
        if (Game.hasAura(aura) && aura !== "No aura") return;

        const levelRequired = auraLevelRequiredMap[aura];
        if (Game.dragonLevel < levelRequired) {
            notify(`You don't have the aura ${aura} unlocked yet`);
            return;
        }
        if (slot == true && Game.dragonLevel < 27) {
            notify("You don't have secondary auras unlocked yet");
            return;
        }

        const auraIndex = Object.keys(auraLevelRequiredMap).indexOf(aura);

        let oldTab = Game.specialTab;
        if (oldTab !== "dragon") {
            Game.specialTab = "dragon";
            Game.ToggleSpecialMenu(1);
        }
        Game.SetDragonAura(auraIndex, slot);
        Game.ConfirmPrompt();
        if (oldTab !== "dragon") Game.ToggleSpecialMenu(0);
        if (oldTab !== "") {
            Game.specialTab = oldTab;
            Game.ToggleSpecialMenu(1);
        }
    },
    upgrade: () => {
        if (Game.dragonLevels[Game.dragonLevel].cost === undefined) {
            notify("Krumblor is fully upgraded");
            return;
        }
        if (!Game.dragonLevels[Game.dragonLevel].cost()) {
            notify("Not enough resources to upgrade Krumblor");
            return;
        }

        let oldTab = Game.specialTab;
        if (oldTab !== "dragon") {
            Game.specialTab = "dragon";
            Game.ToggleSpecialMenu(1);
        }
        Game.UpgradeDragon();
        if (oldTab !== "dragon") Game.ToggleSpecialMenu(0);
        if (oldTab !== "") {
            Game.specialTab = oldTab;
            Game.ToggleSpecialMenu(1);
        }
    },
    pet: () => {
        if (!Game.Has("Pet the dragon")) {
            notify("You don't have Pet the dragon unlocked yet");
            return;
        }
        Game.specialTab = "dragon";
        Game.ToggleSpecialMenu(1);
        ($("#specialPic") as HTMLElement)!.click();
    },
};

applyDecorator(krumblor, (target) => (...args) => {
    if (!Game.Has("How to bake your dragon")) {
        notify("You don't have How to bake your dragon unlocked yet");
        return;
    }
    if (!Game.Has("A crumbly egg")) {
        notify("You don't have A crumbly egg unlocked yet");
        return;
    }
    return target(...args);
});

export default krumblor;
