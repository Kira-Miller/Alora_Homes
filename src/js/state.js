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
  userReviews: [],
  userListings: [],
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
    stage: 2,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  state.viewingRequests = [newReq, ...state.viewingRequests];
  notify();
  return newReq;
}

export function advanceViewingStage(requestId) {
  state.viewingRequests = state.viewingRequests.map((req) => {
    if (req.id !== requestId) return req;
    const cur = Number(req.stage) || 1;
    const next = cur >= 4 ? 1 : cur + 1;
    return {
      ...req,
      stage: next,
      status: next >= 2 ? 'confirmed' : 'pending',
    };
  });
  notify();
}

export function cancelViewingRequest(requestId) {
  state.viewingRequests = state.viewingRequests.filter((r) => r.id !== requestId);
  notify();
}

export function addUserListing(payload) {
  const REGION_COORDS = {
    minsk: {x: 258, y: 186},
    'minsk-region': {x: 245, y: 196},
    brest: {x: 72, y: 300},
    grodno: {x: 76, y: 186},
    vitebsk: {x: 345, y: 88},
    gomel: {x: 375, y: 295},
    mogilev: {x: 382, y: 185},
  };
  const REGION_CITY_DEFAULT = {
    minsk: {ru: 'г. Минск', en: 'Minsk'},
    'minsk-region': {ru: 'Минская область', en: 'Minsk Region'},
    brest: {ru: 'г. Брест', en: 'Brest'},
    grodno: {ru: 'г. Гродно', en: 'Grodno'},
    vitebsk: {ru: 'г. Витебск', en: 'Vitebsk'},
    gomel: {ru: 'г. Гомель', en: 'Gomel'},
    mogilev: {ru: 'г. Могилёв', en: 'Mogilev'},
  };

  const region = payload.region || 'minsk';
  const dealType = payload.dealType === 'rent' ? 'rent' : 'sale';
  const category = payload.category || 'apartments';
  const dealGroup = category === 'commercial' ? 'commercial' : 'residential';
  const area = Math.max(10, Number(payload.area) || 64);
  const rooms = Math.max(1, Number(payload.rooms) || 2);
  const priceByn = Math.max(100, Number(payload.priceByn) || 250000);
  const priceUsd = Math.round(priceByn / 3.23);
  const cleanTitle = String(payload.title || '').trim();
  const cleanCity = String(payload.city || '').trim() || REGION_CITY_DEFAULT[region]?.ru || 'г. Минск';
  const cleanDesc = String(payload.description || '').trim();
  const coords = REGION_COORDS[region] || {x: 258, y: 186};

  const subMap = {
    apartments: dealType === 'rent' ? {ru: 'Аренда квартиры', en: 'Apartment Rent'} : {ru: 'Квартира', en: 'Apartment'},
    houses: dealType === 'rent' ? {ru: 'Аренда дома', en: 'House Rent'} : {ru: 'Загородный дом', en: 'Country House'},
    commercial: dealType === 'rent' ? {ru: 'Аренда коммерции', en: 'Commercial Rent'} : {ru: 'Коммерческая недвижимость', en: 'Commercial'},
  };
  const themeMap = {
    apartments: 'minsk-tower',
    houses: 'villa-pine',
    commercial: 'glass-office',
  };

  const newProp = {
    id: `user-${Date.now()}`,
    isUserListing: true,
    featured: true,
    dealGroup,
    dealType,
    category,
    subcategory: subMap[category] || subMap.apartments,
    region,
    city: {
      ru: cleanCity,
      en: cleanCity,
    },
    title: {
      ru: cleanTitle,
      en: cleanTitle,
    },
    badge: {
      type: 'new',
      ru: dealType === 'rent' ? 'Собственник · Аренда' : 'От собственника',
      en: dealType === 'rent' ? 'Owner · Rent' : 'Owner Listing',
    },
    priceByn,
    priceUsd,
    specs: {
      area,
      livingArea: Math.round(area * 0.68),
      plotArea: category === 'houses' ? Number(payload.plotArea) || 10 : 0,
      rooms,
      floors: Number(payload.floors) || (category === 'houses' ? 2 : 9),
      floor: Number(payload.floor) || (category === 'houses' ? 1 : 4),
      mkadDistance: region === 'minsk-region' ? 12 : 0,
      year: Number(payload.year) || 2024,
      newbuild: Boolean(payload.newbuild),
    },
    visualTheme: themeMap[category] || 'minsk-tower',
    image: payload.image || '',
    interiorImage: '',
    terraceImage: '',
    mapCoords: coords,
    description: {
      ru: cleanDesc || `Объект размещён напрямую собственником (${cleanCity}). Готов к просмотрам по предварительной записи.`,
      en: cleanDesc || `Listed directly by the owner (${cleanCity}). Available for scheduled viewings.`,
    },
    features: [
      {ru: 'Прямое объявление', en: 'Direct owner listing'},
      {ru: dealType === 'rent' ? 'Долгосрочная аренда' : 'Готов к сделке', en: dealType === 'rent' ? 'Long-term lease' : 'Ready to close'},
      {ru: 'Сопровождение Alora Homes', en: 'Alora Homes legal support'},
    ],
  };

  state.userListings = [newProp, ...(state.userListings || [])];
  notify();
  return newProp;
}

export function removeUserListing(listingId) {
  state.userListings = (state.userListings || []).filter((item) => String(item.id) !== String(listingId));
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

export function addUserReview({category = 'apartments', city = '', rating = 5, text = ''}) {
  if (isGuest()) return null;
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
  const cleanCity = String(city || '').trim() || (state.lang === 'ru' ? 'Беларусь' : 'Belarus');
  const author = state.user.name || (state.lang === 'ru' ? 'Клиент Alora Homes' : 'Alora Homes Client');
  const catNamesRu = {
    apartments: 'Квартира',
    houses: 'Загородный дом',
    commercial: 'Коммерческая недвижимость',
    exchange: 'Обмен недвижимости',
  };
  const catNamesEn = {
    apartments: 'Apartment',
    houses: 'Country House',
    commercial: 'Commercial Real Estate',
    exchange: 'Property Exchange',
  };
  const newRev = {
    id: `rev-${Date.now()}`,
    category,
    authorRu: author,
    authorEn: author,
    rating: Math.max(1, Math.min(5, Number(rating) || 5)),
    textRu: String(text || '').trim(),
    textEn: String(text || '').trim(),
    metaRu: `${catNamesRu[category] || catNamesRu.apartments} · ${cleanCity} · ${dateStr}`,
    metaEn: `${catNamesEn[category] || catNamesEn.apartments} · ${cleanCity} · ${dateStr}`,
  };
  state.userReviews = [newRev, ...(state.userReviews || [])];
  notify();
  return newRev;
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
