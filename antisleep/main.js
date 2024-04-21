let audio = new Audio("https://adventure.land/sounds/loops/empty_loop_for_js_performance.ogg");
setInterval(() => {
    audio.play();
}, 30000);

Game.Notify("Antisleep loaded!", "", null, true);
