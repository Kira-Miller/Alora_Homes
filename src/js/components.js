// ==========================================================================
// Повторно используемые DOM-компоненты: карточки объектов и карта Беларуси
// ==========================================================================

import {formatPrices, pluralFloors, t} from './i18n.js';
import {openGuestGateModal} from './layout.js';
import {getState, isGuest, toggleCompare, toggleFavorite} from './state.js';
import {getBelarusMapSvg, getIconSvg, getPropertySvg} from './svg-art.js';
import {showToast} from './toast.js';

export {showToast};

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
    specItems.push(`${s.floors} ${pluralFloors(s.floors, lang)}`);
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

  const mediaVisual = property.image
    ? `<img src="${property.image}" alt="${property.title[lang]}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.style.display='none';this.nextElementSibling.style.display='block';" /><div style="display:none;position:absolute;inset:0;width:100%;height:100%;">${getPropertySvg(property.visualTheme, 'exterior', `card-${property.id}`)}</div>`
    : getPropertySvg(property.visualTheme, 'exterior', `card-${property.id}`);

  card.innerHTML = `
    <div class="property-card__media">
      <a href="${detailUrl}" aria-label="${property.title[lang]}">
        ${mediaVisual}
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
        ${getIconSvg(isSaved ? 'heart-filled' : 'heart', 17)}
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
              ? `<button type="button" class="btn btn--secondary btn--sm js-compare-btn" title="${t('compareBtn', lang)}" aria-label="${t('compareBtn', lang)}">${
                  isCompared ? getIconSvg('check', 15) : getIconSvg('scale', 15)
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
 * Открывает интерактивную карту Беларуси с масштабированием, панорамированием
 * и карточкой выбранного объекта справа
 */
export function openBelarusMapModal(properties, allPropertiesList = null) {
  let modal = document.getElementById('belarus-map-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'belarus-map-modal';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }

  const filteredProps = Array.isArray(properties) ? properties : [];
  const fullProps =
    Array.isArray(allPropertiesList) && allPropertiesList.length >= filteredProps.length
      ? allPropertiesList
      : filteredProps;
  const hasFilterDiff = fullProps.length > filteredProps.length && filteredProps.length > 0;
  let showAllPins = !hasFilterDiff;
  const getVisibleProps = () => (showAllPins ? fullProps : filteredProps);

  const BASE_W = 520;
  const BASE_H = 400;
  const MIN_W = 40; // Макс. увеличение 13.0× (больше 4.3×)
  let activeId = getVisibleProps()[0]?.id || null;
  let activePreset = 'all';
  let viewBox = {x: 0, y: 0, w: BASE_W, h: BASE_H};

  const clampViewBox = (vb) => {
    const w = Math.max(MIN_W, Math.min(BASE_W, vb.w));
    const h = (w * BASE_H) / BASE_W;
    const x = Math.max(-20, Math.min(BASE_W - w + 20, vb.x));
    const y = Math.max(-20, Math.min(BASE_H - h + 20, vb.y));
    return {x, y, w, h};
  };

  const applyPreset = (preset) => {
    activePreset = preset;
    if (preset === 'minsk') {
      viewBox = clampViewBox({x: 180, y: 110, w: 160, h: (160 * BASE_H) / BASE_W});
    } else if (preset === 'brest') {
      viewBox = clampViewBox({x: 30, y: 240, w: 170, h: (170 * BASE_H) / BASE_W});
    } else if (preset === 'grodno') {
      viewBox = clampViewBox({x: 35, y: 140, w: 170, h: (170 * BASE_H) / BASE_W});
    } else if (preset === 'vitebsk') {
      viewBox = clampViewBox({x: 285, y: 35, w: 175, h: (175 * BASE_H) / BASE_W});
    } else if (preset === 'gomel') {
      viewBox = clampViewBox({x: 315, y: 215, w: 175, h: (175 * BASE_H) / BASE_W});
    } else if (preset === 'mogilev') {
      viewBox = clampViewBox({x: 290, y: 115, w: 175, h: (175 * BASE_H) / BASE_W});
    } else {
      viewBox = {x: 0, y: 0, w: BASE_W, h: BASE_H};
    }
  };

  const zoomAt = (factor, cx = viewBox.x + viewBox.w / 2, cy = viewBox.y + viewBox.h / 2) => {
    activePreset = 'custom';
    const nextW = Math.max(MIN_W, Math.min(BASE_W, viewBox.w / factor));
    const nextH = (nextW * BASE_H) / BASE_W;
    const ratioX = (cx - viewBox.x) / viewBox.w;
    const ratioY = (cy - viewBox.y) / viewBox.h;
    viewBox = clampViewBox({
      x: cx - ratioX * nextW,
      y: cy - ratioY * nextH,
      w: nextW,
      h: nextH,
    });
  };

  const renderMapBody = () => {
    const {lang} = getState();
    const visibleProps = getVisibleProps();
    const canvas = modal.querySelector('#belarus-map-canvas');
    const zoomLabel = modal.querySelector('#belarus-map-zoom');
    if (!canvas) return;

    canvas.innerHTML = getBelarusMapSvg(visibleProps, lang, activeId, viewBox);
    if (zoomLabel) {
      zoomLabel.textContent = `${(BASE_W / viewBox.w).toFixed(1)}×`;
    }

    modal.querySelectorAll('[data-map-preset]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-map-preset') === activePreset);
    });

    const toggleAllBtn = modal.querySelector('#map-toggle-all');
    if (toggleAllBtn) {
      toggleAllBtn.classList.toggle('is-active', showAllPins);
      toggleAllBtn.textContent = showAllPins
        ? lang === 'ru'
          ? `По фильтру (${filteredProps.length})`
          : `Filtered (${filteredProps.length})`
        : lang === 'ru'
          ? `Показать все (${fullProps.length})`
          : `Show all (${fullProps.length})`;
    }

    canvas.querySelectorAll('[data-map-id]').forEach((pin) => {
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = e.target.closest('[data-map-id]');
        const nextId = target ? target.getAttribute('data-map-id') : pin.getAttribute('data-map-id');
        if (nextId) {
          if (!visibleProps.some((p) => String(p.id) === String(nextId))) {
            showAllPins = true;
          }
          activeId = nextId;
          renderMapBody();
          renderSidebar();
        }
      });
    });
  };

  const renderSidebar = () => {
    const {lang, currency, favorites} = getState();
    const visibleProps = getVisibleProps();
    const selectedWrap = modal.querySelector('#belarus-map-selected');
    const listWrap = modal.querySelector('#belarus-map-list');
    const listLabel = modal.querySelector('#belarus-map-list-label');
    const selectedProp = visibleProps.find((p) => String(p.id) === String(activeId)) || visibleProps[0];

    if (listLabel) {
      listLabel.textContent = `${t('mapObjectsList', lang)} (${visibleProps.length})`;
    }

    if (selectedWrap && selectedProp) {
      const pr = formatPrices(selectedProp.priceByn, selectedProp.priceUsd, currency);
      const isSaved = favorites.includes(String(selectedProp.id));
      const detailUrl = `./property.html?id=${encodeURIComponent(selectedProp.id)}`;
      const s = selectedProp.specs;

      const mapMedia = selectedProp.image
        ? `<img src="${selectedProp.image}" alt="${selectedProp.title[lang]}" decoding="async" referrerpolicy="no-referrer" onerror="this.style.display='none';this.nextElementSibling.style.display='block';" /><div style="display:none;position:absolute;inset:0;width:100%;height:100%;">${getPropertySvg(selectedProp.visualTheme, 'exterior', `map-${selectedProp.id}`)}</div>`
        : getPropertySvg(selectedProp.visualTheme, 'exterior', `map-${selectedProp.id}`);

      selectedWrap.innerHTML = `
        <div class="belarus-map__selected-card">
          <div class="belarus-map__selected-media">
            ${mapMedia}
            <span class="property-card__badge property-card__badge--${selectedProp.badge.type}">
              ${selectedProp.badge[lang]}
            </span>
            <button
              type="button"
              class="property-card__fav js-map-fav ${isSaved ? 'is-saved' : ''}"
              aria-label="${isSaved ? t('inFav', lang) : t('addToFav', lang)}"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
          <div class="belarus-map__selected-body">
            <div class="property-card__meta-line">
              <span>${selectedProp.subcategory[lang]}</span>
              <span aria-hidden="true">·</span>
              <span>${s.year}</span>
            </div>
            <h3 class="property-card__title">
              <a href="${detailUrl}">${selectedProp.title[lang]}</a>
            </h3>
            <div class="property-card__location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>${selectedProp.city[lang]}</span>
            </div>
            <div class="belarus-map__selected-specs">
              <span>${s.area} ${t('areaUnit', lang)}</span>
              <span>${s.rooms} ${t('roomsShort', lang)}</span>
              <span>${s.floor}/${s.floors} ${t('floorLabel', lang)}</span>
              <span>${s.plotArea > 0 ? `${t('specPlotArea', lang)}: ${s.plotArea} ${t('plotUnit', lang)}` : s.mkadDistance > 0 ? `${t('mkadLabel', lang)} ${s.mkadDistance} ${t('kmUnit', lang)}` : `${s.year}`}</span>
            </div>
            <div class="belarus-map__selected-footer">
              <div>
                <div class="property-card__price-main">${pr.primary}</div>
                <div class="property-card__price-sub">${pr.secondary}</div>
              </div>
              <a href="${detailUrl}" class="btn btn--primary btn--sm">
                ${t('detailsBtn', lang)} →
              </a>
            </div>
          </div>
        </div>
      `;

      selectedWrap.querySelector('.js-map-fav')?.addEventListener('click', () => {
        if (isGuest()) {
          openGuestGateModal('favorite');
          return;
        }
        const added = toggleFavorite(selectedProp.id);
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
        renderSidebar();
      });
    }

    if (listWrap) {
      listWrap.innerHTML = visibleProps
        .map((p) => {
          const pr = formatPrices(p.priceByn, p.priceUsd, currency);
          return `
            <button type="button" class="belarus-map__item ${String(p.id) === String(activeId) ? 'is-active' : ''}" data-select-id="${p.id}">
              <div>
                <strong>${p.title[lang]}</strong>
                <span>${p.city[lang]}</span>
              </div>
              <span style="font-weight:700;color:var(--text-primary);white-space:nowrap;">${pr.primary}</span>
            </button>
          `;
        })
        .join('');

      listWrap.querySelectorAll('[data-select-id]').forEach((btn) => {
        btn.addEventListener('click', () => {
          activeId = btn.getAttribute('data-select-id');
          renderMapBody();
          renderSidebar();
        });
      });
    }
  };

  const {lang} = getState();
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog--map" role="dialog" aria-modal="true" aria-label="${t('onMap', lang)}">
      <div class="modal-dialog__header">
        <div>
          <h2 class="modal-dialog__title">${t('onMap', lang)}</h2>
          <p style="color:var(--text-secondary);font-size:0.88rem;margin-top:4px;">
            ${lang === 'ru' ? 'Нажмите на маркер или выберите регион — справа откроется карточка объекта' : 'Click any marker or zoom into a region to preview the property card on the right'}
          </p>
        </div>
        <button type="button" class="modal-dialog__close js-close-map" aria-label="Close">✕</button>
      </div>

      <div class="belarus-map">
        <div class="belarus-map__stage">
          <div class="belarus-map__toolbar">
            <div class="belarus-map__presets">
              <button type="button" class="belarus-map__tool-btn is-active" data-map-preset="all">${t('mapAllBelarus', lang)}</button>
              <button type="button" class="belarus-map__tool-btn" data-map-preset="minsk">${t('mapMinskZoom', lang)}</button>
              <button type="button" class="belarus-map__tool-btn" data-map-preset="brest">${lang === 'ru' ? 'Брест' : 'Brest'}</button>
              <button type="button" class="belarus-map__tool-btn" data-map-preset="grodno">${lang === 'ru' ? 'Гродно' : 'Grodno'}</button>
              <button type="button" class="belarus-map__tool-btn" data-map-preset="vitebsk">${lang === 'ru' ? 'Витебск' : 'Vitebsk'}</button>
              <button type="button" class="belarus-map__tool-btn" data-map-preset="gomel">${lang === 'ru' ? 'Гомель' : 'Gomel'}</button>
              <button type="button" class="belarus-map__tool-btn" data-map-preset="mogilev">${lang === 'ru' ? 'Могилёв' : 'Mogilev'}</button>
              ${
                hasFilterDiff
                  ? `<button type="button" class="belarus-map__tool-btn" id="map-toggle-all"></button>`
                  : ''
              }
            </div>
            <div class="belarus-map__zoom-controls">
              <button type="button" class="belarus-map__tool-btn belarus-map__tool-btn--icon" id="map-zoom-out" aria-label="Zoom out">−</button>
              <span class="belarus-map__zoom-badge" id="belarus-map-zoom">1.0×</span>
              <button type="button" class="belarus-map__tool-btn belarus-map__tool-btn--icon" id="map-zoom-in" aria-label="Zoom in">+</button>
            </div>
          </div>

          <div class="belarus-map__canvas" id="belarus-map-canvas"></div>
          <span class="belarus-map__hint">${t('mapHint', lang)}</span>
        </div>

        <div class="belarus-map__sidebar">
          <div id="belarus-map-selected"></div>
          <div class="belarus-map__list-label" id="belarus-map-list-label">${t('mapObjectsList', lang)} (${getVisibleProps().length})</div>
          <div class="belarus-map__list" id="belarus-map-list"></div>
        </div>
      </div>
    </div>
  `;

  modal.querySelector('.js-close-map')?.addEventListener('click', () => {
    modal.classList.remove('is-open');
  });

  modal.querySelector('#map-toggle-all')?.addEventListener('click', () => {
    showAllPins = !showAllPins;
    const vis = getVisibleProps();
    if (!vis.some((p) => String(p.id) === String(activeId))) {
      activeId = vis[0]?.id || null;
    }
    if (showAllPins) applyPreset('all');
    renderMapBody();
    renderSidebar();
  });

  modal.querySelectorAll('[data-map-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyPreset(btn.getAttribute('data-map-preset') || 'all');
      renderMapBody();
    });
  });

  modal.querySelector('#map-zoom-in')?.addEventListener('click', () => {
    zoomAt(1.38);
    renderMapBody();
  });

  modal.querySelector('#map-zoom-out')?.addEventListener('click', () => {
    zoomAt(1 / 1.38);
    renderMapBody();
  });

  const canvasEl = modal.querySelector('#belarus-map-canvas');
  const activePointers = new Map();
  let dragState = null;
  let pinchState = null;
  let didPinchGesture = false;

  const syncLiveSvgAndBadge = () => {
    const svg = canvasEl?.querySelector('svg');
    if (svg) {
      svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    }
    const zoomLabel = modal.querySelector('#belarus-map-zoom');
    if (zoomLabel) {
      zoomLabel.textContent = `${(BASE_W / viewBox.w).toFixed(1)}×`;
    }
  };

  const getPinchMetrics = () => {
    const pts = Array.from(activePointers.values());
    if (pts.length < 2) return null;
    const [a, b] = pts;
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;
    return {dist, midX, midY};
  };

  canvasEl?.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const rect = canvasEl.getBoundingClientRect();
      const fx = viewBox.x + ((e.clientX - rect.left) / rect.width) * viewBox.w;
      const fy = viewBox.y + ((e.clientY - rect.top) / rect.height) * viewBox.h;
      zoomAt(e.deltaY < 0 ? 1.24 : 1 / 1.24, fx, fy);
      renderMapBody();
    },
    {passive: false}
  );

  canvasEl?.addEventListener('pointerdown', (e) => {
    const startedOnPin = Boolean(e.target.closest('[data-map-id]'));
    activePointers.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY,
      startedOnPin,
    });

    if (activePointers.size === 1) {
      if (startedOnPin) {
        dragState = null;
        return;
      }
      dragState = {
        clientX: e.clientX,
        clientY: e.clientY,
        startX: viewBox.x,
        startY: viewBox.y,
      };
      pinchState = null;
      canvasEl.classList.add('is-panning');
      canvasEl.setPointerCapture?.(e.pointerId);
    } else if (activePointers.size >= 2) {
      dragState = null;
      const metrics = getPinchMetrics();
      if (metrics) {
        pinchState = {
          prevDist: Math.max(8, metrics.dist),
          prevMidX: metrics.midX,
          prevMidY: metrics.midY,
        };
        didPinchGesture = true;
        canvasEl.classList.add('is-panning');
      }
    }
  });

  canvasEl?.addEventListener('pointermove', (e) => {
    if (!activePointers.has(e.pointerId)) return;
    activePointers.set(e.pointerId, {
      ...activePointers.get(e.pointerId),
      x: e.clientX,
      y: e.clientY,
    });

    const rect = canvasEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    if (activePointers.size >= 2 && pinchState) {
      const metrics = getPinchMetrics();
      if (!metrics) return;
      const nextDist = Math.max(8, metrics.dist);
      const factor = nextDist / pinchState.prevDist;

      // Сдвиг карты вслед за серединой жеста двумя пальцами
      const panDx = ((metrics.midX - pinchState.prevMidX) / rect.width) * viewBox.w;
      const panDy = ((metrics.midY - pinchState.prevMidY) / rect.height) * viewBox.h;
      viewBox = clampViewBox({
        x: viewBox.x - panDx,
        y: viewBox.y - panDy,
        w: viewBox.w,
        h: viewBox.h,
      });

      const fx = viewBox.x + ((metrics.midX - rect.left) / rect.width) * viewBox.w;
      const fy = viewBox.y + ((metrics.midY - rect.top) / rect.height) * viewBox.h;
      zoomAt(factor, fx, fy);
      syncLiveSvgAndBadge();

      pinchState = {
        prevDist: nextDist,
        prevMidX: metrics.midX,
        prevMidY: metrics.midY,
      };
      return;
    }

    if (activePointers.size === 1 && dragState) {
      const dx = ((e.clientX - dragState.clientX) / rect.width) * viewBox.w;
      const dy = ((e.clientY - dragState.clientY) / rect.height) * viewBox.h;
      activePreset = 'custom';
      viewBox = clampViewBox({
        x: dragState.startX - dx,
        y: dragState.startY - dy,
        w: viewBox.w,
        h: viewBox.h,
      });
      syncLiveSvgAndBadge();
    }
  });

  const handlePointerEnd = (e) => {
    activePointers.delete(e.pointerId);

    if (activePointers.size === 1) {
      // Если один палец остался после щипка — плавно переключаемся в панорамирование
      const [remId, remPt] = Array.from(activePointers.entries())[0];
      pinchState = null;
      dragState = remPt.startedOnPin
        ? null
        : {
            clientX: remPt.x,
            clientY: remPt.y,
            startX: viewBox.x,
            startY: viewBox.y,
          };
      if (dragState) {
        canvasEl?.setPointerCapture?.(remId);
      }
      return;
    }

    if (activePointers.size === 0) {
      dragState = null;
      pinchState = null;
      canvasEl?.classList.remove('is-panning');
      if (didPinchGesture) {
        didPinchGesture = false;
        renderMapBody();
      }
    }
  };

  canvasEl?.addEventListener('pointerup', handlePointerEnd);
  canvasEl?.addEventListener('pointercancel', handlePointerEnd);
  canvasEl?.addEventListener('gesturestart', (e) => e.preventDefault());
  canvasEl?.addEventListener('gesturechange', (e) => e.preventDefault());

  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.remove('is-open');
  };

  renderMapBody();
  renderSidebar();
  modal.classList.add('is-open');
}
