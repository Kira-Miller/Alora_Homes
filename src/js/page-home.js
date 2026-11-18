// ==========================================================================
// Контроллер главной страницы (index.html)
// ==========================================================================

import {createPropertyCard, openBelarusMapModal, showToast} from './components.js';
import {pluralObjects, t} from './i18n.js';
import {initLayout} from './layout.js';
import {getState, setCurrency, subscribe} from './state.js';
import {filterProperties, loadPropertiesFromXml} from './xml-loader.js';

initLayout('home');

let allProperties = [];
let activeDealGroup = 'residential';
let activeFeaturedTab = 'all';

const searchForm = document.getElementById('home-search-form');
const featuredGrid = document.getElementById('featured-grid');
const featuredTabsEl = document.getElementById('featured-tabs');
const countBtn = document.getElementById('home-search-submit');

function getSearchFilters() {
  const {currency} = getState();
  return {
    dealGroup: activeDealGroup,
    query: document.getElementById('search-city')?.value || '',
    category: document.getElementById('search-category')?.value || 'all',
    priceCurrency: currency,
    priceMin: document.getElementById('search-price-min')?.value || '',
    priceMax: document.getElementById('search-price-max')?.value || '',
    rooms: document.getElementById('search-rooms')?.value || 'any',
    areaMin: document.getElementById('search-area-min')?.value || '',
    areaMax: document.getElementById('search-area-max')?.value || '',
    livingMin: document.getElementById('search-living-min')?.value || '',
    livingMax: document.getElementById('search-living-max')?.value || '',
    plotMin: document.getElementById('search-plot-min')?.value || '',
    plotMax: document.getElementById('search-plot-max')?.value || '',
    mkadMax: document.getElementById('search-mkad-max')?.value || '',
  };
}

function updateLiveCount() {
  if (!countBtn || !allProperties.length) return;
  const {lang} = getState();
  const matched = filterProperties(allProperties, getSearchFilters());
  const word = pluralObjects(matched.length, lang);
  countBtn.textContent = `${t('findObjectsPrefix', lang)} ${matched.length} ${word} →`;
}

function renderFeaturedTabs() {
  if (!featuredTabsEl) return;
  const {lang} = getState();

  const counts = {
    all: allProperties.length,
    apartments: allProperties.filter((p) => p.category === 'apartments').length,
    houses: allProperties.filter((p) => p.category === 'houses').length,
    commercial: allProperties.filter((p) => p.category === 'commercial').length,
    newbuild: allProperties.filter((p) => p.specs.newbuild).length,
  };

  const tabs = [
    {id: 'all', label: `${t('tabAll', lang)} (${counts.all})`},
    {id: 'apartments', label: `${t('tabApt', lang)} (${counts.apartments})`},
    {id: 'houses', label: `${t('tabHouses', lang)} (${counts.houses})`},
    {id: 'commercial', label: `${t('tabCommercialShort', lang)} (${counts.commercial})`},
    {id: 'newbuild', label: `${t('tabNewbuild', lang)} (${counts.newbuild})`},
  ];

  featuredTabsEl.innerHTML = tabs
    .map(
      (tab) =>
        `<button type="button" class="tab-btn ${activeFeaturedTab === tab.id ? 'is-active' : ''}" data-featured-tab="${tab.id}">${tab.label}</button>`
    )
    .join('');

  featuredTabsEl.querySelectorAll('[data-featured-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeFeaturedTab = btn.getAttribute('data-featured-tab') || 'all';
      renderFeaturedTabs();
      renderFeaturedGrid();
    });
  });
}

function renderFeaturedGrid() {
  if (!featuredGrid) return;
  const filtered = filterProperties(allProperties, {category: activeFeaturedTab}).slice(0, 6);
  featuredGrid.innerHTML = '';
  filtered.forEach((prop) => {
    featuredGrid.appendChild(createPropertyCard(prop));
  });
}

function syncSearchCurrencyButtons() {
  const {currency} = getState();
  document.querySelectorAll('[data-search-curr]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.getAttribute('data-search-curr') === currency);
  });
}

function bindHomeInteractions() {
  // Переключение вкладок поиска (Жилая / Коммерческая)
  document.querySelectorAll('[data-deal-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeDealGroup = btn.getAttribute('data-deal-tab') || 'residential';
      document.querySelectorAll('[data-deal-tab]').forEach((b) =>
        b.classList.toggle('is-active', b === btn)
      );
      const catSelect = document.getElementById('search-category');
      if (catSelect) {
        catSelect.value = activeDealGroup === 'commercial' ? 'commercial' : 'all';
      }
      updateLiveCount();
    });
  });

  // Автоопределение города (Минск)
  document.getElementById('detect-city-btn')?.addEventListener('click', () => {
    const {lang} = getState();
    const cityInput = document.getElementById('search-city');
    if (cityInput) {
      cityInput.value = lang === 'ru' ? 'Минск' : 'Minsk';
      updateLiveCount();
      showToast(lang === 'ru' ? 'Определён регион: Минск' : 'Detected region: Minsk');
    }
  });

  // Валюта внутри блока поиска
  document.querySelectorAll('[data-search-curr]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('data-search-curr') || 'BYN';
      setCurrency(next);
    });
  });

  // Живой пересчёт при изменении любого поля формы
  searchForm?.addEventListener('input', updateLiveCount);
  searchForm?.addEventListener('change', updateLiveCount);

  // Сброс фильтров
  document.getElementById('reset-search-btn')?.addEventListener('click', () => {
    searchForm?.reset();
    activeDealGroup = 'all';
    document.querySelectorAll('[data-deal-tab]').forEach((b, i) =>
      b.classList.toggle('is-active', i === 0)
    );
    activeDealGroup = 'residential';
    updateLiveCount();
  });

  // Переход на страницу каталога с параметрами поиска
  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = getSearchFilters();
    const params = new URLSearchParams();
    if (f.query) params.set('query', f.query);
    if (f.category && f.category !== 'all') params.set('category', f.category);
    else if (activeDealGroup === 'commercial') params.set('category', 'commercial');
    if (f.priceMin) params.set('priceMin', f.priceMin);
    if (f.priceMax) params.set('priceMax', f.priceMax);
    if (f.rooms && f.rooms !== 'any') params.set('rooms', f.rooms);
    if (f.areaMin) params.set('areaMin', f.areaMin);
    if (f.areaMax) params.set('areaMax', f.areaMax);
    if (f.mkadMax) params.set('mkadMax', f.mkadMax);
    window.location.href = `./catalog.html?${params.toString()}`;
  });

  // Кнопка "На карте Беларуси"
  document.getElementById('open-map-btn')?.addEventListener('click', () => {
    const matched = filterProperties(allProperties, getSearchFilters());
    openBelarusMapModal(matched.length ? matched : allProperties);
  });
}

async function initHome() {
  bindHomeInteractions();
  syncSearchCurrencyButtons();

  try {
    allProperties = await loadPropertiesFromXml();
    renderFeaturedTabs();
    renderFeaturedGrid();
    updateLiveCount();
  } catch (err) {
    if (featuredGrid) {
      featuredGrid.innerHTML = `<div class="empty-state"><p>Не удалось загрузить XML-каталог объектов.</p></div>`;
    }
    console.error(err);
  }

  subscribe(() => {
    syncSearchCurrencyButtons();
    renderFeaturedTabs();
    renderFeaturedGrid();
    updateLiveCount();
  });
}

initHome();
