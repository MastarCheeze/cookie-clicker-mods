import { Game, Pantheon } from "../aliases";
import { notify } from "../menu/ui";
import applyDecorator from "./applydecorator";

const godIndexMap = [
    "Holobore",
    "Vomitrax",
    "Godzamok",
    "Cyclius",
    "Selebrak",
    "Dotjeiess",
    "Muridal",
    "Jeremy",
    "Mokalsium",
    "Skruuia",
    "Rigidel",
] as const;

const slotIndexMap = ["Diamond", "Ruby", "Jade"] as const;

function slot(
    god: (typeof godIndexMap)[number],
    to: "Jade" | "Ruby" | "Diamond",
    ifOccupied: "Cancel" | "Unslot" | "Swap",
) {
    const godObj = Pantheon.godsById[godIndexMap.indexOf(god)];
    const slot = slotIndexMap.indexOf(to);

    if (Pantheon.slot[slot] !== -1) {
        if (Pantheon.slot[slot] === godObj.id) return;

        if (ifOccupied === "Cancel") {
            notify("That slot is already occupied by another god");
            return;
        } else if (ifOccupied === "Unslot") {
            Pantheon.dragging = Pantheon.godsById[Pantheon.slot[slot]];
            Pantheon.slotHovered = -1;
            Pantheon.dropGod();
        }
    }

    Pantheon.dragging = godObj;
    Pantheon.slotHovered = slot;
    Pantheon.dropGod();
    Pantheon.slotHovered = -1;
}

function unslot(god: (typeof godIndexMap)[number] | "Any god", from: "Jade" | "Ruby" | "Diamond" | "Any slot") {
    if (god !== "Any god") {
        const godId = godIndexMap.indexOf(god);
        const godObj = Pantheon.godsById[godId];

        if (from !== "Any slot" && Pantheon.slot[slotIndexMap.indexOf(from)] !== godId) {
            notify("Cannot find god at slot");
            return;
        }

        Pantheon.dragging = godObj;
        Pantheon.slotHovered = -1;
        Pantheon.dropGod();
    } else if (from !== "Any slot") {
        const slot = slotIndexMap.indexOf(from);
        const godId = Pantheon.slot[slot];

        if (godId !== -1) {
            Pantheon.dragging = Pantheon.godsById[godId];
            Pantheon.slotHovered = -1;
            Pantheon.dropGod();
        }
    } else {
        for (const godId of Pantheon.slot) {
            if (godId !== -1) {
                Pantheon.dragging = Pantheon.godsById[godId];
                Pantheon.slotHovered = -1;
                Pantheon.dropGod();
            }
        }
    }
}

const pantheon = {
    slot: (
        toSlot: boolean,
        god: (typeof godIndexMap)[number] | "Any god",
        to: "Jade" | "Ruby" | "Diamond",
        ifOccupied: "Cancel" | "Unslot" | "Swap",
        from: "Jade" | "Ruby" | "Diamond" | "Any slot",
    ) => {
        if (toSlot && god !== "Any god") {
            slot(god, to, ifOccupied);
        } else if (!toSlot) {
            unslot(god, from);
        } else {
            throw new Error("Invalid arguments");
        }
    },
};

applyDecorator(pantheon, (target) => (...args) => {
    if (Game.Objects["Temple"].level < 1) {
        notify("You don't have the Pantheon unlocked yet");
        return;
    }
    if (Game.Objects["Temple"].amount < 1) {
        notify("You don't have any Temples");
        return;
    }
    return target(...args);
});

export default pantheon;
