// ==========================================================================
// Повторно используемые DOM-компоненты: карточки объектов, тосты и карта
// ==========================================================================

import {formatPrices, t} from './i18n.js';
import {openGuestGateModal} from './layout.js';
import {getState, isGuest, toggleCompare, toggleFavorite} from './state.js';
import {getBelarusMapSvg, getPropertySvg} from './svg-art.js';

/**
 * Показывает всплывающее уведомление (Toast)
 */
export function showToast(message, type = 'default') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast--success' : ''}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

/**
 * Создаёт DOM-элемент карточки объекта недвижимости <article class="property-card">
 */
export function createPropertyCard(property, options = {}) {
  const {lang, currency, favorites, compareList} = getState();
  const isSaved = favorites.includes(String(property.id));
  const isCompared = compareList.includes(String(property.id));
  const prices = formatPrices(property.priceByn, property.priceUsd, currency);
  const detailUrl = `./property.html?id=${encodeURIComponent(property.id)}`;

  const card = document.createElement('article');
  card.className = 'property-card';
  card.dataset.propertyId = property.id;

  // Формирование 4 кратких характеристик в зависимости от типа недвижимости
  const s = property.specs;
  const specItems = [];
  if (s.plotArea > 0) {
    specItems.push(`${t('specPlotArea', lang)}: ${s.plotArea} ${t('plotUnit', lang)}`);
  } else if (property.category === 'commercial') {
    specItems.push(property.subcategory[lang]);
  } else {
    specItems.push(`${s.rooms} ${t('roomsShort', lang)}`);
  }
  specItems.push(`${s.area} ${t('areaUnit', lang)}`);

  if (property.category === 'houses') {
    specItems.push(`${s.floors} ${t('floorsLabel', lang)}`);
  } else {
    specItems.push(`${s.floor}/${s.floors} ${t('floorLabel', lang)}`);
  }

  if (s.mkadDistance > 0) {
    specItems.push(`${t('mkadLabel', lang)} ${s.mkadDistance} ${t('kmUnit', lang)}`);
  } else if (s.newbuild) {
    specItems.push(t('newbuildLabel', lang));
  } else {
    specItems.push(`${s.year}`);
  }

  card.innerHTML = `
    <div class="property-card__media">
      <a href="${detailUrl}" aria-label="${property.title[lang]}">
        ${getPropertySvg(property.visualTheme, 'exterior', `card-${property.id}`)}
      </a>
      <span class="property-card__badge property-card__badge--${property.badge.type}">
        ${property.badge[lang]}
      </span>
      <button
        type="button"
        class="property-card__fav ${isSaved ? 'is-saved' : ''}"
        aria-label="${isSaved ? t('inFav', lang) : t('addToFav', lang)}"
        title="${isSaved ? t('inFav', lang) : t('addToFav', lang)}"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </div>
    <div class="property-card__body">
      <div class="property-card__meta-line">
        <span>${property.subcategory[lang]}</span>
        <span aria-hidden="true">·</span>
        <span>${s.year}</span>
      </div>
      <h3 class="property-card__title">
        <a href="${detailUrl}">${property.title[lang]}</a>
      </h3>
      <div class="property-card__location">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span>${property.city[lang]}</span>
      </div>
      <div class="property-card__specs">
        ${specItems.map((txt) => `<span>${txt}</span>`).join('')}
      </div>
      <div class="property-card__footer">
        <div>
          <div class="property-card__price-main">${prices.primary}</div>
          <div class="property-card__price-sub">${prices.secondary}</div>
        </div>
        <div class="property-card__actions">
          ${
            options.showCompare !== false
              ? `<button type="button" class="btn btn--secondary btn--sm js-compare-btn" title="${t('compareBtn', lang)}">${
                  isCompared ? '✓' : '⚖'
                }</button>`
              : ''
          }
          <a href="${detailUrl}" class="property-card__arrow" aria-label="${t('detailsBtn', lang)}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `;

  // Обработка добавления/удаления из избранного (недоступно в режиме гостя)
  const favBtn = card.querySelector('.property-card__fav');
  favBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (isGuest()) {
      openGuestGateModal('favorite');
      return;
    }
    const added = toggleFavorite(property.id);
    showToast(
      added
        ? lang === 'ru'
          ? 'Объект добавлен в избранное'
          : 'Added to saved properties'
        : lang === 'ru'
          ? 'Удалено из избранного'
          : 'Removed from saved',
      added ? 'success' : 'default'
    );
  });

  // Обработка добавления/удаления из сравнения
  const cmpBtn = card.querySelector('.js-compare-btn');
  cmpBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const res = toggleCompare(property.id);
    if (res.limitReached) {
      showToast(
        lang === 'ru' ? 'Можно сравнивать до 4 объектов одновременно' : 'You can compare up to 4 properties'
      );
      return;
    }
    showToast(
      res.added
        ? lang === 'ru'
          ? 'Добавлено к сравнению'
          : 'Added to comparison'
        : lang === 'ru'
          ? 'Убрано из сравнения'
          : 'Removed from comparison'
    );
  });

  return card;
}

/**
 * Открывает модальное окно с интерактивной SVG-картой объектов по Беларуси
 */
export function openBelarusMapModal(properties) {
  let modal = document.getElementById('belarus-map-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'belarus-map-modal';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }

  const {lang, currency} = getState();
  let activeId = properties[0]?.id || null;

  const renderMapContent = () => {
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog--wide" role="dialog" aria-modal="true" aria-label="${t('onMap', lang)}">
        <div class="modal-dialog__header">
          <div>
            <h2 class="modal-dialog__title">${t('onMap', lang)}</h2>
            <p style="color:var(--text-secondary);font-size:0.9rem;margin-top:4px;">
              ${lang === 'ru' ? 'Выберите маркер на карте или объект из списка справа' : 'Select a marker on the map or an item from the list'}
            </p>
          </div>
          <button type="button" class="modal-dialog__close js-close-map" aria-label="Close">✕</button>
        </div>
        <div class="belarus-map">
          <div class="belarus-map__canvas">
            ${getBelarusMapSvg(properties, lang, activeId)}
          </div>
          <div class="belarus-map__sidebar">
            ${properties
              .map((p) => {
                const pr = formatPrices(p.priceByn, p.priceUsd, currency);
                return `
                  <button type="button" class="belarus-map__item ${String(p.id) === String(activeId) ? 'is-active' : ''}" data-select-id="${p.id}">
                    <strong>${p.title[lang]}</strong>
                    <span>${p.city[lang]} · ${pr.primary}</span>
                    <a href="./property.html?id=${encodeURIComponent(p.id)}" style="color:var(--accent-primary);font-size:0.8rem;font-weight:600;margin-top:4px;">
                      ${t('detailsBtn', lang)} →
                    </a>
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;

    modal.querySelector('.js-close-map')?.addEventListener('click', () => {
      modal.classList.remove('is-open');
    });

    modal.querySelectorAll('[data-map-id], [data-select-id]').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        activeId = el.getAttribute('data-map-id') || el.getAttribute('data-select-id');
        renderMapContent();
      });
    });
  };

  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.remove('is-open');
  };

  renderMapContent();
  modal.classList.add('is-open');
}
