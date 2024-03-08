// import { w } from "./helpers";

// type TGame = {
//     registerMod: (id: string, mod: TMod) => void;
//     ready: string | undefined;
//     Notify: (title: string, desc: string, pic?: string, quick?: boolean, noLog?: boolean) => void;
// };
// type TMod = {
//     id: string;
//     name: string;
//     init?: () => void;
//     delayedInit?: () => void;
//     save?: () => string | undefined;
//     load?: (str: string) => void;
// };

// export let Game: any;
// export let Garden: any;
// export let Market: any;
// export let Pantheon: any;
// export let Grimoire: any;

// let gameReady = false;
// let modsReady = false;

// const gameReadyInterval = setInterval(() => {
//     if (w.Game === undefined || w.Game.ready === undefined || !w.Game.ready) return;
//     Game = w.Game;
//     gameReady = true;
//     clearInterval(gameReadyInterval);

//     const modsReadyInterval = setInterval(() => {
//         for (const mod of Object.values(Game.mods)) {
//             if ((mod as any).init !== 0) return;
//         }
//         modsReady = true;
//         clearInterval(modsReadyInterval);
//     }, 100);

//     // initialise shortened minigame variables
//     const gardenInterval = setInterval(() => {
//         if (Game.Objects["Farm"]["minigameLoaded"]) {
//             Garden = Game.Objects["Farm"]["minigame"];
//             w.Garden = Garden; // DEBUG
//             clearInterval(gardenInterval);
//         }
//     }, 1000);
//     const marketInterval = setInterval(() => {
//         if (Game.Objects["Bank"]["minigameLoaded"]) {
//             Market = Game.Objects["Bank"]["minigame"];
//             w.Market = Market; // DEBUG
//             w.Market.secondsPerTick = 1; // DEBUG
//             clearInterval(marketInterval);
//         }
//     }, 1000);
//     const pantheonInterval = setInterval(() => {
//         if (Game.Objects["Temple"]["minigameLoaded"]) {
//             Pantheon = Game.Objects["Temple"]["minigame"];
//             w.Pantheon = Pantheon; // DEBUG
//             clearInterval(pantheonInterval);
//         }
//     }, 1000);
//     const grimoireInterval = setInterval(() => {
//         if (Game.Objects["Wizard tower"]["minigameLoaded"]) {
//             Grimoire = Game.Objects["Wizard tower"]["minigame"];
//             w.Grimoire = Grimoire; // DEBUG
//             clearInterval(grimoireInterval);
//         }
//     }, 1000);
// }, 100);

// function loadMod(mod: TMod) {
//     Game.registerMod(mod.id, mod);
//     Game.Notify(`${mod.name} loaded!`, "", undefined, true);
// }

// export default function load<T extends TMod>(mod: T) {
//     if (gameReady) {
//         loadMod(mod);
//     } else {
//         const gameReadyInterval = setInterval(() => {
//             if (!gameReady) return;
//             loadMod(mod);
//             clearInterval(gameReadyInterval);
//         }, 100);
//     }

//     if (mod.delayedInit === undefined) return;
//     if (modsReady) {
//         mod.delayedInit();
//     } else {
//         const modsReadyInterval = setInterval(() => {
//             if (!modsReady) return;
//             mod.delayedInit!();
//             clearInterval(modsReadyInterval);
//         }, 100);
//     }

//     w.mod = mod; // DEBUG
// }
