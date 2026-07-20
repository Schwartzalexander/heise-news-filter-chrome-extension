const DEFAULT_HIDDEN_CATEGORIES = ["bestenlisten", "heise+ exklusiv"];
const DEFAULT_HIDDEN_TITLE_FILTERS = [];

const TITLE_FILTERS = [
  {
    id: "daily-summary",
    label: "Tageskurzzusammenfassungen",
    pattern: /^(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag):\s/i
  },
  {
    id: "missing-link",
    label: "Missing Link",
    pattern: /^Missing Link:\s/i
  },
  {
    id: "zahlen-bitte",
    label: "Zahlen, bitte",
    pattern: /^Zahlen, bitte:\s/i
  }
];

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
  "Make Magazin",
  "WTF"
];

const STORAGE_KEYS = {
  hiddenCategories: "hiddenCategories",
  hiddenTitleFilters: "hiddenTitleFilters",
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

function uniqueTitleFilterIds(filterIds) {
  const validIds = new Set(TITLE_FILTERS.map((filter) => filter.id));
  return [...new Set(filterIds)].filter((filterId) => validIds.has(filterId));
}

function storageGet(defaults) {
  return chrome.storage.sync.get(defaults);
}

function storageSet(values) {
  return chrome.storage.sync.set(values);
}
