export default class Solver {
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
