// ==========================================================================
// Контроллер страницы аналитики рынка недвижимости Беларуси (analytics.html)
// ==========================================================================

import {initLayout} from './layout.js';
import {getState, subscribe} from './state.js';
import {getIconSvg} from './svg-art.js';

initLayout('analytics');

const USD_TO_BYN = 3.227;

const MARKET_REGIONS = [
  {
    id: 'minsk-center',
    nameRu: 'Минск (Центр)',
    nameEn: 'Minsk (Center)',
    shortRu: 'Минск Ц.',
    shortEn: 'Minsk Ctr',
    aptUsd: 2180,
    houseUsd: 2450,
    commUsd: 2620,
    yoyPct: 7.4,
    days: 29,
    catalogQuery: '?region=minsk',
    noteRu: 'Независимости, Сторожовская, проспект Победителей — высокий спрос со стороны IT и инвесторов.',
    noteEn: 'Independence & Pobediteley avenues — high demand from IT specialists and investors.',
  },
  {
    id: 'minsk-city',
    nameRu: 'Минск (спальные р-ны)',
    nameEn: 'Minsk (Residential)',
    shortRu: 'Минск',
    shortEn: 'Minsk Res',
    aptUsd: 1640,
    houseUsd: 1890,
    commUsd: 1950,
    yoyPct: 6.1,
    days: 34,
    catalogQuery: '?region=minsk',
    noteRu: 'Серебрянка, Орловская, Фрунзенский район — сбалансированный бюджет и высокая ликвидность.',
    noteEn: 'Serebryanka, Orlovskaya, Frunzensky — balanced entry budget and quick resale liquidity.',
  },
  {
    id: 'minsk-suburbs',
    nameRu: 'Минский р-н (Ратомка / Н. Боровая)',
    nameEn: 'Minsk Dist. (Suburbs)',
    shortRu: 'Минский р-н',
    shortEn: 'Minsk Dist',
    aptUsd: 1710,
    houseUsd: 1760,
    commUsd: 1580,
    yoyPct: 8.2,
    days: 36,
    catalogQuery: '?region=minsk-region',
    noteRu: 'Новая Боровая, Ратомка, Раубичи, Смиловичи — лидер по росту стоимости загородных домов.',
    noteEn: 'Novaya Borovaya, Ratomka, Raubichi, Smilovichi — fastest appreciation in suburban housing.',
  },
  {
    id: 'grodno',
    nameRu: 'Гродно и область',
    nameEn: 'Grodno & Region',
    shortRu: 'Гродно',
    shortEn: 'Grodno',
    aptUsd: 1090,
    houseUsd: 1240,
    commUsd: 1310,
    yoyPct: 5.8,
    days: 39,
    catalogQuery: '?region=grodno',
    noteRu: 'Высокий интерес к историческому центру и индивидуальной застройке у зелёных зон.',
    noteEn: 'Strong interest in historic center apartments and green-belt family homes.',
  },
  {
    id: 'brest',
    nameRu: 'Брест и область',
    nameEn: 'Brest & Region',
    shortRu: 'Брест',
    shortEn: 'Brest',
    aptUsd: 1045,
    houseUsd: 1180,
    commUsd: 1260,
    yoyPct: 5.3,
    days: 41,
    catalogQuery: '?region=brest',
    noteRu: 'Устойчивый спрос на улицы Советскую, Гоголя и жилые кварталы вдоль Набережной.',
    noteEn: 'Steady demand around Sovetskaya St and modern residential quarters near the river.',
  },
  {
    id: 'gomel',
    nameRu: 'Гомель и область',
    nameEn: 'Gomel & Region',
    shortRu: 'Гомель',
    shortEn: 'Gomel',
    aptUsd: 930,
    houseUsd: 1080,
    commUsd: 1140,
    yoyPct: 4.5,
    days: 45,
    catalogQuery: '?region=gomel',
    noteRu: 'Особой популярностью пользуются коттеджи в посёлке Чёнки и новостройки Центрального района.',
    noteEn: 'Cottages in Chyonki and Central district developments drive regional volume.',
  },
  {
    id: 'vitebsk',
    nameRu: 'Витебск и Полоцк',
    nameEn: 'Vitebsk & Polotsk',
    shortRu: 'Витебск',
    shortEn: 'Vitebsk',
    aptUsd: 885,
    houseUsd: 995,
    commUsd: 1090,
    yoyPct: 4.1,
    days: 47,
    catalogQuery: '?region=vitebsk',
    noteRu: 'Проспект Фрунзе и проспект Скорины в Полоцке формируют ядро ликвидных сделок региона.',
    noteEn: 'Frunze Ave in Vitebsk and Skaryna Ave in Polotsk anchor regional transaction volume.',
  },
  {
    id: 'mogilev',
    nameRu: 'Могилёв и область',
    nameEn: 'Mogilev & Region',
    shortRu: 'Могилёв',
    shortEn: 'Mogilev',
    aptUsd: 895,
    houseUsd: 1015,
    commUsd: 1110,
    yoyPct: 4.4,
    days: 46,
    catalogQuery: '?region=mogilev',
    noteRu: 'Повышенный интерес к качественным объектам на Первомайской улице и вблизи Печерского лесопарка.',
    noteEn: 'Growing demand along Pervomayskaya St and near Pechersky forest park.',
  },
  {
    id: 'slutsk-sat',
    nameRu: 'Слуцк и Смиловичи',
    nameEn: 'Slutsk & Smilovichi',
    shortRu: 'Слуцк',
    shortEn: 'Slutsk',
    aptUsd: 785,
    houseUsd: 920,
    commUsd: 940,
    yoyPct: 6.7,
    days: 38,
    catalogQuery: '?query=%D0%A1%D0%BB%D1%83%D1%86%D0%BA',
    noteRu: 'Выгодное соотношение цены м² и транспортной доступности к Минску стимулирует сделки.',
    noteEn: 'Attractive cost per sq.m and highway connectivity to Minsk drive buyer activity.',
  },
  {
    id: 'pinsk-volk',
    nameRu: 'Пинск и Волковыск',
    nameEn: 'Pinsk & Volkovysk',
    shortRu: 'Пинск/Волк.',
    shortEn: 'Pinsk/Volk',
    aptUsd: 760,
    houseUsd: 890,
    commUsd: 910,
    yoyPct: 5.1,
    days: 43,
    catalogQuery: '?query=%D0%9F%D0%B8%D0%BD%D1%81%D0%BA',
    noteRu: 'Стабильный локальный спрос на семейные дома с участком и энергоэффективные квартиры.',
    noteEn: 'Consistent local demand for family homes with land plots and energy-efficient flats.',
  },
];

const MONTHLY_TREND = {
  monthsRu: ['Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя'],
  monthsEn: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  series: {
    minsk: {
      labelRu: 'Минск (средняя)',
      labelEn: 'Minsk (avg)',
      valuesUsd: [1585, 1595, 1608, 1618, 1630, 1642, 1649, 1656, 1664, 1672, 1680, 1692],
    },
    regional: {
      labelRu: 'Областные центры',
      labelEn: 'Regional Capitals',
      valuesUsd: [940, 945, 952, 958, 966, 974, 980, 986, 992, 998, 1004, 1012],
    },
    towns: {
      labelRu: 'Слуцк, Пинск, Волковыск',
      labelEn: 'Satellite Towns',
      valuesUsd: [735, 740, 745, 750, 756, 762, 766, 771, 776, 780, 784, 790],
    },
  },
};

const ADVICE_CARDS = [
  {
    id: 'audit-bti',
    icon: 'scale',
    titleRu: 'Проверка истории объекта и БТИ перед задатком',
    titleEn: 'Title & Registry Audit Before Deposit',
    bodyRu:
      'Запросите выписку из ЕГРНИ о правах и обременениях, проверьте согласование перепланировок по техпаспорту БТИ и отсутствие зарегистрированных третьих лиц.',
    bodyEn:
      'Always request a fresh state registry extract verifying title and encumbrances, match floor layouts against the technical passport, and confirm vacant registration status.',
    fullRu: [
      'Перед подписанием предварительного договора и внесением задатка необходимо убедиться, что продавец обладает полным правом распоряжения объектом и отсутствуют скрытые ограничения.',
      'Чек-лист Alora Homes из 5 обязательных шагов:',
      '1. Актуальная выписка из ЕГРНИ (выданная не позднее чем за 3 дня до сделки) — подтверждает отсутствие арестов, ипотечных залогов и судебных запретов.',
      '2. Сверка фактической планировки с техпаспортом БТИ — несогласованные сносы стен или перенос мокрых зон снижают ипотечную привлекательность объекта на 10–15%.',
      '3. Копия лицевого счёта (форма о зарегистрированных лицах) и проверка на право проживания бывших членов семьи или несовершеннолетних.',
      '4. При продаже по доверенности — нотариальная проверка её действительности в реестре нотариальной палаты на день подписания договора.',
    ],
    fullEn: [
      'Before signing a preliminary agreement or handing over a deposit, verify that the seller holds unrestricted legal title with no hidden third-party claims.',
      'Alora Homes 5-Step Pre-Deposit Checklist:',
      '1. Fresh State Real Estate Registry extract (issued within 3 days) confirming zero liens, court freezes, or mortgage encumbrances.',
      '2. Architectural blueprint cross-check against the official BTI technical passport to catch unpermitted structural alterations.',
      '3. Occupancy & registration certificate audit verifying all minors or former household members have vacated or consented.',
      '4. If signing via Power of Attorney, live notarial verification on the exact date of closing.',
    ],
  },
  {
    id: 'budget-byn',
    icon: 'building',
    titleRu: 'Расчёт реального бюджета в BYN и USD',
    titleEn: 'Dual-Currency Budgeting (BYN & USD)',
    bodyRu:
      'Согласно законодательству РБ расчёты производятся в белорусских рублях. Закладывайте 2–3% от цены на нотариальное оформление, госпошлины и банковскую комиссию.',
    bodyEn:
      'Settlements in Belarus are legally executed in BYN. Reserve 2–3% above the purchase price for notary fees, state registration duties, and bank transfers.',
    fullRu: [
      'Рынок Беларуси исторически использует долларовый ориентир при переговорах, однако официальные расчёты по договорам купли-продажи производятся в белорусских рублях по курсу НБ РБ или согласованному банковскому курсу.',
      'Что важно заложить в финансовую модель сделки:',
      '1. Резерв 2–3% сверх цены объекта на оформление: нотариальное удостоверение или регистратор БТИ, выдача нового свидетельства, банковская комиссия за перевод или пересчёт наличных.',
      '2. Проверка условий безналичного расчёта через аккредитив или банковский перевод — это избавляет от курсовых потерь при крупных суммах.',
      '3. Для кредитных сделок Беларусбанка или Белинвестбанка учитывайте оценку стоимости залога сертифицированным оценщиком (в среднем 150–250 BYN).',
    ],
    fullEn: [
      'While Belarus listing benchmarks often quote USD equivalents, all legal closings settle in Belarusian Rubles (BYN) indexed at the National Bank or agreed bank rate.',
      'Key budgeting items beyond the headline price:',
      '1. Reserve 2–3% extra for notary certification, BTI state registration, updated title certificates, and bank settlement fees.',
      '2. Prefer bank letters of credit or direct wire transfers to eliminate currency conversion spreads on large closing amounts.',
      '3. For Belarusian bank mortgages, budget 150–250 BYN for an accredited independent collateral appraisal report.',
    ],
  },
  {
    id: 'house-checklist',
    icon: 'trees',
    titleRu: 'Чек-лист при покупке загородного дома',
    titleEn: 'Country Estate Engineering Checklist',
    bodyRu:
      'Оцените мощность выделенного электричества (от 15 кВт), глубину скважины, наличие магистрального газа, правовой статус участка (ПНВ или частная собственность) и подъезд зимой.',
    bodyEn:
      'Verify electrical capacity (15+ kW), well water yield, gas connection status, land ownership tenure, and all-season road clearance before closing.',
    fullRu: [
      'Загородный дом требует отдельной технической и земельно-правовой экспертизы: устранение скрытых ошибок в инженерии может обойтись дороже косметического ремонта.',
      'На что смотрят эксперты Alora Homes при выезде:',
      '1. Статус земли: частная собственность, пожизненное наследуемое владение (ПНВ) или аренда — это напрямую влияет на возможность продажи иностранцам и наследования.',
      '2. Электроснабжение: оптимально 3 фазы 380В и выделенная мощность от 15 кВт (особенно если используется тепловой насос или электрокотёл).',
      '3. Вода и канализация: паспорт скважины (глубина на второй водоносный горизонт от 45 м), тип септика или станция биоочистки, отсутствие высокого уровня грунтовых вод весной.',
      '4. Тепловизионный осмотр фасада, кровли и узлов примыкания окон в холодный сезон.',
    ],
    fullEn: [
      'Acquiring a suburban home or cottage requires deeper engineering and land-tenure due diligence than an urban apartment.',
      'Critical inspection points used by Alora Homes advisors:',
      '1. Land tenure status: private freehold vs. heritable life estate vs. lease — affects future resale flexibility.',
      '2. Power supply: 3-phase 380V service with at least 15 kW capacity for heat pumps, EV chargers, or electric boilers.',
      '3. Water & septic engineering: certified borehole log (typically 45+ m depth), biological treatment tank specs, and spring groundwater drainage.',
      '4. Thermal-camera inspection of roof insulation, facade joints, and window seals.',
    ],
  },
  {
    id: 'liquidity-3y',
    icon: 'briefcase',
    titleRu: 'Как оценить ликвидность через 3–5 лет',
    titleEn: 'Assessing 3–5 Year Resale Liquidity',
    bodyRu:
      'Объекты в пешей доступности от метро, в кварталах с готовой школьной инфраструктурой или у крупных магистралей (М1, Р23) сохраняют цену и продаются на 30% быстрее.',
    bodyEn:
      'Properties within walking distance of metro lines, completed schools, or major highways retain capital value better and resell 30% faster.',
    fullRu: [
      'Даже если вы покупаете квартиру для собственной семьи, стоит оценить, насколько легко её будет продать или сдать в аренду через 3–5 лет без потери капитала.',
      'Факторы максимальной ликвидности в Беларуси:',
      '1. Транспортный радиус: до 10–12 минут пешком до станции метро в Минске или остановок ключевых магистралей в областных центрах.',
      '2. Функциональная планировка: изолированные спальни, просторная кухня-гостиная от 18 м², отсутствие длинных «тёмных» коридоров.',
      '3. Дворовая среда без транзитного транспорта, готовые детские сады и школы в пешей доступности — главный драйвер семейного спроса.',
    ],
    fullEn: [
      'Even when purchasing a primary family residence, evaluating 3-to-5 year exit liquidity protects your long-term capital.',
      'Top value-retention drivers across Belarus:',
      '1. Transit proximity: within a 10–12 minute walk of Minsk metro stations or primary regional boulevards.',
      '2. Efficient floor plans: private bedrooms paired with an 18+ m² kitchen-living area and minimal wasted corridor footage.',
      '3. Pedestrian-friendly courtyards, completed kindergartens/schools, and on-site parking infrastructure.',
    ],
  },
];

const MARKET_NEWS = [
  {
    id: 'news-townhouses',
    dateRu: '16 ноября 2026',
    dateEn: 'Nov 16, 2026',
    tagRu: 'Минск и пригород',
    tagEn: 'Minsk & Suburbs',
    titleRu: 'Спрос на готовые таунхаусы в радиусе до 15 км от МКАД вырос на 18% за год',
    titleEn: 'Demand for turnkey townhouses within 15 km of the Minsk Ring Road rose 18% YoY',
    summaryRu:
      'Покупатели всё чаще выбирают формат «городской комфорт на своей земле» с готовым отоплением, газом и оптоволокном вместо самостоятельной долгой стройки.',
    summaryEn:
      'Buyers increasingly favor turnkey townhouses with gas heating and fiber internet over multi-year ground-up construction.',
    fullRu: [
      'По внутренней статистике сделок Alora Homes за 2026 год доля запросов на готовые таунхаусы и компактные дома площадью 120–180 м² в направлении Ратомки, Боровлян и Смиловичей увеличилась на 18%.',
      'Ключевой мотив семейных покупателей — отказ от 2–3 лет самостоятельной стройки на фоне удорожания отделочных материалов. Готовый дом с подключённым газом, асфальтированным подъездом и террасой стоит сопоставимо с просторной 3–4-комнатной квартирой в пределах МКАД.',
      'При этом средний срок продажи укомплектованного таунхауса с проверкой БТИ сократился с 54 до 36 дней.',
    ],
    fullEn: [
      'Internal transaction data from Alora Homes for 2026 shows demand for move-in-ready 120–180 m² townhouses along the Ratomka, Borovlyany, and Smilovichi corridors grew 18% YoY.',
      'Family buyers are increasingly skipping multi-year custom builds, opting instead for completed developments with natural gas, paved access roads, and private terraces priced comparably to 3–4 bedroom urban apartments.',
      'Average time on market for BTI-verified turnkey townhouses shortened from 54 to 36 days.',
    ],
  },
  {
    id: 'news-tradein',
    dateRu: '11 ноября 2026',
    dateEn: 'Nov 11, 2026',
    tagRu: 'Регионы Беларуси',
    tagEn: 'Regional Markets',
    titleRu: 'Гродно, Брест и Слуцк показали рекордную скорость закрытия сделок с трейд-ин',
    titleEn: 'Grodno, Brest, and Slutsk hit record closing speed on trade-in apartment swaps',
    summaryRu:
      'Синхронные цепочки «продажа старой квартиры + покупка большей площади» сократились с 65 до 38 дней благодаря прозрачной оценке и предпроверке документов.',
    summaryEn:
      'Coordinated sell-and-buy chains dropped from 65 to 38 days thanks to pre-audited documentation and transparent 24-hour appraisals.',
    fullRu: [
      'В региональных центрах и городах-спутниках свыше 34% сделок сегодня проходят в формате встречной цепочки (обмен меньшей квартиры на более просторное жильё с доплатой или привлечением кредита).',
      'Ранее такие сделки затягивались до 2–3 месяцев из-за расхождения ожиданий продавцов по цене. Использование экспресс-оценки за 24 часа на базе реальных цен закрытия и предварительная подготовка справок позволили сократить средний цикл до 38 дней.',
    ],
    fullEn: [
      'In regional capitals and satellite towns, over 34% of residential closings now operate as synchronized trade-in chains upgrading from smaller flats into larger family homes.',
      'Combining 24-hour market-comp valuations with advance document verification cut average chain closing times from 65 days down to 38 days.',
    ],
  },
  {
    id: 'news-commercial',
    dateRu: '04 ноября 2026',
    dateEn: 'Nov 04, 2026',
    tagRu: 'Коммерческая недвижимость',
    tagEn: 'Commercial Sector',
    titleRu: 'Офисы формата A и стрит-ритейл в областных центрах сохраняют доходность 8–10% годовых',
    titleEn: 'Grade-A offices and street retail in regional capitals sustain 8–10% annual yields',
    summaryRu:
      'Наибольший интерес инвесторов сосредоточен на помещениях с готовым долгосрочным арендатором на первых линиях центральных проспектов.',
    summaryEn:
      'Investor interest centers on prime street-level retail and flexible office blocks with established long-term tenants.',
    fullRu: [
      'Частные инвесторы всё активнее диверсифицируют портфели между жилой арендой (доходность 5–6% годовых) и компактными помещениями стрит-ритейла в Минске, Бресте и Гродно (8–10% годовых в валютном эквиваленте).',
      'Наиболее устойчивый спрос сохраняется на помещения от 65 до 180 м² с отдельным входом, витринными окнами и выделенной электрической мощностью под кофейни, медицинские кабинеты и шоурумы.',
    ],
    fullEn: [
      'Private investors are balancing residential rental yields (5–6% p.a.) with prime street-retail units in Minsk, Brest, and Grodno generating 8–10% annual returns.',
      'Spaces between 65 and 180 m² with direct street entry, display glazing, and upgraded electrical capacity for cafes, clinics, or showrooms show near-zero vacancy.',
    ],
  },
];

let activeSegment = 'apt'; // 'apt' | 'house' | 'comm'
let selectedRegionId = 'minsk-center';
let activeTrendSeries = 'minsk'; // 'minsk' | 'regional' | 'towns'
let activeMonthIdx = 11; // Ноябрь

function getSegmentPriceUsd(regionObj, segment) {
  if (segment === 'house') return regionObj.houseUsd;
  if (segment === 'comm') return regionObj.commUsd;
  return regionObj.aptUsd;
}

function formatSqmPrice(usdVal, currency, lang) {
  const unit = lang === 'ru' ? 'м²' : 'm²';
  const bynVal = Math.round(usdVal * USD_TO_BYN);
  const strUsd = `$${usdVal.toLocaleString('ru-RU')}/${unit}`;
  const strByn = `${bynVal.toLocaleString('ru-RU')} BYN/${unit}`;
  return currency === 'USD'
    ? {primary: strUsd, secondary: strByn, val: usdVal}
    : {primary: strByn, secondary: strUsd, val: bynVal};
}

function formatBudgetTotal(usdVal, currency) {
  const bynVal = Math.round(usdVal * USD_TO_BYN);
  return currency === 'USD'
    ? `$${Math.round(usdVal).toLocaleString('ru-RU')}`
    : `${bynVal.toLocaleString('ru-RU')} BYN`;
}

function renderBarChartSvg(regions, segment, activeId, currency, lang) {
  const w = 720;
  const h = 330;
  const padL = 56;
  const padR = 16;
  const padT = 26;
  const padB = 52;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const rawMax = Math.max(...regions.map((r) => getSegmentPriceUsd(r, segment)));
  const maxUsd = Math.ceil(rawMax / 500) * 500;
  const gridSteps = 4;

  const gridLines = Array.from({length: gridSteps + 1}, (_, i) => {
    const ratio = i / gridSteps;
    const y = padT + plotH - ratio * plotH;
    const tickUsd = Math.round(maxUsd * ratio);
    const tickDisplay =
      currency === 'USD'
        ? `$${tickUsd}`
        : `${Math.round((tickUsd * USD_TO_BYN) / 100) * 100}`;
    return `
      <line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="var(--border-subtle)" stroke-dasharray="3 4" />
      <text x="${padL - 8}" y="${y + 4}" text-anchor="end" fill="var(--text-muted)" font-size="10.5" class="svg-tabular">${tickDisplay}</text>
    `;
  }).join('');

  const slotW = plotW / regions.length;
  const barW = Math.min(40, slotW * 0.62);

  const bars = regions
    .map((reg, idx) => {
      const usdVal = getSegmentPriceUsd(reg, segment);
      const barH = Math.max(6, (usdVal / maxUsd) * plotH);
      const x = padL + idx * slotW + (slotW - barW) / 2;
      const y = padT + plotH - barH;
      const isSelected = reg.id === activeId;
      const fill = isSelected ? 'var(--accent-cyan)' : 'var(--accent-primary)';
      const topVal =
        currency === 'USD'
          ? `$${usdVal}`
          : `${Math.round(usdVal * USD_TO_BYN).toLocaleString('ru-RU')}`;
      const label = lang === 'ru' ? reg.shortRu : reg.shortEn;

      return `
        <g
          class="analytics-bar-group ${isSelected ? 'is-active' : ''}"
          data-bar-region="${reg.id}"
          tabindex="0"
          role="button"
          aria-pressed="${isSelected ? 'true' : 'false'}"
          aria-label="${lang === 'ru' ? reg.nameRu : reg.nameEn}: ${topVal}"
        >
          <rect x="${x - 6}" y="${padT}" width="${barW + 12}" height="${plotH + 40}" fill="transparent" />
          <rect
            x="${x}"
            y="${y}"
            width="${barW}"
            height="${barH}"
            rx="6"
            fill="${fill}"
            fill-opacity="${isSelected ? '1' : '0.78'}"
            class="analytics-bar-rect"
          />
          <text
            x="${x + barW / 2}"
            y="${y - 7}"
            text-anchor="middle"
            font-size="10"
            font-weight="${isSelected ? '700' : '600'}"
            fill="${isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)'}"
            class="svg-tabular"
          >${topVal}</text>
          <text
            x="${x + barW / 2}"
            y="${padT + plotH + 18}"
            text-anchor="middle"
            font-size="10.5"
            font-weight="${isSelected ? '700' : '500'}"
            fill="${isSelected ? 'var(--text-primary)' : 'var(--text-muted)'}"
          >${label}</text>
        </g>
      `;
    })
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" class="analytics-chart-svg" role="img" aria-label="Average price per square meter by Belarus region">
      ${gridLines}
      ${bars}
    </svg>
  `;
}

function renderTrendChartSvg(seriesKey, monthIdx, currency, lang) {
  const w = 720;
  const h = 260;
  const padL = 56;
  const padR = 24;
  const padT = 26;
  const padB = 38;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const seriesObj = MONTHLY_TREND.series[seriesKey] || MONTHLY_TREND.series.minsk;
  const vals = seriesObj.valuesUsd;
  const months = lang === 'ru' ? MONTHLY_TREND.monthsRu : MONTHLY_TREND.monthsEn;

  const minRaw = Math.min(...vals);
  const maxRaw = Math.max(...vals);
  const minBound = Math.floor((minRaw - 45) / 50) * 50;
  const maxBound = Math.ceil((maxRaw + 45) / 50) * 50;
  const span = Math.max(100, maxBound - minBound);

  const coords = vals.map((v, i) => {
    const x = padL + (i / (vals.length - 1)) * plotW;
    const y = padT + plotH - ((v - minBound) / span) * plotH;
    return {x, y, valUsd: v, month: months[i], idx: i};
  });

  const polylinePoints = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const areaPath = `M ${coords[0].x.toFixed(1)} ${(padT + plotH).toFixed(1)} L ${coords
    .map((c) => `${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' L ')} L ${coords[coords.length - 1].x.toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;

  const gridSteps = 3;
  const gridLines = Array.from({length: gridSteps + 1}, (_, i) => {
    const ratio = i / gridSteps;
    const y = padT + plotH - ratio * plotH;
    const tickUsd = Math.round(minBound + span * ratio);
    const label = currency === 'USD' ? `$${tickUsd}` : `${Math.round(tickUsd * USD_TO_BYN)}`;
    return `
      <line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="var(--border-subtle)" stroke-dasharray="3 4" />
      <text x="${padL - 8}" y="${y + 4}" text-anchor="end" fill="var(--text-muted)" font-size="10.5" class="svg-tabular">${label}</text>
    `;
  }).join('');

  const activePoint = coords[monthIdx] || coords[coords.length - 1];

  const nodes = coords
    .map((c) => {
      const isAct = c.idx === monthIdx;
      return `
        <g
          class="trend-node ${isAct ? 'is-active' : ''}"
          data-month-idx="${c.idx}"
          tabindex="0"
          role="button"
          aria-pressed="${isAct ? 'true' : 'false'}"
          aria-label="${c.month}: $${c.valUsd}"
        >
          <rect x="${c.x - 20}" y="${padT}" width="40" height="${plotH + 34}" fill="transparent" />
          <circle
            cx="${c.x}"
            cy="${c.y}"
            r="${isAct ? 6.5 : 4}"
            fill="${isAct ? 'var(--accent-cyan)' : 'var(--bg-surface)'}"
            stroke="${isAct ? '#ffffff' : 'var(--accent-primary)'}"
            stroke-width="${isAct ? 2.5 : 2}"
          />
          <text
            x="${c.x}"
            y="${padT + plotH + 22}"
            text-anchor="middle"
            font-size="10.5"
            font-weight="${isAct ? '700' : '500'}"
            fill="${isAct ? 'var(--text-primary)' : 'var(--text-muted)'}"
          >${c.month}</text>
        </g>
      `;
    })
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" class="analytics-chart-svg" role="img" aria-label="12-month price per square meter trend chart">
      <defs>
        <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.34" />
          <stop offset="100%" stop-color="#22d3ee" stop-opacity="0.02" />
        </linearGradient>
      </defs>
      ${gridLines}
      <line
        x1="${activePoint.x}"
        y1="${padT}"
        x2="${activePoint.x}"
        y2="${padT + plotH}"
        stroke="var(--accent-cyan)"
        stroke-width="1.4"
        stroke-dasharray="4 3"
        opacity="0.8"
      />
      <path d="${areaPath}" fill="url(#trendAreaGrad)" />
      <polyline fill="none" stroke="var(--accent-primary)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" points="${polylinePoints}" />
      ${nodes}
    </svg>
  `;
}

function renderAnalyticsPage() {
  const root = document.getElementById('analytics-root');
  if (!root) return;

  const prevBarScrollLeft = document.getElementById('bar-chart-wrap')?.scrollLeft || 0;
  const prevTrendScrollLeft = document.getElementById('trend-chart-wrap')?.scrollLeft || 0;

  const {lang, currency} = getState();
  const segmentLabels = {
    apt: lang === 'ru' ? 'Квартиры (за м²)' : 'Apartments (per m²)',
    house: lang === 'ru' ? 'Дома и коттеджи (за м²)' : 'Houses & Villas (per m²)',
    comm: lang === 'ru' ? 'Коммерческая (за м²)' : 'Commercial (per m²)',
  };

  const minskAvgUsd = getSegmentPriceUsd(MARKET_REGIONS[1], activeSegment);
  const regionalList = MARKET_REGIONS.slice(3, 8);
  const regionalAvgUsd = Math.round(
    regionalList.reduce((sum, r) => sum + getSegmentPriceUsd(r, activeSegment), 0) /
      regionalList.length
  );
  const avgDays = Math.round(
    MARKET_REGIONS.reduce((sum, r) => sum + r.days, 0) / MARKET_REGIONS.length
  );
  const minskFormatted = formatSqmPrice(minskAvgUsd, currency, lang);
  const regFormatted = formatSqmPrice(regionalAvgUsd, currency, lang);

  const selectedRegion =
    MARKET_REGIONS.find((r) => r.id === selectedRegionId) || MARKET_REGIONS[0];
  const selPriceUsd = getSegmentPriceUsd(selectedRegion, activeSegment);
  const selFormatted = formatSqmPrice(selPriceUsd, currency, lang);
  const typicalSqm = activeSegment === 'apt' ? 58 : activeSegment === 'house' ? 160 : 95;
  const typicalBudget = formatBudgetTotal(selPriceUsd * typicalSqm, currency);

  const trendSeries = MONTHLY_TREND.series[activeTrendSeries] || MONTHLY_TREND.series.minsk;
  const curMonthUsd = trendSeries.valuesUsd[activeMonthIdx] || trendSeries.valuesUsd[11];
  const prevMonthUsd =
    trendSeries.valuesUsd[Math.max(0, activeMonthIdx - 1)] || trendSeries.valuesUsd[0];
  const momDelta = (((curMonthUsd - prevMonthUsd) / prevMonthUsd) * 100).toFixed(1);
  const curMonthFormatted = formatSqmPrice(curMonthUsd, currency, lang);
  const monthNames = lang === 'ru' ? MONTHLY_TREND.monthsRu : MONTHLY_TREND.monthsEn;
  const activeMonthYear = activeMonthIdx === 0 ? '2025' : '2026';

  root.innerHTML = `
    <div class="section-header-row">
      <div>
        <span class="section-kicker">${lang === 'ru' ? 'Рыночные исследования · Ноябрь 2026' : 'Market Intelligence · Nov 2026'}</span>
        <h1 class="section-title">${lang === 'ru' ? 'Аналитика рынка недвижимости Беларуси' : 'Belarus Real Estate Market Analytics'}</h1>
        <p class="section-subtitle">
          ${
            lang === 'ru'
              ? 'Средняя стоимость 1 м² по Минску и регионам, динамика цен за 12 месяцев, советы покупателям и обзоры сделок.'
              : 'Average price per sq.m across Minsk and regional capitals, 12-month price trends, buyer guides, and transaction briefings.'
          }
        </p>
      </div>
      <div class="tabs-row" role="tablist" aria-label="Property segment">
        ${Object.entries(segmentLabels)
          .map(
            ([key, lbl]) => `
          <button type="button" class="tab-btn ${activeSegment === key ? 'is-active' : ''}" data-segment="${key}">
            ${lbl}
          </button>
        `
          )
          .join('')}
      </div>
    </div>

    <!-- 4 KPI-карточки -->
    <div class="kpi-strip analytics-kpi-strip">
      <div class="kpi-strip__card">
        <strong>${minskFormatted.primary}</strong>
        <span>${lang === 'ru' ? 'Минск (средняя)' : 'Minsk average'} · <em style="color:var(--status-success);font-style:normal;">+6.1%</em></span>
      </div>
      <div class="kpi-strip__card">
        <strong>${regFormatted.primary}</strong>
        <span>${lang === 'ru' ? 'Областные центры' : 'Regional capitals'} · <em style="color:var(--status-success);font-style:normal;">+4.8%</em></span>
      </div>
      <div class="kpi-strip__card">
        <strong>${avgDays} ${lang === 'ru' ? 'дн.' : 'days'}</strong>
        <span>${lang === 'ru' ? 'Средний срок экспозиции' : 'Avg. time to sell'}</span>
      </div>
      <div class="kpi-strip__card">
        <strong>34%</strong>
        <span>${lang === 'ru' ? 'Сделки трейд-ин и рассрочка' : 'Trade-in & financed deals'}</span>
      </div>
    </div>

    <!-- Интерактивный столбчатый SVG-график + инспектор выбранного города -->
    <div class="analytics-main-grid">
      <section class="chart-card" aria-label="Regional price comparison">
        <div class="chart-card__header">
          <div>
            <h2 class="chart-card__title">${lang === 'ru' ? 'Средняя цена 1 м² по городам и регионам' : 'Average Price per m² by City & Region'}</h2>
            <p class="chart-card__sub">
              ${
                lang === 'ru'
                  ? 'Нажмите на любой столбец графика, чтобы изучить регион и перейти к объектам'
                  : 'Click any bar to inspect regional metrics and browse matching listings'
              }
            </p>
          </div>
          <span class="analytics-unit-note">${segmentLabels[activeSegment]}</span>
        </div>
        <div class="chart-scroll-hint" aria-hidden="true">
          ${lang === 'ru' ? '↔ Листайте график влево и вправо' : '↔ Swipe chart horizontally'}
        </div>
        <div class="chart-svg-wrap" id="bar-chart-wrap">
          ${renderBarChartSvg(MARKET_REGIONS, activeSegment, selectedRegion.id, currency, lang)}
        </div>
      </section>

      <aside class="chart-inspector">
        <span class="section-kicker">${lang === 'ru' ? 'Выбранный рынок' : 'Selected Market'}</span>
        <h3 class="chart-inspector__city">${lang === 'ru' ? selectedRegion.nameRu : selectedRegion.nameEn}</h3>
        <div class="chart-inspector__price">${selFormatted.primary}</div>
        <div class="chart-inspector__subprice">${selFormatted.secondary}</div>

        <div class="chart-inspector__metrics">
          <div>
            <span>${lang === 'ru' ? 'Изменение за год' : '12-Month Change'}</span>
            <strong style="color:var(--status-success);">+${selectedRegion.yoyPct}%</strong>
          </div>
          <div>
            <span>${lang === 'ru' ? 'Срок продажи' : 'Avg. Exposure'}</span>
            <strong>${selectedRegion.days} ${lang === 'ru' ? 'дн.' : 'days'}</strong>
          </div>
          <div>
            <span>${lang === 'ru' ? `Ориентир (${typicalSqm} м²)` : `Est. (${typicalSqm} m²)`}</span>
            <strong>${typicalBudget}</strong>
          </div>
        </div>

        <p class="chart-inspector__note">${lang === 'ru' ? selectedRegion.noteRu : selectedRegion.noteEn}</p>

        <a href="./catalog.html${selectedRegion.catalogQuery}" class="btn btn--primary btn--full">
          ${lang === 'ru' ? 'Смотреть объекты в регионе →' : 'View Regional Listings →'}
        </a>
      </aside>
    </div>

    <!-- Интерактивный линейный SVG-график за 12 месяцев -->
    <section class="chart-card" style="margin-top:24px;" aria-label="12-month price trend">
      <div class="chart-card__header">
        <div>
          <h2 class="chart-card__title">${lang === 'ru' ? 'Динамика стоимости м² за 12 месяцев' : '12-Month Price Trend per m²'}</h2>
          <p class="chart-card__sub">
            ${monthNames[activeMonthIdx]} ${activeMonthYear} · <strong>${curMonthFormatted.primary}</strong> (${curMonthFormatted.secondary}) ·
            <span style="color:var(--status-success);font-weight:700;">${Number(momDelta) >= 0 ? '+' : ''}${momDelta}% ${lang === 'ru' ? 'за месяц' : 'MoM'}</span>
          </p>
        </div>
        <div class="tabs-row">
          ${Object.entries(MONTHLY_TREND.series)
            .map(
              ([k, sObj]) => `
            <button type="button" class="tab-btn ${activeTrendSeries === k ? 'is-active' : ''}" data-trend-series="${k}">
              ${lang === 'ru' ? sObj.labelRu : sObj.labelEn}
            </button>
          `
            )
            .join('')}
        </div>
      </div>
      <div class="chart-scroll-hint" aria-hidden="true">
        ${lang === 'ru' ? '↔ Листайте график влево и вправо' : '↔ Swipe chart horizontally'}
      </div>
      <div class="chart-svg-wrap" id="trend-chart-wrap">
        ${renderTrendChartSvg(activeTrendSeries, activeMonthIdx, currency, lang)}
      </div>
    </section>

    <!-- Таблица сравнения регионов -->
    <section style="margin-top:44px;">
      <div class="section-header-row">
        <div>
          <span class="section-kicker">${lang === 'ru' ? 'Сводная матрица цен' : 'Regional Price Matrix'}</span>
          <h2 class="section-title" style="font-size:1.75rem;">${lang === 'ru' ? 'Сравнение стоимости по регионам Беларуси' : 'Belarus Regional Comparison Table'}</h2>
        </div>
      </div>
      <div class="compare-table-wrap">
        <table class="compare-table analytics-table">
          <thead>
            <tr>
              <th>${lang === 'ru' ? 'Город / регион' : 'City / Region'}</th>
              <th>${lang === 'ru' ? 'Квартиры (м²)' : 'Apartments'}</th>
              <th>${lang === 'ru' ? 'Дома (м²)' : 'Houses'}</th>
              <th>${lang === 'ru' ? 'Коммерция (м²)' : 'Commercial'}</th>
              <th>${lang === 'ru' ? 'Рост г/г' : 'YoY'}</th>
              <th>${lang === 'ru' ? 'Экспозиция' : 'Days on Market'}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${MARKET_REGIONS.map((r) => {
              const aptF = formatSqmPrice(r.aptUsd, currency, lang);
              const houseF = formatSqmPrice(r.houseUsd, currency, lang);
              const commF = formatSqmPrice(r.commUsd, currency, lang);
              return `
                <tr class="${r.id === selectedRegion.id ? 'is-selected' : ''}" data-row-region="${r.id}">
                  <th style="width:auto;color:var(--text-primary);">${lang === 'ru' ? r.nameRu : r.nameEn}</th>
                  <td>${aptF.primary}</td>
                  <td>${houseF.primary}</td>
                  <td>${commF.primary}</td>
                  <td style="color:var(--status-success);font-weight:700;">+${r.yoyPct}%</td>
                  <td>${r.days} ${lang === 'ru' ? 'дн.' : 'd.'}</td>
                  <td style="text-align:right;">
                    <a href="./catalog.html${r.catalogQuery}" class="btn btn--secondary btn--sm">${lang === 'ru' ? 'Объекты →' : 'Listings →'}</a>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Советы покупателю и продавцу -->
    <section style="margin-top:48px;">
      <span class="section-kicker">${lang === 'ru' ? 'Экспертиза Alora Homes' : 'Alora Homes Advisory'}</span>
      <h2 class="section-title" style="font-size:1.75rem;">${lang === 'ru' ? 'Практические советы покупателю и продавцу' : 'Buyer & Seller Advisory Checklist'}</h2>
      <div class="advice-grid">
        ${ADVICE_CARDS.map(
          (card) => `
          <article class="benefit-card article-card-clickable" data-open-advice="${card.id}" tabindex="0" role="button">
            <div class="benefit-card__icon">${getIconSvg(card.icon, 22)}</div>
            <h3 class="benefit-card__title">${lang === 'ru' ? card.titleRu : card.titleEn}</h3>
            <p class="benefit-card__desc">${lang === 'ru' ? card.bodyRu : card.bodyEn}</p>
            <span class="article-read-more">${lang === 'ru' ? 'Открыть чек-лист →' : 'Read full guide →'}</span>
          </article>
        `
        ).join('')}
      </div>
    </section>

    <!-- Новости рынка -->
    <section style="margin-top:48px;">
      <span class="section-kicker">${lang === 'ru' ? 'Дайджест рынка' : 'Market Briefing'}</span>
      <h2 class="section-title" style="font-size:1.75rem;">${lang === 'ru' ? 'Новости и тренды недвижимости' : 'Market News & Trends'}</h2>
      <div class="news-grid">
        ${MARKET_NEWS.map(
          (item) => `
          <article class="news-card article-card-clickable" data-open-news="${item.id}" tabindex="0" role="button">
            <div class="news-card__meta">
              <span>${lang === 'ru' ? item.dateRu : item.dateEn}</span>
              <span aria-hidden="true">·</span>
              <span>${lang === 'ru' ? item.tagRu : item.tagEn}</span>
            </div>
            <h3 class="news-card__title">${lang === 'ru' ? item.titleRu : item.titleEn}</h3>
            <p class="news-card__summary">${lang === 'ru' ? item.summaryRu : item.summaryEn}</p>
            <span class="article-read-more">${lang === 'ru' ? 'Читать обзор полностью →' : 'Read full briefing →'}</span>
          </article>
        `
        ).join('')}
      </div>
    </section>
  `;

  root.querySelectorAll('[data-segment]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeSegment = btn.getAttribute('data-segment') || 'apt';
      renderAnalyticsPage();
    });
  });

  root.querySelectorAll('[data-bar-region]').forEach((bar) => {
    bar.addEventListener('click', () => {
      selectedRegionId = bar.getAttribute('data-bar-region') || 'minsk-center';
      renderAnalyticsPage();
    });
    bar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectedRegionId = bar.getAttribute('data-bar-region') || 'minsk-center';
        renderAnalyticsPage();
      }
    });
  });

  root.querySelectorAll('[data-trend-series]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTrendSeries = btn.getAttribute('data-trend-series') || 'minsk';
      renderAnalyticsPage();
    });
  });

  root.querySelectorAll('[data-month-idx]').forEach((node) => {
    node.addEventListener('click', () => {
      activeMonthIdx = Number(node.getAttribute('data-month-idx')) || 11;
      renderAnalyticsPage();
    });
    node.addEventListener('mouseenter', () => {
      const nextIdx = Number(node.getAttribute('data-month-idx'));
      if (!Number.isNaN(nextIdx) && nextIdx !== activeMonthIdx) {
        activeMonthIdx = nextIdx;
        renderAnalyticsPage();
      }
    });
  });

  root.querySelectorAll('[data-row-region]').forEach((row) => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      selectedRegionId = row.getAttribute('data-row-region') || 'minsk-center';
      renderAnalyticsPage();
    });
  });

  root.querySelectorAll('[data-open-advice]').forEach((card) => {
    const open = () => {
      const id = card.getAttribute('data-open-advice');
      const item = ADVICE_CARDS.find((c) => c.id === id);
      if (item) openArticleModal(item, 'advice');
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  root.querySelectorAll('[data-open-news]').forEach((card) => {
    const open = () => {
      const id = card.getAttribute('data-open-news');
      const item = MARKET_NEWS.find((n) => n.id === id);
      if (item) openArticleModal(item, 'news');
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  const barWrap = document.getElementById('bar-chart-wrap');
  const trendWrap = document.getElementById('trend-chart-wrap');
  if (barWrap && prevBarScrollLeft > 0) barWrap.scrollLeft = prevBarScrollLeft;
  if (trendWrap && prevTrendScrollLeft > 0) trendWrap.scrollLeft = prevTrendScrollLeft;
}

function openArticleModal(item, kind) {
  const {lang} = getState();
  let modal = document.getElementById('analytics-article-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'analytics-article-modal';
    modal.className = 'modal-backdrop';
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('is-open');
    });
    document.body.appendChild(modal);
  }

  const title = lang === 'ru' ? item.titleRu : item.titleEn;
  const kicker =
    kind === 'news'
      ? `${lang === 'ru' ? item.dateRu : item.dateEn} · ${lang === 'ru' ? item.tagRu : item.tagEn}`
      : lang === 'ru'
        ? 'Экспертный чек-лист Alora Homes'
        : 'Alora Homes Expert Checklist';
  const paragraphs = lang === 'ru' ? item.fullRu : item.fullEn;

  modal.innerHTML = `
    <div class="modal-dialog modal-dialog--wide" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="modal-dialog__header">
        <div>
          <span class="section-kicker" style="margin-bottom:4px;">${kicker}</span>
          <h2 class="modal-dialog__title" style="font-size:1.35rem;">${title}</h2>
        </div>
        <button type="button" class="modal-dialog__close js-close-article" aria-label="Close">✕</button>
      </div>

      <div class="article-modal-body">
        ${paragraphs.map((p) => `<p>${p}</p>`).join('')}
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;margin-top:18px;">
        <a href="./catalog.html" class="btn btn--secondary btn--sm">${lang === 'ru' ? 'Перейти в каталог' : 'Browse Catalog'}</a>
        <button type="button" class="btn btn--primary btn--sm js-close-article">${lang === 'ru' ? 'Закрыть' : 'Close'}</button>
      </div>
    </div>
  `;

  modal.querySelectorAll('.js-close-article').forEach((btn) => {
    btn.addEventListener('click', () => modal.classList.remove('is-open'));
  });
  modal.classList.add('is-open');
}

renderAnalyticsPage();
subscribe(() => renderAnalyticsPage());
