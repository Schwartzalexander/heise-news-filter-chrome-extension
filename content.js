(async function () {
  const hiddenAttribute = "data-heise-news-filter-hidden";
  let hiddenCategories = new Set(DEFAULT_HIDDEN_CATEGORIES);
  let knownCategories = new Set(SEEDED_CATEGORIES);
  let observer;

  function findCategory(article) {
    const meta = article.querySelector(".typo-meta.text-accent");

    if (!meta) {
      return "";
    }

    const visibleSpans = [...meta.querySelectorAll("span")]
      .filter((span) => !span.classList.contains("sr-only"))
      .map((span) => normalizeCategory(span.textContent || ""))
      .filter(Boolean);

    return visibleSpans.at(-1) || "";
  }

  function getArticles() {
    return [...document.querySelectorAll('article[data-component="ArchiveTeaser"]')];
  }

  async function rememberCategories(categories) {
    const newCategories = uniqueCategories(categories).filter((category) => !knownCategories.has(category));

    if (!newCategories.length) {
      return;
    }

    knownCategories = new Set(uniqueCategories([...knownCategories, ...newCategories]));

    await storageSet({ [STORAGE_KEYS.knownCategories]: [...knownCategories] });
  }

  function applyFilters() {
    const foundCategories = [];

    for (const article of getArticles()) {
      const category = findCategory(article);
      const shouldHide = category && hiddenCategories.has(category);

      if (category) {
        foundCategories.push(category);
      }

      article.hidden = shouldHide;
      article.toggleAttribute(hiddenAttribute, shouldHide);
    }

    void rememberCategories(foundCategories);
  }

  async function loadSettings() {
    const stored = await storageGet({
      [STORAGE_KEYS.hiddenCategories]: DEFAULT_HIDDEN_CATEGORIES,
      [STORAGE_KEYS.knownCategories]: SEEDED_CATEGORIES
    });

    hiddenCategories = new Set(uniqueCategories(stored[STORAGE_KEYS.hiddenCategories]));
    knownCategories = new Set(uniqueCategories([
      ...SEEDED_CATEGORIES,
      ...stored[STORAGE_KEYS.knownCategories]
    ]));

    await storageSet({ [STORAGE_KEYS.knownCategories]: [...knownCategories] });
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync" || !changes[STORAGE_KEYS.hiddenCategories]) {
      return;
    }

    hiddenCategories = new Set(uniqueCategories(changes[STORAGE_KEYS.hiddenCategories].newValue || []));
    applyFilters();
  });

  await loadSettings();
  applyFilters();

  observer = new MutationObserver(() => applyFilters());
  observer.observe(document.body, { childList: true, subtree: true });
})();
