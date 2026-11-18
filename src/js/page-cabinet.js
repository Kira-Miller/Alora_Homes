// ==========================================================================
// Контроллер личного кабинета (cabinet.html)
// Поддерживает режим гостя и авторизованного пользователя
// ==========================================================================

import {createPropertyCard, showToast} from './components.js';
import {formatPrices, t} from './i18n.js';
import {initLayout, openAuthModal} from './layout.js';
import {
  addViewingRequest,
  cancelViewingRequest,
  continueAsGuest,
  getState,
  isGuest,
  subscribe,
  toggleCompare,
  toggleFavorite,
} from './state.js';
import {loadPropertiesFromXml, sortProperties} from './xml-loader.js';

initLayout('cabinet');

let allProperties = [];
let activeTab = 'saved';
let savedSort = 'default';

const rootEl = document.getElementById('cabinet-root');

function getInitials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('') || 'Г';
}

function renderCabinet() {
  if (!rootEl) return;
  const {lang, currency, user, favorites, compareList, viewingRequests} = getState();
  const isReg = user.mode === 'registered';

  const savedProps = sortProperties(
    allProperties.filter((p) => favorites.includes(String(p.id))),
    savedSort
  );
  const compareProps = allProperties.filter((p) => compareList.includes(String(p.id)));

  rootEl.innerHTML = `
    <div class="cabinet-banner">
      <div class="cabinet-banner__user">
        <div class="cabinet-banner__avatar">${isReg ? getInitials(user.name) : 'Г'}</div>
        <div>
          <strong style="font-size:1.1rem;display:block;">
            ${isReg ? user.name : t('guestBannerTitle', lang)}
          </strong>
          <div class="cabinet-banner__meta">
            <span>${isReg ? user.email : t('guestBannerDesc', lang)}</span>
            <span aria-hidden="true">·</span>
            <span class="tabular">${favorites.length} ${t('savedCountText', lang)}</span>
            <span aria-hidden="true">·</span>
            <span class="tabular">${viewingRequests.length} ${t('requestsCountText', lang)}</span>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        ${
          isReg
            ? `<button type="button" class="btn btn--secondary btn--sm" id="cab-logout-btn">${t('signOut', lang)}</button>`
            : `<button type="button" class="btn btn--primary btn--sm" id="cab-auth-btn">${t('registerBtn', lang)}</button>`
        }
      </div>
    </div>

    <div class="cabinet-tabs" role="tablist">
      <button type="button" class="${activeTab === 'saved' ? 'is-active' : ''}" data-cab-tab="saved" role="tab">
        ♥ ${t('tabSaved', lang)} (${savedProps.length})
      </button>
      <button type="button" class="${activeTab === 'compare' ? 'is-active' : ''}" data-cab-tab="compare" role="tab">
        ⚖ ${t('tabCompare', lang)} (${compareProps.length})
      </button>
      <button type="button" class="${activeTab === 'requests' ? 'is-active' : ''}" data-cab-tab="requests" role="tab">
        📅 ${t('tabRequests', lang)} (${viewingRequests.length})
      </button>
    </div>

    <div id="cabinet-tab-panel"></div>
  `;

  document.getElementById('cab-auth-btn')?.addEventListener('click', () => openAuthModal('register'));
  document.getElementById('cab-logout-btn')?.addEventListener('click', () => {
    continueAsGuest();
    showToast(lang === 'ru' ? 'Вы перешли в режим гостя' : 'Switched to guest mode');
  });

  rootEl.querySelectorAll('[data-cab-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTab = btn.getAttribute('data-cab-tab') || 'saved';
      renderCabinet();
    });
  });

  const panel = document.getElementById('cabinet-tab-panel');
  if (!panel) return;

  if (activeTab === 'saved') {
    panel.innerHTML = `
      <div class="section-header-row">
        <div>
          <span class="section-kicker">${t('cabinetKicker', lang)}</span>
          <h2 class="section-title">${t('tabSaved', lang)}</h2>
        </div>
        <div class="field" style="min-width:210px;">
          <select id="cab-sort" class="field__control" aria-label="${t('labelSort', lang)}">
            <option value="default" ${savedSort === 'default' ? 'selected' : ''}>${t('sortDefault', lang)}</option>
            <option value="price-asc" ${savedSort === 'price-asc' ? 'selected' : ''}>${t('sortPriceAsc', lang)}</option>
            <option value="price-desc" ${savedSort === 'price-desc' ? 'selected' : ''}>${t('sortPriceDesc', lang)}</option>
          </select>
        </div>
      </div>
      <div id="cab-saved-grid" class="property-grid"></div>
    `;

    document.getElementById('cab-sort')?.addEventListener('change', (e) => {
      savedSort = e.target.value;
      renderCabinet();
    });

    const grid = document.getElementById('cab-saved-grid');
    if (isGuest()) {
      grid.style.display = 'block';
      grid.innerHTML = `
        <div class="empty-state">
          <h3>${t('guestGateTitle', lang)}</h3>
          <p>${t('guestGateFavDesc', lang)}</p>
          <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
            <button type="button" class="btn btn--primary js-cab-guest-reg">${t('registerBtn', lang)}</button>
            <a href="tel:+375297745210" class="btn btn--secondary">📞 +375 (29) 774-52-10</a>
          </div>
        </div>
      `;
      grid.querySelector('.js-cab-guest-reg')?.addEventListener('click', () => openAuthModal('register'));
      return;
    }

    if (!savedProps.length) {
      grid.style.display = 'block';
      grid.innerHTML = `
        <div class="empty-state">
          <h3>${lang === 'ru' ? 'В избранном пока пусто' : 'No saved properties yet'}</h3>
          <p>${lang === 'ru' ? 'Добавьте понравившиеся объекты из каталога, чтобы вернуться к ним позже.' : 'Save listings from the catalog to review them here.'}</p>
          <a href="./catalog.html" class="btn btn--primary">${t('navCatalog', lang)}</a>
        </div>
      `;
      return;
    }

    savedProps.forEach((p) => {
      const card = createPropertyCard(p);
      const body = card.querySelector('.property-card__body');
      const btnBar = document.createElement('div');
      btnBar.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;';
      btnBar.innerHTML = `
        <button type="button" class="btn btn--primary btn--sm js-quick-book">${t('bookViewing', lang)}</button>
        <button type="button" class="btn btn--secondary btn--sm js-remove-fav">${t('removeSaved', lang)}</button>
      `;
      btnBar.querySelector('.js-quick-book')?.addEventListener('click', () => {
        addViewingRequest({
          propertyId: p.id,
          name: isReg ? user.name : t('guestLabel', lang),
          phone: user.phone || '+375 (29) 000-00-00',
          date: '2026-11-25',
        });
        showToast(lang === 'ru' ? 'Заявка на показ создана!' : 'Viewing request created!', 'success');
      });
      btnBar.querySelector('.js-remove-fav')?.addEventListener('click', () => {
        toggleFavorite(p.id);
      });
      body?.appendChild(btnBar);
      grid.appendChild(card);
    });
    return;
  }

  if (activeTab === 'compare') {
    if (!compareProps.length) {
      panel.innerHTML = `
        <div class="empty-state">
          <h3>${lang === 'ru' ? 'Список сравнения пуст' : 'Comparison list is empty'}</h3>
          <p>${lang === 'ru' ? 'Нажмите кнопку «⚖» на карточках в каталоге, чтобы сравнить характеристики.' : 'Click the compare button on catalog cards to compare specs.'}</p>
          <a href="./catalog.html" class="btn btn--primary">${t('navCatalog', lang)}</a>
        </div>
      `;
      return;
    }

    panel.innerHTML = `
      <div class="compare-table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th>${t('characteristics', lang)}</th>
              ${compareProps
                .map(
                  (p) => `
                <td>
                  <strong style="display:block;margin-bottom:6px;">
                    <a href="./property.html?id=${encodeURIComponent(p.id)}" style="color:var(--accent-primary);">${p.title[lang]}</a>
                  </strong>
                  <button type="button" class="btn btn--secondary btn--sm js-rm-cmp" data-id="${p.id}">${t('removeSaved', lang)}</button>
                </td>
              `
                )
                .join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>${t('objectPriceLabel', lang)}</th>
              ${compareProps.map((p) => `<td><strong>${formatPrices(p.priceByn, p.priceUsd, currency).primary}</strong></td>`).join('')}
            </tr>
            <tr>
              <th>${t('specLocation', lang)}</th>
              ${compareProps.map((p) => `<td>${p.city[lang]}</td>`).join('')}
            </tr>
            <tr>
              <th>${t('specTotalArea', lang)}</th>
              ${compareProps.map((p) => `<td>${p.specs.area} ${t('areaUnit', lang)}</td>`).join('')}
            </tr>
            <tr>
              <th>${t('specLiving', lang)}</th>
              ${compareProps.map((p) => `<td>${p.specs.livingArea} ${t('areaUnit', lang)}</td>`).join('')}
            </tr>
            <tr>
              <th>${t('specPlotArea', lang)}</th>
              ${compareProps.map((p) => `<td>${p.specs.plotArea > 0 ? `${p.specs.plotArea} ${t('plotUnit', lang)}` : '—'}</td>`).join('')}
            </tr>
            <tr>
              <th>${t('specRooms', lang)}</th>
              ${compareProps.map((p) => `<td>${p.specs.rooms}</td>`).join('')}
            </tr>
            <tr>
              <th>${t('specYear', lang)}</th>
              ${compareProps.map((p) => `<td>${p.specs.year}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    `;

    panel.querySelectorAll('.js-rm-cmp').forEach((btn) => {
      btn.addEventListener('click', () => {
        toggleCompare(btn.getAttribute('data-id'));
      });
    });
    return;
  }

  // Вкладка заявок на показ
  if (isGuest()) {
    panel.innerHTML = `
      <div class="empty-state">
        <h3>${t('guestGateTitle', lang)}</h3>
        <p>${t('guestGateBookDesc', lang)}</p>
        <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
          <button type="button" class="btn btn--primary js-cab-req-reg">${t('registerBtn', lang)}</button>
          <a href="tel:+375297745210" class="btn btn--secondary">📞 +375 (29) 774-52-10</a>
        </div>
      </div>
    `;
    panel.querySelector('.js-cab-req-reg')?.addEventListener('click', () => openAuthModal('register'));
    return;
  }

  if (!viewingRequests.length) {
    panel.innerHTML = `
      <div class="empty-state">
        <h3>${lang === 'ru' ? 'У вас пока нет заявок на показ' : 'No viewing requests yet'}</h3>
        <p>${lang === 'ru' ? 'Выберите объект в каталоге и запишитесь на удобное время.' : 'Choose a property in the catalog and schedule a tour.'}</p>
        <a href="./catalog.html" class="btn btn--primary">${t('navCatalog', lang)}</a>
      </div>
    `;
    return;
  }

  panel.innerHTML = `
    <div class="requests-list">
      ${viewingRequests
        .map((req) => {
          const prop = allProperties.find((p) => String(p.id) === String(req.propertyId));
          const title = prop ? prop.title[lang] : `Объект #${req.propertyId}`;
          return `
            <div class="request-row">
              <div>
                <strong style="font-size:1.05rem;">
                  <a href="./property.html?id=${encodeURIComponent(req.propertyId)}">${title}</a>
                </strong>
                <p style="color:var(--text-secondary);font-size:0.875rem;margin-top:4px;">
                  ${req.name} · ${req.phone} · ${t('inputDate', lang)}: <strong class="tabular">${req.date}</strong>
                </p>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="padding:6px 12px;border-radius:999px;font-size:0.78rem;font-weight:700;background:var(--accent-cyan-soft);color:var(--accent-cyan);">
                  ${req.status === 'confirmed' ? t('statusConfirmed', lang) : t('statusPending', lang)}
                </span>
                <button type="button" class="btn btn--secondary btn--sm js-cancel-req" data-req-id="${req.id}">
                  ${t('cancelRequest', lang)}
                </button>
              </div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;

  panel.querySelectorAll('.js-cancel-req').forEach((btn) => {
    btn.addEventListener('click', () => {
      cancelViewingRequest(btn.getAttribute('data-req-id'));
      showToast(lang === 'ru' ? 'Заявка отменена' : 'Request cancelled');
    });
  });
}

async function initCabinet() {
  try {
    allProperties = await loadPropertiesFromXml();
    renderCabinet();
  } catch (err) {
    console.error(err);
  }
  subscribe(() => renderCabinet());
}

initCabinet();
