function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function matchItems(lost, found) {
  return (
    normalize(lost.category) === normalize(found.category) &&
    normalize(lost.title).includes(normalize(found.title)) ||
    normalize(found.title).includes(normalize(lost.title))
  );
}

module.exports = matchItems;
