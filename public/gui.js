import {pick} from "./array.js";

const TILE_SELECTOR = "#tiles>*";
const COUNTDOWN_SELECTOR = "#countdownBar";
const PLAY_BUTTON_SELECTOR = "#playButton";
const BODY_SELECTOR = "body";
const WORD_LIST_SELECTOR = "#results ul";
const AMBIGUOUS_LETTERS = ["M", "N", "W", "Z"];
const ORIENTATIONS = ["north", "east", "south", "west"];

export default class GUI {
  onPlay(callback) {
    document.querySelector(PLAY_BUTTON_SELECTOR)
      .addEventListener("click", callback);
  }

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

