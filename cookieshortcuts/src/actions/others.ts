import { Game } from "../aliases";

export default {
    wipeSave: (force: boolean) => {
        Game.HardReset(force ? 2 : 0);
    },
};
