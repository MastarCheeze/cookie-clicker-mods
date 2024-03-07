import { Text, OnOffButton, Listing, Button, Label, WrapperComponent } from "../base/menu/component";
import { Collapsible, PrefButton, Shortcut } from "./component";
import Storage from "../storage";
import { assignParam, warning } from "./helpers";
import { notify } from "./ui";

export default new Collapsible("⚙️ Others").add(
    new Shortcut("others.wipeSave", (params) => {
        const frag = new DocumentFragment();

        frag.appendChild(new Text(`${warning} Wipe save`).write());

        const force = new OnOffButton(`${warning} Skip menu`);
        force.addStyle("width: 100px;");
        assignParam(force, params, 0);
        frag.appendChild(force.write());

        return [frag];
    }),
    new PrefButton("verbose", "Verbose", "Show notifications when a shortcut fails to run."),
    new PrefButton("advanced", "Advanced mode", "Enables run button, run order number and duplicating shortcuts."),
    new Listing().add(new Text("Run ▶"), new Label("Runs the shortcut directly.")),
    new Listing().add(
        new Text("Run order"),
        new Label(
            "When multiple shortcuts have the same keybind, the shortcut with the higher run order runs first. Useful for combo shortcuts. Note: you can set negative values.",
        ),
    ),
    new Listing().add(
        new Text("Duplicate ＋ / Remove －"),
        new Label("Enables assigning multiple keybinds to the same shortcut. Useful for combo shortcuts."),
    ),
    new PrefButton("cheats", "Cheats"),
    new Listing().add(
        (() => {
            const button = new Button("Reset all to defaults");
            button.triggerCallback.attach(() => {
                Storage.resetAllToDefaults();
                notify("All Cookie Shortcut settings resetted to default");
            });
            return button;
        })(),
        new Label("Reset all Cookie Shortcut settings to default."),
    ),
);
