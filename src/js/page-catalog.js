// ==========================================================================
// Контроллер страницы каталога (catalog.html)
// ==========================================================================

import '../scss/main.scss';
import {createPropertyCard, openBelarusMapModal} from './components.js';
import {pluralObjects, t} from './i18n.js';
import {initLayout} from './layout.js';
import {getState, subscribe} from './state.js';
import {filterProperties, loadPropertiesFromXml, sortProperties} from './xml-loader.js';

initLayout('catalog');

let allProperties = [];

const gridEl = document.getElementById('catalog-grid');
const countEl = document.getElementById('catalog-count');
const queryInput = document.getElementById('cat-query');
const regionSelect = document.getElementById('cat-region');
const categorySelect = document.getElementById('cat-category');
const roomsSelect = document.getElementById('cat-rooms');
const priceMaxInput = document.getElementById('cat-price-max');
const sortSelect = document.getElementById('cat-sort');

function applyUrlParamsToControls() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('query') && queryInput) queryInput.value = params.get('query') || '';
  if (params.has('region') && regionSelect) regionSelect.value = params.get('region') || 'all';
  if (params.has('category') && categorySelect) categorySelect.value = params.get('category') || 'all';
  if (params.has('rooms') && roomsSelect) roomsSelect.value = params.get('rooms') || 'any';
  if (params.has('priceMax') && priceMaxInput) priceMaxInput.value = params.get('priceMax') || '';
}

function getCurrentFilters() {
  const {currency} = getState();
  return {
    query: queryInput?.value || '',
    region: regionSelect?.value || 'all',
    category: categorySelect?.value || 'all',
    rooms: roomsSelect?.value || 'any',
    priceMax: priceMaxInput?.value || '',
    priceCurrency: currency,
  };
}

function renderCatalog() {
  if (!gridEl) return;
  const {lang} = getState();
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
  if (queryInput) queryInput.value = '';
  if (regionSelect) regionSelect.value = 'all';
  if (categorySelect) categorySelect.value = 'all';
  if (roomsSelect) roomsSelect.value = 'any';
  if (priceMaxInput) priceMaxInput.value = '';
  if (sortSelect) sortSelect.value = 'default';
  window.history.replaceState({}, '', '/catalog.html');
  renderCatalog();
}

async function initCatalog() {
  applyUrlParamsToControls();

  [queryInput, regionSelect, categorySelect, roomsSelect, priceMaxInput, sortSelect].forEach((el) => {
    el?.addEventListener('input', renderCatalog);
    el?.addEventListener('change', renderCatalog);
  });

  document.getElementById('cat-reset-btn')?.addEventListener('click', resetAllFilters);
  document.getElementById('cat-map-btn')?.addEventListener('click', () => {
    const filtered = filterProperties(allProperties, getCurrentFilters());
    openBelarusMapModal(filtered.length ? filtered : allProperties);
  });

  try {
    allProperties = await loadPropertiesFromXml();
    renderCatalog();
  } catch (err) {
    console.error(err);
  }

  subscribe(() => renderCatalog());
}

initCatalog();
