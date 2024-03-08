export const $ = document.querySelector.bind(document);

export const w = window as any;
export const Game = w.Game;
export let Garden: any;
export let Market: any;
export let Pantheon: any;
export let Grimoire: any;

let modsReady = false;

const modsReadyInterval = setInterval(() => {
    for (const mod of Object.values(Game.mods)) {
        if ((mod as any).init !== 0) return;
    }
    modsReady = true;
    clearInterval(modsReadyInterval);
}, 100);

// initialise shortened minigame variables
const gardenInterval = setInterval(() => {
    if (Game.Objects["Farm"]["minigameLoaded"]) {
        Garden = Game.Objects["Farm"]["minigame"];
        // w.Garden = Garden; // DEBUG
        clearInterval(gardenInterval);
    }
}, 1000);
const marketInterval = setInterval(() => {
    if (Game.Objects["Bank"]["minigameLoaded"]) {
        Market = Game.Objects["Bank"]["minigame"];
        // w.Market = Market; // DEBUG
        // w.Market.secondsPerTick = 1; // DEBUG
        clearInterval(marketInterval);
    }
}, 1000);
const pantheonInterval = setInterval(() => {
    if (Game.Objects["Temple"]["minigameLoaded"]) {
        Pantheon = Game.Objects["Temple"]["minigame"];
        // w.Pantheon = Pantheon; // DEBUG
        clearInterval(pantheonInterval);
    }
}, 1000);
const grimoireInterval = setInterval(() => {
    if (Game.Objects["Wizard tower"]["minigameLoaded"]) {
        Grimoire = Game.Objects["Wizard tower"]["minigame"];
        // w.Grimoire = Grimoire; // DEBUG
        clearInterval(grimoireInterval);
    }
}, 1000);
