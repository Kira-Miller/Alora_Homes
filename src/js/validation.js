// ==========================================================================
// Модуль валидации форм: имя, телефон Беларуси (+375), email, пароль и дата
// ==========================================================================

const VALID_BY_PREFIXES = new Set(['17', '25', '29', '33', '44']);

export function validateName(raw, lang = 'ru') {
  const val = String(raw || '').trim();
  if (val.length < 2) {
    return {
      ok: false,
      error: lang === 'ru' ? 'Введите имя (минимум 2 буквы)' : 'Enter your name (at least 2 letters)',
    };
  }
  if (!/^[a-zA-Zа-яА-ЯёЁіІўЎ\s'-]{2,60}$/.test(val) || !/[a-zA-Zа-яА-ЯёЁіІўЎ]{2}/.test(val)) {
    return {
      ok: false,
      error: lang === 'ru' ? 'Имя должно содержать только буквы' : 'Name must contain letters only',
    };
  }
  return {ok: true, value: val};
}

export function validateBelarusPhone(raw, lang = 'ru', prefixIncluded = true) {
  const digits = String(raw || '').replace(/\D/g, '');
  let local9 = '';

  if (digits.startsWith('375') && digits.length === 12) {
    local9 = digits.slice(3);
  } else if (digits.startsWith('80') && digits.length === 11) {
    local9 = digits.slice(2);
  } else if (!prefixIncluded && digits.length === 9) {
    local9 = digits;
  } else if (digits.length === 9) {
    local9 = digits;
  }

  if (local9.length !== 9) {
    return {
      ok: false,
      error:
        lang === 'ru'
          ? 'Укажите 9 цифр номера (например: +375 29 774-52-10)'
          : 'Enter a valid 9-digit Belarus number (e.g. +375 29 774-52-10)',
    };
  }

  const code = local9.slice(0, 2);
  if (!VALID_BY_PREFIXES.has(code)) {
    return {
      ok: false,
      error:
        lang === 'ru'
          ? 'Допустимые коды операторов Беларуси: 29, 33, 44, 25, 17'
          : 'Valid Belarus operator codes: 29, 33, 44, 25, 17',
    };
  }

  const formatted = `+375 (${code}) ${local9.slice(2, 5)}-${local9.slice(5, 7)}-${local9.slice(7, 9)}`;
  return {ok: true, value: formatted};
}

function extractBelarusLocalDigits(raw) {
  let digits = String(raw || '').replace(/\D/g, '');
  if (digits.startsWith('375')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('80')) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 9);
}

export function formatBelarusPhoneInput(raw, withCountryCode = true, keepEmptyPrefix = false) {
  const digits = extractBelarusLocalDigits(raw);
  const prefix = withCountryCode ? '+375 ' : '';

  if (digits.length === 0) {
    return withCountryCode && keepEmptyPrefix ? '+375 ' : '';
  }

  let formatted = prefix + '(' + digits.slice(0, 2);
  if (digits.length >= 2) {
    formatted += ')';
  }
  if (digits.length > 2) {
    formatted += ' ' + digits.slice(2, 5);
  }
  if (digits.length > 5) {
    formatted += '-' + digits.slice(5, 7);
  }
  if (digits.length > 7) {
    formatted += '-' + digits.slice(7, 9);
  }
  return formatted;
}

export function attachPhoneMask(inputEl, withCountryCode = true) {
  if (!inputEl) return;

  if (withCountryCode) {
    if (!inputEl.value.trim()) {
      inputEl.value = '+375 ';
    } else {
      inputEl.value = formatBelarusPhoneInput(inputEl.value, true, true);
    }
  } else if (inputEl.value.trim()) {
    inputEl.value = formatBelarusPhoneInput(inputEl.value, false, false);
  }

  if (inputEl.dataset.phoneMaskBound === '1') return;
  inputEl.dataset.phoneMaskBound = '1';

  inputEl.addEventListener('focus', () => {
    if (withCountryCode && !inputEl.value.trim()) {
      inputEl.value = '+375 ';
    }
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Backspace') return;
    const val = inputEl.value;
    const atEnd = inputEl.selectionStart === val.length && inputEl.selectionEnd === val.length;
    if (!atEnd) return;

    if (withCountryCode && val === '+375 ') {
      e.preventDefault();
      return;
    }

    if (val.endsWith(')') || val.endsWith('-') || val.endsWith(' ')) {
      const digits = extractBelarusLocalDigits(val);
      if (digits.length > 0) {
        e.preventDefault();
        const nextDigits = digits.slice(0, -1);
        inputEl.value = formatBelarusPhoneInput(nextDigits, withCountryCode, withCountryCode);
        inputEl.dispatchEvent(new Event('input', {bubbles: true}));
      }
    }
  });

  inputEl.addEventListener('input', () => {
    inputEl.value = formatBelarusPhoneInput(inputEl.value, withCountryCode, withCountryCode);
  });
}

export function validateEmail(raw, lang = 'ru') {
  const val = String(raw || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
    return {
      ok: false,
      error: lang === 'ru' ? 'Введите корректный email (например: name@example.by)' : 'Enter a valid email address',
    };
  }
  return {ok: true, value: val.toLowerCase()};
}

export function validatePassword(raw, lang = 'ru', isLogin = false) {
  const val = String(raw || '');
  if (isLogin) {
    if (val.length < 4) {
      return {
        ok: false,
        error: lang === 'ru' ? 'Пароль должен содержать минимум 4 символа' : 'Password must be at least 4 characters',
      };
    }
    return {ok: true, value: val};
  }

  if (val.length < 6) {
    return {
      ok: false,
      error: lang === 'ru' ? 'Пароль должен быть не короче 6 символов' : 'Password must be at least 6 characters',
    };
  }
  if (!/[a-zA-Zа-яА-ЯёЁ]/.test(val) || !/\d/.test(val)) {
    return {
      ok: false,
      error:
        lang === 'ru'
          ? 'Пароль должен содержать хотя бы одну букву и одну цифру'
          : 'Password must include at least one letter and one digit',
    };
  }
  return {ok: true, value: val};
}

export function validateFutureDate(raw, lang = 'ru') {
  const val = String(raw || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    return {
      ok: false,
      error: lang === 'ru' ? 'Выберите корректную дату показа' : 'Select a valid viewing date',
    };
  }
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;
  if (val < todayIso) {
    return {
      ok: false,
      error: lang === 'ru' ? 'Дата показа не может быть в прошлом' : 'Viewing date cannot be in the past',
    };
  }
  return {ok: true, value: val};
}

export function setFieldError(inputEl, message = '') {
  if (!inputEl) return;
  const wrap = inputEl.closest('.phone-prefix-wrap') || inputEl;
  wrap.classList.toggle('is-invalid', Boolean(message));

  const fieldBox = inputEl.closest('.field');
  const parent = fieldBox || wrap.parentElement;
  if (!parent) return;

  let errEl = parent.querySelector(`.field__error[data-for="${inputEl.id}"]`);
  if (!errEl && fieldBox) {
    errEl = fieldBox.querySelector('.field__error');
  }

  if (!message) {
    if (errEl) errEl.textContent = '';
    return;
  }

  if (!errEl) {
    errEl = document.createElement('div');
    errEl.className = 'field__error';
    if (inputEl.id) errEl.dataset.for = inputEl.id;
    if (fieldBox) {
      fieldBox.appendChild(errEl);
    } else {
      wrap.insertAdjacentElement('afterend', errEl);
    }
  }
  errEl.textContent = message;
}

export function clearFormErrors(formEl) {
  if (!formEl) return;
  formEl.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
  formEl.querySelectorAll('.field__error').forEach((el) => {
    el.textContent = '';
  });
}

export function syncProfileAutofill(fieldsConfig = [], user = {}, options = {}) {
  const {force = false} = options;
  const isReg = user?.mode === 'registered';
  const regName = isReg && user.name && user.name !== 'Гость' ? user.name : '';
  const regPhone = isReg && user.phone ? user.phone : '';

  fieldsConfig.forEach((cfg) => {
    const el = typeof cfg.el === 'string' ? document.getElementById(cfg.el) : cfg.el;
    if (!el) return;

    if (el.dataset.autofillBound !== '1') {
      el.dataset.autofillBound = '1';
      el.addEventListener('input', (e) => {
        if (e.isTrusted) {
          el.dataset.userEdited = '1';
        }
      });
    }

    if (force) {
      delete el.dataset.userEdited;
    }

    if (el.dataset.userEdited === '1') return;

    if (cfg.type === 'name') {
      el.value = regName;
    } else if (cfg.type === 'phone') {
      const withPrefix = cfg.withCountryCode !== false;
      el.value = regPhone
        ? formatBelarusPhoneInput(regPhone, withPrefix, withPrefix)
        : withPrefix
          ? '+375 '
          : '';
    }
  });
}

