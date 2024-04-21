# Antisleep

A small script to keep Cookie Clicker running in the background while not in focus.

**How it works:** By default, browsers throttle tabs that aren't focused, causing them to run slower. The script plays an empty sound every 30 seconds to keep the tab active.

## Installation

[Source code](./main.js)

### Userscript

Paste [this userscript](./userscript.js) in a new script in your preferred userscript manager.

### Bookmarklet

Save this code as a bookmark.

```js
javascript: (function () {
    Game.LoadMod("https://mastarcheeze.github.io/cookie-clicker-mods/antisleep/main.js");
})();
```

### Manual load

Paste this code into your console.

```js
Game.LoadMod("https://mastarcheeze.github.io/cookie-clicker-mods/antisleep/main.js");
```
