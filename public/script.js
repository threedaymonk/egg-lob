{
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
    ["A", "F", "F", "K", "P",  "S"],
  ]
  const BOARD_SIZE = DICE.length;
  const ORIENTATIONS = ["north", "east", "south", "west"];
  const AMBIGUOUS_LETTERS = ["M", "N", "W", "Z"];
  const GAME_DURATION = 2 * 60 * 1000;
  const TILE_SELECTOR = "#tiles>*";
  const COUNTDOWN_SELECTOR = "#countdownBar";
  const PLAY_BUTTON_SELECTOR = "#playButton";
  const BODY_SELECTOR = "body";
  const VOWEL_REGEX = /[AEIOU]/;
  const WORD_LIST_SELECTOR = "#results ul";

  const shuffle = arr => {
    let shuffled = arr.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[rand]] = [shuffled[rand], shuffled[i]];
    }
    return shuffled;
  };

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  class Game {
    constructor() {
      document.querySelector(PLAY_BUTTON_SELECTOR).disabled = true;
      this.board = this.generateBoard();
      this.drawBoard();
      this.startAt = new Date();
      this.countdownTimer = setInterval(this.updateCountdown.bind(this), 100);
      document.querySelector(BODY_SELECTOR).classList.remove("inactive");
    }

    generateBoard() {
      let board = shuffle(DICE).map(d => pick(d));
      if (board.some(a => VOWEL_REGEX.test(a))) {
        return board;
      } else {
        return this.generateBoard();
      }
    }

    drawBoard() {
      let tiles = document.querySelectorAll(TILE_SELECTOR);
      for (let i = 0; i < BOARD_SIZE; i++) {
        let letter = this.board[i];
        tiles[i].innerText = letter;
        tiles[i].className = pick(ORIENTATIONS);
        if (AMBIGUOUS_LETTERS.includes(letter)) {
          tiles[i].classList.add("ambiguous");
        }
      }
    }

    updateCountdown() {
      let elapsed = new Date() - this.startAt;
      let fractionLeft = Math.max(0, GAME_DURATION - elapsed) / GAME_DURATION;
      document.querySelector(COUNTDOWN_SELECTOR).
        setAttribute("style", `width: ${fractionLeft * 100}%;`);
      if (fractionLeft <= 0) {
        this.finish();
      }
    }

    finish() {
      clearInterval(this.countdownTimer);
      document.querySelector(PLAY_BUTTON_SELECTOR).disabled = false;
      document.querySelector(BODY_SELECTOR).classList.add("inactive");
      this.showSolutions();
    }

    showSolutions() {
      let words = window.solver.solve(this.board);
      document.querySelector(WORD_LIST_SELECTOR)
        .innerHTML = words.map(w => '<li>' + w + '<li>').join('')
    }
  }

  class Solver {
    constructor(dictionary) {
      this.dictionary = dictionary;
    }

    solve(board) {
      let mask = board.map((_, i) => i);
      let words = {};
      board.forEach((_, i) => {
        this.walk(this.dictionary, board, i, "", mask, w => words[w] = 1);
      });
      return Object.keys(words).sort();
    }

    walk(dictionary, board, i, word, mask, callback) {
      let nextMask = mask.filter(a => a !== i);
      let tile = board[i].toUpperCase();
      let nextDict = dictionary[tile];
      let nextWord = word + tile;
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
      let dimension = Math.sqrt(boardsize);
      let x = i % dimension;
      let y = Math.floor(i / dimension);
      let xs = [x - 1, x, x + 1].filter(a => 0 <= a && a < dimension);
      let ys = [y - 1, y, y + 1].filter(a => 0 <= a && a < dimension);
      return [].concat(...ys.map(yy => xs.map(xx => yy * dimension + xx)))
        .filter(a => a !== i);
    }
  }

  window.onload = () => {
    document.querySelector(PLAY_BUTTON_SELECTOR)
      .addEventListener('click', () => new Game());
    fetch('dictionary.json')
      .then(response => response.json())
      .then(dict => window.solver = new Solver(dict));
  }
}
