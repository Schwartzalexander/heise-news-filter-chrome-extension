const SEEDED_CATEGORIES = [
  "Alert",
  "Angebot",
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
  "Update",
  "WTF"
];

const DEFAULT_VISIBLE_CATEGORIES = ["heise online"];
const DEFAULT_HIDDEN_CATEGORIES = SEEDED_CATEGORIES.filter((category) => !DEFAULT_VISIBLE_CATEGORIES.includes(category));
const DEFAULT_SETTINGS_VERSION = 2;

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
  },
  {
    id: "tgiqf",
    label: "#TGIQF",
    pattern: /^#TGIQF\b/i
  },
  {
    id: "post-zum-freitag",
    label: "Post zum Freitag",
    pattern: /^Post zum Freitag\b/i
  },
  {
    id: "kommentar",
    label: "Kommentar",
    pattern: /^Kommentar:\s/i
  }
];

const DEFAULT_HIDDEN_TITLE_FILTERS = TITLE_FILTERS.map((filter) => filter.id);

const STORAGE_KEYS = {
  hiddenCategories: "hiddenCategories",
  hiddenTitleFilters: "hiddenTitleFilters",
  knownCategories: "knownCategories",
  defaultSettingsVersion: "defaultSettingsVersion"
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
