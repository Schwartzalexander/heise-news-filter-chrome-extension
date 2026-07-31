const listElement = document.querySelector("#category-list");
const titleFilterListElement = document.querySelector("#title-filter-list");
const statusElement = document.querySelector("#status");
const resetButton = document.querySelector("#reset-button");
let hiddenCategories = new Set(DEFAULT_HIDDEN_CATEGORIES);
let hiddenTitleFilters = new Set(DEFAULT_HIDDEN_TITLE_FILTERS);
let statusTimer;

function showStatus(message) {
  statusElement.textContent = message;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    statusElement.textContent = "";
  }, 1800);
}

async function saveHiddenCategories() {
  await storageSet({ [STORAGE_KEYS.hiddenCategories]: sortCategories(hiddenCategories) });
  showStatus("Einstellung gespeichert.");
}

async function saveHiddenTitleFilters() {
  await storageSet({ [STORAGE_KEYS.hiddenTitleFilters]: uniqueTitleFilterIds([...hiddenTitleFilters]) });
  showStatus("Einstellung gespeichert.");
}

function createCategoryOption(category) {
  const label = document.createElement("label");
  label.className = "category-option";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = hiddenCategories.has(category);
  checkbox.addEventListener("change", async () => {
    if (checkbox.checked) {
      hiddenCategories.add(category);
    } else {
      hiddenCategories.delete(category);
    }

    await saveHiddenCategories();
  });

  const text = document.createElement("span");
  text.textContent = category;

  label.append(checkbox, text);
  return label;
}

function createTitleFilterOption(filter) {
  const label = document.createElement("label");
  label.className = "category-option";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = hiddenTitleFilters.has(filter.id);
  checkbox.addEventListener("change", async () => {
    if (checkbox.checked) {
      hiddenTitleFilters.add(filter.id);
    } else {
      hiddenTitleFilters.delete(filter.id);
    }

    await saveHiddenTitleFilters();
  });

  const text = document.createElement("span");
  text.textContent = filter.label;

  label.append(checkbox, text);
  return label;
}

function renderCategories(categories) {
  listElement.replaceChildren(...categories.map(createCategoryOption));
}

function renderTitleFilters() {
  titleFilterListElement.replaceChildren(...TITLE_FILTERS.map(createTitleFilterOption));
}

async function loadPopup() {
  const stored = await storageGet({
    [STORAGE_KEYS.hiddenCategories]: DEFAULT_HIDDEN_CATEGORIES,
    [STORAGE_KEYS.hiddenTitleFilters]: DEFAULT_HIDDEN_TITLE_FILTERS,
    [STORAGE_KEYS.knownCategories]: SEEDED_CATEGORIES,
    [STORAGE_KEYS.defaultSettingsVersion]: 0
  });

  const shouldApplyDefaultSettings = stored[STORAGE_KEYS.defaultSettingsVersion] !== DEFAULT_SETTINGS_VERSION;
  hiddenCategories = new Set(uniqueCategories([
    ...(shouldApplyDefaultSettings ? DEFAULT_HIDDEN_CATEGORIES : []),
    ...stored[STORAGE_KEYS.hiddenCategories]
  ]));
  hiddenTitleFilters = new Set(uniqueTitleFilterIds([
    ...(shouldApplyDefaultSettings ? DEFAULT_HIDDEN_TITLE_FILTERS : []),
    ...stored[STORAGE_KEYS.hiddenTitleFilters]
  ]));
  const categories = uniqueCategories([
    ...SEEDED_CATEGORIES,
    ...stored[STORAGE_KEYS.knownCategories]
  ]);

  await storageSet({
    [STORAGE_KEYS.hiddenCategories]: [...hiddenCategories],
    [STORAGE_KEYS.hiddenTitleFilters]: [...hiddenTitleFilters],
    [STORAGE_KEYS.knownCategories]: categories,
    [STORAGE_KEYS.defaultSettingsVersion]: DEFAULT_SETTINGS_VERSION
  });
  renderCategories(categories);
  renderTitleFilters();
}

resetButton.addEventListener("click", async () => {
  hiddenCategories = new Set(DEFAULT_HIDDEN_CATEGORIES);
  hiddenTitleFilters = new Set(DEFAULT_HIDDEN_TITLE_FILTERS);
  await saveHiddenCategories();
  await saveHiddenTitleFilters();
  await loadPopup();
});

void loadPopup();
