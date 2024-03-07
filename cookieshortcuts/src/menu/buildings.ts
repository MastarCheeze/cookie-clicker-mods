import { Text, OnOffButton, Listing, Label, Dropdown, NumberInput } from "../base/menu/component";
import { Collapsible, Shortcut } from "./component";
import { assignParam } from "./helpers";

const buildings = [
    "Cursor",
    "Grandma",
    "Farm",
    "Mine",
    "Factory",
    "Bank",
    "Temple",
    "Wizard tower",
    "Shipment",
    "Alchemy lab",
    "Portal",
    "Time machine",
    "Antimatter condenser",
    "Prism",
    "Chancemaker",
    "Fractal engine",
    "Javascript console",
    "Idleverse",
    "Cortex baker",
    "You",
    "All buildings",
] as const;

export default new Collapsible("🧱 Buildings").add(
    new Shortcut("buildings.building", (params) => {
        const frags = [];
        const frag = new DocumentFragment();
        frags.push(frag);

        const action = new Dropdown(["Buy", "Buy until have", "Sell", "Sell until have"] as const);
        assignParam(action, params, 0);
        frag.appendChild(action.write());

        const amounts = ["1", "10", "100", "Custom"];
        if (params[0].startsWith("Buy")) amounts.splice(3, 0, "Max");
        else amounts.splice(3, 0, "All");
        const amount = new Dropdown(amounts as unknown as (typeof params)[1][]);
        assignParam(amount, params, 1);
        frag.appendChild(amount.write());

        if (amount.value._ === "Custom") {
            const custom = new NumberInput(0, 9999);
            custom.addStyle("width: 45px;");
            assignParam(custom, params, 2);
            frag.appendChild(custom.write());
        } else {
            params[2] = 0;
        }

        frag.appendChild(new Text("of").write());

        const building = new Dropdown([...buildings]);
        assignParam(building, params, 3);
        frag.appendChild(building.write());

        if (amount.value._ !== "Max" && amount.value._ !== "All") {
            const frag2 = new DocumentFragment();
            const over = new OnOffButton(action.value._.startsWith("Buy") ? "Overbuy" : "Oversell");
            over.addStyle("width: 75px;");
            assignParam(over, params, 4);
            frag2.appendChild(over.write());
            frags.push(frag2);
        } else {
            params[4] = false;
        }

        return frags;
    }),
    new Listing().add(
        new Text("Overbuy"),
        new Label(
            "Allow spending max cookies to buy buildings when you can't buy all. Example: buy 70 buildings with all your cookies when in buy-100 mode.",
        ),
    ),
    new Listing().add(
        new Text("Oversell"),
        new Label(
            "Allow spending selling all of your remaining buildings when you don't have enough to sell. Example: sell last 70 buildings when in sell-100 mode.",
        ),
    ),
);
