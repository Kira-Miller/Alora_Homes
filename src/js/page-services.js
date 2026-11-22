// ==========================================================================
// Контроллер страницы услуг и продажи недвижимости (services.html)
// Объединяет каталог услуг, 3-шаговый калькулятор оценки, пакеты и заявки
// ==========================================================================

import {showToast} from './components.js';
import {formatPrices, t} from './i18n.js';
import {initLayout} from './layout.js';
import {addConsultationRequest, addSellRequest, addUserListing, getState, subscribe} from './state.js';
import {getIconSvg} from './svg-art.js';
import {
  attachPhoneMask,
  clearFormErrors,
  setFieldError,
  syncProfileAutofill,
  validateBelarusPhone,
  validateName,
} from './validation.js';

initLayout('services');

let calcStep = 1;
const calcData = {
  type: 'apartment',
  region: 'minsk',
  area: 72,
  condition: 'modern',
};

const wizardRoot = document.getElementById('sell-wizard-body');
const uploadedFiles = [];
const uploadedDataUrls = [];

function selectConsultIntent(intent = 'exchange') {
  const radio = document.querySelector(`input[name="srv-intent"][value="${intent}"]`);
  if (radio) {
    radio.checked = true;
    radio.dispatchEvent(new Event('change', {bubbles: true}));
  }
}

function applyUrlServiceParam() {
  const params = new URLSearchParams(window.location.search);
  const srv = params.get('service') || params.get('intent');
  if (srv === 'sell-house') calcData.type = 'house';
  else if (srv === 'sell-land') calcData.type = 'land';
  else if (srv === 'sell-apartment') calcData.type = 'apartment';

  const typeSelect = document.getElementById('sell-type');
  if (typeSelect && ['apartment', 'house', 'land'].includes(calcData.type)) {
    typeSelect.value = calcData.type;
  }

  if (srv === 'exchange' || window.location.hash.includes('exchange')) {
    selectConsultIntent('exchange');
  }
}

function calculateEstimate() {
  const basePerSqmUsd = {
    apartment: {minsk: 1650, 'minsk-region': 1150, brest: 1020, grodno: 1040, vitebsk: 890, gomel: 920},
    house: {minsk: 1450, 'minsk-region': 1250, brest: 950, grodno: 980, vitebsk: 820, gomel: 850},
    land: {minsk: 620, 'minsk-region': 320, brest: 220, grodno: 240, vitebsk: 180, gomel: 190},
    commercial: {minsk: 1850, 'minsk-region': 1200, brest: 1080, grodno: 1100, vitebsk: 940, gomel: 960},
  };
  const condMult = {shell: 0.82, standard: 1.0, modern: 1.22};

  const rate = basePerSqmUsd[calcData.type]?.[calcData.region] || 1100;
  const mult = condMult[calcData.condition] || 1.0;
  const area = Math.max(10, Number(calcData.area) || 60);
  const midUsd = Math.round(rate * area * mult);
  const lowUsd = Math.round(midUsd * 0.93);
  const highUsd = Math.round(midUsd * 1.08);
  const rateUsdToByn = 3.23;

  return {
    lowUsd,
    highUsd,
    lowByn: Math.round(lowUsd * rateUsdToByn),
    highByn: Math.round(highUsd * rateUsdToByn),
  };
}

function renderWizard() {
  if (!wizardRoot) return;
  const {lang, currency} = getState();

  document.querySelectorAll('[data-wizard-step]').forEach((el) => {
    const step = Number(el.getAttribute('data-wizard-step'));
    el.classList.toggle('is-active', step === calcStep);
    el.classList.toggle('is-done', step < calcStep);
  });

  if (calcStep === 1) {
    const types = [
      {
        id: 'apartment',
        icon: getIconSvg('building', 20),
        title: lang === 'ru' ? 'Квартира' : 'Apartment',
        sub: lang === 'ru' ? 'Городская недвижимость' : 'Urban residential',
      },
      {
        id: 'house',
        icon: getIconSvg('home', 20),
        title: lang === 'ru' ? 'Загородный дом' : 'Country House',
        sub: lang === 'ru' ? 'Коттеджи, таунхаусы, виллы' : 'Cottages, townhouses, villas',
      },
      {
        id: 'land',
        icon: getIconSvg('trees', 20),
        title: lang === 'ru' ? 'Земельный участок' : 'Land Plot',
        sub: lang === 'ru' ? 'Под строительство ИЖС' : 'Residential development',
      },
      {
        id: 'commercial',
        icon: getIconSvg('briefcase', 20),
        title: lang === 'ru' ? 'Коммерческая' : 'Commercial',
        sub: lang === 'ru' ? 'Офис, ритейл, склад' : 'Office, retail, warehouse',
      },
    ];

    wizardRoot.innerHTML = `
      <h3 style="font-size:1.15rem;margin-bottom:16px;">${t('calcStep1Prompt', lang)}</h3>
      <div class="type-options-grid">
        ${types
          .map(
            (item) => `
          <button type="button" class="type-option ${calcData.type === item.id ? 'is-selected' : ''}" data-prop-type="${item.id}">
            <span class="type-option__icon">${item.icon}</span>
            <div>
              <strong>${item.title}</strong>
              <span>${item.sub}</span>
            </div>
          </button>
        `
          )
          .join('')}
      </div>
      <button type="button" class="btn btn--primary btn--full" id="wizard-next-1">${t('nextStepBtn', lang)} →</button>
    `;

    wizardRoot.querySelectorAll('[data-prop-type]').forEach((btn) => {
      btn.addEventListener('click', () => {
        calcData.type = btn.getAttribute('data-prop-type') || 'apartment';
        renderWizard();
      });
    });
    document.getElementById('wizard-next-1')?.addEventListener('click', () => {
      calcStep = 2;
      renderWizard();
    });
    return;
  }

  if (calcStep === 2) {
    wizardRoot.innerHTML = `
      <h3 style="font-size:1.15rem;margin-bottom:16px;">${t('calcStep2Prompt', lang)}</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr));gap:14px;margin-bottom:20px;">
        <div class="field">
          <label class="field__label" for="calc-region">${t('labelRegion', lang)}</label>
          <select id="calc-region" class="field__control">
            <option value="minsk" ${calcData.region === 'minsk' ? 'selected' : ''}>${t('regionMinsk', lang)}</option>
            <option value="minsk-region" ${calcData.region === 'minsk-region' ? 'selected' : ''}>${t('regionMinskRegion', lang)}</option>
            <option value="brest" ${calcData.region === 'brest' ? 'selected' : ''}>${t('regionBrest', lang)}</option>
            <option value="grodno" ${calcData.region === 'grodno' ? 'selected' : ''}>${t('regionGrodno', lang)}</option>
            <option value="vitebsk" ${calcData.region === 'vitebsk' ? 'selected' : ''}>${t('regionVitebsk', lang)}</option>
            <option value="gomel" ${calcData.region === 'gomel' ? 'selected' : ''}>${t('regionGomel', lang)}</option>
          </select>
        </div>
        <div class="field">
          <label class="field__label" for="calc-area">${t('labelArea', lang)}</label>
          <input id="calc-area" class="field__control" type="number" min="10" max="2000" value="${calcData.area}" />
        </div>
        <div class="field">
          <label class="field__label" for="calc-cond">${lang === 'ru' ? 'Состояние' : 'Condition'}</label>
          <select id="calc-cond" class="field__control">
            <option value="shell" ${calcData.condition === 'shell' ? 'selected' : ''}>${lang === 'ru' ? 'Без отделки' : 'Shell & core'}</option>
            <option value="standard" ${calcData.condition === 'standard' ? 'selected' : ''}>${lang === 'ru' ? 'Хороший ремонт' : 'Standard finish'}</option>
            <option value="modern" ${calcData.condition === 'modern' ? 'selected' : ''}>${lang === 'ru' ? 'Дизайнерский ремонт' : 'Designer finish'}</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:12px;">
        <button type="button" class="btn btn--secondary" id="wizard-prev-2">← ${t('prevStepBtn', lang)}</button>
        <button type="button" class="btn btn--primary" style="flex:1;" id="wizard-next-2">${t('nextStepBtn', lang)} →</button>
      </div>
    `;

    document.getElementById('wizard-prev-2')?.addEventListener('click', () => {
      calcStep = 1;
      renderWizard();
    });
    document.getElementById('wizard-next-2')?.addEventListener('click', () => {
      calcData.region = document.getElementById('calc-region').value;
      calcData.area = Number(document.getElementById('calc-area').value) || 60;
      calcData.condition = document.getElementById('calc-cond').value;
      calcStep = 3;
      renderWizard();
    });
    return;
  }

  const est = calculateEstimate();
  const lowFmt = formatPrices(est.lowByn, est.lowUsd, currency);
  const highFmt = formatPrices(est.highByn, est.highUsd, currency);

  wizardRoot.innerHTML = `
    <h3 style="font-size:1.15rem;margin-bottom:16px;">${t('calcStep3Prompt', lang)}</h3>
    <div class="valuation-result">
      <div style="font-size:0.85rem;color:var(--text-secondary);">
        ${calcData.area} ${t('areaUnit', lang)} · ${calcData.region.toUpperCase()}
      </div>
      <div class="valuation-result__price">${lowFmt.primary} — ${highFmt.primary}</div>
      <div class="valuation-result__sub">${lowFmt.secondary} — ${highFmt.secondary}</div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;">
      <button type="button" class="btn btn--secondary" id="wizard-recalc">${t('recalcBtn', lang)}</button>
      <button type="button" class="btn btn--primary" style="flex:1;" id="wizard-apply">${t('applyWithEstimate', lang)} →</button>
    </div>
  `;

  document.getElementById('wizard-recalc')?.addEventListener('click', () => {
    calcStep = 1;
    renderWizard();
  });

  document.getElementById('wizard-apply')?.addEventListener('click', () => {
    const typeSelect = document.getElementById('sell-type');
    const commentEl = document.getElementById('sell-comment');
    if (typeSelect) typeSelect.value = calcData.type;
    if (commentEl) {
      commentEl.value =
        lang === 'ru'
          ? `Онлайн-оценка: ${calcData.area} м², ориентир ${lowFmt.primary} – ${highFmt.primary}.`
          : `Online estimate: ${calcData.area} sq.m, range ${lowFmt.primary} – ${highFmt.primary}.`;
    }
    document.getElementById('sell-application')?.scrollIntoView({behavior: 'smooth'});
  });
}

function bindServicesInteractions() {
  document.querySelectorAll('.js-preset-type').forEach((link) => {
    link.addEventListener('click', () => {
      const preset = link.getAttribute('data-preset');
      if (preset) {
        calcData.type = preset;
        calcStep = 1;
        renderWizard();
      }
    });
  });

  document.querySelectorAll('[data-select-package]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pkg = btn.getAttribute('data-select-package');
      const pkgSelect = document.getElementById('sell-package');
      if (pkgSelect && pkg) pkgSelect.value = pkg;
      document.getElementById('sell-application')?.scrollIntoView({behavior: 'smooth'});
      showToast(
        getState().lang === 'ru' ? 'Пакет выбран в форме заявки' : 'Package selected in form',
        'success'
      );
    });
  });

  document.querySelectorAll('[data-select-intent]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const intent = link.getAttribute('data-select-intent') || 'exchange';
      selectConsultIntent(intent);
      document.getElementById('consultation')?.scrollIntoView({behavior: 'smooth'});
      setTimeout(() => document.getElementById('srv-consult-name')?.focus({preventScroll: true}), 350);
    });
  });

  const dropzone = document.getElementById('sell-dropzone');
  const fileInput = document.getElementById('sell-file-input');
  const previewBox = document.getElementById('sell-previews');

  const handleFiles = (files) => {
    Array.from(files)
      .slice(0, 6)
      .forEach((file) => {
        if (!file.type.startsWith('image/')) return;
        uploadedFiles.push(file.name);
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = String(ev.target?.result || '');
          if (dataUrl) uploadedDataUrls.push(dataUrl);
          const thumb = document.createElement('div');
          thumb.className = 'dropzone__thumb';
          thumb.innerHTML = `<img src="${dataUrl}" alt="${file.name}" />`;
          previewBox?.appendChild(thumb);
        };
        reader.readAsDataURL(file);
      });
  };

  dropzone?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', (e) => {
    if (e.target.files) handleFiles(e.target.files);
  });
  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('is-dragover');
  });
  dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('is-dragover');
    if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
  });

  const sellForm = document.getElementById('sell-form');
  const sellPhoneEl = document.getElementById('sell-phone');
  const directCheckEl = document.getElementById('sell-publish-direct');
  const directFieldsEl = document.getElementById('sell-direct-fields');

  const SELL_AUTOFILL_FIELDS = [
    {el: 'sell-name', type: 'name'},
    {el: 'sell-phone', type: 'phone', withCountryCode: true},
  ];
  const SRV_CONSULT_AUTOFILL_FIELDS = [
    {el: 'srv-consult-name', type: 'name'},
    {el: 'srv-consult-phone', type: 'phone', withCountryCode: false},
  ];

  directCheckEl?.addEventListener('change', () => {
    if (directFieldsEl) directFieldsEl.hidden = !directCheckEl.checked;
  });

  syncProfileAutofill(SELL_AUTOFILL_FIELDS, getState().user, {force: false});
  attachPhoneMask(sellPhoneEl, true);
  sellForm?.querySelectorAll('input, textarea').forEach((inp) => {
    inp.addEventListener('input', () => setFieldError(inp, ''));
    inp.addEventListener('change', () => setFieldError(inp, ''));
  });
  sellForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors(sellForm);
    const {lang, user} = getState();
    const nameEl = document.getElementById('sell-name');
    const phoneEl = document.getElementById('sell-phone');
    const agreeEl = document.getElementById('sell-agree');
    const type = document.getElementById('sell-type').value;
    const pkg = document.getElementById('sell-package').value;
    const comment = document.getElementById('sell-comment').value.trim();

    const nameRes = validateName(nameEl?.value, lang);
    const phoneRes = validateBelarusPhone(phoneEl?.value, lang, true);
    let firstInvalid = null;

    if (!nameRes.ok) {
      setFieldError(nameEl, nameRes.error);
      firstInvalid ||= nameEl;
    }
    if (!phoneRes.ok) {
      setFieldError(phoneEl, phoneRes.error);
      firstInvalid ||= phoneEl;
    }
    if (!agreeEl?.checked) {
      setFieldError(
        agreeEl,
        lang === 'ru' ? 'Подтвердите согласие с Политикой конфиденциальности' : 'Please accept the Privacy Policy'
      );
      firstInvalid ||= agreeEl;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    addSellRequest({
      name: nameRes.value,
      phone: phoneRes.value,
      type,
      pkg,
      comment,
      photosCount: uploadedFiles.length,
    });

    let publishedProp = null;
    if (directCheckEl?.checked) {
      const catMap = {apartment: 'apartments', house: 'houses', land: 'houses', commercial: 'commercial'};
      const rawTitle = document.getElementById('sell-pub-title')?.value.trim();
      const dealType = document.getElementById('sell-pub-deal')?.value || 'sale';
      const region = document.getElementById('sell-pub-region')?.value || 'minsk';
      const city = document.getElementById('sell-pub-city')?.value.trim() || '';
      const priceByn = Number(document.getElementById('sell-pub-price')?.value) || 250000;
      const area = Number(document.getElementById('sell-pub-area')?.value) || 64;
      const rooms = Number(document.getElementById('sell-pub-rooms')?.value) || 2;
      const defaultTitle =
        lang === 'ru'
          ? `${rooms}-комнатный объект (${area} м²)`
          : `${rooms}-Room Property (${area} m²)`;

      publishedProp = addUserListing({
        title: rawTitle || defaultTitle,
        dealType,
        category: catMap[type] || 'apartments',
        region,
        city,
        priceByn,
        area,
        rooms,
        description: comment,
        image: uploadedDataUrls[0] || '',
      });
    }

    sellForm.reset();
    syncProfileAutofill(SELL_AUTOFILL_FIELDS, user, {force: true});
    if (previewBox) previewBox.innerHTML = '';
    if (directFieldsEl) directFieldsEl.hidden = true;
    uploadedFiles.length = 0;
    uploadedDataUrls.length = 0;

    showToast(
      publishedProp
        ? lang === 'ru'
          ? 'Заявка принята! Объявление отправлено на модерацию и появится в каталоге после одобрения.'
          : 'Request saved! Your listing is pending review and will appear publicly once approved.'
        : lang === 'ru'
          ? 'Заявка отправлена! Агент Alora Homes свяжется с вами сегодня.'
          : 'Request submitted! An Alora Homes advisor will reach out today.',
      'success'
    );
  });

  const consultForm = document.getElementById('services-consult-form');
  syncProfileAutofill(SRV_CONSULT_AUTOFILL_FIELDS, getState().user, {force: false});
  attachPhoneMask(document.getElementById('srv-consult-phone'), false);
  consultForm?.querySelectorAll('input').forEach((inp) => {
    inp.addEventListener('input', () => setFieldError(inp, ''));
  });
  consultForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors(consultForm);
    const {lang, user} = getState();
    const intent = consultForm.querySelector('input[name="srv-intent"]:checked')?.value || 'sell';
    const nameEl = document.getElementById('srv-consult-name');
    const phoneEl = document.getElementById('srv-consult-phone');
    const city = document.getElementById('srv-consult-city').value.trim();

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
    syncProfileAutofill(SRV_CONSULT_AUTOFILL_FIELDS, user, {force: true});
    showToast(
      lang === 'ru'
        ? 'Заявка на консультацию принята! Специалист скоро позвонит.'
        : 'Consultation request submitted!',
      'success'
    );
  });
}

applyUrlServiceParam();
renderWizard();
bindServicesInteractions();
let lastAuthSig = `${getState().user.mode}|${getState().user.name}|${getState().user.phone}`;
subscribe(() => {
  const curUser = getState().user;
  const nextAuthSig = `${curUser.mode}|${curUser.name}|${curUser.phone}`;
  if (nextAuthSig !== lastAuthSig) {
    lastAuthSig = nextAuthSig;
    syncProfileAutofill(
      [
        {el: 'sell-name', type: 'name'},
        {el: 'sell-phone', type: 'phone', withCountryCode: true},
        {el: 'srv-consult-name', type: 'name'},
        {el: 'srv-consult-phone', type: 'phone', withCountryCode: false},
      ],
      curUser,
      {force: true}
    );
  }
  renderWizard();
});
