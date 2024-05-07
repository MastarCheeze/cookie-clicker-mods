// Creates a notification when stock market events occur

const MarketNotifications = {
    toBuy: true,
    toSell: true,
};

(() => {
    async function createNotification(title, body) {
        if (document.hasFocus()) return;

        let granted = false;
        if (Notification.permission === "granted") {
            granted = true;
        } else if (Notification.permission !== "denied") {
            let permission = await Notification.requestPermission();
            granted = permission === "granted" ? true : false;
        }

        if (!granted) return;

        const notification = new Notification(title, {
            body: body,
            icon: "https://orteil.dashnet.org/cookieclicker/img/icon.png",
        });

        notification.addEventListener("click", () => {
            window.focus();
            notification.close();
        });

        window.addEventListener(
            "focus",
            () => {
                notification.close();
            },
            { once: true },
        );
    }

    function main() {
        const Market = Game.Objects.Bank.minigame;
        const symbolToIcon = {
            CRL: [2, 33],
            CHC: [3, 33],
            BTR: [4, 33],
            SUG: [15, 33],
            NUT: [16, 33],
            SLT: [17, 33],
            VNL: [5, 33],
            EGG: [6, 33],
            CNM: [7, 33],
            CRM: [8, 33],
            JAM: [13, 33],
            WCH: [14, 33],
            HNY: [19, 33],
            CKI: [20, 33],
            RCP: [32, 33],
            SBD: [33, 33],
            PBL: [34, 33],
            YOU: [35, 33],
        };

        Market.tick = (function (old) {
            return (...params) => {
                let ret = old(...params);

                if (Game.Objects.Bank.amount === 0) {
                    return ret;
                }

                let notify = false;

                let toBuy = Object.values(Market.goods)
                    .filter((stock) => stock.val <= 3 && stock.stock < Market.getGoodMaxStock(stock))
                    .map((stock) => stock.symbol);
                if (MarketNotifications.toBuy && toBuy.length > 0) {
                    notify = true;

                    for (symbol of toBuy) {
                        Game.Notify("Prices are low!", `${symbol} is below $3`, symbolToIcon[symbol], 60);
                    }

                    let text = "";
                    if (toBuy.length > 1) {
                        text += `${toBuy.slice(0, -1).join(", ")} and `;
                    }
                    text += toBuy.slice(-1)[0];
                    text += toBuy.length === 1 ? " is below $3" : " are below $3";
                    createNotification("Prices are low!", text);
                }

                let toSell = Object.values(Market.goods)
                    .filter(
                        (stock) =>
                            stock.val >= (130 / 17) * Market.goodsById.indexOf(stock) + 49 + Game.Objects.Bank.level &&
                            stock.stock > 0,
                    )
                    .map((stock) => stock.symbol);
                if (MarketNotifications.toSell && toSell.length > 0) {
                    notify = true;

                    for (symbol of toSell) {
                        Game.Notify("Prices are high!", `${symbol} is ready to sell`, symbolToIcon[symbol], 60);
                    }

                    let text = "";
                    if (toSell.length > 1) {
                        text += `${toSell.slice(0, -1).join(", ")} and `;
                    }
                    text += toSell.slice(-1)[0];
                    text += toSell.length === 1 ? " is ready to sell" : " are ready to sell";
                    createNotification("Prices are high!", text);
                }

                if (notify) {
                    PlaySound("snd/cashIn.mp3", 0.5);
                }

                return ret;
            };
        })(Market.tick);
    }

    const marketInterval = setInterval(() => {
        if (Game.Objects["Bank"]["minigameLoaded"]) {
            main();
            clearInterval(marketInterval);
        }
    }, 1000);
})();
