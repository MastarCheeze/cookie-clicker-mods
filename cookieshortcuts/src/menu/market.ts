import { Text, OnOffButton, Dropdown, NumberInput, Listing, Label } from "../base/menu/component";
import { Collapsible, Shortcut, TitleShortcut } from "./component";
import { assignParam } from "./helpers";
import { Game } from "../aliases";

export default new Collapsible("📈 Stock market").add(
    new Shortcut("market.good", (params) => {
        const frag = new DocumentFragment();

        const action = new Dropdown(["Buy", "Buy until have", "Sell", "Sell until have"] as const);
        assignParam(action, params, 0);
        frag.appendChild(action.write());

        const amounts = ["1", "10", "100", "Custom"];
        if (params[0].startsWith("Buy")) amounts.splice(3, 0, "Max");
        else if (params[0] === "Sell") amounts.push("All");
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

        const stocks = [
            "CRL Cereals",
            "CHC Chocolate",
            "BTR Butter",
            "SUG Sugar",
            "NUT Nuts",
            "SLT Salt",
            "VNL Vanilla",
            "EGG Eggs",
            "CNM Cinnamon",
            "CRM Cream",
            "JAM Jam",
            "WCH White chocolate",
            "HNY Honey",
            "CKI Cookies",
            "RCP Recipes",
            "SBD Subsidiaries",
            "PBL Publicists",
            `YOU ${Game.bakeryName}`,
            "All stocks",
        ];
        const stockSymbols = [
            "CRL",
            "CHC",
            "BTR",
            "SUG",
            "NUT",
            "SLT",
            "VNL",
            "EGG",
            "CNM",
            "CRM",
            "JAM",
            "WCH",
            "HNY",
            "CKI",
            "RCP",
            "SBD",
            "PBL",
            "YOU",
            "All stocks",
        ];

        const good = new Dropdown(stocks, stockSymbols as unknown as (typeof params)[3][]);
        assignParam(good, params, 3);
        frag.appendChild(good.write());

        if (action.value._ === "Buy" && amount.value._ !== "Max") {
            const over = new OnOffButton("Overbuy");
            over.addStyle("width: 75px;");
            assignParam(over, params, 4);
            frag.appendChild(over.write());
        } else {
            params[4] = false;
        }

        return [frag];
    }),
    new Listing().add(
        new Text("Overbuy"),
        new Label(
            "Allow spending max cookies to buy stocks when you can't buy all. Example: buy 7 stocks with all your cookies when in buy-10 mode.",
        ),
    ),
    new Shortcut("market.loan", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text("Take loan").write());

        const loan = new Dropdown(["1st loan", "2nd loan", "3rd loan"] as const);
        assignParam(loan, params, 0);
        frag.appendChild(loan.write());

        return [frag];
    }),
    new TitleShortcut("market.hireBroker", "Hire broker"),
    new TitleShortcut("market.upgradeOffice", "Upgrade office"),
);
