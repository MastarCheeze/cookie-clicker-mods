import { $ } from "../aliases";
import { Game, Market } from "../aliases";
import { notify } from "../menu/ui";
import applyDecorator from "./applydecorator";

function buyGood(goodObj: any, amount: number) {
    const success = Market.buyGood(goodObj.id, amount);
    if (success) {
        Market.hoverOnGood = goodObj.id;
        Market.toRedraw = 2;
    }
    return success;
}

function sellGood(goodObj: any, amount: number) {
    const success = Market.sellGood(goodObj.id, amount);
    if (success) {
        Market.hoverOnGood = goodObj.id;
        Market.toRedraw = 2;
    }
    return success;
}

function calcGoodPrice(goodObj: any) {
    const costIn$ = Market.getGoodPrice(goodObj);
    const cost = Game.cookiesPsRawHighest * costIn$;
    const overhead = 1 + 0.01 * (20 * Math.pow(0.95, Market.brokers));
    return cost * overhead;
}

const goodIndexMap = [
    "CRL",
    "CHC",
    "BTR",
    "SUG",
    "NUT",
    "SLT",
    "VNL",
    "EGG",
    "CNM",
    "CRM",
    "JAM",
    "WCH",
    "HNY",
    "CKI",
    "RCP",
    "SBD",
    "PBL",
    "YOU",
] as const;

const loanMap = {
    "1st loan": "bankLoan1",
    "2nd loan": "bankLoan2",
    "3rd loan": "bankLoan3",
} as const;

const loanBuffMap = {
    "1st loan": "Loan 1",
    "2nd loan": "Loan 2",
    "3rd loan": "Loan 3",
} as const;

const loanOfficeLevelRequired = {
    "1st loan": 2,
    "2nd loan": 4,
    "3rd loan": 5,
};

const market = {
    good: (
        actionStr: "Buy" | "Buy until have" | "Sell" | "Sell until have",
        amountStr: "1" | "10" | "100" | "Max" | "All" | "Custom",
        amountCustom: number,
        good: (typeof goodIndexMap)[number] | "All stocks",
        overbuy: boolean,
    ) => {
        const buy = actionStr.startsWith("Buy");
        const untilHave = actionStr.endsWith("until have");
        let goodObj: { [key: string]: any };
        let amount: number;

        if (amountStr === "Max" || amountStr === "All") {
            amount = 9999;
            overbuy = true;
        } else {
            // concrete number
            if (amountStr === "Custom") amount = amountCustom;
            else amount = parseInt(amountStr);
        }

        if (good !== "All stocks") {
            goodObj = Market.goodsById[goodIndexMap.indexOf(good)];
            if (goodObj.building.amount <= 0) {
                notify("You don't have the building for this stock");
                return;
            }

            if (untilHave) {
                if (amount === goodObj.stock) {
                    notify("You have enough stocks");
                    return;
                }
                if (buy) {
                    amount = amount - goodObj.stock;
                    if (amount <= 0) {
                        notify("You have more than enough stocks");
                        return;
                    }
                } else if (!buy) {
                    amount = goodObj.stock - amount;
                    if (amount <= 0) {
                        notify("You have less than enough stocks");
                        return;
                    }
                }
            }

            const maxStock = Market.getGoodMaxStock(goodObj);
            if (amount + goodObj.stock > maxStock) amount = maxStock - goodObj.stock; // cap amount at max goods you can buy

            if (buy) {
                if (goodObj.last === 2) {
                    notify("You cannot buy and sell the same stock in the same tick");
                    return;
                }

                // buy n amount of one good
                if (!buyGood(goodObj, amount)) {
                    // buy as many as possible if unable to buy desired amount
                    if (overbuy || amountStr === "Max") {
                        buyGood(goodObj, Math.floor(Game.cookies / calcGoodPrice(goodObj)));
                    } else {
                        notify("Not enough cookies to buy stock");
                    }
                }
            } else {
                if (goodObj.last === 1) {
                    notify("You cannot buy and sell the same stock in the same tick");
                    return;
                }

                // sell n amount of one good
                sellGood(goodObj, amount);
            }
        } else {
            const amountMap: { [Key in (typeof goodIndexMap)[number]]?: number } = {};
            for (const goodSymbol of goodIndexMap) {
                goodObj = Market.goodsById[goodIndexMap.indexOf(goodSymbol)];
                if ((goodObj as any).building.amount <= 0) continue;
                if (!untilHave) amountMap[goodSymbol] = amount;
                else if (buy) amountMap[goodSymbol] = amount - goodObj.stock;
                else amountMap[goodSymbol] = goodObj.stock - amount;
            }

            if (buy) {
                for (const goodObj of Object.values(Market.goods)) {
                    if ((goodObj as any).last === 2) {
                        notify("You cannot buy and sell the same stock in the same tick");
                        return;
                    }
                }

                // buy n amount of all goods
                if (!overbuy) {
                    let totalPrice = 0;
                    for (const [goodName, amount] of Object.entries(amountMap)) {
                        totalPrice +=
                            calcGoodPrice(
                                Market.goodsById[goodIndexMap.indexOf(goodName as (typeof goodIndexMap)[number])],
                            ) * amount;
                    }
                    if (Game.cookies < totalPrice) {
                        notify("Not enough cookies to buy stock");
                        return;
                    }
                }

                // distribute cookies among stocks evenly by looping through and buying 1 of each stock repeatedly
                while (true) {
                    let bought = false;
                    for (const [goodName, amount] of Object.entries(amountMap)) {
                        if (amount <= 0) continue;

                        goodObj = Market.goodsById[goodIndexMap.indexOf(goodName as (typeof goodIndexMap)[number])];
                        if (Game.cookies >= calcGoodPrice(goodObj)) {
                            buyGood(goodObj, 1);
                            bought = true;
                            amountMap[goodName as keyof typeof amountMap]!--;
                        }
                    }
                    if (!bought) return; // return when cannot buy any building at all
                }
            } else {
                for (const goodObjLoop of Object.values(Market.goods)) {
                    if ((goodObjLoop as any).last === 1) {
                        notify("You cannot buy and sell the same stock in the same tick");
                        return;
                    }
                }

                // sell n amount of all goods
                for (const [goodName, amount] of Object.entries(amountMap)) {
                    goodObj = Market.goodsById[goodIndexMap.indexOf(goodName as (typeof goodIndexMap)[number])];
                    sellGood(goodObj, amount);
                }
            }
        }
    },
    loan: (loan: "1st loan" | "2nd loan" | "3rd loan") => {
        if (Market.officeLevel < loanOfficeLevelRequired[loan]) {
            notify("You don't have this loan unlocked yet");
            return;
        }
        const loanBuff = loanBuffMap[loan];
        if (Game.hasBuff(loanBuff) || Game.hasBuff(loanBuff + " (interest)")) {
            notify("You're already taking this loan");
            return;
        }
        ($(`#${loanMap[loan]}`) as HTMLElement).click();
    },
    hireBroker: () => {
        if (Market.brokers >= Market.getMaxBrokers()) {
            notify("You already have the maximum amount of brokers");
            return;
        }
        if (Game.cookies < Market.getBrokerPrice()) {
            notify("Not enough cookies to buy a broker");
            return;
        }
        ($("#bankBrokersBuy") as HTMLElement).click();
    },
    upgradeOffice: () => {
        if (Market.officeLevel >= 5) {
            notify("Your offices are at max level");
            return;
        }
        const office = Market.offices[Market.officeLevel];
        if (Game.Objects["Cursor"].level < office.cost[1]) {
            notify("You don't have the required Cursor level");
            return;
        }
        if (Game.Objects["Cursor"].amount < office.cost[0]) {
            notify("You don't have enough Cursors");
            return;
        }
        ($("#bankOfficeUpgrade") as HTMLElement).click();
    },
};

applyDecorator(market, (target) => (...args) => {
    if (Game.Objects["Bank"].level < 1) {
        notify("You don't have the Stock Market unlocked yet");
        return;
    }
    if (Game.Objects["Bank"].amount < 1) {
        notify("You don't have any Banks");
        return;
    }
    return target(...args);
});

export default market;
