import { w, $ } from "../base/helpers";
import { Game, Garden, Market } from "../base/loader";
import { notify } from "../menu/ui";
import applyDecorator from "./applydecorator";

const plantIndexes = [
    "Baker's wheat",
    "Thumbcorn",
    "Cronerice",
    "Gildmillet",
    "Ordinary clover",
    "Golden clover",
    "Shimmerlily",
    "Elderwort",
    "Bakeberry",
    "Chocoroot",
    "White chocoroot",
    "White mildew",
    "Brown mold",
    "Meddleweed",
    "Whiskerbloom",
    "Chimerose",
    "Nursetulip",
    "Drowsyfern",
    "Wardlichen",
    "Keenmoss",
    "Queenbeet",
    "Juicy queenbeet",
    "Duketater",
    "Crumbspore",
    "Doughshroom",
    "Glovemorel",
    "Cheapcap",
    "Fool's bolete",
    "Wrinklegill",
    "Green rot",
    "Shriekbulb",
    "Tidygrass",
    "Everdaisy",
    "Ichorpuff",
    "Any plant",
] as const;

const soilRequiredFarmsMap = {
    "Dirt": 0,
    "Fertilizer": 50,
    "Clay": 100,
    "Pebbles": 200,
    "Wood chips": 300,
} as const;

function harvestOne(
    plant: (typeof plantIndexes)[number],
    tileRow: number,
    tileCol: number,
    mature: boolean,
    mortal: boolean,
) {
    const [minCol, minRow] = Garden.plotLimits[Math.min(Game.Objects["Farm"].level - 1, 8)];
    const x = minCol + tileCol - 1;
    const y = minRow + tileRow - 1;

    const tile = Garden.plot[y][x];
    if (tile[0] === 0) return;

    const plantObj = Garden.plantsById[tile[0] - 1];

    if (!(plant === "Any plant" || plant === plantObj.name)) return;
    if (mortal && plantObj.immortal) return;
    if (mature && tile[1] < plantObj.mature) return;

    Garden.harvest(x, y, true);
    setTimeout(function () {
        w.PlaySound("snd/harvest1.mp3", 1, 0.2);
    }, 50);
}

function harvestAll(plant: (typeof plantIndexes)[number], mature: boolean, mortal: boolean) {
    Garden.harvestAll(Garden.plantsById[plantIndexes.indexOf(plant)], mature, mortal);
}

function plantOne(plant: (typeof plantIndexes)[number], tileRow: number, tileCol: number, harvestExisting: boolean) {
    const [minCol, minRow] = Garden.plotLimits[Math.min(Game.Objects["Farm"].level - 1, 8)];
    const x = minCol + tileCol - 1;
    const y = minRow + tileRow - 1;
    const plantIndex = plantIndexes.indexOf(plant);

    if (!Garden.canPlant(Garden.plantsById[plantIndex])) {
        notify("Not enough cookies to plant seed");
        return;
    }

    const tile = Garden.plot[y][x];
    if (tile[0] !== 0) {
        if (harvestExisting) Garden.harvest(x, y, true);
        else return;
    }

    Garden.seedSelected = plantIndex;
    Garden.clickTile(x, y);
}

function plantAll(plant: (typeof plantIndexes)[number], harvestExisting: boolean) {
    const plantIndex = plantIndexes.indexOf(plant);
    // search phase
    let emptyTileCount = 0;
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            if (Garden.isTileUnlocked(x, y)) {
                const tile = Garden.plot[y][x];
                if (tile[0] === 0) {
                    emptyTileCount++;
                }
            }
        }
    }

    const price = Garden.getCost(Garden.plantsById[plantIndex]) * emptyTileCount;
    if (price > Game.cookies) {
        notify("Not enough cookies to plant seed");
        return;
    }

    // harvest/plant phase
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            if (Garden.isTileUnlocked(x, y)) {
                const tile = Garden.plot[y][x];
                if (tile[0] === 0 || harvestExisting) {
                    Garden.harvest(x, y, true);
                    Garden.seedSelected = plantIndex;
                    Garden.clickTile(x, y);
                }
            }
        }
    }
}

const garden = {
    seed: (
        harvest: boolean,
        one: boolean,
        plant: (typeof plantIndexes)[number],
        tileRow: number,
        tileCol: number,
        mature: boolean,
        mortal: boolean,
        harvestExisting: boolean,
    ) => {
        if (harvest) {
            if (one) harvestOne(plant, tileRow, tileCol, mature, mortal);
            else harvestAll(plant, mature, mortal);
        } else {
            if (one) plantOne(plant, tileRow, tileCol, harvestExisting);
            else plantAll(plant, harvestExisting);
        }
    },
    freeze: (action: "Toggle" | "Switch on" | "Switch off") => {
        if (
            action === "Toggle" ||
            (action === "Switch on" && !Garden.freeze) ||
            (action === "Switch off" && Garden.freeze)
        ) {
            Garden.tools.freeze.func.call($("#gardenTool-2"));
        }
    },
    changeSoil: (soil: keyof typeof soilRequiredFarmsMap) => {
        const requiredFarms = soilRequiredFarmsMap[soil];
        if (Game.Objects["Farm"].amount < requiredFarms) {
            notify("You don't have this soil unlocked");
            return;
        }

        const soilIndex = ["Dirt", "Fertilizer", "Clay", "Pebbles", "Wood chips"].indexOf(soil);
        if (new Date().getTime() < Garden.nextSoil) {
            notify("Soil changing is on cooldown");
            return;
        }

        ($(`#gardenSoil-${soilIndex}`) as HTMLElement).click();
    },
    convert: (force: boolean) => {
        if (Garden.plantsUnlockedN < Garden.plantsN) {
            notify("You don't have all seeds discovered");
            return;
        }

        if (!force) Garden.askConvert();
        else Garden.convert();
    },
};

applyDecorator(garden, (target) => (...args) => {
    if (Game.Objects["Farm"].level < 1) {
        notify("You don't have the Garden unlocked yet");
        return;
    }
    if (Game.Objects["Farm"].amount < 1) {
        notify("You don't have any Farms");
        return;
    }
    return target(...args);
});

export default garden;
