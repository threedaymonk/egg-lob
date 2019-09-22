import {pick, shuffle} from "./array.js";

const DICE = [
  ["H", "I", "M", "N", "Qu", "U"],
  ["E", "E", "I", "N", "S",  "U"],
  ["A", "B", "B", "J", "O",  "O"],
  ["A", "O", "O", "T", "T",  "W"],
  ["H", "L", "N", "N", "R",  "Z"],
  ["D", "I", "S", "T", "T",  "Y"],
  ["A", "A", "E", "E", "G",  "N"],
  ["D", "E", "L", "R", "V",  "Y"],
  ["D", "E", "I", "L", "R",  "X"],
  ["A", "C", "H", "O", "P",  "S"],
  ["E", "L", "R", "T", "T",  "Y"],
  ["C", "I", "M", "O", "T",  "U"],
  ["E", "I", "O", "S", "S",  "T"],
  ["E", "H", "R", "T", "V",  "W"],
  ["E", "E", "G", "H", "N",  "W"],
  ["A", "F", "F", "K", "P",  "S"]
];

const REFRESH_INTERVAL = 100;
const VOWEL_REGEX = /[AEIOU]/u;

export default class Game {
  constructor(gui) {
    this.gui = gui;
  }

  start(duration) {
    this.gui.disablePlayButton();
    this.duration = duration;
    this.board = this.generateBoard();
    this.gui.drawBoard(this.board);
    this.startAt = new Date();
    this.countdownTimer =
      setInterval(this.updateCountdown.bind(this), REFRESH_INTERVAL);
    this.gui.setActive();
  }

  generateBoard() {
    const board = shuffle(DICE).map(d => pick(d));
    if (board.some(a => VOWEL_REGEX.test(a))) {
      return board;
    } else {
      return this.generateBoard();
    }
  }

  updateCountdown() {
    const elapsed = new Date() - this.startAt;
    const fractionLeft = Math.max(0, this.duration - elapsed) / this.duration;
    this.gui.updateTimer(fractionLeft);
    if (fractionLeft <= 0) {
      this.finish();
    }
  }

  finish() {
    clearInterval(this.countdownTimer);
    this.gui.setInactive();
    this.gui.enablePlayButton();
    this.showSolutions();
  }

  showSolutions() {
    this.gui.showSolutions(this.solver.solve(this.board));
  }
}
