// ==========================================================================
// Контроллер личного кабинета (cabinet.html)
// Поддерживает режим гостя и авторизованного пользователя
// ==========================================================================

import {createPropertyCard, showToast} from './components.js';
import {formatPrices, t} from './i18n.js';
import {initLayout, openAuthModal} from './layout.js';
import {getRealtorLabel, getRealtorSelectOptionsHtml} from './realtors-data.js';
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
import {getIconSvg} from './svg-art.js';
import {
  attachPhoneMask,
  clearFormErrors,
  formatBelarusPhoneInput,
  setFieldError,
  validateBelarusPhone,
  validateFutureDate,
  validateName,
} from './validation.js';
import {loadPropertiesFromXml, sortProperties} from './xml-loader.js';

initLayout('cabinet');

let allProperties = [];
let activeTab = 'saved';
let savedSort = 'default';

const rootEl = document.getElementById('cabinet-root');

function getInitials(name, lang = 'ru') {
  return (
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || '')
      .join('') || (lang === 'ru' ? 'Г' : 'G')
  );
}

function openCabinetBookingModal(property) {
  let modal = document.getElementById('cabinet-booking-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cabinet-booking-modal';
    modal.className = 'modal-backdrop';
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('is-open');
    });
    document.body.appendChild(modal);
  }

  const {lang, user} = getState();
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;
  const initialName = user.mode === 'registered' && user.name ? user.name : '';
  const initialPhone = user.phone ? formatBelarusPhoneInput(user.phone, true, true) : '+375 ';

  modal.innerHTML = `
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-label="${t('bookingTitle', lang)}">
      <div class="modal-dialog__header">
        <div>
          <h2 class="modal-dialog__title">${t('bookingTitle', lang)}</h2>
          <p style="color:var(--text-secondary);font-size:0.86rem;margin-top:4px;">
            ${property.title[lang]} · ${property.city[lang]}
          </p>
        </div>
        <button type="button" class="modal-dialog__close js-close-cab-book" aria-label="Close">✕</button>
      </div>

      <form id="cabinet-booking-form" novalidate style="display:flex;flex-direction:column;gap:14px;">
        <div class="field">
          <label class="field__label" for="cab-book-name">${t('inputName', lang)}</label>
          <input
            id="cab-book-name"
            class="field__control"
            type="text"
            required
            value="${initialName}"
            placeholder="${t('inputNamePlaceholder', lang)}"
          />
        </div>

        <div class="field">
          <label class="field__label" for="cab-book-phone">${t('inputPhone', lang)}</label>
          <input
            id="cab-book-phone"
            class="field__control"
            type="tel"
            required
            value="${initialPhone}"
            placeholder="+375 (29) 123-45-67"
          />
        </div>

        <div class="field">
          <label class="field__label" for="cab-book-date">${t('inputDate', lang)}</label>
          <input
            id="cab-book-date"
            class="field__control"
            type="date"
            required
            min="${todayIso}"
            value=""
          />
        </div>

        <div class="field">
          <label class="field__label" for="cab-book-consultant">${t('viewConsultantLabel', lang)}</label>
          <select id="cab-book-consultant" class="field__control">
            ${getRealtorSelectOptionsHtml('any', lang)}
          </select>
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px;">
          <button type="button" class="btn btn--secondary js-close-cab-book" style="flex:1;">
            ${t('prevStepBtn', lang)}
          </button>
          <button type="submit" class="btn btn--primary" style="flex:1.6;">
            ${t('bookViewing', lang)}
          </button>
        </div>
      </form>
    </div>
  `;

  modal.querySelectorAll('.js-close-cab-book').forEach((btn) => {
    btn.addEventListener('click', () => modal.classList.remove('is-open'));
  });

  const form = modal.querySelector('#cabinet-booking-form');
  const phoneEl = modal.querySelector('#cab-book-phone');
  attachPhoneMask(phoneEl, true);

  form?.querySelectorAll('input, select').forEach((inp) => {
    inp.addEventListener('input', () => setFieldError(inp, ''));
    inp.addEventListener('change', () => setFieldError(inp, ''));
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors(form);

    const nameEl = modal.querySelector('#cab-book-name');
    const dateEl = modal.querySelector('#cab-book-date');
    const consultantEl = modal.querySelector('#cab-book-consultant');

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
      propertyId: property.id,
      name: nameRes.value,
      phone: phoneRes.value,
      date: dateRes.value,
      consultant: consultantEl?.value || 'any',
    });

    modal.classList.remove('is-open');
    showToast(lang === 'ru' ? 'Заявка на показ создана!' : 'Viewing request created!', 'success');
  });

  modal.classList.add('is-open');
  modal.querySelector('#cab-book-date')?.focus();
}

function renderCabinet() {
  if (!rootEl) return;
  const {lang, currency, user, favorites, compareList, viewingRequests} = getState();
  const isReg = user.mode === 'registered';
  const guestInitial = lang === 'ru' ? 'Г' : 'G';

  const savedProps = sortProperties(
    allProperties.filter((p) => favorites.includes(String(p.id))),
    savedSort
  );
  const compareProps = allProperties.filter((p) => compareList.includes(String(p.id)));

  rootEl.innerHTML = `
    <div class="cabinet-banner">
      <div class="cabinet-banner__user">
        <div class="cabinet-banner__avatar">${isReg ? getInitials(user.name, lang) : guestInitial}</div>
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
        ${getIconSvg('heart', 16)} <span>${t('tabSaved', lang)} (${savedProps.length})</span>
      </button>
      <button type="button" class="${activeTab === 'compare' ? 'is-active' : ''}" data-cab-tab="compare" role="tab">
        ${getIconSvg('scale', 16)} <span>${t('tabCompare', lang)} (${compareProps.length})</span>
      </button>
      <button type="button" class="${activeTab === 'requests' ? 'is-active' : ''}" data-cab-tab="requests" role="tab">
        ${getIconSvg('calendar', 16)} <span>${t('tabRequests', lang)} (${viewingRequests.length})</span>
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
        <div class="field" style="min-width:0;width:100%;max-width:260px;">
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
            <a href="tel:+375297745210" class="btn btn--secondary">${getIconSvg('phone', 16)} <span>+375 (29) 774-52-10</span></a>
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
      btnBar.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(115px,1fr));gap:8px;margin-top:8px;';
      btnBar.innerHTML = `
        <button type="button" class="btn btn--primary btn--sm js-quick-book">${t('bookViewing', lang)}</button>
        <button type="button" class="btn btn--secondary btn--sm js-remove-fav">${t('removeSaved', lang)}</button>
      `;
      btnBar.querySelector('.js-quick-book')?.addEventListener('click', () => {
        openCabinetBookingModal(p);
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
          <p>${lang === 'ru' ? 'Нажмите кнопку сравнения на карточках в каталоге, чтобы сопоставить характеристики.' : 'Click the compare button on catalog cards to compare specs.'}</p>
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
          <a href="tel:+375297745210" class="btn btn--secondary">${getIconSvg('phone', 16)} <span>+375 (29) 774-52-10</span></a>
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
          const title = prop
            ? prop.title[lang]
            : lang === 'ru'
              ? `Объект #${req.propertyId}`
              : `Property #${req.propertyId}`;
          const consultantText = getRealtorLabel(req.consultant, lang);
          return `
            <div class="request-row">
              <div class="request-row__info">
                <strong class="request-row__title">
                  <a href="./property.html?id=${encodeURIComponent(req.propertyId)}">${title}</a>
                </strong>
                <div class="request-row__meta">
                  ${req.name} · ${req.phone}
                </div>
                <div class="request-row__date">
                  ${t('inputDate', lang)}: <strong class="tabular">${req.date}</strong>
                </div>
                <div class="request-row__consultant">
                  ${t('viewConsultantLabel', lang)}: <strong>${consultantText}</strong>
                </div>
              </div>
              <div class="request-row__actions">
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
