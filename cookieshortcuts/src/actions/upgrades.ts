import { Game } from "../base/loader";
import { notify } from "../menu/ui";

const seasonMap = {
    "Christmas": ["Festive biscuit", "christmas"],
    "Halloween": ["Ghostly biscuit", "halloween"],
    "Valentine's day": ["Lovesick biscuit", "valentines"],
    "Business day": ["Fool's biscuit", "fools"],
    "Easter": ["Bunny biscuit", "easter"],
    "Any season": [],
} as const; // season to biscuit name and season id

export default {
    buyAll: () => {
        if (Game.storeBuyAll() === false) {
            notify("You don't have Inspired checklist unlocked yet");
        }
    },
    switchSeason: (action: "Toggle" | "Switch on" | "Switch off", season: keyof typeof seasonMap) => {
        if (!Game.HasUnlocked("Season switcher")) {
            notify("You don't have Season switcher unlocked yet");
            return;
        }

        const [upgrade, seasonName] = seasonMap[season];

        if (upgrade !== undefined) {
            if (action === "Toggle") {
                Game.Upgrades[upgrade].buy();
            } else if (action === "Switch on") {
                if (Game.season !== seasonName) Game.Upgrades[upgrade].buy();
            } else if (action === "Switch off") {
                if (season !== "Any season") {
                    if (Game.season === seasonName) Game.Upgrades[upgrade].buy();
                }
            }
        } else if (action === "Switch off") {
            const upgrade = {
                "christmas": "Festive biscuit",
                "halloween": "Ghostly biscuit",
                "valentines": "Lovesick biscuit",
                "fools": "Fool's biscuit",
                "easter": "Bunny biscuit",
                "": null,
            }[Game.season as string]!;
            if (upgrade != null) Game.Upgrades[upgrade].buy();
        }
    },
    goldenSwitch: (action: "Toggle" | "Switch on" | "Switch off") => {
        if (!Game.Has("Golden switch")) {
            notify("You don't have Golden switch unlocked yet");
            return;
        }

        if (action === "Toggle") {
            Game.Upgrades["Golden switch [off]"].buy() || Game.Upgrades["Golden switch [on]"].buy();
        } else if (action === "Switch on") {
            Game.Upgrades["Golden switch [off]"].buy();
        } else if (action === "Switch off") {
            Game.Upgrades["Golden switch [on]"].buy();
        }
    },
    shimmeringVeil: (action: "Toggle" | "Switch on" | "Switch off") => {
        if (!Game.Has("Shimmering veil")) {
            notify("You don't have Shimmering veil unlocked yet");
            return;
        }

        if (action === "Toggle") {
            Game.Upgrades["Shimmering veil [off]"].buy() || Game.Upgrades["Shimmering veil [on]"].buy();
        } else if (action === "Switch on") {
            Game.Upgrades["Shimmering veil [off]"].buy();
        } else if (action === "Switch off") {
            Game.Upgrades["Shimmering veil [on]"].buy();
        }
    },
    sugarFrenzy: (force: boolean) => {
        if (!Game.Has("Sugar craving")) {
            notify("You don't have Sugar craving unlocked yet");
            return;
        }
        if (Game.Has("Sugar frenzy")) {
            notify("You already activated a Sugar frenzy this acension");
            return;
        }
        if (!Game.Upgrades["Sugar frenzy"].canBuy()) {
            notify("You can't afford Sugar frenzy");
            return;
        }

        Game.Upgrades["Sugar frenzy"].buy();
        if (force) Game.ConfirmPrompt();
    },
};
