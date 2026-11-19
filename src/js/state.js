// ==========================================================================
// Управление состоянием приложения и хранение данных в localStorage
// В режиме гостя избранное и запись на показ ограничены
// ==========================================================================

const STORAGE_KEY = 'alora_homes_state_v2';

const DEFAULT_STATE = {
  theme: 'dark',
  lang: 'ru',
  currency: 'BYN',
  user: {
    mode: 'guest',
    name: 'Гость',
    email: '',
    phone: '',
  },
  registeredUsers: [],
  favorites: [],
  compareList: ['1', '2'],
  viewingRequests: [],
  sellRequests: [],
  consultationRequests: [],
};

let state = loadState();
const listeners = new Set();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
      return structuredClone(DEFAULT_STATE);
    }
    const parsed = JSON.parse(raw);
    return {...structuredClone(DEFAULT_STATE), ...parsed};
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Игнорируем переполнение хранилища
  }
}

export function getState() {
  return state;
}

export function isGuest() {
  return state.user.mode !== 'registered';
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  saveState();
  listeners.forEach((fn) => fn(state));
}

export function setTheme(theme) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  notify();
}

export function toggleTheme() {
  setTheme(state.theme === 'dark' ? 'light' : 'dark');
}

export function setLang(lang) {
  state.lang = lang === 'en' ? 'en' : 'ru';
  notify();
}

export function toggleLang() {
  setLang(state.lang === 'ru' ? 'en' : 'ru');
}

export function setCurrency(currency) {
  state.currency = currency === 'USD' ? 'USD' : 'BYN';
  notify();
}

export function toggleCurrency() {
  setCurrency(state.currency === 'BYN' ? 'USD' : 'BYN');
}

export function toggleFavorite(propertyId) {
  if (isGuest()) return null;
  const id = String(propertyId);
  const exists = state.favorites.includes(id);
  if (exists) {
    state.favorites = state.favorites.filter((item) => item !== id);
  } else {
    state.favorites = [id, ...state.favorites];
  }
  notify();
  return !exists;
}

export function toggleCompare(propertyId) {
  const id = String(propertyId);
  const exists = state.compareList.includes(id);
  if (exists) {
    state.compareList = state.compareList.filter((item) => item !== id);
    notify();
    return {added: false, limitReached: false};
  }
  if (state.compareList.length >= 4) {
    return {added: false, limitReached: true};
  }
  state.compareList = [...state.compareList, id];
  notify();
  return {added: true, limitReached: false};
}

export function addViewingRequest({propertyId, name, phone, date, consultant = 'any'}) {
  if (isGuest()) return null;
  const newReq = {
    id: `req-${Date.now()}`,
    propertyId: String(propertyId),
    name,
    phone,
    date,
    consultant: consultant || 'any',
    status: 'pending',
    createdAt: new Date().toISOString().slice(0, 10),
  };
  state.viewingRequests = [newReq, ...state.viewingRequests];
  notify();
  return newReq;
}

export function cancelViewingRequest(requestId) {
  state.viewingRequests = state.viewingRequests.filter((r) => r.id !== requestId);
  notify();
}

export function addSellRequest(payload) {
  const newReq = {
    id: `sell-${Date.now()}`,
    ...payload,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  state.sellRequests = [newReq, ...state.sellRequests];
  notify();
  return newReq;
}

export function addConsultationRequest(payload) {
  const newReq = {
    id: `consult-${Date.now()}`,
    ...payload,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  state.consultationRequests = [newReq, ...state.consultationRequests];
  notify();
  return newReq;
}

export function registerUser({name, email, phone, password}) {
  const cleanEmail = email.trim().toLowerCase();
  const existing = state.registeredUsers.find((u) => u.email === cleanEmail);
  if (existing) {
    return {ok: false, reason: 'exists'};
  }
  const account = {
    name: name.trim(),
    email: cleanEmail,
    phone: phone.trim(),
    password,
  };
  state.registeredUsers = [...state.registeredUsers, account];
  state.user = {
    mode: 'registered',
    name: account.name,
    email: account.email,
    phone: account.phone,
  };
  notify();
  return {ok: true};
}

export function loginUser({email, password}) {
  const cleanEmail = email.trim().toLowerCase();
  const found = state.registeredUsers.find(
    (u) => u.email === cleanEmail && u.password === password
  );
  if (!found) {
    return {ok: false};
  }
  state.user = {
    mode: 'registered',
    name: found.name,
    email: found.email,
    phone: found.phone,
  };
  notify();
  return {ok: true};
}

export function continueAsGuest() {
  state.user = {
    mode: 'guest',
    name: 'Гость',
    email: '',
    phone: '',
  };
  state.favorites = [];
  state.viewingRequests = [];
  notify();
}

// Инициализируем тему до отрисовки страницы
document.documentElement.setAttribute('data-theme', state.theme);
