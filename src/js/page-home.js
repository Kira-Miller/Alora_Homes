// ==========================================================================
// Контроллер главной страницы (index.html)
// ==========================================================================

import {createPropertyCard, openBelarusMapModal, showToast} from './components.js';
import {pluralObjects, t} from './i18n.js';
import {initLayout} from './layout.js';
import {addConsultationRequest, getState, setCurrency, subscribe} from './state.js';
import {getIconSvg, getRealtorPortraitSvg} from './svg-art.js';
import {filterProperties, loadPropertiesFromXml} from './xml-loader.js';

initLayout('home');

let allProperties = [];
let activeDealGroup = 'residential';
let activeFeaturedTab = 'all';

const searchForm = document.getElementById('home-search-form');
const featuredGrid = document.getElementById('featured-grid');
const featuredTabsEl = document.getElementById('featured-tabs');
const countBtn = document.getElementById('home-search-submit');

const REALTORS = [
  {
    nameRu: 'Соболевский Дмитрий Викторович',
    nameEn: 'Dmitry Sobolevsky',
    roleRu: 'Ведущий риэлтор · Жилая недвижимость',
    roleEn: 'Lead Realtor · Residential',
    phone: '+375 (29) 774-52-10',
  },
  {
    nameRu: 'Воронова Елена Сергеевна',
    nameEn: 'Elena Voronova',
    roleRu: 'Эксперт по загородным домам',
    roleEn: 'Country Estate Specialist',
    phone: '+375 (29) 618-33-40',
  },
  {
    nameRu: 'Красовский Андрей Игоревич',
    nameEn: 'Andrey Krasovsky',
    roleRu: 'Риэлтор · Коммерческие объекты',
    roleEn: 'Commercial Real Estate Advisor',
    phone: '+375 (44) 551-88-55',
  },
];

const REVIEWS = [
  {
    authorRu: 'Татьяна М.',
    authorEn: 'Tatiana M.',
    textRu:
      'Огромное спасибо команде Alora Homes! Была непростая сделка по продаже квартиры в Минске с последующей покупкой дома в Ратомке. На каждом этапе нам предлагали чёткие и безопасные решения.',
    textEn:
      'Huge thanks to the Alora Homes team! We had a complex sale in Minsk followed by buying a house in Ratomka. Every step was handled transparently and safely.',
    metaRu: 'Купля-продажа жилья · 17.11.2026',
    metaEn: 'Residential Sale & Purchase · 17.11.2026',
  },
  {
    authorRu: 'Эрнест К.',
    authorEn: 'Ernest K.',
    textRu:
      'Очень доволен работой с Еленой и Дмитрием! Результат превзошёл ожидания: нашли покупателя на коттедж за 3 недели без торга по заниженной цене. Профессиональный подход.',
    textEn:
      'Extremely satisfied with Elena and Dmitry! They found a buyer for our cottage in just 3 weeks at our target valuation. Truly professional brokerage.',
    metaRu: 'Загородная недвижимость · 13.11.2026',
    metaEn: 'Country Property · 13.11.2026',
  },
  {
    authorRu: 'Лобач Алексей',
    authorEn: 'Alexey Lobach',
    textRu:
      'Отличный сервис и понятный личный кабинет! Помогли обменять двухкомнатную квартиру в Гродно на просторную трёшку в новостройке с полным юридическим сопровождением.',
    textEn:
      'Great service and intuitive account tools! Helped us exchange a 2-room apartment in Grodno for a spacious 3-room new build with full legal support.',
    metaRu: 'Обмен недвижимости · 12.11.2026',
    metaEn: 'Property Exchange · 12.11.2026',
  },
];

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

function renderRealtorsAndReviews() {
  const {lang} = getState();
  const realtorsEl = document.getElementById('home-realtors');
  if (realtorsEl) {
    realtorsEl.innerHTML = REALTORS.map(
      (r, idx) => `
      <article class="realtor-card">
        <div class="realtor-card__portrait">
          ${getRealtorPortraitSvg(idx)}
        </div>
        <div class="realtor-card__body">
          <h3 class="realtor-card__name">${lang === 'ru' ? r.nameRu : r.nameEn}</h3>
          <p class="realtor-card__role">${lang === 'ru' ? r.roleRu : r.roleEn}</p>
          <a href="tel:${r.phone.replace(/[^+\d]/g, '')}" class="realtor-card__phone">${getIconSvg('phone', 15)} <span>${r.phone}</span></a>
        </div>
      </article>
    `
    ).join('');
  }

  const reviewsEl = document.getElementById('home-reviews');
  if (reviewsEl) {
    const starsHtml = Array.from({length: 5}, () => getIconSvg('star', 15)).join('');
    reviewsEl.innerHTML = REVIEWS.map(
      (rev) => `
      <article class="review-card">
        <strong>${lang === 'ru' ? rev.authorRu : rev.authorEn}</strong>
        <div class="review-card__stars" aria-label="5 stars" style="display:flex;gap:4px;">${starsHtml}</div>
        <p class="review-card__text">${lang === 'ru' ? rev.textRu : rev.textEn}</p>
        <div class="review-card__meta">${lang === 'ru' ? rev.metaRu : rev.metaEn}</div>
      </article>
    `
    ).join('');
  }
}

function syncSearchCurrencyButtons() {
  const {currency} = getState();
  document.querySelectorAll('[data-search-curr]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.getAttribute('data-search-curr') === currency);
  });
}

function bindHomeInteractions() {
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

  document.getElementById('detect-city-btn')?.addEventListener('click', () => {
    const {lang} = getState();
    const cityInput = document.getElementById('search-city');
    if (cityInput) {
      cityInput.value = lang === 'ru' ? 'Минск' : 'Minsk';
      updateLiveCount();
      showToast(lang === 'ru' ? 'Определён регион: Минск' : 'Detected region: Minsk');
    }
  });

  document.querySelectorAll('[data-search-curr]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('data-search-curr') || 'BYN';
      setCurrency(next);
    });
  });

  searchForm?.addEventListener('input', updateLiveCount);
  searchForm?.addEventListener('change', updateLiveCount);

  document.getElementById('reset-search-btn')?.addEventListener('click', () => {
    searchForm?.reset();
    activeDealGroup = 'residential';
    document.querySelectorAll('[data-deal-tab]').forEach((b, i) =>
      b.classList.toggle('is-active', i === 0)
    );
    updateLiveCount();
  });

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

  document.getElementById('open-map-btn')?.addEventListener('click', () => {
    const matched = filterProperties(allProperties, getSearchFilters());
    openBelarusMapModal(matched.length ? matched : allProperties);
  });

  // Форма консультации «Ответим на ваши вопросы»
  const consultForm = document.getElementById('home-consult-form');
  consultForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const {lang} = getState();
    const intent = consultForm.querySelector('input[name="consult-intent"]:checked')?.value || 'buy';
    const name = document.getElementById('consult-name')?.value.trim() || '';
    const phone = document.getElementById('consult-phone')?.value.trim() || '';
    const city = document.getElementById('consult-city')?.value.trim() || '';

    if (name.length < 2 || phone.length < 7) {
      showToast(lang === 'ru' ? 'Введите имя и номер телефона' : 'Please enter name and phone number');
      return;
    }

    addConsultationRequest({intent, name, phone: `+375 ${phone}`, city});
    consultForm.reset();
    showToast(
      lang === 'ru'
        ? 'Заявка на консультацию принята! Специалист скоро позвонит.'
        : 'Consultation request submitted! A specialist will call shortly.',
      'success'
    );
  });
}

async function initHome() {
  bindHomeInteractions();
  syncSearchCurrencyButtons();
  renderRealtorsAndReviews();

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
    renderRealtorsAndReviews();
    updateLiveCount();
  });
}

initHome();
