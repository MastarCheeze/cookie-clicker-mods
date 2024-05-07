// Adds a buy and sell 50 button to the store

(() => {
    const bulkContent = `
                <div id="storeBulkBuy" class="storePreButton storeBulkMode selected" onclick="Game.storeBulkButton(0);">Buy</div>
                <div id="storeBulkSell" class="storePreButton storeBulkMode" onclick="Game.storeBulkButton(1);">Sell</div>
                <div id="storeBulk1" class="storePreButton storeBulkAmount selected" onclick="Game.storeBulkButton(2);">1</div>
                <div id="storeBulk10" class="storePreButton storeBulkAmount" onclick="Game.storeBulkButton(3);">10</div>
                <div id="storeBulk50" class="storePreButton storeBulkAmount">50</div>
                <div id="storeBulk100" class="storePreButton storeBulkAmount" onclick="Game.storeBulkButton(4);">100</div>
                <div id="storeBulkMax" class="storePreButton storeBulkAmount" onclick="Game.storeBulkButton(5);" style="visibility: hidden;">all</div>
    `;
    document.getElementById("storeBulk").innerHTML = bulkContent;

    l("storeBulk50").onclick = () => {
        Game.buyBulk = 50;
        if (Game.buyMode === 1 && Game.buyBulk === -1) Game.buyBulk = 100;

        l("storeBulk1").className = "storePreButton storeBulkAmount";
        l("storeBulk10").className = "storePreButton storeBulkAmount";
        l("storeBulk100").className = "storePreButton storeBulkAmount";
        l("storeBulkMax").className = "storePreButton storeBulkAmount";
        l("storeBulk50").className = "storePreButton storeBulkAmount selected";

        Game.storeToRefresh = 1;
        PlaySound("snd/tick.mp3");
    };

    function deselectBulk50() {
        l("storeBulk50").className = "storePreButton storeBulkAmount";
    }

    l("storeBulk1").addEventListener("click", deselectBulk50, false);
    l("storeBulk10").addEventListener("click", deselectBulk50, false);
    l("storeBulk100").addEventListener("click", deselectBulk50, false);
    l("storeBulkMax").addEventListener("click", deselectBulk50, false);

    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(".storeBulkAmount{ width: 46px !important; }"));

    const head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(style);
})();
