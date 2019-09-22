"use strict";

import GUI from "./gui.js";
import Game from "./game.js";
import NoSleep from "./nosleep/nosleep.js";
import Solver from "./solver.js";

const GAME_DURATION = 2 * 60;
const SECOND = 1000;

const gui = new GUI();
const game = new Game(gui);
const params = new URLSearchParams(window.location.search);
const noSleep = new NoSleep();

fetch("dictionary.json")
  .then(response => response.json())
  .then(dict => {
    game.solver = new Solver(dict);
  });

window.onload = () => {
  gui.onPlay(() => {
    noSleep.enable();
    game.start((parseInt(params.get("d"), 10) || GAME_DURATION) * SECOND);
  });
  game.onFinish(() => {
    noSleep.disable();
  });
};
