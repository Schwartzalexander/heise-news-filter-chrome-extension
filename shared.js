const DEFAULT_HIDDEN_CATEGORIES = ["bestenlisten", "heise+ exklusiv"];

const SEEDED_CATEGORIES = [
  "bestenlisten",
  "c't Fotografie Magazin",
  "c't Magazin",
  "heise academy",
  "heise autos",
  "heise conferences",
  "heise developer",
  "heise online",
  "heise security",
  "heise+ exklusiv",
  "iX Magazin",
  "Mac & i Magazin",
  "Make Magazin"
];

const STORAGE_KEYS = {
  hiddenCategories: "hiddenCategories",
  knownCategories: "knownCategories"
};

function normalizeCategory(category) {
  return category.replace(/\s+/g, " ").trim();
}

function sortCategories(categories) {
  return [...categories].sort((left, right) => left.localeCompare(right, "de", { sensitivity: "base" }));
}

function uniqueCategories(categories) {
  return sortCategories([...new Set(categories.map(normalizeCategory).filter(Boolean))]);
}

function storageGet(defaults) {
  return chrome.storage.sync.get(defaults);
}

function storageSet(values) {
  return chrome.storage.sync.set(values);
}
