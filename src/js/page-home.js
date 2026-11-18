// ==========================================================================
// Контроллер главной страницы (index.html)
// ==========================================================================

import {createPropertyCard, openBelarusMapModal, showToast} from './components.js';
import {pluralObjects, t} from './i18n.js';
import {initLayout} from './layout.js';
import {addConsultationRequest, getState, setCurrency, subscribe} from './state.js';
import {getIconSvg, getRealtorPortraitSvg} from './svg-art.js';
import {clearFormErrors, setFieldError, validateBelarusPhone, validateName, attachPhoneMask} from './validation.js';
import {filterProperties, loadPropertiesFromXml} from './xml-loader.js';

initLayout('home');

let allProperties = [];
let activeDealGroup = 'residential';
let activeFeaturedTab = 'all';
let featuredPage = 0;
const FEATURED_PAGE_SIZE = 6;

const searchForm = document.getElementById('home-search-form');
const featuredGrid = document.getElementById('featured-grid');
const featuredTabsEl = document.getElementById('featured-tabs');
const featuredPagerTopEl = document.getElementById('featured-pager-top');
const featuredPagerBottomEl = document.getElementById('featured-pager-bottom');
const countBtn = document.getElementById('home-search-submit');

const REALTORS = [
  {
    nameRu: 'Шестак Алиса Дмитриевна',
    nameEn: 'Alisa Shestak',
    roleRu: 'Ведущий риэлтор · Жилая недвижимость',
    roleEn: 'Lead Realtor · Residential',
    phone: '+375 (29) 774-52-10',
    image: './assets/images/realtor-shestak.jpg',
  },
  {
    nameRu: 'Ботвич Ксения Сергеевна',
    nameEn: 'Kseniya Botvich',
    roleRu: 'Эксперт по загородным домам',
    roleEn: 'Country Estate Specialist',
    phone: '+375 (29) 618-33-40',
    image: './assets/images/realtor-botvich.jpg',
  },
  {
    nameRu: 'Свирко Юлия Александровна',
    nameEn: 'Yulia Svirko',
    roleRu: 'Риэлтор · Коммерческие и элитные объекты',
    roleEn: 'Commercial & Luxury Advisor',
    phone: '+375 (44) 551-88-55',
    image: './assets/images/realtor-svirko.jpg',
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
    metaRu: 'Купля-продажа жилья · Минск — Ратомка · 17.11.2026',
    metaEn: 'Residential Sale & Purchase · Minsk — Ratomka · 17.11.2026',
  },
  {
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
  const filtered = filterProperties(allProperties, {category: activeFeaturedTab});
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

  const reviewsEl = document.getElementById('home-reviews');
  if (reviewsEl) {
    reviewsEl.innerHTML = REVIEWS.map((rev) => {
      const rating = rev.rating || 5;
      const starsHtml = Array.from({length: 5}, (_, idx) =>
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
    }).join('');
    syncReviewCarouselButtons();
  }
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
  attachPhoneMask(document.getElementById('consult-phone'));
  consultForm?.querySelectorAll('input').forEach((inp) => {
    inp.addEventListener('input', () => setFieldError(inp, ''));
  });
  consultForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors(consultForm);
    const {lang} = getState();
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
      featuredGrid.innerHTML = `<div class="empty-state"><p>Не удалось загрузить каталог объектов.</p></div>`;
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
