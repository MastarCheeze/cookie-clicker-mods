import { $ } from "../base/helpers";
import { Game } from "../base/loader";
import { notify } from "../menu/ui";
import applyDecorator from "./applydecorator";

const santa = {
    upgrade: () => {
        if (Game.santaLevel >= 14) {
            notify("Santa is fully upgraded");
            return;
        }
        if (Game.cookies < Math.pow(Game.santaLevel + 1, Game.santaLevel + 1)) {
            notify("Not enough resources to upgrade Santa");
            return;
        }

        let oldTab = Game.specialTab;
        if (oldTab !== "santa") {
            Game.specialTab = "santa";
            Game.ToggleSpecialMenu(1);
        }
        Game.UpgradeSanta();
        if (oldTab !== "santa") Game.ToggleSpecialMenu(0);
        if (oldTab !== "") {
            Game.specialTab = oldTab;
            Game.ToggleSpecialMenu(1);
        }
    },
};

applyDecorator(santa, (target) => (...args) => {
    if (!Game.Has("A festive hat")) {
        notify("You don't have A festive hat unlocked yet");
        return;
    }
    return target(...args);
});

export default santa;
