// ==========================================================================
// Контроллер детальной страницы объекта (property.html)
// ==========================================================================

import '../scss/main.scss';
import {showToast} from './components.js';
import {formatPrices, t} from './i18n.js';
import {initLayout} from './layout.js';
import {addViewingRequest, getState, subscribe, toggleFavorite} from './state.js';
import {getPropertySvg} from './svg-art.js';
import {loadPropertiesFromXml} from './xml-loader.js';

initLayout('catalog');

let currentProperty = null;
let activeView = 'exterior';

const rootEl = document.getElementById('property-detail-root');

function renderPropertyPage() {
  if (!rootEl || !currentProperty) return;

  const {lang, currency, favorites, user} = getState();
  const p = currentProperty;
  const s = p.specs;
  const prices = formatPrices(p.priceByn, p.priceUsd, currency);
  const isSaved = favorites.includes(String(p.id));

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

  rootEl.innerHTML = `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/index.html">${t('crumbHome', lang)}</a>
      <span aria-hidden="true">/</span>
      <a href="/catalog.html">${t('crumbCatalog', lang)}</a>
      <span aria-hidden="true">/</span>
      <a href="/catalog.html?category=${encodeURIComponent(p.category)}">${p.subcategory[lang]}</a>
      <span aria-hidden="true">/</span>
      <span>${p.title[lang]}</span>
    </nav>

    <div class="property-hero">
      <div>
        <h1 class="property-hero__title">${p.title[lang]}</h1>
        <p class="property-hero__meta">
          ${p.city[lang]}${s.mkadDistance > 0 ? ` · ${s.mkadDistance} ${t('kmUnit', lang)} ${t('specMkad', lang)}` : ''} · ${p.subcategory[lang]}
        </p>
      </div>
      <span class="property-card__badge property-card__badge--${p.badge.type}" style="position:static;">
        ${p.badge[lang]}
      </span>
    </div>

    <section class="gallery-bento" aria-label="Property gallery">
      <div class="gallery-bento__main" id="gallery-main-view">
        ${getPropertySvg(p.visualTheme, activeView, `detail-main-${p.id}`)}
        <span class="gallery-bento__caption">${views.find((v) => v.id === activeView)?.label}</span>
      </div>
      <div class="gallery-bento__side">
        ${views
          .filter((v) => v.id !== activeView)
          .map(
            (v) => `
          <button type="button" class="gallery-bento__thumb" data-switch-view="${v.id}">
            ${getPropertySvg(p.visualTheme, v.id, `detail-thumb-${v.id}-${p.id}`)}
            <span class="gallery-bento__caption">${v.label}</span>
          </button>
        `
          )
          .join('')}
      </div>
    </section>

    <div class="property-layout">
      <div>
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

        <section style="margin-bottom:28px;">
          <h2 class="section-title" style="font-size:1.5rem;margin-bottom:12px;">${t('aboutObject', lang)}</h2>
          <p style="color:var(--text-secondary);line-height:1.7;">${p.description[lang]}</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;">
            ${p.features
              .map(
                (f) =>
                  `<span style="padding:6px 12px;border-radius:8px;background:var(--bg-surface);border:1px solid var(--border-subtle);font-size:0.84rem;color:var(--text-secondary);">✓ ${f[lang]}</span>`
              )
              .join('')}
          </div>
        </section>

        <section style="margin-bottom:28px;">
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

        <section style="padding:22px;border-radius:16px;background:var(--bg-surface);border:1px solid var(--border-subtle);">
          <h3 style="font-size:1.1rem;margin-bottom:6px;">${t('nextStepTitle', lang)}</h3>
          <p style="color:var(--text-secondary);font-size:0.9rem;">${t('nextStepDesc', lang)}</p>
        </section>
      </div>

      <aside class="property-sidebar">
        <div>
          <span class="section-kicker" style="margin-bottom:4px;">${t('objectPriceLabel', lang)}</span>
          <div class="property-sidebar__price">${prices.primary}</div>
          <div class="property-sidebar__subprice">${prices.secondary}</div>
        </div>

        <button type="button" class="btn btn--secondary btn--full" id="detail-fav-btn">
          <span>${isSaved ? '♥' : '♡'}</span>
          <span>${isSaved ? t('inFav', lang) : t('addToFav', lang)}</span>
        </button>

        <hr style="border:none;border-top:1px solid var(--border-subtle);margin:4px 0;" />

        <div>
          <h2 style="font-size:1.25rem;margin-bottom:4px;">${t('bookingTitle', lang)}</h2>
          <p style="font-size:0.84rem;color:var(--text-secondary);">${t('bookingSubtitle', lang)}</p>
        </div>

        <form id="viewing-form" style="display:flex;flex-direction:column;gap:12px;">
          <div class="field">
            <label class="field__label" for="view-name">${t('inputName', lang)}</label>
            <input
              id="view-name"
              class="field__control"
              type="text"
              required
              value="${user.mode === 'registered' ? user.name : ''}"
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
              value="${user.mode === 'registered' ? user.phone : ''}"
              placeholder="+375 (29) ___-__-__"
            />
          </div>
          <div class="field">
            <label class="field__label" for="view-date">${t('inputDate', lang)}</label>
            <input id="view-date" class="field__control" type="date" required value="2026-11-24" />
          </div>
          <button type="submit" class="btn btn--primary btn--full">${t('bookViewing', lang)}</button>
          <p style="font-size:0.78rem;color:var(--text-muted);text-align:center;">
            ${t('bookingNote', lang)}
          </p>
        </form>
      </aside>
    </div>
  `;

  rootEl.querySelectorAll('[data-switch-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeView = btn.getAttribute('data-switch-view') || 'exterior';
      renderPropertyPage();
    });
  });

  document.getElementById('detail-fav-btn')?.addEventListener('click', () => {
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
  });

  document.getElementById('viewing-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('view-name').value.trim();
    const phone = document.getElementById('view-phone').value.trim();
    const date = document.getElementById('view-date').value;
    if (name.length < 2 || phone.length < 7) {
      showToast(lang === 'ru' ? 'Проверьте имя и номер телефона' : 'Please check name and phone');
      return;
    }
    addViewingRequest({propertyId: p.id, name, phone, date});
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

  try {
    const all = await loadPropertiesFromXml();
    currentProperty = all.find((item) => String(item.id) === String(id)) || all[0];
    document.title = `${currentProperty.title[getState().lang]} — Alora Homes`;
    renderPropertyPage();
  } catch (err) {
    if (rootEl) {
      rootEl.innerHTML = `<div class="empty-state"><h2>Объект не найден</h2><a href="/catalog.html" class="btn btn--primary">Вернуться в каталог</a></div>`;
    }
    console.error(err);
  }

  subscribe(() => renderPropertyPage());
}

initPropertyDetail();
