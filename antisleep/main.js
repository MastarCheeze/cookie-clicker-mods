let audio = new Audio("https://adventure.land/sounds/loops/empty_loop_for_js_performance.ogg");
audio.volume = 0.5;
setInterval(() => {
    audio.play();
}, 30000);

Game.Notify("Antisleep loaded!", "", null, true);
Game.registerMod("Antisleep", {init: 0});
