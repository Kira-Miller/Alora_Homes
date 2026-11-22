// ==========================================================================
// Контроллер страницы каталога (catalog.html)
// ==========================================================================

import {createPropertyCard, openBelarusMapModal} from './components.js';
import {pluralObjects, t} from './i18n.js';
import {initLayout} from './layout.js';
import {getState, subscribe} from './state.js';
import {
  FALLBACK_PROPERTIES,
  filterProperties,
  loadPropertiesFromXml,
  mergeWithUserListings,
  sortProperties,
} from './xml-loader.js';

initLayout('catalog');

let baseProperties = FALLBACK_PROPERTIES;
let allProperties = mergeWithUserListings(FALLBACK_PROPERTIES);

const gridEl = document.getElementById('catalog-grid');
const countEl = document.getElementById('catalog-count');
const dealTypeSelect = document.getElementById('cat-deal-type');
const queryInput = document.getElementById('cat-query');
const regionSelect = document.getElementById('cat-region');
const categorySelect = document.getElementById('cat-category');
const roomsSelect = document.getElementById('cat-rooms');
const priceMaxInput = document.getElementById('cat-price-max');
const priceMinInput = document.getElementById('cat-price-min');
const areaMinInput = document.getElementById('cat-area-min');
const areaMaxInput = document.getElementById('cat-area-max');
const mkadMaxInput = document.getElementById('cat-mkad-max');
const newbuildOnlyInput = document.getElementById('cat-newbuild-only');
const sortSelect = document.getElementById('cat-sort');
const advPanelEl = document.getElementById('cat-advanced-filters');
const moreFiltersBtn = document.getElementById('cat-more-filters-btn');

let advancedOpen = false;

function syncAdvancedToggleUi() {
  const {lang} = getState();
  if (advPanelEl) advPanelEl.hidden = !advancedOpen;
  if (moreFiltersBtn) {
    moreFiltersBtn.setAttribute('aria-expanded', advancedOpen ? 'true' : 'false');
    moreFiltersBtn.textContent = t(advancedOpen ? 'hideFiltersBtn' : 'allFiltersBtn', lang);
  }
}

function applyUrlParamsToControls() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('dealType') && dealTypeSelect) dealTypeSelect.value = params.get('dealType') || 'all';
  if (params.has('query') && queryInput) queryInput.value = params.get('query') || '';
  if (params.has('region') && regionSelect) regionSelect.value = params.get('region') || 'all';
  if (params.has('category') && categorySelect) categorySelect.value = params.get('category') || 'all';
  if (params.has('rooms') && roomsSelect) roomsSelect.value = params.get('rooms') || 'any';
  if (params.has('priceMax') && priceMaxInput) priceMaxInput.value = params.get('priceMax') || '';

  let hasAdvanced = false;
  if (params.has('priceMin') && priceMinInput) {
    priceMinInput.value = params.get('priceMin') || '';
    if (priceMinInput.value) hasAdvanced = true;
  }
  if (params.has('areaMin') && areaMinInput) {
    areaMinInput.value = params.get('areaMin') || '';
    if (areaMinInput.value) hasAdvanced = true;
  }
  if (params.has('areaMax') && areaMaxInput) {
    areaMaxInput.value = params.get('areaMax') || '';
    if (areaMaxInput.value) hasAdvanced = true;
  }
  if (params.has('mkadMax') && mkadMaxInput) {
    mkadMaxInput.value = params.get('mkadMax') || '';
    if (mkadMaxInput.value) hasAdvanced = true;
  }
  if (params.get('newbuildOnly') === 'true' && newbuildOnlyInput) {
    newbuildOnlyInput.checked = true;
    hasAdvanced = true;
  }

  if (hasAdvanced) {
    advancedOpen = true;
  }
  syncAdvancedToggleUi();
}

function getCurrentFilters() {
  const {currency} = getState();
  return {
    dealType: dealTypeSelect?.value || 'all',
    query: queryInput?.value || '',
    region: regionSelect?.value || 'all',
    category: categorySelect?.value || 'all',
    rooms: roomsSelect?.value || 'any',
    priceMin: priceMinInput?.value || '',
    priceMax: priceMaxInput?.value || '',
    areaMin: areaMinInput?.value || '',
    areaMax: areaMaxInput?.value || '',
    mkadMax: mkadMaxInput?.value || '',
    newbuildOnly: Boolean(newbuildOnlyInput?.checked),
    priceCurrency: currency,
  };
}

function renderCatalog() {
  if (!gridEl) return;
  const {lang} = getState();
  syncAdvancedToggleUi();
  const filtered = filterProperties(allProperties, getCurrentFilters());
  const sorted = sortProperties(filtered, sortSelect?.value || 'default');

  if (countEl) {
    countEl.textContent = `${t('foundCountLabel', lang)} ${sorted.length} ${pluralObjects(sorted.length, lang)}`;
  }

  gridEl.innerHTML = '';

  if (!sorted.length) {
    gridEl.style.display = 'block';
    gridEl.innerHTML = `
      <div class="empty-state">
        <h3>${t('emptyCatalogTitle', lang)}</h3>
        <p>${t('emptyCatalogDesc', lang)}</p>
        <button type="button" class="btn btn--primary" id="empty-reset-btn">${t('resetFilters', lang)}</button>
      </div>
    `;
    document.getElementById('empty-reset-btn')?.addEventListener('click', resetAllFilters);
    return;
  }

  gridEl.style.display = '';
  sorted.forEach((prop) => {
    gridEl.appendChild(createPropertyCard(prop));
  });
}

function resetAllFilters() {
  if (dealTypeSelect) dealTypeSelect.value = 'all';
  if (queryInput) queryInput.value = '';
  if (regionSelect) regionSelect.value = 'all';
  if (categorySelect) categorySelect.value = 'all';
  if (roomsSelect) roomsSelect.value = 'any';
  if (priceMinInput) priceMinInput.value = '';
  if (priceMaxInput) priceMaxInput.value = '';
  if (areaMinInput) areaMinInput.value = '';
  if (areaMaxInput) areaMaxInput.value = '';
  if (mkadMaxInput) mkadMaxInput.value = '';
  if (newbuildOnlyInput) newbuildOnlyInput.checked = false;
  if (sortSelect) sortSelect.value = 'default';
  window.history.replaceState({}, '', './catalog.html');
  renderCatalog();
}

function openFilteredMap() {
  const filtered = filterProperties(allProperties, getCurrentFilters());
  openBelarusMapModal(filtered.length ? filtered : allProperties, allProperties);
}

async function initCatalog() {
  applyUrlParamsToControls();

  [
    dealTypeSelect,
    queryInput,
    regionSelect,
    categorySelect,
    roomsSelect,
    priceMinInput,
    priceMaxInput,
    areaMinInput,
    areaMaxInput,
    mkadMaxInput,
    newbuildOnlyInput,
    sortSelect,
  ].forEach((el) => {
    el?.addEventListener('input', renderCatalog);
    el?.addEventListener('change', renderCatalog);
  });

  moreFiltersBtn?.addEventListener('click', () => {
    advancedOpen = !advancedOpen;
    syncAdvancedToggleUi();
  });

  document.getElementById('cat-reset-btn')?.addEventListener('click', resetAllFilters);
  document.getElementById('cat-map-btn')?.addEventListener('click', openFilteredMap);
  document.getElementById('cat-map-bar-btn')?.addEventListener('click', openFilteredMap);

  renderCatalog();

  try {
    const loaded = await loadPropertiesFromXml();
    baseProperties = loaded.filter((p) => !p.isUserListing);
    allProperties = mergeWithUserListings(baseProperties);
    renderCatalog();
  } catch (err) {
    console.error(err);
  }

  subscribe(() => {
    allProperties = mergeWithUserListings(baseProperties);
    renderCatalog();
  });
}

initCatalog();
