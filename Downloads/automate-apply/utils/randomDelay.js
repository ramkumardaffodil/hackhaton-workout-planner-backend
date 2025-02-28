const randomDelay = (min = 4000, max = 30000) => {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.random() * (max - min) + min)
  );
};

module.exports = {
  randomDelay,
};
