const listElement = document.querySelector("#category-list");
const statusElement = document.querySelector("#status");
const resetButton = document.querySelector("#reset-button");
let hiddenCategories = new Set(DEFAULT_HIDDEN_CATEGORIES);
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

function renderCategories(categories) {
  listElement.replaceChildren(...categories.map(createCategoryOption));
}

async function loadPopup() {
  const stored = await storageGet({
    [STORAGE_KEYS.hiddenCategories]: DEFAULT_HIDDEN_CATEGORIES,
    [STORAGE_KEYS.knownCategories]: SEEDED_CATEGORIES
  });

  hiddenCategories = new Set(uniqueCategories(stored[STORAGE_KEYS.hiddenCategories]));
  const categories = uniqueCategories([
    ...SEEDED_CATEGORIES,
    ...stored[STORAGE_KEYS.knownCategories]
  ]);

  await storageSet({ [STORAGE_KEYS.knownCategories]: categories });
  renderCategories(categories);
}

resetButton.addEventListener("click", async () => {
  hiddenCategories = new Set(DEFAULT_HIDDEN_CATEGORIES);
  await saveHiddenCategories();
  await loadPopup();
});

void loadPopup();
