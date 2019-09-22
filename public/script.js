"use strict";

{
  const shuffle = arr => {
    const shuffled = arr.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[rand]] = [shuffled[rand], shuffled[i]];
    }
    return shuffled;
  };

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  const TILE_SELECTOR = "#tiles>*";
  const COUNTDOWN_SELECTOR = "#countdownBar";
  const PLAY_BUTTON_SELECTOR = "#playButton";
  const BODY_SELECTOR = "body";
  const WORD_LIST_SELECTOR = "#results ul";
  const AMBIGUOUS_LETTERS = ["M", "N", "W", "Z"];
  const ORIENTATIONS = ["north", "east", "south", "west"];

  class GUI {
    disablePlayButton() {
      document.querySelector(PLAY_BUTTON_SELECTOR).disabled = true;
    }

    enablePlayButton() {
      document.querySelector(PLAY_BUTTON_SELECTOR).disabled = false;
    }

    drawBoard(board) {
      const tiles = document.querySelectorAll(TILE_SELECTOR);
      board.forEach((letter, i) => {
        tiles[i].innerText = letter;
        tiles[i].className = pick(ORIENTATIONS);
        if (AMBIGUOUS_LETTERS.includes(letter)) {
          tiles[i].classList.add("ambiguous");
        }
      });
    }

    updateTimer(fractionLeft) {
      document.querySelector(COUNTDOWN_SELECTOR)
        .setAttribute("style", `width: ${fractionLeft * 100}%;`);
    }

    setActive() {
      document.querySelector(BODY_SELECTOR).classList.remove("inactive");
    }

    setInactive() {
      document.querySelector(BODY_SELECTOR).classList.add("inactive");
    }

    showSolutions(words) {
      document.querySelector(WORD_LIST_SELECTOR)
        .innerHTML = words.map(w => `<li>${w}<li>`).join("");
    }
  }

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

  const GAME_DURATION = 2 * 60 * 1000;
  const REFRESH_INTERVAL = 500;
  const VOWEL_REGEX = /[AEIOU]/u;

  class Game {
    constructor(gui) {
      this.gui = gui;
      this.gui.disablePlayButton();
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
      const fractionLeft = Math.max(0, GAME_DURATION - elapsed) / GAME_DURATION;
      this.gui.updateTimer(fractionLeft);
      if (fractionLeft <= 0) {
        this.finish();
      }
    }

    finish() {
      clearInterval(this.countdownTimer);
      this.gui.enablePlayButton();
      this.gui.setInactive();
      this.showSolutions();
    }

    showSolutions() {
      this.gui.showSolutions(window.solver.solve(this.board));
    }
  }

  class Solver {
    constructor(dictionary) {
      this.dictionary = dictionary;
    }

    solve(board) {
      const mask = board.map((_, i) => i);
      const words = new Set();
      board.forEach((_, i) => {
        this.walk(this.dictionary, board, i, "", mask, w => words.add(w));
      });
      return [...words].sort();
    }

    walk(dictionary, board, i, word, mask, callback) {
      const nextMask = mask.filter(a => a !== i);
      const tile = board[i].toUpperCase();
      const nextDict = dictionary[tile];
      const nextWord = word + tile;
      if (nextDict) {
        if (nextDict["."]) {
          callback(nextWord);
        }
        this.neighbors(i, board.length).forEach(j => {
          if (nextMask.includes(j)) {
            this.walk(nextDict, board, j, nextWord, nextMask, callback);
          }
        });
      }
    }

    neighbors(i, boardsize) {
      const dimension = Math.sqrt(boardsize);
      const x = i % dimension;
      const y = Math.floor(i / dimension);
      const xs = [x - 1, x, x + 1].filter(a => 0 <= a && a < dimension);
      const ys = [y - 1, y, y + 1].filter(a => 0 <= a && a < dimension);
      return [].concat(...ys.map(yy => xs.map(xx => yy * dimension + xx)))
        .filter(a => a !== i);
    }
  }

  window.onload = () => {
    const gui = new GUI();
    document.querySelector(PLAY_BUTTON_SELECTOR)
      .addEventListener("click", () => new Game(gui));
    fetch("dictionary.json")
      .then(response => response.json())
      .then(dict => {
        window.solver = new Solver(dict);
      });
  };
}
