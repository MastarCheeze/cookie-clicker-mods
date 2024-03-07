import { Game } from "../base/loader";

export default {
    wipeSave: (force: boolean) => {
        Game.HardReset(force ? 2 : 0);
    },
};
