import { Text, Dropdown, ToggleButton, Listing, Label } from "../base/menu/component";
import { Collapsible, Shortcut } from "./component";
import { assignParam, assignParamIntToBool } from "./helpers";

export default new Collapsible("🏛 Pantheon").add(
    new Shortcut("pantheon.slot", (params) => {
        const frag = new DocumentFragment();

        const toSlot = new ToggleButton(["Unslot", "Slot"]);
        toSlot.addStyle("width: 40px;");
        assignParamIntToBool(toSlot, params, 0);
        frag.appendChild(toSlot.write());

        const gods = [
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
        const god = new Dropdown([...gods, ...(toSlot.value._ ? ([] as const) : (["Any god"] as const))]);
        assignParam(god, params, 1);
        frag.appendChild(god.write());

        if (toSlot.value._) {
            frag.appendChild(new Text("to").write());

            const to = new Dropdown(["Jade", "Ruby", "Diamond"] as const);
            assignParam(to, params, 2);
            frag.appendChild(to.write());

            frag.appendChild(new Text("If occupied:").write());

            const ifOccupied = new Dropdown(["Cancel", "Unslot", "Swap"] as const);
            assignParam(ifOccupied, params, 3);
            frag.appendChild(ifOccupied.write());
        } else {
            frag.appendChild(new Text("from").write());

            const from = new Dropdown(["Jade", "Ruby", "Diamond", "Any slot"] as const);
            assignParam(from, params, 4);
            frag.appendChild(from.write());
        }

        return [frag];
    }).addStyle("margin-bottom: 10px;"),
    new Listing().add(
        new Text("If occupied"),
        new Label("Behavior of slotting gods if the destination slot is already occupied by another god."),
    ),
    new Listing().add(
        new Text("&bull; Cancel"),
        new Label("Cancels the process. Nothing happens and you get a warning."),
    ),
    new Listing().add(
        new Text("&bull; Unslot"),
        new Label("Unslots the god occupying the destination slot and replace it with your chosen god."),
    ),
    new Listing().add(
        new Text("&bull; Swap"),
        new Label(
            "Swaps the places of both gods. The god occupying the destination slot will be unslotted or moved to another slot depending on the location of your chosen god.",
        ),
    ),
);
