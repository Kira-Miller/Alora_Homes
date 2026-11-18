// ==========================================================================
// Генератор векторной SVG-графики: логотип Alora Homes, архитектурные иллюстрации
// объектов (экстерьер, интерьер, терраса) и интерактивная карта Беларуси
// ==========================================================================

export function getBrandLogoSvg(size = 34) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="aloraBrandGradInline" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#8b5cf6" />
          <stop offset="55%" stop-color="#a855f7" />
          <stop offset="100%" stop-color="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#aloraBrandGradInline)" />
      <path d="M24 12L12.5 23.5V35H19V27.5C19 25.567 20.567 24 22.5 24H25.5C27.433 24 29 25.567 29 27.5V35H35.5V23.5L24 12Z" fill="#ffffff" fill-opacity="0.96" />
      <circle cx="24" cy="19" r="2" fill="#8b5cf6" />
    </svg>
  `;
}

const PALETTES = {
  'villa-pine': {skyTop: '#241b4b', skyBot: '#102437', glow: '#8b5cf6', accent: '#f59e0b', roof: '#1e293b', wall: '#cbd5e1'},
  'minsk-tower': {skyTop: '#162544', skyBot: '#0e172a', glow: '#22d3ee', accent: '#38bdf8', roof: '#334155', wall: '#94a3b8'},
  'townhouse-dusk': {skyTop: '#3b174f', skyBot: '#151329', glow: '#c084fc', accent: '#fbbf24', roof: '#1e1b4b', wall: '#e2e8f0'},
  'forest-cottage': {skyTop: '#1a2e2b', skyBot: '#111a1e', glow: '#34d399', accent: '#fb923c', roof: '#27272a', wall: '#d6d3d1'},
  'glass-office': {skyTop: '#0f2b3c', skyBot: '#091522', glow: '#22d3ee', accent: '#60a5fa', roof: '#1e293b', wall: '#bae6fd'},
  'waterfront-loft': {skyTop: '#311b3f', skyBot: '#171329', glow: '#ec4899', accent: '#22d3ee', roof: '#27272a', wall: '#e4e4e7'},
};

/**
 * Генерирует детализированную архитектурную SVG-визуализацию объекта
 */
export function getPropertySvg(theme = 'villa-pine', viewType = 'exterior', uid = '1') {
  const p = PALETTES[theme] || PALETTES['villa-pine'];
  const gId = `sky-${theme}-${viewType}-${uid}`;

  if (viewType === 'interior') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Interior visualization">
        <defs>
          <linearGradient id="${gId}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${p.skyTop}" />
            <stop offset="100%" stop-color="#0b0c14" />
          </linearGradient>
        </defs>
        <rect width="640" height="400" fill="url(#${gId})" />
        <!-- Панорамное окно с видом -->
        <rect x="70" y="45" width="500" height="225" rx="6" fill="#0f172a" stroke="#475569" stroke-width="5" />
        <line x1="235" y1="45" x2="235" y2="270" stroke="#334155" stroke-width="4" />
        <line x1="405" y1="45" x2="405" y2="270" stroke="#334155" stroke-width="4" />
        <!-- Горизонт и закатный свет за окном -->
        <circle cx="490" cy="120" r="42" fill="${p.glow}" opacity="0.35" />
        <path d="M74 220 L180 165 L290 210 L420 155 L566 215 L566 266 L74 266 Z" fill="#1e293b" opacity="0.85" />
        <!-- Пол и ковер -->
        <polygon points="0,280 640,280 640,400 0,400" fill="#161622" />
        <polygon points="145,305 495,305 540,382 100,382" fill="#232336" stroke="${p.glow}" stroke-opacity="0.35" />
        <!-- Дизайнерский диван -->
        <rect x="175" y="242" width="290" height="58" rx="14" fill="#31334a" />
        <rect x="188" y="220" width="264" height="32" rx="10" fill="#3f425e" />
        <rect x="165" y="252" width="28" height="48" rx="8" fill="#26283b" />
        <rect x="447" y="252" width="28" height="48" rx="8" fill="#26283b" />
        <!-- Журнальный столик и тёплое освещение -->
        <rect x="260" y="318" width="120" height="14" rx="5" fill="#d4a373" opacity="0.88" />
        <line x1="320" y1="0" x2="320" y2="72" stroke="#94a3b8" stroke-width="2" />
        <ellipse cx="320" cy="82" rx="34" ry="12" fill="${p.accent}" opacity="0.92" />
        <ellipse cx="320" cy="145" rx="120" ry="70" fill="${p.accent}" opacity="0.08" />
      </svg>
    `;
  }

  if (viewType === 'terrace') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Terrace visualization">
        <defs>
          <linearGradient id="${gId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${p.skyTop}" />
            <stop offset="100%" stop-color="${p.skyBot}" />
          </linearGradient>
        </defs>
        <rect width="640" height="400" fill="url(#${gId})" />
        <circle cx="515" cy="95" r="76" fill="${p.glow}" opacity="0.24" />
        <!-- Сосновый лес на фоне -->
        <path d="M0 245 L55 150 L110 245 L165 140 L220 245 L285 160 L345 245 L420 145 L485 245 L560 155 L640 245 L640 290 L0 290 Z" fill="#0d1b24" />
        <!-- Деревянный настил террасы -->
        <polygon points="0,275 640,275 640,400 0,400" fill="#1e1b26" />
        <line x1="0" y1="305" x2="640" y2="305" stroke="#2d2838" stroke-width="2" />
        <line x1="0" y1="340" x2="640" y2="340" stroke="#2d2838" stroke-width="2" />
        <line x1="0" y1="375" x2="640" y2="375" stroke="#2d2838" stroke-width="2" />
        <!-- Навес и панорамный фасад слева -->
        <rect x="40" y="95" width="270" height="190" fill="#111827" stroke="#475569" stroke-width="3" />
        <rect x="56" y="115" width="110" height="165" fill="${p.accent}" fill-opacity="0.28" />
        <rect x="180" y="115" width="110" height="165" fill="${p.accent}" fill-opacity="0.18" />
        <!-- Лаунж-зона и бассейн / водоём -->
        <rect x="355" y="295" width="230" height="64" rx="10" fill="#0ea5e9" fill-opacity="0.34" stroke="#38bdf8" stroke-opacity="0.45" />
        <rect x="365" y="242" width="130" height="34" rx="8" fill="#334155" />
        <circle cx="545" cy="252" r="14" fill="${p.accent}" opacity="0.85" />
      </svg>
    `;
  }

  // Экстерьер (уникальный силуэт для каждого типа объекта)
  if (theme === 'minsk-tower' || theme === 'glass-office') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Architectural tower exterior">
        <defs>
          <linearGradient id="${gId}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${p.skyTop}" />
            <stop offset="100%" stop-color="${p.skyBot}" />
          </linearGradient>
        </defs>
        <rect width="640" height="400" fill="url(#${gId})" />
        <circle cx="500" cy="95" r="95" fill="${p.glow}" opacity="0.25" />
        <!-- Фоновый силуэт Минска -->
        <rect x="40" y="160" width="90" height="180" fill="#0f172a" opacity="0.7" />
        <rect x="495" y="140" width="105" height="200" fill="#0f172a" opacity="0.7" />
        <!-- Главный стеклянный небоскрёб -->
        <rect x="190" y="55" width="250" height="285" rx="6" fill="#172036" stroke="${p.accent}" stroke-opacity="0.45" stroke-width="2" />
        <rect x="210" y="75" width="210" height="245" fill="#0e1628" />
        <!-- Световые этажи -->
        <g fill="${p.accent}" opacity="0.42">
          <rect x="224" y="92" width="54" height="18" rx="2" />
          <rect x="292" y="92" width="114" height="18" rx="2" opacity="0.65" />
          <rect x="224" y="126" width="114" height="18" rx="2" opacity="0.85" />
          <rect x="352" y="126" width="54" height="18" rx="2" />
          <rect x="224" y="160" width="84" height="18" rx="2" />
          <rect x="322" y="160" width="84" height="18" rx="2" opacity="0.7" />
          <rect x="224" y="194" width="182" height="18" rx="2" opacity="0.55" />
          <rect x="224" y="228" width="95" height="18" rx="2" />
          <rect x="334" y="228" width="72" height="18" rx="2" opacity="0.8" />
        </g>
        <!-- Благоустроенный стилобат -->
        <rect x="0" y="330" width="640" height="70" fill="#090d16" />
        <rect x="165" y="308" width="300" height="28" rx="4" fill="#1e293b" />
      </svg>
    `;
  }

  // Современная вилла / загородный дом / таунхаус
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Modern residence exterior">
      <defs>
        <linearGradient id="${gId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${p.skyTop}" />
          <stop offset="100%" stop-color="${p.skyBot}" />
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#${gId})" />
      <circle cx="130" cy="95" r="88" fill="${p.glow}" opacity="0.25" />
      <!-- Силуэт хвойного леса -->
      <path d="M0 295 L42 185 L84 295 L125 170 L170 295 L500 295 L540 165 L585 295 L615 190 L640 295 Z" fill="#0b151e" opacity="0.88" />
      <!-- Земля и подъездная дорожка -->
      <rect x="0" y="295" width="640" height="105" fill="#0d111a" />
      <polygon points="150,315 490,315 560,400 80,400" fill="#1a1f2e" />
      <!-- Основной объём здания -->
      <rect x="135" y="160" width="370" height="145" rx="4" fill="${p.roof}" stroke="rgba(255,255,255,0.12)" />
      <!-- Верхняя консоль второго этажа -->
      <rect x="115" y="112" width="280" height="82" rx="4" fill="#273147" stroke="rgba(255,255,255,0.16)" />
      <rect x="110" y="106" width="292" height="10" rx="3" fill="${p.wall}" opacity="0.9" />
      <!-- Панорамные окна с тёплым интерьерным свечением -->
      <rect x="142" y="128" width="110" height="52" rx="3" fill="${p.accent}" fill-opacity="0.72" />
      <rect x="266" y="128" width="104" height="52" rx="3" fill="${p.accent}" fill-opacity="0.52" />
      <rect x="155" y="212" width="160" height="84" rx="3" fill="${p.accent}" fill-opacity="0.78" />
      <rect x="336" y="212" width="142" height="84" rx="3" fill="#111827" stroke="#475569" stroke-width="2" />
      <!-- Отражение света на террасе -->
      <ellipse cx="235" cy="316" rx="115" ry="12" fill="${p.accent}" opacity="0.22" />
    </svg>
  `;
}

/**
 * Генерирует интерактивную SVG-карту Республики Беларусь с маркерами объектов
 */
export function getBelarusMapSvg(properties, lang = 'ru', activeId = null) {
  const cities = [
    {name: lang === 'ru' ? 'Минск' : 'Minsk', x: 274, y: 186},
    {name: lang === 'ru' ? 'Брест' : 'Brest', x: 105, y: 325},
    {name: lang === 'ru' ? 'Гродно' : 'Grodno', x: 108, y: 212},
    {name: lang === 'ru' ? 'Витебск' : 'Vitebsk', x: 392, y: 102},
    {name: lang === 'ru' ? 'Гомель' : 'Gomel', x: 405, y: 315},
    {name: lang === 'ru' ? 'Могилёв' : 'Mogilev', x: 395, y: 205},
  ];

  const pins = properties
    .map((p) => {
      const isSelected = String(p.id) === String(activeId);
      return `
        <g class="belarus-map__pin" data-map-id="${p.id}" transform="translate(${p.mapCoords.x}, ${p.mapCoords.y})">
          <circle r="${isSelected ? 10 : 7}" fill="${isSelected ? '#22d3ee' : '#8b5cf6'}" stroke="#ffffff" stroke-width="2" />
        </g>
      `;
    })
    .join('');

  const cityLabels = cities
    .map(
      (c) => `
      <text x="${c.x}" y="${c.y - 12}" text-anchor="middle" fill="#a1a4b8" font-size="11" font-weight="600">${c.name}</text>
    `
    )
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 400" role="img" aria-label="Map of Belarus">
      <!-- Стилизованный контур Республики Беларусь -->
      <path
        d="M128 118 L195 92 L265 62 L352 44 L428 78 L468 148 L452 222 L462 292 L416 346 L334 342 L264 358 L178 344 L96 352 L68 292 L84 224 L62 174 Z"
        fill="rgba(139, 92, 246, 0.12)"
        stroke="rgba(139, 92, 246, 0.55)"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
      <!-- Административные связи к столице -->
      <g stroke="rgba(255,255,255,0.09)" stroke-dasharray="4 4" stroke-width="1.2">
        <line x1="274" y1="186" x2="105" y2="325" />
        <line x1="274" y1="186" x2="108" y2="212" />
        <line x1="274" y1="186" x2="392" y2="102" />
        <line x1="274" y1="186" x2="405" y2="315" />
        <line x1="274" y1="186" x2="395" y2="205" />
      </g>
      ${cityLabels}
      ${pins}
    </svg>
  `;
}

/**
 * Иконки социальных сетей в формате SVG (Telegram, Instagram, Viber, LinkedIn)
 */
export function getSocialLinksHtml(labeled = false) {
  const items = [
    {
      name: 'Telegram',
      href: 'https://t.me/alorahomes_by',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>`,
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/alorahomes.by',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    },
    {
      name: 'Viber',
      href: 'tel:+375297745210',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.5 5a4.5 4.5 0 0 1 4.5 4.5"/><path d="M14.5 2a7.5 7.5 0 0 1 7.5 7.5"/></svg>`,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    },
  ];

  return `
    <div class="social-links">
      ${items
        .map(
          (item) => `
        <a
          href="${item.href}"
          target="${item.href.startsWith('http') ? '_blank' : '_self'}"
          rel="noopener noreferrer"
          class="social-link ${labeled ? 'social-link--labeled' : ''}"
          aria-label="${item.name}"
          title="${item.name}"
        >
          ${item.svg}
          ${labeled ? `<span>${item.name}</span>` : ''}
        </a>
      `
        )
        .join('')}
    </div>
  `;
}

/**
 * Генерирует векторный портрет-иллюстрацию риэлтора для блока команды
 */
export function getRealtorPortraitSvg(index = 0) {
  const palettes = [
    {bg1: '#231845', bg2: '#13243b', suit: '#1e293b', accent: '#8b5cf6', hair: '#27201e'},
    {bg1: '#182b3a', bg2: '#151526', suit: '#334155', accent: '#22d3ee', hair: '#3b2820'},
    {bg1: '#2d193d', bg2: '#162032', suit: '#1f2937', accent: '#a855f7', hair: '#4a3728'},
  ];
  const p = palettes[index % palettes.length];
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 270" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Realtor portrait">
      <defs>
        <linearGradient id="rpBg${index}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${p.bg1}" />
          <stop offset="100%" stop-color="${p.bg2}" />
        </linearGradient>
      </defs>
      <rect width="360" height="270" fill="url(#rpBg${index})" />
      <circle cx="290" cy="55" r="70" fill="${p.accent}" opacity="0.18" />
      <!-- Силуэт офиса на фоне -->
      <rect x="28" y="34" width="90" height="170" rx="4" fill="#ffffff" opacity="0.04" />
      <rect x="242" y="48" width="90" height="156" rx="4" fill="#ffffff" opacity="0.04" />
      <!-- Костюм и плечи -->
      <path d="M88 270 C92 205 130 185 180 185 C230 185 268 205 272 270 Z" fill="${p.suit}" />
      <polygon points="160,185 180,235 200,185" fill="#f8fafc" />
      <polygon points="175,195 180,248 185,195" fill="${p.accent}" />
      <!-- Голова и причёска -->
      <rect x="164" y="152" width="32" height="36" rx="12" fill="#e6b89c" />
      <ellipse cx="180" cy="116" rx="42" ry="48" fill="#f1c7ad" />
      <path d="M138 110 C138 68 222 68 222 110 C215 84 145 84 138 110 Z" fill="${p.hair}" />
      <!-- Черты лица -->
      <circle cx="165" cy="116" r="3" fill="#1e293b" />
      <circle cx="195" cy="116" r="3" fill="#1e293b" />
      <path d="M168 138 Q180 146 192 138" stroke="#9a5b4a" stroke-width="2.5" fill="none" stroke-linecap="round" />
    </svg>
  `;
}

