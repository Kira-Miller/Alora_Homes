// ==========================================================================
// Контроллер страницы каталога (catalog.html)
// ==========================================================================

import {createPropertyCard, openBelarusMapModal, showToast} from './components.js';
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

const BELARUS_CITIES = [
  {ru: 'Минск', en: 'Minsk', lat: 53.9006, lon: 27.559, aliases: ['minsk', 'минск']},
  {ru: 'Брест', en: 'Brest', lat: 52.0976, lon: 23.7341, aliases: ['brest', 'брест']},
  {ru: 'Гродно', en: 'Grodno', lat: 53.6694, lon: 23.8131, aliases: ['grodno', 'hrodna', 'гродно']},
  {ru: 'Витебск', en: 'Vitebsk', lat: 55.1848, lon: 30.2016, aliases: ['vitebsk', 'vitsyebsk', 'витебск']},
  {ru: 'Гомель', en: 'Gomel', lat: 52.4345, lon: 30.9754, aliases: ['gomel', 'homyel', 'гомель']},
  {ru: 'Могилёв', en: 'Mogilev', lat: 53.9007, lon: 30.3314, aliases: ['mogilev', 'mahilyow', 'могилёв', 'могилев']},
  {ru: 'Слуцк', en: 'Slutsk', lat: 53.0273, lon: 27.5499, aliases: ['slutsk', 'слуцк']},
  {ru: 'Волковыск', en: 'Volkovysk', lat: 53.1561, lon: 24.4514, aliases: ['volkovysk', 'vawkavysk', 'волковыск']},
  {ru: 'Смиловичи', en: 'Smilovichi', lat: 53.7511, lon: 28.0067, aliases: ['smilovichi', 'smilavichy', 'смиловичи']},
  {ru: 'Смолевичи', en: 'Smolevichi', lat: 54.0289, lon: 28.0819, aliases: ['smolevichi', 'smalyavichy', 'смолевичи']},
  {ru: 'Барановичи', en: 'Baranovichi', lat: 53.1327, lon: 26.0139, aliases: ['baranovichi', 'baranavichy', 'барановичи']},
  {ru: 'Пинск', en: 'Pinsk', lat: 52.1114, lon: 26.1025, aliases: ['pinsk', 'пинск']},
  {ru: 'Полоцк', en: 'Polotsk', lat: 55.4879, lon: 28.7856, aliases: ['polotsk', 'polatsk', 'полоцк']},
  {ru: 'Новополоцк', en: 'Novopolotsk', lat: 55.5318, lon: 28.5987, aliases: ['novopolotsk', 'navapolatsk', 'новополоцк']},
  {ru: 'Борисов', en: 'Borisov', lat: 54.2279, lon: 28.505, aliases: ['borisov', 'barysaw', 'борисов']},
  {ru: 'Бобруйск', en: 'Bobruisk', lat: 53.1384, lon: 29.2214, aliases: ['bobruisk', 'babruysk', 'бобруйск']},
  {ru: 'Лида', en: 'Lida', lat: 53.8879, lon: 25.2997, aliases: ['lida', 'лида']},
  {ru: 'Жлобин', en: 'Zhlobin', lat: 52.8926, lon: 30.024, aliases: ['zhlobin', 'жлобин']},
  {ru: 'Солигорск', en: 'Soligorsk', lat: 52.7875, lon: 27.5414, aliases: ['soligorsk', 'salihorsk', 'солигорск']},
  {ru: 'Молодечно', en: 'Molodechno', lat: 54.3167, lon: 26.85, aliases: ['molodechno', 'maladzyechna', 'молодечно']},
  {ru: 'Орша', en: 'Orsha', lat: 54.5092, lon: 30.4258, aliases: ['orsha', 'vorša', 'орша']},
  {ru: 'Мозырь', en: 'Mozyr', lat: 52.0495, lon: 29.2456, aliases: ['mozyr', 'mazyr', 'мозырь']},
  {ru: 'Ратомка', en: 'Ratomka', lat: 53.9372, lon: 27.3358, aliases: ['ratomka', 'ратомка']},
  {ru: 'Раубичи', en: 'Raubichi', lat: 54.0581, lon: 27.7375, aliases: ['raubichi', 'раубичи']},
];

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getBrowserCoordinates() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    let settled = false;
    const finish = (val) => {
      if (settled) return;
      settled = true;
      resolve(val);
    };
    const timer = setTimeout(() => finish(null), 5500);
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timer);
          finish({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            countryCode: '',
            cityHint: '',
            source: 'gps',
          });
        },
        () => {
          clearTimeout(timer);
          finish(null);
        },
        {enableHighAccuracy: false, timeout: 5000, maximumAge: 300000}
      );
    } catch {
      clearTimeout(timer);
      finish(null);
    }
  });
}

async function fetchGeoJson(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4500);
  try {
    const res = await fetch(url, {signal: ctrl.signal, cache: 'no-store'});
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function getIpCoordinates() {
  const ipWho = await fetchGeoJson('https://ipwho.is/');
  if (ipWho && ipWho.success !== false && Number.isFinite(Number(ipWho.latitude)) && Number.isFinite(Number(ipWho.longitude))) {
    return {
      latitude: Number(ipWho.latitude),
      longitude: Number(ipWho.longitude),
      countryCode: String(ipWho.country_code || '').toUpperCase(),
      cityHint: String(ipWho.city || ''),
      countryName: String(ipWho.country || ''),
      source: 'ip',
    };
  }

  const geoJs = await fetchGeoJson('https://get.geojs.io/v1/ip/geo.json');
  if (geoJs && Number.isFinite(Number(geoJs.latitude)) && Number.isFinite(Number(geoJs.longitude))) {
    return {
      latitude: Number(geoJs.latitude),
      longitude: Number(geoJs.longitude),
      countryCode: String(geoJs.country_code || '').toUpperCase(),
      cityHint: String(geoJs.city || ''),
      countryName: String(geoJs.country || ''),
      source: 'ip',
    };
  }

  const freeIp = await fetchGeoJson('https://freeipapi.com/api/json');
  if (freeIp && Number.isFinite(Number(freeIp.latitude)) && Number.isFinite(Number(freeIp.longitude))) {
    return {
      latitude: Number(freeIp.latitude),
      longitude: Number(freeIp.longitude),
      countryCode: String(freeIp.countryCode || '').toUpperCase(),
      cityHint: String(freeIp.cityName || ''),
      countryName: String(freeIp.countryName || ''),
      source: 'ip',
    };
  }

  return null;
}

function findMatchingBelarusCity(coords) {
  const hint = (coords.cityHint || '').trim().toLowerCase();
  if (hint) {
    const byAlias = BELARUS_CITIES.find((c) => c.aliases?.some((al) => hint.includes(al)));
    if (byAlias) return {city: byAlias, dist: 0};
  }

  let nearest = BELARUS_CITIES[0];
  let minDist = Infinity;
  for (const c of BELARUS_CITIES) {
    const d = haversineKm(coords.latitude, coords.longitude, c.lat, c.lon);
    if (d < minDist) {
      minDist = d;
      nearest = c;
    }
  }
  return {city: nearest, dist: minDist};
}

function populateCatalogCitiesDatalist() {
  const listEl = document.getElementById('belarus-cities-list');
  if (!listEl) return;
  const {lang} = getState();
  listEl.innerHTML = BELARUS_CITIES.map((c) => `<option value="${lang === 'ru' ? c.ru : c.en}"></option>`).join('');
}

function syncCatalogCityUi() {
  const {lang} = getState();
  const clearBtn = document.getElementById('cat-clear-city-btn');
  const val = (queryInput?.value || '').trim();
  if (clearBtn) {
    clearBtn.hidden = val.length === 0;
    clearBtn.setAttribute('aria-label', t('clearCityLabel', lang));
    clearBtn.setAttribute('title', t('clearCityLabel', lang));
  }
}

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

  populateCatalogCitiesDatalist();
  syncCatalogCityUi();

  queryInput?.addEventListener('input', () => {
    syncCatalogCityUi();
    renderCatalog();
  });

  document.getElementById('cat-clear-city-btn')?.addEventListener('click', () => {
    if (queryInput) {
      queryInput.value = '';
      queryInput.focus();
      syncCatalogCityUi();
      renderCatalog();
    }
  });

  const mapPinSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

  document.getElementById('cat-detect-city-btn')?.addEventListener('click', async () => {
    const {lang} = getState();
    const detectBtn = document.getElementById('cat-detect-city-btn');
    if (!detectBtn) return;
    detectBtn.disabled = true;
    detectBtn.innerHTML = `<svg class="is-spinning" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9" opacity="0.3"></circle><path d="M21 12a9 9 0 00-9-9"></path></svg>`;

    try {
      let coords = await getBrowserCoordinates();
      if (!coords) coords = await getIpCoordinates();

      if (!coords) {
        showToast(t('geoDetectDenied', lang));
        return;
      }

      const {city, dist} = findMatchingBelarusCity(coords);
      const isBelarus = coords.countryCode === 'BY' || dist <= 180;

      if (!isBelarus) {
        showToast(t('geoDetectOutside', lang));
        return;
      }

      if (queryInput) {
        const cityName = lang === 'ru' ? city.ru : city.en;
        queryInput.value = cityName;
        syncCatalogCityUi();
        renderCatalog();
        showToast(lang === 'ru' ? `Определён город: ${cityName}` : `Detected city: ${cityName}`, 'success');
      }
    } finally {
      detectBtn.disabled = false;
      detectBtn.innerHTML = mapPinSvg;
    }
  });

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
