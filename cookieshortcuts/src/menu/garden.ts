import { Text, OnOffButton, ToggleButton, Label, Dropdown, NumberInput, Listing } from "../base/menu/component";
import { Collapsible, Shortcut } from "./component";
import { assignParam, assignParamIntToBool, warning } from "./helpers";
import { Game, Garden } from "../base/loader";

export default new Collapsible("🌱 Garden").add(
    new Shortcut("garden.seed", (params) => {
        const frag = new DocumentFragment();

        const harvest = new ToggleButton(["Plant", "Harvest"]);
        harvest.addStyle("width: 45px;");
        assignParamIntToBool(harvest, params, 0);
        frag.appendChild(harvest.write());

        const one = new ToggleButton(["All", "One"]);
        one.addStyle("width: 20px;");
        assignParamIntToBool(one, params, 1);
        frag.appendChild(one.write());

        frag.appendChild(new Text("of").write());

        const plants = [
            "Baker's wheat",
            "Thumbcorn",
            "Cronerice",
            "Gildmillet",
            "Ordinary clover",
            "Golden clover",
            "Shimmerlily",
            "Elderwort",
            "Bakeberry",
            "Chocoroot",
            "White chocoroot",
            "White mildew",
            "Brown mold",
            "Meddleweed",
            "Whiskerbloom",
            "Chimerose",
            "Nursetulip",
            "Drowsyfern",
            "Wardlichen",
            "Keenmoss",
            "Queenbeet",
            "Juicy queenbeet",
            "Duketater",
            "Crumbspore",
            "Doughshroom",
            "Glovemorel",
            "Cheapcap",
            "Fool's bolete",
            "Wrinklegill",
            "Green rot",
            "Shriekbulb",
            "Tidygrass",
            "Everdaisy",
            "Ichorpuff",
        ];
        if (harvest.value._) plants.splice(0, 0, "Any plant");
        const plant = new Dropdown(plants as unknown as (typeof params)[2][]);
        assignParam(plant, params, 2);
        frag.appendChild(plant.write());

        if (one.value._) {
            const [minCol, minRow, maxCol, maxRow] = Garden.plotLimits[Math.min(Game.Objects["Farm"].level - 1, 8)];

            frag.appendChild(new Text("at row").write());
            const row = new NumberInput(1, maxRow - minRow, true);
            assignParam(row, params, 3);
            frag.appendChild(row.write());

            frag.appendChild(new Text("col").write());
            const col = new NumberInput(1, maxCol - minCol, true);
            assignParam(col, params, 4);
            frag.appendChild(col.write());
        } else {
            params[3] = 1;
            params[4] = 1;
        }

        const frag2 = new DocumentFragment();

        if (harvest.value._) {
            params[7] = false;

            const mature = new OnOffButton("Mature only", true);
            mature.addStyle("width: 100px;");
            assignParam(mature, params, 5);
            frag2.appendChild(mature.write());

            if (plant.value._ === "Any plant") {
                const mortal = new OnOffButton("Mortal only", true);
                mortal.addStyle("width: 100px;");
                assignParam(mortal, params, 6);
                frag2.appendChild(mortal.write());
            }
        } else {
            params[5] = true;
            params[6] = true;

            const harvestExisting = new OnOffButton("Harvest existing");
            assignParam(harvestExisting, params, 7);
            frag2.appendChild(harvestExisting.write());
        }

        return [frag, frag2];
    }),
    new Listing().add(new Text("Mature only"), new Label("When harvesting, only harvest plants that are mature.")),
    new Listing().add(new Text("Mortal only"), new Label("When harvesting, only harvest plants that are mortal.")),
    new Listing().add(
        new Text("Harvest existing"),
        new Label("When planting, harvest existing plants to make space for new seeds."),
    ),
    new Shortcut("garden.freeze", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Freeze").write());

        const action = new Dropdown(["Toggle", "Switch on", "Switch off"] as const);
        assignParam(action, params, 0);
        frag.appendChild(action.write());

        return [frag];
    }),
    new Shortcut("garden.changeSoil", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Change soil to").write());

        const soil = new Dropdown(["Dirt", "Fertilizer", "Clay", "Pebbles", "Wood chips"] as const);
        assignParam(soil, params, 0);
        frag.appendChild(soil.write());

        return [frag];
    }),
    new Shortcut("garden.convert", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Sacrifice garden").write());

        const force = new OnOffButton(`${warning} Skip menu`);
        force.addStyle("width: 100px;");
        assignParam(force, params, 0);
        frag.appendChild(force.write());

        return [frag];
    }),
);
