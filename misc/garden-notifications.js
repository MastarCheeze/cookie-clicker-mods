// Creates a notification when garden events occur

const GardenNotifications = {
    newPlants: true,
    maturePlants: true,
    dyingPlants: false,
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
        let Garden = Game.Objects.Farm.minigame;

        let prevNextStep = Garden.nextStep;
        let prevPlots = structuredClone(Garden.plot);

        Garden.clickTile = (function (old) {
            return (...params) => {
                old(...params);

                prevPlots = structuredClone(Garden.plot);
            };
        })(Garden.clickTile);

        Garden.logic = (function (old) {
            return (...params) => {
                let ret = old(...params);

                if (prevNextStep !== Garden.nextStep) {
                    if (Game.Objects.Farm.amount !== 0) {
                        let notify = false;

                        let newPlants = [];
                        let maturePlants = [];
                        let dyingPlants = [];
                        for ([rowNum, row] of Object.entries(Garden.plot)) {
                            for ([colNum, [plant, age]] of Object.entries(row)) {
                                if (plant !== 0) {
                                    let plantObj = Garden.plantsById[plant - 1];
                                    if (age <= 0 && prevPlots[rowNum][colNum][0] !== plant) {
                                        newPlants.push(plantObj.name);
                                    }
                                    if (age >= plantObj.mature && prevPlots[rowNum][colNum][1] < plantObj.mature) {
                                        maturePlants.push(plantObj.name);
                                    }
                                    if (age + Math.ceil(plantObj.ageTick + plantObj.ageTickR) >= 100) {
                                        dyingPlants.push(plantObj.name);
                                    }
                                }
                            }
                        }
                        newPlants = GardenNotifications ? [...new Set(newPlants)] : [];
                        maturePlants = GardenNotifications ? [...new Set(maturePlants)] : [];
                        dyingPlants = GardenNotifications ? [...new Set(dyingPlants)] : [];

                        if (newPlants.length > 0) {
                            notify = true;
                            let text = "";
                            if (newPlants.length > 1) {
                                text += `${newPlants.slice(0, -1).join(", ")} and `;
                            }
                            text += `${newPlants.slice(-1)[0]} popped out of the ground`;
                            Game.Notify("Sprouts have appeared!", text, null, 170);
                            createNotification("Sprouts have appeared!", text);
                        }

                        if (maturePlants.length > 0) {
                            notify = true;
                            let text = "";
                            if (maturePlants.length > 1) {
                                text += `${maturePlants.slice(0, -1).join(", ")} and `;
                            }
                            text += `${maturePlants.slice(-1)[0]} is ready for harvest`;
                            Game.Notify("Plants are mature!", text, null, 170);
                            createNotification("Plants are mature!", text);
                        }

                        if (dyingPlants.length > 0) {
                            notify = true;
                            let text = "";
                            if (dyingPlants.length > 1) {
                                text += `${dyingPlants.slice(0, -1).join(", ")} and `;
                            }
                            text += `${dyingPlants.slice(-1)[0]} is dying!`;
                            Game.Notify("Plants are dying!", text, null, 170);
                            createNotification("Plants are dying!", text);
                        }

                        if (notify) {
                            PlaySound("snd/harvest1.mp3");
                        }
                    }

                    prevNextStep = Garden.nextStep;
                    prevPlots = structuredClone(Garden.plot);
                }

                return ret;
            };
        })(Garden.logic);
    }

    const gardenInterval = setInterval(() => {
        if (Game.Objects["Farm"]["minigameLoaded"]) {
            main();
            clearInterval(gardenInterval);
        }
    }, 1000);
})();
