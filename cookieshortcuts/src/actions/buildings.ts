import { Game } from "../aliases";
import { notify } from "../menu/ui";

const buildingIndexMap = [
    "Cursor",
    "Grandma",
    "Farm",
    "Mine",
    "Factory",
    "Bank",
    "Temple",
    "Wizard tower",
    "Shipment",
    "Alchemy lab",
    "Portal",
    "Time machine",
    "Antimatter condenser",
    "Prism",
    "Chancemaker",
    "Fractal engine",
    "Javascript console",
    "Idleverse",
    "Cortex baker",
    "You",
    "All buildings",
] as const;

export default {
    building: (
        actionStr: "Buy" | "Buy until have" | "Sell" | "Sell until have",
        amountStr: "1" | "10" | "100" | "Max" | "All" | "Custom",
        amountCustom: number,
        building: (typeof buildingIndexMap)[number],
        over: boolean,
    ) => {
        const buy = actionStr.startsWith("Buy");
        const untilHave = actionStr.endsWith("until have");
        let buildingObj: any;
        let amount: number;

        const oldBuyMode = Game.buyMode;
        const oldBulk = Game.buyBulk;

        if (amountStr === "Max" || amountStr === "All") {
            amount = 9999;
            over = true;
        } else {
            // concrete number
            if (amountStr === "Custom") amount = amountCustom;
            else amount = parseInt(amountStr);
        }

        if (building !== "All buildings") {
            buildingObj = Game.Objects[building];
            if (untilHave) {
                if (amount === buildingObj.amount) {
                    notify("You have enough buildings");
                    return;
                }
                if (buy) {
                    amount = amount - buildingObj.amount;
                    if (amount <= 0) {
                        notify("You have more than enough buildings");
                        return;
                    }
                } else if (!buy) {
                    amount = buildingObj.amount - amount;
                    if (amount <= 0) {
                        notify("You have less than enough buildings");
                        return;
                    }
                }
            }

            if (buy) {
                if (!over && Game.cookies < buildingObj.getSumPrice(amount)) {
                    notify("Not enough cookies to buy buildings");
                    return;
                }
                Game.buyMode = 1;
                Game.buyBulk = amount;
                buildingObj.buy();
            } else {
                if (!over && buildingObj.amount < amount) {
                    notify("Not enough buildings to sell");
                    return;
                }
                Game.buyMode = -1;
                Game.buyBulk = amount;
                buildingObj.sell();
            }
        } else {
            const amountMap: { [Key in (typeof buildingIndexMap)[number]]?: number } = {};
            for (const buildingName_ in Game.Objects as any) {
                const buildingName = buildingName_ as (typeof buildingIndexMap)[number];
                if (!untilHave) amountMap[buildingName] = amount;
                else if (buy) amountMap[buildingName] = amount - Game.Objects[buildingName].amount;
                else amountMap[buildingName] = Game.Objects[buildingName].amount - amount;
            }

            if (buy) {
                if (!over) {
                    let totalPrice = 0;
                    for (const [buildingName, amount] of Object.entries(amountMap)) {
                        totalPrice += (Game.Objects[buildingName] as any).getSumPrice(amount);
                    }
                    if (Game.cookies < totalPrice) {
                        notify("Not enough cookies to buy buildings");
                        return;
                    }
                }

                // distribute cookies among buildings evenly by looping through and buying 1 of each building repeatedly
                while (true) {
                    let bought = false;
                    for (const [buildingName, amount] of Object.entries(amountMap)) {
                        if (amount <= 0) continue;

                        Game.buyMode = 1;
                        Game.buyBulk = 1;
                        buildingObj = Game.Objects[buildingName] as any;
                        if (Game.cookies >= buildingObj.price) {
                            buildingObj.buy();
                            bought = true;
                            amountMap[buildingName as keyof typeof amountMap]!--;
                        }
                    }
                    if (!bought) break; // break when cannot buy any building at all
                }
            } else {
                if (!over) {
                    for (const [buildingName, amount] of Object.entries(amountMap)) {
                        if (Game.Objects[buildingName].amount < amount) {
                            notify("Not enough buildings to sell");
                            return;
                        }
                    }
                }

                Game.buyMode = -1;
                for (const [buildingName, amount] of Object.entries(amountMap)) {
                    Game.buyBulk = amount;
                    (Game.Objects[buildingName] as any).sell();
                }
            }
        }

        Game.buyMode = oldBuyMode;
        Game.buyBulk = oldBulk;
        Game.storeToRefresh = 1;
    },
};
