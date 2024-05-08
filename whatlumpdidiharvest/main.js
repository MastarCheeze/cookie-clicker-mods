(() => {
    const mod = {
        init: function () {
            this.data = {
                lumps: undefined,
                lumpT: undefined,
                lumpCurrentType: undefined,
            };

            Game.loadLumps = (function (old) {
                return (...params) => {
                    let ret = old(...params);
                    mod.createNotification();
                    return ret;
                };
            })(Game.loadLumps);

            Game.Notify("What Lump Did I Harvest loaded!", "", null, 3);
        },
        createNotification: function () {
            // remove default harvest notification
            let noteId = Game.Notes.filter((note) => note.pic[0] === 29 && note.pic[1] === 14).map(
                (note) => note.id,
            )[0];
            if (noteId === undefined) {
                return;
            }

            // add custom harvest notification
            const idToName = ["normal", "bifurcated", "golden", "meaty", "caramelized"];
            const idToIcon = [
                [29, 14],
                [29, 15],
                [29, 16],
                [29, 17],
                [29, 27],
            ];

            if (this.data && Game.lumpT > this.data.lumpT) {
                Game.CloseNote(noteId);
                let name = idToName[this.data.lumpCurrentType];
                let icon = idToIcon[this.data.lumpCurrentType];

                var age = Math.max(Date.now() - this.data.lumpT, 0);
                var amount = Math.floor(age / Game.lumpOverripeAge); // how many lumps did we harvest since we closed the game?
                let subsequentEarned = amount - 1;
                let firstEarned = Game.lumps - this.data.lumps - subsequentEarned;

                Game.Notify(
                    `${firstEarned > 0 ? firstEarned : "No"} lump${firstEarned === 1 ? "" : "s"} gained`,
                    `A ${name} sugar lump was harvested while offline`,
                    icon,
                    0,
                );

                if (subsequentEarned !== 0) {
                    Game.Notify(
                        `${subsequentEarned} more lump${subsequentEarned === 1 ? "" : "s"} gained`,
                        `${subsequentEarned} more normal lump${
                            subsequentEarned === 1 ? " was" : "s were"
                        } harvested while offline`,
                        [29, 14],
                        0,
                    );
                }
            }
        },
        save: function () {
            this.data = {
                lumps: Game.lumps,
                lumpT: Game.lumpT,
                lumpCurrentType: Game.lumpCurrentType,
            };

            const tokens = [];
            for (let key in this.data) {
                tokens.push(this.data[key].toString());
            }
            return tokens.join();
        },
        load: function (str) {
            const tokens = str.split(",");
            let i = 0;
            for (let key in this.data) {
                this.data[key] = Number(tokens[i]);
                i++;
            }

            this.createNotification();
        },
    };

    Game.registerMod("WhatLumpDidIHarvest", mod);
})();
