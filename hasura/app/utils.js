const kebab = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("-");

const sleep = (n) => new Promise((r) => setTimeout(r, n));

const wait = async (f) => {
  while (!f()) await sleep(1000);
  return f();
};

module.exports = {
  kebab,
  sleep,
  wait,
};
