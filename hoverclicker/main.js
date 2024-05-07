(() => {
    const mod = {
        init: function () {
            const mod = this;
            this.prefs = {
                autoClicker: 1,
                autoClickerCps: 10,
                clickGC: 1,
                clickWrath: 0,
                clickWrinkler: 0,
                clickFortune: 1,
            };
            this.globs = {
                autoClickerId: null,
            };

            this.callFromAutoClicker = false;

            // hover big cookie autoclicker
            l("bigCookie").removeEventListener("click", Game.ClickCookie, false);
            Game.ClickCookie = (function (oldFunc) {
                return function (...args) {
                    if (!mod.prefs.autoClicker || !l("bigCookie").matches(":hover") || mod.callFromAutoClicker) {
                        mod.callFromAutoClicker = false;
                        return oldFunc.apply(this, args);
                    }
                };
            })(Game.ClickCookie);

            if (!Game.mods.CookieMonster) {
                // Cookie monster already overrides big cookie click event
                l("bigCookie").addEventListener("click", Game.ClickCookie, false);
            }

            this.updateAutoClicker();

            // hover golden/wrath cookie autoclicker
            Game.shimmer.prototype.init = (function (oldFunc) {
                return function () {
                    this.l.addEventListener("mouseover", () => {
                        if (
                            mod.prefs.clickGC &&
                            (this.wrath != 1 || // is golden cookie
                                mod.prefs.clickWrath || // click wrath setting is on
                                this.force === "cookie storm drop" || // cookie storm drops
                                Game.shimmerTypes[this.type].chain) // chain cookies
                        )
                            this.pop();
                    });
                    return oldFunc.apply(this, arguments);
                };
            })(Game.shimmer.prototype.init);

            // hover wrinkler autoclicker
            Game.wrinklers.forEach((wrinkler) => {
                Object.defineProperty(wrinkler, "selected", {
                    get: function () {
                        return this._selected;
                    },
                    set: function (value) {
                        if (value === 1 && this.phase === 2 && this.type === 0 && mod.prefs.clickWrinkler)
                            this.hp = -10;
                        this._selected = value;
                    },
                });
            });

            // hover fortune cookie autoclicker
            Game.tickerL.addEventListener("mouseover", () => {
                if (Game.TickerEffect && Game.TickerEffect.type === "fortune" && mod.prefs.clickFortune)
                    Game.tickerL.click();
            });

            // options menu
            this.customMenu = Game.UpdateMenu.bind({});
            Game.UpdateMenu = () => {
                this.customMenu();
                if (Game.onMenu === "prefs") {
                    const blocks = document.getElementsByClassName("block");
                    let settingsBlock = null;
                    for (let i = 0; i < blocks.length; i++)
                        if (blocks[i].textContent.search(loc("Settings")) === 0) settingsBlock = blocks[i];

                    const optionsHTML = `
                    <div class="block" style="padding: 0px; margin: 8px 4px;">
                      <div class="subsection" style="padding: 0px;">
                        <div class="title">Hoverclicker</div>
                        <div class="listing">
                          ${this.writePrefButton(
                              "autoClicker",
                              "autoClickerButton",
                              "Auto Clicker" + ON,
                              "Auto Clicker" + OFF,
                              "",
                          )}<label>(click big cookie on hover)</label><br>
                        </div>
                        <div class="listing">
                          ${this.writeSlider(
                              "autoClickerCpsSlider",
                              "Auto Clicker CPS",
                              "[$] CPS",
                              () => {
                                  return this.prefs.autoClickerCps;
                              },
                              5,
                              20,
                              0.1,
                              "Game.mods.Hoverclicker.prefs.autoClickerCps=Math.round(l('autoClickerCpsSlider').value*100)/100;Game.mods.Hoverclicker.updateAutoClicker();l('autoClickerCpsSliderRightText').innerHTML=Game.mods.Hoverclicker.prefs.autoClickerCps+' CPS';",
                          )}<br>
                        </div>
                        <div class="listing">
                          ${this.writePrefButton(
                              "clickGC",
                              "clickGCButton",
                              "Click golden cookies" + ON,
                              "Click golden cookies" + OFF,
                              "",
                          )}<label>(click golden cookies on hover)</label><br>
                        </div>
                        <div class="listing">
                          ${this.writePrefButton(
                              "clickWrath",
                              "clickWrathButton",
                              "Click wrath cookies" + ON,
                              "Click wrath cookies" + OFF,
                              "",
                          )}<label>(click wrath cookies on hover, must have click golden cookies on hover option turned on)</label><br>
                        </div>
                        <div class="listing">
                          ${this.writePrefButton(
                              "clickWrinkler",
                              "clickWrinklerButton",
                              "Click wrinklers" + ON,
                              "Click wrinklers" + OFF,
                              "",
                          )}<label>(pop wrinklers on hover when they reach the big cookie)</label><br>
                        </div>
                        <div class="listing">
                          ${this.writePrefButton(
                              "clickFortune",
                              "clickFortuneButton",
                              "Click fortune cookies" + ON,
                              "Click fortune cookies" + OFF,
                              "",
                          )}<label>(click news ticker fortunes on hover)</label><br>
                        </div>
                      </div>
                    </div>
                `;

                    settingsBlock.after(this.elementFromHtml(optionsHTML));
                }
            };

            Game.Notify("Hoverclicker loaded!", "", null, 3);
        },
        save: function () {
            const tokens = [];
            for (let pref in this.prefs) {
                tokens.push(this.prefs[pref].toString());
            }
            return tokens.join(",");
        },
        load: function (str) {
            const tokens = str.split(",");
            let i = 0;
            for (let pref in this.prefs) {
                this.prefs[pref] = Number(tokens[i]);
                i++;
            }
            this.updateAutoClicker();
        },
        updateAutoClicker: function () {
            if (this.globs.autoClickerId) clearInterval(this.globs.autoClickerId);
            this.globs.autoClickerId = setInterval(() => {
                if (this.prefs.autoClicker && l("bigCookie").matches(":hover") && !Game.Has("Shimmering veil [off]")) {
                    Game.ClickCookie(null, 0);
                    this.callFromAutoClicker = true;
                }
            }, 1000 / this.prefs.autoClickerCps);
        },
        writePrefButton: function (prefName, button, on, off, callback, invert) {
            invert = invert ? 1 : 0;
            if (!callback) callback = "";
            callback += "PlaySound('snd/tick.mp3');";
            return `
            <a class="smallFancyButton prefButton option${
                this.prefs[prefName] ^ invert ? "" : " off"
            }" id="${button}" ${
                Game.clickStr
            }="Game.mods.Hoverclicker.toggle('${prefName}','${button}','${on}','${off}','${invert}');${callback}">
              ${this.prefs[prefName] ? on : off}
            </a>
        `;
        },
        writeSlider: function (slider, leftText, rightText, startValueFunction, min, max, step, callback) {
            if (!callback) callback = "";
            return `
            <div class="sliderBox">
              <div style="float:left;" class="smallFancyButton">${leftText}</div>
              <div style="float:right;" class="smallFancyButton" id="${slider}RightText">${rightText.replace(
                "[$]",
                startValueFunction(),
            )}</div>
              <input class="slider" style="clear:both;" type="range" min="${min}" max="${max}" step="${step}" value="${startValueFunction()}" onchange="${callback}" oninput="${callback}" onmouseup="PlaySound('snd/tick.mp3');" id="${slider}"/>
            </div>
        `;
        },
        toggle: function (prefName, button, on, off, invert) {
            if (this.prefs[prefName]) {
                l(button).innerHTML = off;
                this.prefs[prefName] = 0;
            } else {
                l(button).innerHTML = on;
                this.prefs[prefName] = 1;
            }
            l(button).className = `smallFancyButton prefButton option${this.prefs[prefName] ^ invert ? "" : " off"}`;
        },
        elementFromHtml: function (html, breaks) {
            var template = document.createElement("template");
            template.innerHTML = html.trim();
            return template.content.firstChild;
        },
    };

    Game.registerMod("Hoverclicker", mod);
})();
