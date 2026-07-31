(async function () {
  const hiddenAttribute = "data-heise-news-filter-hidden";
  let hiddenCategories = new Set(DEFAULT_HIDDEN_CATEGORIES);
  let hiddenTitleFilters = new Set(DEFAULT_HIDDEN_TITLE_FILTERS);
  let knownCategories = new Set(SEEDED_CATEGORIES);
  let observer;

  function findCategories(article) {
    const meta = article.querySelector(".typo-meta.text-accent");

    if (!meta) {
      return [];
    }

    return [...meta.querySelectorAll("span")]
      .filter((span) => !span.classList.contains("sr-only"))
      .map((span) => normalizeCategory(span.textContent || ""))
      .filter(Boolean);
  }

  function findTitle(article) {
    return article.querySelector("h3")?.textContent?.replace(/\s+/g, " ").trim() || "";
  }

  function isTitleHidden(title) {
    return TITLE_FILTERS.some((filter) => hiddenTitleFilters.has(filter.id) && filter.pattern.test(title));
  }

  function getArticles() {
    return [...document.querySelectorAll([
      'article[data-component="ArchiveTeaser"]',
      'article[data-component="NewstickerTeaser"]'
    ].join(","))];
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
      const categories = findCategories(article);
      const title = findTitle(article);
      const shouldHide = categories.some((category) => hiddenCategories.has(category)) || isTitleHidden(title);

      foundCategories.push(...categories);

      article.hidden = shouldHide;
      article.toggleAttribute(hiddenAttribute, shouldHide);
    }

    void rememberCategories(foundCategories);
  }

  async function loadSettings() {
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
    knownCategories = new Set(uniqueCategories([
      ...SEEDED_CATEGORIES,
      ...stored[STORAGE_KEYS.knownCategories]
    ]));

    await storageSet({
      [STORAGE_KEYS.hiddenCategories]: [...hiddenCategories],
      [STORAGE_KEYS.hiddenTitleFilters]: [...hiddenTitleFilters],
      [STORAGE_KEYS.knownCategories]: [...knownCategories],
      [STORAGE_KEYS.defaultSettingsVersion]: DEFAULT_SETTINGS_VERSION
    });
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync") {
      return;
    }

    if (changes[STORAGE_KEYS.hiddenCategories]) {
      hiddenCategories = new Set(uniqueCategories(changes[STORAGE_KEYS.hiddenCategories].newValue || []));
    }

    if (changes[STORAGE_KEYS.hiddenTitleFilters]) {
      hiddenTitleFilters = new Set(uniqueTitleFilterIds(changes[STORAGE_KEYS.hiddenTitleFilters].newValue || []));
    }

    if (changes[STORAGE_KEYS.hiddenCategories] || changes[STORAGE_KEYS.hiddenTitleFilters]) {
      applyFilters();
    }
  });

  await loadSettings();
  applyFilters();

  observer = new MutationObserver(() => applyFilters());
  observer.observe(document.body, { childList: true, subtree: true });
})();
