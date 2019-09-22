export const shuffle = arr => {
  const shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[rand]] = [shuffled[rand], shuffled[i]];
  }
  return shuffled;
};

export const pick = arr => arr[Math.floor(Math.random() * arr.length)];
