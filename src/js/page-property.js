// ==========================================================================
// Контроллер детальной страницы объекта (property.html)
// ==========================================================================

import {showToast} from './components.js';
import {formatPrices, t} from './i18n.js';
import {initLayout, openAuthModal, openGuestGateModal} from './layout.js';
import {getRealtorSelectOptionsHtml} from './realtors-data.js';
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
import {loadPropertiesFromXml} from './xml-loader.js';

initLayout('catalog');

let allCatalog = [];
let currentProperty = null;
let activeView = 'exterior';
let activeFloorIdx = 0;
let activeRoomId = null;

const bookingDraft = {
  name: null,
  phone: null,
  date: '2026-11-24',
  consultant: 'any',
};

const rootEl = document.getElementById('property-detail-root');

function renderPropertyPage() {
  if (!rootEl || !currentProperty) return;

  const {lang, currency, favorites, user} = getState();
  const p = currentProperty;
  const s = p.specs;
  const prices = formatPrices(p.priceByn, p.priceUsd, currency);
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
  ];

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
        <button type="button" class="gallery-bento__arrow gallery-bento__arrow--prev" data-gallery-step="-1" aria-label="${t('prevSlide', lang)}">
          ${getIconSvg('chevron-left', 20)}
        </button>
        <button type="button" class="gallery-bento__arrow gallery-bento__arrow--next" data-gallery-step="1" aria-label="${t('nextSlide', lang)}">
          ${getIconSvg('chevron-right', 20)}
        </button>
        <span class="gallery-bento__caption">${views.find((v) => v.id === activeView)?.label}</span>
      </div>
      <div class="gallery-bento__side">
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
        <span class="section-kicker" style="margin-bottom:4px;">${t('objectPriceLabel', lang)}</span>
        <div class="property-price-strip__values">
          <div class="property-sidebar__price">${prices.primary}</div>
          <div class="property-sidebar__subprice">${prices.secondary}</div>
        </div>
      </div>
      <div class="property-price-strip__actions">
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

    <section class="property-booking-section" id="property-booking-section" aria-label="${t('bookingTitle', lang)}">
      <div class="property-booking-grid">
        <div class="property-next-step">
          <span class="section-kicker">${t('objectPriceLabel', lang)}</span>
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
  `;

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

  rootEl.querySelector('.js-sidebar-reg')?.addEventListener('click', () => openAuthModal('register'));

  const viewingForm = document.getElementById('viewing-form');
  const phoneInputEl = document.getElementById('view-phone');
  attachPhoneMask(phoneInputEl, true);

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
    allCatalog = await loadPropertiesFromXml();
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

  subscribe(() => renderPropertyPage());
}

initPropertyDetail();
