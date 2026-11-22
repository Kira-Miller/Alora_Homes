// ==========================================================================
// Контроллер главной страницы (index.html)
// ==========================================================================

import {createPropertyCard, openBelarusMapModal, showToast} from './components.js';
import {formatPrices, pluralObjects, t} from './i18n.js';
import {initLayout, openGuestGateModal} from './layout.js';
import {REALTORS} from './realtors-data.js';
import {addConsultationRequest, addUserReview, getState, isGuest, setCurrency, subscribe} from './state.js';
import {getIconSvg, getRealtorPortraitSvg} from './svg-art.js';
import {
  clearFormErrors,
  setFieldError,
  syncProfileAutofill,
  validateBelarusPhone,
  validateName,
  attachPhoneMask,
} from './validation.js';
import {FALLBACK_PROPERTIES, filterProperties, loadPropertiesFromXml, mergeWithUserListings} from './xml-loader.js';

initLayout('home');

let baseProperties = FALLBACK_PROPERTIES;
let allProperties = mergeWithUserListings(FALLBACK_PROPERTIES);
let activeDealType = 'all';
let activeDealGroup = 'all';
let activeFeaturedTab = 'all';
let activeReviewCategory = 'all';
let featuredPage = 0;
const FEATURED_PAGE_SIZE = 6;

const SALES_CASES = [
  {
    cityRu: 'Минск · Новая Боровая',
    cityEn: 'Minsk · Novaya Borovaya',
    titleRu: '3-комнатная квартира в закрытом квартале',
    titleEn: '3-Room Apartment in Gated Quarter',
    days: 18,
    beforeByn: 512000,
    beforeUsd: 158500,
    afterByn: 555500,
    afterUsd: 172000,
    gainPct: '+8.5%',
    noteRu: 'Хоум-стейджинг, 3D-тур и торги с 4 претендентами без снижения стартовой цены.',
    noteEn: 'Home staging, 3D tour, and 4 qualified offers without discounting.',
  },
  {
    cityRu: 'Минский р-н · Ратомка',
    cityEn: 'Minsk District · Ratomka',
    titleRu: 'Коттедж 210 м² у соснового леса',
    titleEn: '210 m² Pine-Edge Cottage',
    days: 26,
    beforeByn: 823600,
    beforeUsd: 255000,
    afterByn: 891500,
    afterUsd: 276000,
    gainPct: '+8.2%',
    noteRu: 'Полный аудит техдокументов БТИ до показа и таргетированная кампания среди IT-покупателей.',
    noteEn: 'Pre-viewing BTI legal audit and targeted campaign among tech-sector buyers.',
  },
  {
    cityRu: 'Гродно · Центр',
    cityEn: 'Grodno · Center',
    titleRu: 'Сталинка с высокими потолками + трейд-ин',
    titleEn: 'High-Ceiling Residence + Trade-In',
    days: 21,
    beforeByn: 306800,
    beforeUsd: 95000,
    afterByn: 331000,
    afterUsd: 102500,
    gainPct: '+7.9%',
    noteRu: 'Синхронизировали встречную сделку за 3 недели с оплатой комиссии строго по факту расчёта.',
    noteEn: 'Synchronized trade-in chain in 3 weeks with zero upfront brokerage fee.',
  },
];

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

const searchForm = document.getElementById('home-search-form');
const featuredGrid = document.getElementById('featured-grid');
const featuredTabsEl = document.getElementById('featured-tabs');
const featuredPagerTopEl = document.getElementById('featured-pager-top');
const featuredPagerBottomEl = document.getElementById('featured-pager-bottom');
const countBtn = document.getElementById('home-search-submit');


const REVIEWS = [
  {
    category: 'houses',
    authorRu: 'Татьяна М.',
    authorEn: 'Tatiana M.',
    textRu:
      'Огромное спасибо команде Alora Homes! Была непростая сделка по продаже квартиры в Минске с последующей покупкой дома в Ратомке. На каждом этапе нам предлагали чёткие и безопасные решения.',
    textEn:
      'Huge thanks to the Alora Homes team! We had a complex sale in Minsk followed by buying a house in Ratomka. Every step was handled transparently and safely.',
    metaRu: 'Купля-продажа жилья · Минск — Ратомка · 17.11.2026',
    metaEn: 'Residential Sale & Purchase · Minsk — Ratomka · 17.11.2026',
  },
  {
    category: 'houses',
    authorRu: 'Эрнест К.',
    authorEn: 'Ernest K.',
    textRu:
      'Очень доволен работой с Ксенией и Алисой! Результат превзошёл ожидания: нашли покупателя на коттедж за 3 недели без торга по заниженной цене. Профессиональный подход.',
    textEn:
      'Extremely satisfied with Kseniya and Alisa! They found a buyer for our cottage in just 3 weeks at our target valuation. Truly professional brokerage.',
    metaRu: 'Загородная недвижимость · Тарасово · 13.11.2026',
    metaEn: 'Country Property · Tarasovo · 13.11.2026',
  },
  {
    category: 'exchange',
    authorRu: 'Лобач Алексей',
    authorEn: 'Alexey Lobach',
    textRu:
      'Отличный сервис и понятный личный кабинет! Помогли обменять двухкомнатную квартиру в Гродно на просторную трёшку в новостройке с полным юридическим сопровождением.',
    textEn:
      'Great service and intuitive account tools! Helped us exchange a 2-room apartment in Grodno for a spacious 3-room new build with full legal support.',
    metaRu: 'Обмен недвижимости · Гродно · 12.11.2026',
    metaEn: 'Property Exchange · Grodno · 12.11.2026',
  },
  {
    category: 'houses',
    authorRu: 'Ирина и Виктор Савицкие',
    authorEn: 'Irina & Victor Savitsky',
    textRu:
      'Искали дом для родителей в Слуцке с готовым участком и баней. Юлия организовала 4 показа за один день и проверила все документы БТИ до задатка.',
    textEn:
      'We were looking for a quiet house in Slutsk for our parents. Yulia arranged 4 viewings in one day and audited every land and building record.',
    metaRu: 'Покупка дома · Слуцк · 09.11.2026',
    metaEn: 'House Purchase · Slutsk · 09.11.2026',
  },
  {
    category: 'commercial',
    authorRu: 'Дмитрий Веремейчик',
    authorEn: 'Dmitry Veremeichik',
    textRu:
      'Приобретали помещение под кофейню в Бресте. Порадовала детальная аналитика по трафику и расчёт окупаемости, а также быстрая регистрация договора.',
    textEn:
      'Acquired a retail space for a coffee shop in Brest. Impressed by the foot-traffic analytics, ROI breakdown, and seamless contract registration.',
    metaRu: 'Коммерческая недвижимость · Брест · 04.11.2026',
    metaEn: 'Commercial Real Estate · Brest · 04.11.2026',
  },
  {
    category: 'apartments',
    authorRu: 'Анна Ковалёва',
    authorEn: 'Anna Kovaleva',
    textRu:
      'Продавали квартиру в Витебске дистанционно. Агентство взяло на себя фотосъёмку, показы и сопровождение сделки — приехали только на подписание у нотариуса.',
    textEn:
      'Sold our apartment in Vitebsk remotely. The agency handled staging, photos, and tours — we only flew in for final signing.',
    metaRu: 'Дистанционная продажа · Витебск · 28.10.2026',
    metaEn: 'Remote Sale · Vitebsk · 28.10.2026',
  },
  {
    category: 'apartments',
    authorRu: 'Максим Русецкий',
    authorEn: 'Maxim Rusetsky',
    textRu:
      'На сайте сразу сравнили четыре новостройки в Минске и Барановичах по планировке этажей и цене за квадрат. Записались на показ в один клик — всё чётко и вовремя.',
    textEn:
      'Compared four new builds across Minsk and Baranovichi right on the site using interactive floor plans. Booked a tour in one click.',
    metaRu: 'Покупка новостройки · Барановичи · 21.10.2026',
    metaEn: 'New Build Purchase · Baranovichi · 21.10.2026',
  },
  {
    category: 'apartments',
    authorRu: 'Светлана Герасимова',
    authorEn: 'Svetlana Gerasimova',
    textRu:
      'Оценка стоимости квартиры в Могилёве заняла меньше суток и совпала с реальной ценой продажи на 98%. Никаких скрытых доплат после закрытия сделки.',
    textEn:
      'The valuation for our Mogilev apartment took less than 24 hours and matched our final closing price within 2%. Zero hidden fees.',
    metaRu: 'Оценка и продажа · Могилёв · 15.10.2026',
    metaEn: 'Valuation & Sale · Mogilev · 15.10.2026',
  },
  {
    category: 'houses',
    authorRu: 'Олег Статкевич',
    authorEn: 'Oleg Statkevich',
    textRu:
      'Благодарю за помощь с покупкой уютного коттеджа в Волковыске. Редкий случай, когда агентство действительно защищает интересы клиента на каждом шаге.',
    textEn:
      'Grateful for help buying a cozy cottage in Volkovysk. A rare agency that truly advocates for the buyer at every step.',
    metaRu: 'Загородная недвижимость · Волковыск · 08.10.2026',
    metaEn: 'Country Property · Volkovysk · 08.10.2026',
    rating: 5,
  },
  {
    category: 'commercial',
    authorRu: 'Павел Демидович',
    authorEn: 'Pavel Demidovich',
    textRu:
      'Арендовали с последующим выкупом офис для IT-команды на Кальварийской. Юлия Свирко за два дня согласовала каникулы на ремонт и проверила все мощности БЦ.',
    textEn:
      'Leased-to-own an IT office on Kalvariyskaya St. Yulia Svirko negotiated a rent-free fit-out period and verified all building specs in two days.',
    metaRu: 'Коммерческий офис · Минск · 05.11.2026',
    metaEn: 'Commercial Office · Minsk · 05.11.2026',
    rating: 5,
  },
  {
    category: 'exchange',
    authorRu: 'Марина Хомич',
    authorEn: 'Marina Khomich',
    textRu:
      'Провели встречный обмен дома в Смиловичах и квартиры в Минске за 19 дней без задержек по расчётам. Всегда были на связи и заранее предупреждали о каждом документе.',
    textEn:
      'Completed a synchronized exchange of a house in Smilovichi and an apartment in Minsk in 19 days with zero settlement delays.',
    metaRu: 'Обмен недвижимости · Смиловичи — Минск · 02.11.2026',
    metaEn: 'Property Exchange · Smilovichi — Minsk · 02.11.2026',
    rating: 5,
  },
  {
    category: 'apartments',
    authorRu: 'Евгений Макаров',
    authorEn: 'Evgeny Makarov',
    textRu:
      'Хорошее агентство, помогли быстро подобрать квартиру в Минске. Снижаю одну звезду только за то, что в офисе было немного людно в день подписания договора, но в остальном всё на высоте.',
    textEn:
      'Good agency, helped quickly find an apartment in Minsk. Deducting one star only because the office was a bit crowded on signing day, but otherwise top notch.',
    metaRu: 'Покупка квартиры · Минск · 14.11.2026',
    metaEn: 'Apartment Purchase · Minsk · 14.11.2026',
    rating: 4,
  },
  {
    category: 'houses',
    authorRu: 'Наталья Воронова',
    authorEn: 'Natalia Voronova',
    textRu:
      'Продавали загородный дом через Алису Шестак. Сделка прошла успешно, профессионально и без нервов. Хотелось бы чуть больше гибкости по времени показов, но результат отличный!',
    textEn:
      'Sold our country house through Alisa Shestak. Smooth and professional. Would have liked slightly more flexibility on viewing times, but great results!',
    metaRu: 'Продажа дома · Минский р-н · 10.11.2026',
    metaEn: 'House Sale · Minsk Region · 10.11.2026',
    rating: 4,
  },
  {
    category: 'apartments',
    authorRu: 'Артур Семёнов',
    authorEn: 'Arthur Semyonov',
    textRu:
      'Слишком крутые и всё оформляют в два счёта — аж бесят! Хотел придраться хоть к чему-нибудь или поторговаться, а они всё сделали идеально и быстрее, чем я успел выпить кофе. Невозможно работать с такими профессионалами!',
    textEn:
      'Too cool and fast, which is annoying! Wanted to find something to nitpick or bargain over, but they did everything perfectly before I finished my coffee.',
    metaRu: 'Покупка апартаментов · Минск · 16.11.2026',
    metaEn: 'Apartment Purchase · Minsk · 16.11.2026',
    rating: 1,
  },
];

function getSearchFilters() {
  const {currency} = getState();
  return {
    dealType: activeDealType,
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
  const {lang} = getState();
  const allTabBtn = document.querySelector('[data-deal-tab="all"]');
  if (allTabBtn) {
    allTabBtn.textContent = `${t('tabAllObjectsLabel', lang)} (${allProperties.length})`;
  }
  if (!countBtn || !allProperties.length) return;
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
    rent: allProperties.filter((p) => (p.dealType || 'sale') === 'rent').length,
  };

  const tabs = [
    {id: 'all', label: `${t('tabAll', lang)} (${counts.all})`},
    {id: 'apartments', label: `${t('tabApt', lang)} (${counts.apartments})`},
    {id: 'houses', label: `${t('tabHouses', lang)} (${counts.houses})`},
    {id: 'commercial', label: `${t('tabCommercialShort', lang)} (${counts.commercial})`},
    {id: 'newbuild', label: `${t('tabNewbuild', lang)} (${counts.newbuild})`},
    {id: 'rent', label: `${t('tabRent', lang)} (${counts.rent})`},
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
      featuredPage = 0;
      renderFeaturedTabs();
      renderFeaturedGrid();
    });
  });
}

function renderFeaturedPagerControls(totalPages) {
  const {lang} = getState();
  const pagerTargets = [featuredPagerTopEl, featuredPagerBottomEl];

  if (totalPages <= 1) {
    pagerTargets.forEach((el) => {
      if (el) el.innerHTML = '';
    });
    return;
  }

  const dotsHtml = Array.from(
    {length: totalPages},
    (_, idx) => `
      <button
        type="button"
        class="pager-dot ${idx === featuredPage ? 'is-active' : ''}"
        data-featured-dot="${idx}"
        aria-label="${idx + 1} / ${totalPages}"
      ></button>
    `
  ).join('');

  if (featuredPagerTopEl) {
    featuredPagerTopEl.innerHTML = `
      <button type="button" class="pager-arrow" data-featured-step="-1" aria-label="${t('prevSlide', lang)}" title="${t('prevSlide', lang)}">
        ${getIconSvg('chevron-left', 18)}
      </button>
      <span class="featured-pager__counter">${featuredPage + 1} / ${totalPages}</span>
      <button type="button" class="pager-arrow" data-featured-step="1" aria-label="${t('nextSlide', lang)}" title="${t('nextSlide', lang)}">
        ${getIconSvg('chevron-right', 18)}
      </button>
    `;
  }

  if (featuredPagerBottomEl) {
    featuredPagerBottomEl.innerHTML = `
      <button type="button" class="pager-arrow" data-featured-step="-1" aria-label="${t('prevSlide', lang)}">
        ${getIconSvg('chevron-left', 18)}
      </button>
      <div class="pager-dots">${dotsHtml}</div>
      <button type="button" class="pager-arrow" data-featured-step="1" aria-label="${t('nextSlide', lang)}">
        ${getIconSvg('chevron-right', 18)}
      </button>
    `;
  }

  pagerTargets.forEach((container) => {
    if (!container) return;
    container.querySelectorAll('[data-featured-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const step = Number(btn.getAttribute('data-featured-step')) || 1;
        featuredPage = (featuredPage + step + totalPages) % totalPages;
        renderFeaturedGrid();
      });
    });
    container.querySelectorAll('[data-featured-dot]').forEach((dot) => {
      dot.addEventListener('click', () => {
        featuredPage = Number(dot.getAttribute('data-featured-dot')) || 0;
        renderFeaturedGrid();
      });
    });
  });
}

function renderFeaturedGrid() {
  if (!featuredGrid) return;
  const filters = activeFeaturedTab === 'rent' ? {dealType: 'rent'} : {category: activeFeaturedTab};
  const filtered = filterProperties(allProperties, filters);
  const totalPages = Math.max(1, Math.ceil(filtered.length / FEATURED_PAGE_SIZE));
  if (featuredPage >= totalPages) featuredPage = 0;

  const start = featuredPage * FEATURED_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + FEATURED_PAGE_SIZE);

  featuredGrid.innerHTML = '';
  pageItems.forEach((prop) => {
    featuredGrid.appendChild(createPropertyCard(prop));
  });

  renderFeaturedPagerControls(totalPages);
}

function renderMarketPulseAndCases() {
  const {lang, currency} = getState();
  const pulseEl = document.getElementById('home-market-pulse');
  if (pulseEl) {
    const minskSqm = formatPrices(5290, 1640, currency, 'sale', lang);
    const regSqm = formatPrices(3290, 1020, currency, 'sale', lang);
    const unitSqm = lang === 'ru' ? '/м²' : '/m²';
    const items = [
      {
        value: `${minskSqm.primary}${unitSqm}`,
        sub: `${minskSqm.secondary}${unitSqm}`,
        label: t('pulseMinskSqm', lang),
      },
      {
        value: `${regSqm.primary}${unitSqm}`,
        sub: `${regSqm.secondary}${unitSqm}`,
        label: t('pulseRegionsSqm', lang),
      },
      {
        value: '+6.1%',
        sub: lang === 'ru' ? 'Ноябрь 2025 → Ноябрь 2026' : 'Nov 2025 → Nov 2026',
        label: t('pulseYoY', lang),
      },
      {
        value: lang === 'ru' ? '34 дня' : '34 days',
        sub: lang === 'ru' ? 'По закрытым сделкам Alora' : 'Across closed Alora deals',
        label: t('pulseAvgDays', lang),
      },
    ];
    pulseEl.innerHTML = items
      .map(
        (it) => `
        <article class="pulse-card">
          <div class="pulse-card__val">${it.value}</div>
          <div class="pulse-card__sub">${it.sub}</div>
          <div class="pulse-card__label">${it.label}</div>
        </article>
      `
      )
      .join('');
  }

  const casesEl = document.getElementById('home-cases');
  if (casesEl) {
    casesEl.innerHTML = SALES_CASES.map((c) => {
      const beforeP = formatPrices(c.beforeByn, c.beforeUsd, currency, 'sale', lang);
      const afterP = formatPrices(c.afterByn, c.afterUsd, currency, 'sale', lang);
      const daysLabel = lang === 'ru' ? `Продано за ${c.days} дн.` : `Sold in ${c.days} days`;
      return `
        <article class="case-card">
          <div class="case-card__meta">
            <span>${lang === 'ru' ? c.cityRu : c.cityEn}</span>
            <span aria-hidden="true">·</span>
            <span>${daysLabel}</span>
          </div>
          <h3 class="case-card__title">${lang === 'ru' ? c.titleRu : c.titleEn}</h3>
          <div class="case-card__delta">
            <div>
              <span>${lang === 'ru' ? 'Было' : 'Initial'}</span>
              <s>${beforeP.primary}</s>
            </div>
            <div class="case-card__arrow" aria-hidden="true">→</div>
            <div>
              <span>${lang === 'ru' ? 'Продано' : 'Final Sale'}</span>
              <strong>${afterP.primary}</strong>
            </div>
            <div class="case-card__gain">
              <span>${lang === 'ru' ? 'Выгода' : 'Gain'}</span>
              <strong>${c.gainPct}</strong>
            </div>
          </div>
          <p class="case-card__note">${lang === 'ru' ? c.noteRu : c.noteEn}</p>
        </article>
      `;
    }).join('');
  }
}

function getAllCombinedReviews() {
  const userRevs = getState().userReviews || [];
  return [...userRevs, ...REVIEWS];
}

function renderReviewsTabs() {
  const tabsEl = document.getElementById('reviews-filter-tabs');
  if (!tabsEl) return;
  const {lang} = getState();
  const allReviews = getAllCombinedReviews();

  const counts = {
    all: allReviews.length,
    apartments: allReviews.filter((r) => r.category === 'apartments').length,
    houses: allReviews.filter((r) => r.category === 'houses').length,
    commercial: allReviews.filter((r) => r.category === 'commercial').length,
    exchange: allReviews.filter((r) => r.category === 'exchange').length,
  };

  const tabs = [
    {id: 'all', label: `${t('tabAll', lang)} (${counts.all})`},
    {id: 'apartments', label: `${t('tabApt', lang)} (${counts.apartments})`},
    {id: 'houses', label: `${t('tabHouses', lang)} (${counts.houses})`},
    {id: 'commercial', label: `${t('tabCommercialShort', lang)} (${counts.commercial})`},
    {id: 'exchange', label: `${t('intentExchange', lang)} (${counts.exchange})`},
  ];

  tabsEl.innerHTML = tabs
    .map(
      (tab) =>
        `<button type="button" class="tab-btn ${activeReviewCategory === tab.id ? 'is-active' : ''}" data-review-cat="${tab.id}">${tab.label}</button>`
    )
    .join('');

  tabsEl.querySelectorAll('[data-review-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeReviewCategory = btn.getAttribute('data-review-cat') || 'all';
      renderRealtorsAndReviews();
      const reviewsEl = document.getElementById('home-reviews');
      if (reviewsEl) {
        reviewsEl.scrollLeft = 0;
        syncReviewCarouselButtons();
      }
    });
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
          <img
            src="${r.image}"
            alt="${lang === 'ru' ? r.nameRu : r.nameEn}"
            loading="lazy"
            decoding="async"
            referrerpolicy="no-referrer"
            onerror="this.style.display='none';this.nextElementSibling.style.display='block';"
          />
          <div style="display:none;width:100%;height:100%;">${getRealtorPortraitSvg(idx)}</div>
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

  renderReviewsTabs();

  const reviewsEl = document.getElementById('home-reviews');
  if (reviewsEl) {
    const allReviews = getAllCombinedReviews();
    const visibleReviews =
      activeReviewCategory === 'all'
        ? allReviews
        : allReviews.filter((r) => r.category === activeReviewCategory);

    reviewsEl.innerHTML = visibleReviews
      .map((rev) => {
        const rating = rev.rating || 5;
        const starsHtml = Array.from(
          {length: 5},
          (_, idx) =>
            `<span style="color:${idx < rating ? '#f59e0b' : 'var(--border-subtle)'};display:inline-flex;">${getIconSvg('star', 15)}</span>`
        ).join('');
        return `
      <article class="review-card">
        <strong>${lang === 'ru' ? rev.authorRu : rev.authorEn}</strong>
        <div class="review-card__stars" aria-label="${rating} stars" style="display:flex;gap:4px;">${starsHtml}</div>
        <p class="review-card__text">${lang === 'ru' ? rev.textRu : rev.textEn}</p>
        <div class="review-card__meta">${lang === 'ru' ? rev.metaRu : rev.metaEn}</div>
      </article>
    `;
      })
      .join('');
    syncReviewCarouselButtons();
  }
}

function openReviewModal() {
  if (isGuest()) {
    openGuestGateModal('review');
    return;
  }

  let modal = document.getElementById('review-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'review-modal';
    modal.className = 'modal-backdrop';
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('is-open');
    });
    document.body.appendChild(modal);
  }

  const {lang} = getState();
  let selectedRating = 5;

  modal.innerHTML = `
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-label="${t('reviewModalTitle', lang)}">
      <div class="modal-dialog__header">
        <h2 class="modal-dialog__title">${t('reviewModalTitle', lang)}</h2>
        <button type="button" class="modal-dialog__close js-close-rev" aria-label="Close">✕</button>
      </div>

      <form id="new-review-form" novalidate style="display:flex;flex-direction:column;gap:14px;">
        <div class="field">
          <label class="field__label" for="rev-category">${t('reviewCategoryLabel', lang)}</label>
          <select id="rev-category" class="field__control">
            <option value="apartments">${t('tabApt', lang)}</option>
            <option value="houses">${t('tabHouses', lang)}</option>
            <option value="commercial">${t('tabCommercialShort', lang)}</option>
            <option value="exchange">${t('intentExchange', lang)}</option>
          </select>
        </div>

        <div class="field">
          <label class="field__label" for="rev-city">${t('reviewCityLabel', lang)}</label>
          <input
            id="rev-city"
            class="field__control"
            type="text"
            list="belarus-cities-list"
            placeholder="${t('reviewCityPlaceholder', lang)}"
          />
        </div>

        <div class="field">
          <span class="field__label">${t('reviewRatingLabel', lang)}</span>
          <div class="review-stars-picker" id="rev-stars-picker" role="radiogroup" aria-label="${t('reviewRatingLabel', lang)}">
            ${[1, 2, 3, 4, 5]
              .map(
                (val) => `
              <button type="button" class="review-star-btn is-filled" data-rate="${val}" aria-label="${val} / 5">
                ${getIconSvg('star', 22)}
              </button>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="field">
          <label class="field__label" for="rev-text">${t('reviewTextLabel', lang)}</label>
          <textarea
            id="rev-text"
            class="field__control"
            rows="4"
            required
            placeholder="${t('reviewTextPlaceholder', lang)}"
            style="resize:vertical;min-height:96px;"
          ></textarea>
        </div>

        <button type="submit" class="btn btn--primary btn--full">
          ${t('submitReviewBtn', lang)}
        </button>
      </form>
    </div>
  `;

  const syncStars = () => {
    modal.querySelectorAll('.review-star-btn').forEach((btn) => {
      const val = Number(btn.getAttribute('data-rate')) || 5;
      btn.classList.toggle('is-filled', val <= selectedRating);
    });
  };

  modal.querySelectorAll('.review-star-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedRating = Number(btn.getAttribute('data-rate')) || 5;
      syncStars();
    });
  });

  modal.querySelector('.js-close-rev')?.addEventListener('click', () => {
    modal.classList.remove('is-open');
  });

  const revForm = modal.querySelector('#new-review-form');
  const revTextEl = modal.querySelector('#rev-text');
  revTextEl?.addEventListener('input', () => setFieldError(revTextEl, ''));

  revForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors(revForm);
    const textVal = revTextEl?.value.trim() || '';
    if (textVal.length < 10) {
      setFieldError(
        revTextEl,
        lang === 'ru' ? 'Напишите отзыв (минимум 10 символов)' : 'Please write at least 10 characters'
      );
      revTextEl?.focus();
      return;
    }

    const catVal = modal.querySelector('#rev-category')?.value || 'apartments';
    const cityVal = modal.querySelector('#rev-city')?.value || '';
    activeReviewCategory = 'all';
    addUserReview({
      category: catVal,
      city: cityVal,
      rating: selectedRating,
      text: textVal,
    });

    modal.classList.remove('is-open');
    const reviewsEl = document.getElementById('home-reviews');
    if (reviewsEl) reviewsEl.scrollLeft = 0;
    showToast(
      lang === 'ru' ? 'Спасибо! Ваш отзыв опубликован.' : 'Thank you! Your review has been published.',
      'success'
    );
  });

  modal.classList.add('is-open');
  revTextEl?.focus();
}

function populateCityDatalist() {
  const listEl = document.getElementById('belarus-cities-list');
  if (!listEl) return;
  const {lang} = getState();
  listEl.innerHTML = BELARUS_CITIES.map((c) => `<option value="${lang === 'ru' ? c.ru : c.en}"></option>`).join('');
}

function syncCityUi() {
  const {lang} = getState();
  const cityInput = document.getElementById('search-city');
  const clearBtn = document.getElementById('clear-city-btn');
  const currentVal = (cityInput?.value || '').trim();
  const currentLower = currentVal.toLowerCase();

  if (clearBtn) {
    clearBtn.hidden = currentVal.length === 0;
    clearBtn.setAttribute('aria-label', t('clearCityLabel', lang));
    clearBtn.setAttribute('title', t('clearCityLabel', lang));
  }

  document.querySelectorAll('[data-quick-city]').forEach((btn) => {
    const ru = btn.getAttribute('data-city-ru');
    const en = btn.getAttribute('data-city-en');
    if (ru && en) {
      btn.textContent = lang === 'ru' ? ru : en;
    }
    const isAllBtn = !ru && !en;
    const isActive = isAllBtn
      ? currentVal === ''
      : currentLower === (ru || '').toLowerCase() || currentLower === (en || '').toLowerCase();
    btn.classList.toggle('is-active', isActive);
  });
}

function syncReviewCarouselButtons() {
  const reviewsEl = document.getElementById('home-reviews');
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');
  if (!reviewsEl || !prevBtn || !nextBtn) return;

  const maxScroll = Math.max(0, reviewsEl.scrollWidth - reviewsEl.clientWidth - 4);
  prevBtn.disabled = reviewsEl.scrollLeft <= 4;
  nextBtn.disabled = reviewsEl.scrollLeft >= maxScroll;
}

function syncSearchCurrencyButtons() {
  const {currency} = getState();
  document.querySelectorAll('[data-search-curr]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.getAttribute('data-search-curr') === currency);
  });
}

function bindHomeInteractions() {
  document.querySelectorAll('[data-deal-type]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeDealType = btn.getAttribute('data-deal-type') || 'all';
      document.querySelectorAll('[data-deal-type]').forEach((b) =>
        b.classList.toggle('is-active', b === btn)
      );
      updateLiveCount();
    });
  });

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

  const cityInput = document.getElementById('search-city');
  const clearBtn = document.getElementById('clear-city-btn');
  const detectBtn = document.getElementById('detect-city-btn');

  cityInput?.addEventListener('input', () => syncCityUi());

  clearBtn?.addEventListener('click', () => {
    if (cityInput) {
      cityInput.value = '';
      cityInput.focus();
      syncCityUi();
      updateLiveCount();
    }
  });

  document.querySelectorAll('[data-quick-city]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!cityInput) return;
      const {lang} = getState();
      const ru = btn.getAttribute('data-city-ru');
      const en = btn.getAttribute('data-city-en');
      cityInput.value = ru && en ? (lang === 'ru' ? ru : en) : '';
      syncCityUi();
      updateLiveCount();
    });
  });

  detectBtn?.addEventListener('click', async () => {
    const {lang} = getState();
    detectBtn.disabled = true;
    detectBtn.textContent = t('geoDetecting', lang);

    try {
      let coords = await getBrowserCoordinates();
      if (!coords) {
        coords = await getIpCoordinates();
      }

      if (!coords) {
        showToast(t('geoDetectDenied', lang));
        return;
      }

      const {city, dist} = findMatchingBelarusCity(coords);
      const isBelarus = coords.countryCode === 'BY' || dist <= 180;

      if (!isBelarus) {
        const place = [coords.cityHint, coords.countryName].filter(Boolean).join(', ');
        showToast(
          place
            ? lang === 'ru'
              ? `Локация (${place}) вне Беларуси — выберите город ниже или введите вручную`
              : `Detected (${place}) is outside Belarus — pick a city below or type manually`
            : t('geoDetectOutside', lang)
        );
        return;
      }

      if (cityInput) {
        const cityName = lang === 'ru' ? city.ru : city.en;
        cityInput.value = cityName;
        syncCityUi();
        updateLiveCount();
        showToast(
          lang === 'ru' ? `Определён город: ${cityName}` : `Detected city: ${cityName}`,
          'success'
        );
      }
    } finally {
      detectBtn.disabled = false;
      detectBtn.textContent = t('detectCity', getState().lang);
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
    activeDealType = 'all';
    activeDealGroup = 'all';
    document.querySelectorAll('[data-deal-type]').forEach((b, i) =>
      b.classList.toggle('is-active', i === 0)
    );
    document.querySelectorAll('[data-deal-tab]').forEach((b, i) =>
      b.classList.toggle('is-active', i === 0)
    );
    syncCityUi();
    updateLiveCount();
  });

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = getSearchFilters();
    const params = new URLSearchParams();
    if (f.dealType && f.dealType !== 'all') params.set('dealType', f.dealType);
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
    openBelarusMapModal(matched.length ? matched : allProperties, allProperties);
  });

  document.getElementById('open-review-modal-btn')?.addEventListener('click', openReviewModal);

  // Прокрутка отзывов кнопками влево / вправо
  const reviewsEl = document.getElementById('home-reviews');
  const scrollReviews = (dir) => {
    if (!reviewsEl) return;
    const card = reviewsEl.querySelector('.review-card');
    const step = card ? card.getBoundingClientRect().width + 20 : 340;
    reviewsEl.scrollBy({left: dir * step, behavior: 'smooth'});
  };
  document.getElementById('reviews-prev')?.addEventListener('click', () => scrollReviews(-1));
  document.getElementById('reviews-next')?.addEventListener('click', () => scrollReviews(1));
  reviewsEl?.addEventListener('scroll', syncReviewCarouselButtons, {passive: true});
  window.addEventListener('resize', syncReviewCarouselButtons, {passive: true});

  // Форма консультации «Ответим на ваши вопросы» с проверкой вводимых данных
  const consultForm = document.getElementById('home-consult-form');
  const selectHomeConsultIntent = (intentVal) => {
    const radio = consultForm?.querySelector(`input[name="consult-intent"][value="${intentVal}"]`);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', {bubbles: true}));
    }
  };
  const homeParams = new URLSearchParams(window.location.search);
  const homeIntent = homeParams.get('intent') || homeParams.get('service');
  if (homeIntent === 'exchange' || window.location.hash.includes('exchange')) {
    selectHomeConsultIntent('exchange');
  }
  document.querySelectorAll('[data-select-intent]').forEach((el) => {
    el.addEventListener('click', () => {
      const intentVal = el.getAttribute('data-select-intent');
      if (intentVal) selectHomeConsultIntent(intentVal);
    });
  });

  const HOME_AUTOFILL_FIELDS = [
    {el: 'consult-name', type: 'name'},
    {el: 'consult-phone', type: 'phone', withCountryCode: false},
  ];
  syncProfileAutofill(HOME_AUTOFILL_FIELDS, getState().user, {force: false});
  attachPhoneMask(document.getElementById('consult-phone'), false);
  consultForm?.querySelectorAll('input').forEach((inp) => {
    inp.addEventListener('input', () => setFieldError(inp, ''));
  });
  consultForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors(consultForm);
    const {lang, user} = getState();
    const intent = consultForm.querySelector('input[name="consult-intent"]:checked')?.value || 'buy';
    const nameEl = document.getElementById('consult-name');
    const phoneEl = document.getElementById('consult-phone');
    const city = document.getElementById('consult-city')?.value.trim() || '';

    const nameRes = validateName(nameEl?.value, lang);
    const phoneRes = validateBelarusPhone(phoneEl?.value, lang, false);
    let firstInvalid = null;

    if (!nameRes.ok) {
      setFieldError(nameEl, nameRes.error);
      firstInvalid ||= nameEl;
    }
    if (!phoneRes.ok) {
      setFieldError(phoneEl, phoneRes.error);
      firstInvalid ||= phoneEl;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    addConsultationRequest({intent, name: nameRes.value, phone: phoneRes.value, city});
    consultForm.reset();
    syncProfileAutofill(HOME_AUTOFILL_FIELDS, user, {force: true});
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
  populateCityDatalist();
  syncCityUi();
  syncSearchCurrencyButtons();
  renderMarketPulseAndCases();
  renderRealtorsAndReviews();

  renderFeaturedTabs();
  renderFeaturedGrid();
  updateLiveCount();

  try {
    const loaded = await loadPropertiesFromXml();
    baseProperties = loaded.filter((p) => !p.isUserListing);
    allProperties = mergeWithUserListings(baseProperties);
    renderFeaturedTabs();
    renderFeaturedGrid();
    updateLiveCount();
  } catch (err) {
    const {lang} = getState();
    if (featuredGrid && !allProperties.length) {
      featuredGrid.innerHTML = `<div class="empty-state"><p>${
        lang === 'ru' ? 'Не удалось загрузить каталог объектов.' : 'Failed to load property catalog.'
      }</p></div>`;
    }
    console.error(err);
  }

  let lastAuthSig = `${getState().user.mode}|${getState().user.name}|${getState().user.phone}`;
  subscribe(() => {
    const curUser = getState().user;
    const nextAuthSig = `${curUser.mode}|${curUser.name}|${curUser.phone}`;
    if (nextAuthSig !== lastAuthSig) {
      lastAuthSig = nextAuthSig;
      syncProfileAutofill(
        [
          {el: 'consult-name', type: 'name'},
          {el: 'consult-phone', type: 'phone', withCountryCode: false},
        ],
        curUser,
        {force: true}
      );
    }

    allProperties = mergeWithUserListings(baseProperties);
    populateCityDatalist();
    syncCityUi();
    syncSearchCurrencyButtons();
    renderMarketPulseAndCases();
    renderFeaturedTabs();
    renderFeaturedGrid();
    renderRealtorsAndReviews();
    updateLiveCount();
  });
}

initHome();
