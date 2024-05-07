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
        let Market = Game.Objects.Bank.minigame;

        Market.tick = (function (old) {
            return (...params) => {
                let ret = old(...params);

                if (Game.Objects.Bank.amount === 0) {
                    return ret;
                }

                let notify = false;

                let toBuy = Object.values(Market.goods).filter(
                    (stock) => stock.val <= 3 && stock.stock < Market.getGoodMaxStock(stock),
                );
                let toBuyNames = toBuy.map((stock) => stock.symbol);
                if (MarketNotifications.toBuy && toBuy.length > 0) {
                    notify = true;
                    let text = "";
                    if (toBuy.length > 1) {
                        text += `${toBuyNames.slice(0, -1).join(", ")} and `;
                    }
                    text += `${toBuyNames.slice(-1)[0]} is below $3`;
                    Game.Notify("Prices are low!", text, null, 50);
                    createNotification("Prices are low!", text);
                }

                let toSell = Object.values(Market.goods).filter(
                    (stock) =>
                        stock.val >= (130 / 17) * Market.goodsById.indexOf(stock) + 49 + Game.Objects.Bank.level &&
                        stock.stock > 0,
                );
                let toSellNames = toSell.map((stock) => stock.symbol);
                if (MarketNotifications.toSell && toSell.length > 0) {
                    notify = true;
                    let text = "";
                    if (toSell.length > 1) {
                        text += `${toSellNames.slice(0, -1).join(", ")} and `;
                    }
                    text += `${toSellNames.slice(-1)[0]} is ready to sell`;
                    Game.Notify("Prices are high!", text, null, 50);
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
