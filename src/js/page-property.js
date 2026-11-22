// ==========================================================================
// Контроллер детальной страницы объекта (property.html)
// ==========================================================================

import {showToast} from './components.js';
import {formatPrices, t} from './i18n.js';
import {initLayout, openAuthModal, openGuestGateModal} from './layout.js';
import {getRealtorSelectOptionsHtml, renderRealtorMiniCardHtml} from './realtors-data.js';
import {addViewingRequest, getState, isGuest, subscribe, toggleFavorite} from './state.js';
import {getFloorPlanData, getFloorPlanSvg, getIconSvg, getPropertySvg} from './svg-art.js';
import {
  attachPhoneMask,
  clearFormErrors,
  formatBelarusPhoneInput,
  setFieldError,
  validateBelarusPhone,
  validateFutureDate,
  validateName,
} from './validation.js';
import {loadPropertiesFromXml, mergeWithUserListings} from './xml-loader.js';

initLayout('catalog');

let baseCatalog = [];
let allCatalog = [];
let currentProperty = null;
let activeView = 'exterior';
let activeFloorIdx = 0;
let activeRoomId = null;

let tourSceneIdx = 0;
let tourPlaying = true;
let tourTimerId = null;

const bookingDraft = {
  name: null,
  phone: null,
  date: '2026-11-24',
  consultant: 'any',
};

const BANK_PRESETS = [
  {
    id: 'belarusbank',
    nameRu: 'Беларусбанк · 16.5%',
    nameEn: 'Belarusbank · 16.5%',
    rate: 16.5,
    years: 20,
    downPct: 20,
  },
  {
    id: 'belinvest',
    nameRu: 'Белинвестбанк · 15.9%',
    nameEn: 'Belinvestbank · 15.9%',
    rate: 15.9,
    years: 20,
    downPct: 20,
  },
  {
    id: 'priorbank',
    nameRu: 'Приорбанк · 16.9%',
    nameEn: 'Priorbank · 16.9%',
    rate: 16.9,
    years: 15,
    downPct: 25,
  },
  {
    id: 'installment',
    nameRu: 'Рассрочка · 7.5%',
    nameEn: 'Installment · 7.5%',
    rate: 7.5,
    years: 5,
    downPct: 30,
  },
];

const financeDraft = {
  presetId: 'belarusbank',
  downPct: 20,
  years: 20,
  rate: 16.5,
  leaseMonths: 12,
  includeDeposit: true,
};

const rootEl = document.getElementById('property-detail-root');

function stopTourTimer() {
  if (tourTimerId) {
    clearInterval(tourTimerId);
    tourTimerId = null;
  }
}

function calcMortgageNumbers(priceByn, priceUsd, downPct, years, rate) {
  const ratioUsd = priceByn > 0 ? priceUsd / priceByn : 1 / 3.23;
  const downByn = Math.round(priceByn * (downPct / 100));
  const loanByn = Math.max(0, priceByn - downByn);
  const months = Math.max(1, years * 12);
  const monthlyRate = rate / 100 / 12;

  let monthlyByn = 0;
  if (loanByn > 0) {
    if (monthlyRate <= 0) {
      monthlyByn = loanByn / months;
    } else {
      const pow = Math.pow(1 + monthlyRate, months);
      monthlyByn = (loanByn * monthlyRate * pow) / (pow - 1);
    }
  }
  const monthlyBynRounded = Math.round(monthlyByn);
  const totalPaidByn = monthlyBynRounded * months;
  const overpayByn = Math.max(0, totalPaidByn - loanByn);

  return {
    downByn,
    downUsd: Math.round(downByn * ratioUsd),
    loanByn,
    loanUsd: Math.round(loanByn * ratioUsd),
    monthlyByn: monthlyBynRounded,
    monthlyUsd: Math.round(monthlyBynRounded * ratioUsd),
    overpayByn,
    overpayUsd: Math.round(overpayByn * ratioUsd),
  };
}

function updateFinanceResultsInDom() {
  if (!currentProperty) return;
  const {lang, currency} = getState();
  const p = currentProperty;

  if ((p.dealType || 'sale') === 'rent') {
    const months = Number(financeDraft.leaseMonths) || 12;
    const depositMult = financeDraft.includeDeposit ? 1 : 0;
    const firstMonthP = formatPrices(p.priceByn, p.priceUsd, currency, 'rent', lang);
    const moveInByn = p.priceByn * (1 + depositMult);
    const moveInUsd = p.priceUsd * (1 + depositMult);
    const moveInP = formatPrices(moveInByn, moveInUsd, currency, 'sale', lang);
    const totalContractByn = p.priceByn * months;
    const totalContractUsd = p.priceUsd * months;
    const contractP = formatPrices(totalContractByn, totalContractUsd, currency, 'sale', lang);

    const mEl = document.getElementById('rent-movein-val');
    const mSubEl = document.getElementById('rent-movein-sub');
    const monthEl = document.getElementById('rent-monthly-val');
    const contractEl = document.getElementById('rent-contract-val');
    if (mEl) mEl.textContent = moveInP.primary;
    if (mSubEl) mSubEl.textContent = moveInP.secondary;
    if (monthEl) monthEl.textContent = firstMonthP.primary;
    if (contractEl) contractEl.textContent = contractP.primary;
    return;
  }

  const res = calcMortgageNumbers(
    p.priceByn,
    p.priceUsd,
    financeDraft.downPct,
    financeDraft.years,
    financeDraft.rate
  );

  const mFmt = formatPrices(res.monthlyByn, res.monthlyUsd, currency, 'rent', lang);
  const loanFmt = formatPrices(res.loanByn, res.loanUsd, currency, 'sale', lang);
  const downFmt = formatPrices(res.downByn, res.downUsd, currency, 'sale', lang);
  const overFmt = formatPrices(res.overpayByn, res.overpayUsd, currency, 'sale', lang);

  const downLabelEl = document.getElementById('mort-down-label');
  const yearsLabelEl = document.getElementById('mort-years-label');
  const rateLabelEl = document.getElementById('mort-rate-label');
  if (downLabelEl) downLabelEl.textContent = `${financeDraft.downPct}% (${downFmt.primary})`;
  if (yearsLabelEl) {
    yearsLabelEl.textContent = `${financeDraft.years} ${lang === 'ru' ? 'лет' : 'yrs'}`;
  }
  if (rateLabelEl) rateLabelEl.textContent = `${financeDraft.rate.toFixed(1)}%`;

  const mValEl = document.getElementById('mort-monthly-val');
  const mSubEl = document.getElementById('mort-monthly-sub');
  const loanEl = document.getElementById('mort-loan-val');
  const downEl = document.getElementById('mort-down-val');
  const overEl = document.getElementById('mort-overpay-val');

  if (mValEl) mValEl.textContent = mFmt.primary;
  if (mSubEl) mSubEl.textContent = mFmt.secondary;
  if (loanEl) loanEl.textContent = loanFmt.primary;
  if (downEl) downEl.textContent = downFmt.primary;
  if (overEl) overEl.textContent = overFmt.primary;
}

function renderPropertyPage() {
  if (!rootEl || !currentProperty) return;
  stopTourTimer();

  const {lang, currency, favorites, user} = getState();
  const p = currentProperty;
  const s = p.specs;
  const isRent = (p.dealType || 'sale') === 'rent';
  const prices = formatPrices(p.priceByn, p.priceUsd, currency, p.dealType || 'sale', lang);
  const isSaved = favorites.includes(String(p.id));

  document.title = `${p.title[lang]} — Alora Homes`;

  const existingName = document.getElementById('view-name')?.value;
  const existingPhone = document.getElementById('view-phone')?.value;
  const existingDate = document.getElementById('view-date')?.value;
  const existingConsultant = document.getElementById('view-consultant')?.value;
  if (existingName !== undefined) bookingDraft.name = existingName;
  if (existingPhone !== undefined) bookingDraft.phone = existingPhone;
  if (existingDate !== undefined) bookingDraft.date = existingDate;
  if (existingConsultant !== undefined) bookingDraft.consultant = existingConsultant;

  const draftName = bookingDraft.name !== null ? bookingDraft.name : user.name && user.name !== 'Гость' ? user.name : '';
  const draftPhone =
    bookingDraft.phone !== null
      ? formatBelarusPhoneInput(bookingDraft.phone, true, true)
      : user.phone
        ? formatBelarusPhoneInput(user.phone, true, true)
        : '+375 ';

  const floorPlans = getFloorPlanData(p, lang);
  if (activeFloorIdx >= floorPlans.length) activeFloorIdx = 0;
  const currentFloor = floorPlans[activeFloorIdx];
  if (!currentFloor.rooms.some((r) => r.id === activeRoomId)) {
    activeRoomId = currentFloor.rooms[0]?.id || null;
  }
  const selectedRoom =
    currentFloor.rooms.find((r) => r.id === activeRoomId) || currentFloor.rooms[0];

  const views = [
    {id: 'exterior', label: t('viewExterior', lang)},
    {id: 'interior', label: t('viewInterior', lang)},
    {id: 'terrace', label: t('viewTerrace', lang)},
    {id: 'tour', label: t('viewTour', lang)},
  ];

  const tourScenes = [
    {
      id: 'exterior',
      labelRu: '01 · Фасад и подъезд',
      labelEn: '01 · Facade & Approach',
      img: p.image,
      capRu: 'Архитектурный облик и придомовая территория',
      capEn: 'Exterior architecture and surrounding grounds',
    },
    {
      id: 'interior',
      labelRu: '02 · Интерьер и свет',
      labelEn: '02 · Living Interior',
      img: p.interiorImage || p.image,
      capRu: 'Планировка гостиной и естественное освещение',
      capEn: 'Living space proportions and natural daylight',
    },
    {
      id: 'terrace',
      labelRu: '03 · Панорама и детали',
      labelEn: '03 · Panorama & View',
      img: p.terraceImage || p.interiorImage || p.image,
      capRu: 'Видовые характеристики и отделка',
      capEn: 'Terrace outlook and architectural finishes',
    },
  ];
  if (tourSceneIdx >= tourScenes.length) tourSceneIdx = 0;

  const kpis = [
    {val: `${s.area} ${t('areaUnit', lang)}`, label: t('specTotalArea', lang)},
    s.plotArea > 0
      ? {val: `${s.plotArea} ${t('plotUnit', lang)}`, label: t('specPlotArea', lang)}
      : {val: `${s.livingArea} ${t('areaUnit', lang)}`, label: t('specLiving', lang)},
    {val: `${s.floors}`, label: t('specFloors', lang)},
    s.mkadDistance > 0
      ? {val: `${s.mkadDistance} ${t('kmUnit', lang)}`, label: t('specMkad', lang)}
      : {val: `${s.year}`, label: t('specYear', lang)},
  ];

  const renderGalleryMedia = (viewId, imgStyle, svgUid, isMain = false) => {
    if (viewId === 'tour') {
      if (isMain) {
        const curScene = tourScenes[tourSceneIdx] || tourScenes[0];
        const sceneVisual = curScene.img
          ? `<img src="${curScene.img}" alt="${p.title[lang]}" class="tour-stage__img ${tourPlaying ? 'is-playing' : ''}" referrerpolicy="no-referrer" onerror="this.style.display='none';this.nextElementSibling.style.display='block';" /><div style="display:none;position:absolute;inset:0;width:100%;height:100%;">${getPropertySvg(p.visualTheme, curScene.id, svgUid)}</div>`
          : `<div class="tour-stage__img ${tourPlaying ? 'is-playing' : ''}" style="position:absolute;inset:0;">${getPropertySvg(p.visualTheme, curScene.id, svgUid)}</div>`;
        return `
          <div class="tour-stage" id="property-tour-stage">
            ${sceneVisual}
            <div class="tour-stage__scrim"></div>
            <div class="tour-stage__top">
              <span class="tour-stage__tag">${t('viewTour', lang)}</span>
              <button type="button" class="tour-stage__play" id="tour-play-toggle" aria-label="${tourPlaying ? 'Pause' : 'Play'}">
                ${getIconSvg(tourPlaying ? 'pause' : 'play', 14)}
                <span>${tourPlaying ? (lang === 'ru' ? 'Пауза' : 'Pause') : (lang === 'ru' ? 'Запуск' : 'Play')}</span>
              </button>
            </div>
            <div class="tour-stage__bottom">
              <div class="tour-stage__desc" id="tour-scene-caption">${lang === 'ru' ? curScene.capRu : curScene.capEn}</div>
              <div class="tour-stage__scenes">
                ${tourScenes
                  .map(
                    (sc, idx) => `
                  <button type="button" class="tour-scene-btn ${idx === tourSceneIdx ? 'is-active' : ''}" data-tour-scene="${idx}">
                    ${lang === 'ru' ? sc.labelRu : sc.labelEn}
                  </button>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        `;
      }
      const thumbImg = p.interiorImage || p.image || '';
      const thumbVisual = thumbImg
        ? `<img src="${thumbImg}" alt="${t('viewTour', lang)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" style="${imgStyle}" onerror="this.style.display='none';this.nextElementSibling.style.display='block';" /><div style="display:none;position:absolute;inset:0;width:100%;height:100%;">${getPropertySvg(p.visualTheme, 'interior', svgUid)}</div>`
        : getPropertySvg(p.visualTheme, 'interior', svgUid);
      return `
        ${thumbVisual}
        <span class="tour-thumb-badge" aria-hidden="true">${getIconSvg('play', 18)}</span>
      `;
    }

    const viewSrcMap = {
      exterior: p.image,
      interior: p.interiorImage,
      terrace: p.terraceImage,
    };
    const url = viewSrcMap[viewId] || '';
    if (!url) {
      return getPropertySvg(p.visualTheme, viewId, svgUid);
    }
    const perfAttrs = isMain
      ? 'fetchpriority="high" decoding="async"'
      : 'loading="lazy" decoding="async"';
    return `<img src="${url}" alt="${p.title[lang]}" ${perfAttrs} referrerpolicy="no-referrer" style="${imgStyle}" onerror="this.style.display='none';this.nextElementSibling.style.display='block';" /><div style="display:none;position:absolute;inset:0;width:100%;height:100%;">${getPropertySvg(p.visualTheme, viewId, svgUid)}</div>`;
  };

  const currentIdx = allCatalog.findIndex((item) => String(item.id) === String(p.id));
  const hasMultipleObjects = allCatalog.length > 1 && currentIdx >= 0;
  const prevObj = hasMultipleObjects
    ? allCatalog[(currentIdx - 1 + allCatalog.length) % allCatalog.length]
    : null;
  const nextObj = hasMultipleObjects
    ? allCatalog[(currentIdx + 1) % allCatalog.length]
    : null;

  const priceLabelText = isRent
    ? lang === 'ru'
      ? 'Арендная ставка в месяц'
      : 'Monthly Lease Rate'
    : t('objectPriceLabel', lang);

  const financeSectionHtml = isRent
    ? `
      <section class="mortgage-card" aria-label="${lang === 'ru' ? 'Расчёт заселения и аренды' : 'Rental Move-In Estimator'}">
        <div class="mortgage-card__head">
          <div>
            <span class="section-kicker" style="margin-bottom:4px;">${lang === 'ru' ? 'Прозрачная аренда' : 'Transparent Lease'}</span>
            <h2 class="section-title" style="font-size:1.45rem;margin:0;">${lang === 'ru' ? 'Калькулятор заселения и срока аренды' : 'Lease & Move-In Estimator'}</h2>
          </div>
          <span class="mortgage-card__badge">${lang === 'ru' ? '0% скрытых сборов' : 'Zero hidden fees'}</span>
        </div>
        <div class="mortgage-card__grid">
          <div class="mortgage-controls">
            <div class="field">
              <span class="field__label">${lang === 'ru' ? 'Срок договора аренды' : 'Lease Term'}</span>
              <div class="mortgage-presets">
                ${[3, 6, 12, 24]
                  .map(
                    (m) => `
                  <button type="button" class="tab-btn ${financeDraft.leaseMonths === m ? 'is-active' : ''}" data-lease-months="${m}">
                    ${m} ${lang === 'ru' ? 'мес.' : 'mo'}
                  </button>
                `
                  )
                  .join('')}
              </div>
            </div>
            <label class="catalog-checkbox" style="margin-top:6px;">
              <input id="rent-deposit-toggle" type="checkbox" ${financeDraft.includeDeposit ? 'checked' : ''} />
              <span>${lang === 'ru' ? 'Включить возвратный депозит (1 месяц)' : 'Include refundable security deposit (1 mo)'}</span>
            </label>
          </div>
          <div class="mortgage-result">
            <span class="section-kicker" style="margin-bottom:4px;">${lang === 'ru' ? 'Бюджет при заселении' : 'Move-In Total'}</span>
            <div class="mortgage-result__main" id="rent-movein-val">—</div>
            <div class="mortgage-result__sub" id="rent-movein-sub">—</div>
            <div class="mortgage-result__meta">
              <div>
                <span>${lang === 'ru' ? 'Ежемесячный платёж' : 'Monthly Rent'}</span>
                <strong id="rent-monthly-val">—</strong>
              </div>
              <div>
                <span>${lang === 'ru' ? 'Сумма за весь срок' : 'Total Lease Value'}</span>
                <strong id="rent-contract-val">—</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
    : `
      <section class="mortgage-card" aria-label="${lang === 'ru' ? 'Калькулятор кредита и рассрочки' : 'Mortgage & Installment Calculator'}">
        <div class="mortgage-card__head">
          <div>
            <span class="section-kicker" style="margin-bottom:4px;">${lang === 'ru' ? 'Финансирование в Беларуси' : 'Belarus Financing Options'}</span>
            <h2 class="section-title" style="font-size:1.45rem;margin:0;">${lang === 'ru' ? 'Калькулятор ипотеки и рассрочки' : 'Bank Credit & Installment Calculator'}</h2>
          </div>
          <span class="mortgage-card__badge">${lang === 'ru' ? 'Беларусбанк · Белинвест · Приор' : 'Belarusbank · Belinvest · Prior'}</span>
        </div>

        <div class="mortgage-presets" role="group" aria-label="${lang === 'ru' ? 'Программы банков' : 'Bank Programs'}">
          ${BANK_PRESETS.map(
            (bp) => `
            <button type="button" class="tab-btn ${financeDraft.presetId === bp.id ? 'is-active' : ''}" data-bank-preset="${bp.id}">
              ${lang === 'ru' ? bp.nameRu : bp.nameEn}
            </button>
          `
          ).join('')}
        </div>

        <div class="mortgage-card__grid">
          <div class="mortgage-controls">
            <div class="mortgage-slider">
              <div class="mortgage-slider__top">
                <label for="mort-down-range">${lang === 'ru' ? 'Первоначальный взнос' : 'Down Payment'}</label>
                <strong id="mort-down-label" class="tabular">${financeDraft.downPct}%</strong>
              </div>
              <input id="mort-down-range" type="range" min="10" max="75" step="5" value="${financeDraft.downPct}" />
            </div>

            <div class="mortgage-slider">
              <div class="mortgage-slider__top">
                <label for="mort-years-range">${lang === 'ru' ? 'Срок кредитования' : 'Loan Term'}</label>
                <strong id="mort-years-label" class="tabular">${financeDraft.years} ${lang === 'ru' ? 'лет' : 'yrs'}</strong>
              </div>
              <input id="mort-years-range" type="range" min="1" max="20" step="1" value="${financeDraft.years}" />
            </div>

            <div class="mortgage-slider">
              <div class="mortgage-slider__top">
                <label for="mort-rate-range">${lang === 'ru' ? 'Процентная ставка' : 'Annual Interest Rate'}</label>
                <strong id="mort-rate-label" class="tabular">${financeDraft.rate.toFixed(1)}%</strong>
              </div>
              <input id="mort-rate-range" type="range" min="0" max="22" step="0.1" value="${financeDraft.rate}" />
            </div>
          </div>

          <div class="mortgage-result">
            <span class="section-kicker" style="margin-bottom:4px;">${lang === 'ru' ? 'Ежемесячный платёж' : 'Estimated Monthly Payment'}</span>
            <div class="mortgage-result__main" id="mort-monthly-val">—</div>
            <div class="mortgage-result__sub" id="mort-monthly-sub">—</div>
            <div class="mortgage-result__meta">
              <div>
                <span>${lang === 'ru' ? 'Сумма кредита' : 'Loan Amount'}</span>
                <strong id="mort-loan-val">—</strong>
              </div>
              <div>
                <span>${lang === 'ru' ? 'Свой взнос' : 'Down Payment'}</span>
                <strong id="mort-down-val">—</strong>
              </div>
              <div>
                <span>${lang === 'ru' ? 'Переплата по %' : 'Total Interest'}</span>
                <strong id="mort-overpay-val">—</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

  rootEl.innerHTML = `
    <div class="property-topbar">
      <nav class="breadcrumbs" aria-label="Breadcrumb" style="margin-bottom:0;">
        <a href="./index.html">${t('crumbHome', lang)}</a>
        <span aria-hidden="true">/</span>
        <a href="./catalog.html">${t('crumbCatalog', lang)}</a>
        <span aria-hidden="true">/</span>
        <a href="./catalog.html?category=${encodeURIComponent(p.category)}">${p.subcategory[lang]}</a>
        <span aria-hidden="true">/</span>
        <span>${p.title[lang]}</span>
      </nav>
      ${
        hasMultipleObjects
          ? `
        <div class="property-nav-arrows" aria-label="Object navigation">
          <a href="./property.html?id=${encodeURIComponent(prevObj.id)}" class="pager-arrow" title="${t('prevObject', lang)}: ${prevObj.title[lang]}" aria-label="${t('prevObject', lang)}">
            ${getIconSvg('chevron-left', 18)}
          </a>
          <span class="featured-pager__counter">${currentIdx + 1} / ${allCatalog.length}</span>
          <a href="./property.html?id=${encodeURIComponent(nextObj.id)}" class="pager-arrow" title="${t('nextObject', lang)}: ${nextObj.title[lang]}" aria-label="${t('nextObject', lang)}">
            ${getIconSvg('chevron-right', 18)}
          </a>
        </div>
      `
          : ''
      }
    </div>

    <div class="property-hero">
      <div>
        <h1 class="property-hero__title">${p.title[lang]}</h1>
        <p class="property-hero__meta">
          ${p.city[lang]}${s.mkadDistance > 0 ? ` · ${s.mkadDistance} ${t('kmUnit', lang)} ${t('specMkad', lang)}` : ''} · ${p.subcategory[lang]}
        </p>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <a href="#floorplan-section" class="btn btn--secondary btn--sm">
          ${t('viewFloorplan', lang)} ↓
        </a>
        <a href="#property-booking-section" class="btn btn--primary btn--sm">
          ${t('bookViewing', lang)} ↓
        </a>
        <span class="property-card__badge property-card__badge--${p.badge.type}" style="position:static;">
          ${p.badge[lang]}
        </span>
      </div>
    </div>

    <section class="gallery-bento" aria-label="Property gallery">
      <div class="gallery-bento__main" id="gallery-main-view">
        ${renderGalleryMedia(activeView, 'width:100%;height:100%;object-fit:cover;', `detail-main-${p.id}`, true)}
        ${
          activeView !== 'tour'
            ? `
          <button type="button" class="gallery-bento__arrow gallery-bento__arrow--prev" data-gallery-step="-1" aria-label="${t('prevSlide', lang)}">
            ${getIconSvg('chevron-left', 20)}
          </button>
          <button type="button" class="gallery-bento__arrow gallery-bento__arrow--next" data-gallery-step="1" aria-label="${t('nextSlide', lang)}">
            ${getIconSvg('chevron-right', 20)}
          </button>
          <span class="gallery-bento__caption">${views.find((v) => v.id === activeView)?.label}</span>
        `
            : ''
        }
      </div>
      <div class="gallery-bento__side gallery-bento__side--three">
        ${views
          .filter((v) => v.id !== activeView)
          .map(
            (v) => `
          <button type="button" class="gallery-bento__thumb" data-switch-view="${v.id}">
            ${renderGalleryMedia(v.id, 'width:100%;height:100%;object-fit:cover;', `detail-thumb-${v.id}-${p.id}`)}
            <span class="gallery-bento__caption">${v.label}</span>
          </button>
        `
          )
          .join('')}
      </div>
    </section>

    <div class="property-price-strip">
      <div>
        <span class="section-kicker" style="margin-bottom:4px;">${priceLabelText}</span>
        <div class="property-price-strip__values">
          <div class="property-sidebar__price">${prices.primary}</div>
          <div class="property-sidebar__subprice">${prices.secondary}</div>
        </div>
      </div>
      <div class="property-price-strip__actions">
        <button type="button" class="btn btn--secondary btn--sm" id="share-property-btn">
          ${getIconSvg('share', 16)}
          <span>${t('shareBtn', lang)}</span>
        </button>
        <button type="button" class="btn btn--secondary btn--sm" id="print-property-btn">
          ${getIconSvg('printer', 16)}
          <span>${t('printBtn', lang)}</span>
        </button>
        <button type="button" class="btn btn--secondary" id="detail-fav-btn">
          ${getIconSvg(isSaved ? 'heart-filled' : 'heart', 17)}
          <span>${isSaved ? t('inFav', lang) : t('addToFav', lang)}</span>
        </button>
        <a href="#property-booking-section" class="btn btn--primary">
          ${t('bookViewing', lang)} ↓
        </a>
      </div>
    </div>

    <div class="property-overview">
      <div class="kpi-strip">
        ${kpis
          .map(
            (k) => `
          <div class="kpi-strip__card">
            <strong>${k.val}</strong>
            <span>${k.label}</span>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="property-info-grid">
        <section>
          <h2 class="section-title" style="font-size:1.5rem;margin-bottom:12px;">${t('aboutObject', lang)}</h2>
          <p style="color:var(--text-secondary);line-height:1.7;">${p.description[lang]}</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;">
            ${p.features
              .map(
                (f) =>
                  `<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;background:var(--bg-surface);border:1px solid var(--border-subtle);font-size:0.84rem;color:var(--text-secondary);"><span style="color:var(--accent-cyan);display:inline-flex;">${getIconSvg('check', 14)}</span> ${f[lang]}</span>`
              )
              .join('')}
          </div>
        </section>

        <section>
          <h2 class="section-title" style="font-size:1.5rem;">${t('characteristics', lang)}</h2>
          <table class="specs-table">
            <tbody>
              <tr><th>${t('specType', lang)}</th><td>${p.subcategory[lang]}</td></tr>
              <tr><th>${t('specLocation', lang)}</th><td>${p.city[lang]}</td></tr>
              <tr><th>${t('specTotalArea', lang)}</th><td>${s.area} ${t('areaUnit', lang)}</td></tr>
              <tr><th>${t('specLiving', lang)}</th><td>${s.livingArea} ${t('areaUnit', lang)}</td></tr>
              ${s.plotArea > 0 ? `<tr><th>${t('specPlotArea', lang)}</th><td>${s.plotArea} ${t('plotUnit', lang)}</td></tr>` : ''}
              <tr><th>${t('specRooms', lang)}</th><td>${s.rooms}</td></tr>
              <tr><th>${t('specFloor', lang)} / ${t('specFloors', lang)}</th><td>${s.floor} / ${s.floors}</td></tr>
              <tr><th>${t('specYear', lang)}</th><td>${s.year}</td></tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>

    <section class="floorplan-section" id="floorplan-section" aria-label="${t('floorplanTitle', lang)}">
      <div class="floorplan-section__header">
        <div>
          <span class="section-kicker">${t('floorplanKicker', lang)}</span>
          <h2 class="section-title" style="font-size:1.65rem;margin-bottom:6px;">${t('floorplanTitle', lang)}</h2>
          <p style="color:var(--text-secondary);font-size:0.9rem;">${t('floorplanHint', lang)}</p>
        </div>
        <div class="floorplan-tabs" role="tablist" aria-label="Floor levels">
          ${floorPlans
            .map(
              (fl, idx) => `
            <button
              type="button"
              role="tab"
              aria-selected="${idx === activeFloorIdx ? 'true' : 'false'}"
              class="tab-btn ${idx === activeFloorIdx ? 'is-active' : ''}"
              data-floor-idx="${idx}"
            >
              ${lang === 'ru' ? fl.labelRu : fl.labelEn}
            </button>
          `
            )
            .join('')}
        </div>
      </div>

      <div class="floorplan-layout">
        <div class="floorplan-svg-wrap" id="floorplan-canvas">
          ${getFloorPlanSvg(currentFloor, activeRoomId, lang)}
          <div class="floorplan-meta-strip">
            <span>${lang === 'ru' ? 'Площадь уровня' : 'Level area'}: <strong>${currentFloor.totalArea} ${t('areaUnit', lang)}</strong></span>
            <span>·</span>
            <span>${lang === 'ru' ? 'Высота потолков' : 'Ceiling height'}: <strong>${currentFloor.ceiling}</strong></span>
            <span>·</span>
            <span>${lang === 'ru' ? 'Помещений' : 'Zones'}: <strong>${currentFloor.rooms.length}</strong></span>
          </div>
        </div>

        <div class="floorplan-inspector">
          ${
            selectedRoom
              ? `
            <div class="floorplan-inspector__card">
              <span class="section-kicker" style="margin-bottom:4px;">${lang === 'ru' ? currentFloor.labelRu : currentFloor.labelEn}</span>
              <div class="floorplan-inspector__top">
                <h3>${lang === 'ru' ? selectedRoom.nameRu : selectedRoom.nameEn}</h3>
                <strong>${selectedRoom.area} ${t('areaUnit', lang)}</strong>
              </div>
              <p class="floorplan-inspector__aspect">${lang === 'ru' ? selectedRoom.aspectRu : selectedRoom.aspectEn}</p>
              <p class="floorplan-inspector__finish">
                <span>${lang === 'ru' ? 'Отделка и инженерия:' : 'Finishes & MEP:'}</span>
                ${lang === 'ru' ? selectedRoom.finishRu : selectedRoom.finishEn}
              </p>
            </div>
          `
              : ''
          }

          <div class="floorplan-rooms-list" role="list">
            ${currentFloor.rooms
              .map(
                (room) => `
              <button
                type="button"
                class="floorplan-room-btn ${room.id === activeRoomId ? 'is-active' : ''}"
                data-select-room="${room.id}"
              >
                <span>${lang === 'ru' ? room.nameRu : room.nameEn}</span>
                <strong>${room.area} ${t('areaUnit', lang)}</strong>
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    </section>

    ${financeSectionHtml}

    <section class="property-booking-section" id="property-booking-section" aria-label="${t('bookingTitle', lang)}">
      <div class="property-booking-grid">
        <div class="property-next-step">
          <span class="section-kicker">${priceLabelText}</span>
          <div class="property-sidebar__price">${prices.primary}</div>
          <div class="property-sidebar__subprice" style="margin-bottom:14px;">${prices.secondary}</div>
          <h3 style="font-size:1.25rem;margin-bottom:8px;">${t('nextStepTitle', lang)}</h3>
          <p style="color:var(--text-secondary);font-size:0.94rem;line-height:1.65;margin-bottom:18px;">${t('nextStepDesc', lang)}</p>
          <button type="button" class="btn btn--secondary" id="detail-fav-btn-bottom">
            ${getIconSvg(isSaved ? 'heart-filled' : 'heart', 17)}
            <span>${isSaved ? t('inFav', lang) : t('addToFav', lang)}</span>
          </button>
        </div>

        <aside class="property-sidebar property-sidebar--inline">
          <div>
            <h2 style="font-size:1.35rem;margin-bottom:4px;">${t('bookingTitle', lang)}</h2>
            <p style="font-size:0.86rem;color:var(--text-secondary);">${t('bookingSubtitle', lang)}</p>
          </div>

          ${
            isGuest()
              ? `
            <div class="guest-gate__notice" style="font-size:0.86rem;">
              ${t('guestGateBookDesc', lang)}
            </div>
            <button type="button" class="btn btn--primary btn--full js-sidebar-reg">${t('registerBtn', lang)}</button>
            <a href="tel:+375297745210" class="btn btn--secondary btn--full">${getIconSvg('phone', 16)} <span>+375 (29) 774-52-10</span></a>
          `
              : `
            <form id="viewing-form" novalidate style="display:flex;flex-direction:column;gap:12px;">
              <div class="field">
                <label class="field__label" for="view-name">${t('inputName', lang)}</label>
                <input
                  id="view-name"
                  class="field__control"
                  type="text"
                  required
                  value="${draftName}"
                  placeholder="${t('inputNamePlaceholder', lang)}"
                />
              </div>
              <div class="field">
                <label class="field__label" for="view-phone">${t('inputPhone', lang)}</label>
                <input
                  id="view-phone"
                  class="field__control"
                  type="tel"
                  required
                  value="${draftPhone}"
                  placeholder="+375 (29) 123-45-67"
                />
              </div>
              <div class="field">
                <label class="field__label" for="view-date">${t('inputDate', lang)}</label>
                <input id="view-date" class="field__control" type="date" required value="${bookingDraft.date || '2026-11-24'}" />
              </div>
              <div class="field">
                <label class="field__label" for="view-consultant">${t('viewConsultantLabel', lang)}</label>
                <select id="view-consultant" class="field__control">
                  ${getRealtorSelectOptionsHtml(bookingDraft.consultant || 'any', lang)}
                </select>
              </div>
              <div id="view-consultant-preview" class="consultant-mini-card">
                ${renderRealtorMiniCardHtml(bookingDraft.consultant || 'any', lang)}
              </div>
              <button type="submit" class="btn btn--primary btn--full">${t('bookViewing', lang)}</button>
              <p style="font-size:0.78rem;color:var(--text-muted);text-align:center;">
                ${t('bookingNote', lang)}
              </p>
            </form>
          `
          }
        </aside>
      </div>
    </section>

    <div class="print-only-footer">${t('printCardNote', lang)} · ${window.location.href}</div>
  `;

  updateFinanceResultsInDom();

  if (activeView === 'tour') {
    if (tourPlaying) {
      tourTimerId = setInterval(() => {
        tourSceneIdx = (tourSceneIdx + 1) % tourScenes.length;
        renderPropertyPage();
      }, 3800);
    }
    document.getElementById('tour-play-toggle')?.addEventListener('click', () => {
      tourPlaying = !tourPlaying;
      renderPropertyPage();
    });
    rootEl.querySelectorAll('[data-tour-scene]').forEach((btn) => {
      btn.addEventListener('click', () => {
        tourSceneIdx = Number(btn.getAttribute('data-tour-scene')) || 0;
        renderPropertyPage();
      });
    });
  }

  rootEl.querySelectorAll('[data-bank-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-bank-preset');
      const preset = BANK_PRESETS.find((b) => b.id === id);
      if (!preset) return;
      financeDraft.presetId = preset.id;
      financeDraft.downPct = preset.downPct;
      financeDraft.years = preset.years;
      financeDraft.rate = preset.rate;
      const dEl = document.getElementById('mort-down-range');
      const yEl = document.getElementById('mort-years-range');
      const rEl = document.getElementById('mort-rate-range');
      if (dEl) dEl.value = String(preset.downPct);
      if (yEl) yEl.value = String(preset.years);
      if (rEl) rEl.value = String(preset.rate);
      rootEl.querySelectorAll('[data-bank-preset]').forEach((b) =>
        b.classList.toggle('is-active', b === btn)
      );
      updateFinanceResultsInDom();
    });
  });

  document.getElementById('mort-down-range')?.addEventListener('input', (e) => {
    financeDraft.downPct = Number(e.target.value) || 20;
    updateFinanceResultsInDom();
  });
  document.getElementById('mort-years-range')?.addEventListener('input', (e) => {
    financeDraft.years = Number(e.target.value) || 20;
    updateFinanceResultsInDom();
  });
  document.getElementById('mort-rate-range')?.addEventListener('input', (e) => {
    financeDraft.rate = Number(e.target.value) || 16.5;
    updateFinanceResultsInDom();
  });

  rootEl.querySelectorAll('[data-lease-months]').forEach((btn) => {
    btn.addEventListener('click', () => {
      financeDraft.leaseMonths = Number(btn.getAttribute('data-lease-months')) || 12;
      rootEl.querySelectorAll('[data-lease-months]').forEach((b) =>
        b.classList.toggle('is-active', b === btn)
      );
      updateFinanceResultsInDom();
    });
  });
  document.getElementById('rent-deposit-toggle')?.addEventListener('change', (e) => {
    financeDraft.includeDeposit = Boolean(e.target.checked);
    updateFinanceResultsInDom();
  });

  rootEl.querySelectorAll('[data-switch-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeView = btn.getAttribute('data-switch-view') || 'exterior';
      renderPropertyPage();
    });
  });

  rootEl.querySelectorAll('[data-gallery-step]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const step = Number(btn.getAttribute('data-gallery-step')) || 1;
      const order = views.map((v) => v.id);
      const idx = order.indexOf(activeView);
      activeView = order[(idx + step + order.length) % order.length];
      renderPropertyPage();
    });
  });

  rootEl.querySelectorAll('[data-floor-idx]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeFloorIdx = Number(btn.getAttribute('data-floor-idx')) || 0;
      activeRoomId = null;
      renderPropertyPage();
    });
  });

  const selectRoom = (roomId) => {
    if (!roomId || roomId === activeRoomId) return;
    activeRoomId = roomId;
    renderPropertyPage();
  };

  rootEl.querySelectorAll('[data-room-id]').forEach((node) => {
    node.addEventListener('click', () => selectRoom(node.getAttribute('data-room-id')));
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectRoom(node.getAttribute('data-room-id'));
      }
    });
  });

  rootEl.querySelectorAll('[data-select-room]').forEach((btn) => {
    btn.addEventListener('click', () => selectRoom(btn.getAttribute('data-select-room')));
  });

  const handleToggleFav = () => {
    if (isGuest()) {
      openGuestGateModal('favorite');
      return;
    }
    const added = toggleFavorite(p.id);
    showToast(
      added
        ? lang === 'ru'
          ? 'Добавлено в избранное'
          : 'Saved to favorites'
        : lang === 'ru'
          ? 'Удалено из избранного'
          : 'Removed from favorites',
      added ? 'success' : 'default'
    );
  };

  document.getElementById('detail-fav-btn')?.addEventListener('click', handleToggleFav);
  document.getElementById('detail-fav-btn-bottom')?.addEventListener('click', handleToggleFav);

  document.getElementById('share-property-btn')?.addEventListener('click', async () => {
    const shareUrl = window.location.href;
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        copied = true;
      }
    } catch {
      copied = false;
    }
    if (!copied) {
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px;';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        // Ignore fallback copy errors
      }
      ta.remove();
    }
    showToast(t('shareCopied', lang), 'success');
  });

  document.getElementById('print-property-btn')?.addEventListener('click', () => {
    window.print();
  });

  rootEl.querySelector('.js-sidebar-reg')?.addEventListener('click', () => openAuthModal('register'));

  const viewingForm = document.getElementById('viewing-form');
  const phoneInputEl = document.getElementById('view-phone');
  attachPhoneMask(phoneInputEl, true);

  document.getElementById('view-consultant')?.addEventListener('change', (e) => {
    bookingDraft.consultant = e.target.value || 'any';
    const previewEl = document.getElementById('view-consultant-preview');
    if (previewEl) {
      previewEl.innerHTML = renderRealtorMiniCardHtml(bookingDraft.consultant, getState().lang);
    }
  });

  viewingForm?.querySelectorAll('input, select').forEach((inp) => {
    inp.addEventListener('input', () => setFieldError(inp, ''));
    inp.addEventListener('change', () => setFieldError(inp, ''));
  });
  viewingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isGuest()) {
      openGuestGateModal('booking');
      return;
    }
    clearFormErrors(viewingForm);
    const nameEl = document.getElementById('view-name');
    const phoneEl = document.getElementById('view-phone');
    const dateEl = document.getElementById('view-date');
    const consultantEl = document.getElementById('view-consultant');

    const nameRes = validateName(nameEl?.value, lang);
    const phoneRes = validateBelarusPhone(phoneEl?.value, lang, true);
    const dateRes = validateFutureDate(dateEl?.value, lang);
    let firstInvalid = null;

    if (!nameRes.ok) {
      setFieldError(nameEl, nameRes.error);
      firstInvalid ||= nameEl;
    }
    if (!phoneRes.ok) {
      setFieldError(phoneEl, phoneRes.error);
      firstInvalid ||= phoneEl;
    }
    if (!dateRes.ok) {
      setFieldError(dateEl, dateRes.error);
      firstInvalid ||= dateEl;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    addViewingRequest({
      propertyId: p.id,
      name: nameRes.value,
      phone: phoneRes.value,
      date: dateRes.value,
      consultant: consultantEl?.value || 'any',
    });
    showToast(
      lang === 'ru'
        ? 'Заявка на показ сохранена в вашем кабинете!'
        : 'Viewing request saved to your account!',
      'success'
    );
  });
}

async function initPropertyDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || '1';
  const {lang} = getState();

  try {
    const loaded = await loadPropertiesFromXml();
    baseCatalog = loaded.filter((p) => !p.isUserListing);
    allCatalog = mergeWithUserListings(baseCatalog);
    currentProperty = allCatalog.find((item) => String(item.id) === String(id)) || allCatalog[0];
    document.title = `${currentProperty.title[getState().lang]} — Alora Homes`;
    renderPropertyPage();
    [currentProperty.interiorImage, currentProperty.terraceImage].forEach((src) => {
      if (src) {
        const pre = new Image();
        pre.decoding = 'async';
        pre.src = src;
      }
    });
  } catch (err) {
    if (rootEl) {
      rootEl.innerHTML = `<div class="empty-state"><h2>${lang === 'ru' ? 'Объект не найден' : 'Property not found'}</h2><a href="./catalog.html" class="btn btn--primary">${lang === 'ru' ? 'Вернуться в каталог' : 'Back to catalog'}</a></div>`;
    }
    console.error(err);
  }

  subscribe(() => {
    allCatalog = mergeWithUserListings(baseCatalog);
    currentProperty = allCatalog.find((item) => String(item.id) === String(id)) || allCatalog[0];
    renderPropertyPage();
  });
}

initPropertyDetail();
