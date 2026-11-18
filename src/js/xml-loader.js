// ==========================================================================
// Модуль загрузки и разбора XML-базы объектов недвижимости (DOMParser + Fallback)
// ==========================================================================

let cachedCatalog = null;

const FALLBACK_PROPERTIES = [
  {
    id: "1",
    featured: true,
    dealGroup: "residential",
    category: "houses",
    subcategory: { ru: "Загородный дом", en: "Country House" },
    region: "minsk-region",
    city: { ru: "Минский р-н, аг. Ратомка, ул. Морская, 14", en: "Ratomka, Morskaya St, 14" },
    title: { ru: "Современная вилла с панорамным видом", en: "Modern Villa with Panoramic View" },
    badge: { type: "urgent", ru: "Срочная продажа", en: "Urgent Sale" },
    priceByn: 1226762,
    priceUsd: 380000,
    specs: { area: 364.8, livingArea: 240, plotArea: 15.5, rooms: 6, floors: 3, floor: 3, mkadDistance: 7, year: 2024, newbuild: false },
    visualTheme: "villa-pine",
    image: "./assets/images/prop-1.jpg",
    interiorImage: "./assets/images/prop-1-interior.jpg",
    terraceImage: "./assets/images/prop-1-terrace.jpg",
    mapCoords: { x: 244, y: 168 },
    description: {
      ru: "Современная вилла с панорамным остеклением в престижном посёлке Ратомка в 7 км от МКАД.",
      en: "Modern villa with floor-to-ceiling glazing in prestigious Ratomka village, 7 km from Minsk Ring Road."
    },
    features: [{ ru: "Панорамное остекление", en: "Panoramic glazing" }, { ru: "Умный дом", en: "Smart home system" }]
  },
  {
    id: "2",
    featured: true,
    dealGroup: "residential",
    category: "apartments",
    subcategory: { ru: "Квартира", en: "Apartment" },
    region: "minsk",
    city: { ru: "г. Минск, просп. Независимости, 95", en: "Minsk, Independence Ave, 95" },
    title: { ru: "Апартаменты премиум-класса в центре", en: "Premium Downtown Apartments" },
    badge: { type: "new", ru: "Новинка", en: "New Listing" },
    priceByn: 487500,
    priceUsd: 151000,
    specs: { area: 112.5, livingArea: 74, plotArea: 0, rooms: 3, floors: 20, floor: 15, mkadDistance: 0, year: 2025, newbuild: true },
    visualTheme: "minsk-tower",
    image: "./assets/images/prop-2.jpg",
    interiorImage: "./assets/images/prop-2-interior.jpg",
    terraceImage: "./assets/images/prop-2-terrace.jpg",
    mapCoords: { x: 282, y: 186 },
    description: {
      ru: "Видовые трёхкомнатные апартаменты в новом доме бизнес-класса на проспекте Независимости.",
      en: "Three-room panoramic apartment in a new business-class residence on Independence Avenue."
    },
    features: [{ ru: "Новостройка 2025 года", en: "New build 2025" }, { ru: "Подземный паркинг", en: "Underground parking" }]
  },
  {
    id: "3",
    featured: true,
    dealGroup: "residential",
    category: "houses",
    subcategory: { ru: "Таунхаус", en: "Townhouse" },
    region: "minsk",
    city: { ru: "г. Минск, ул. Плеханова, 42 (Серебрянка)", en: "Minsk, Plekhanova St, 42" },
    title: { ru: "Элитный таунхаус в закрытом комплексе", en: "Luxury Townhouse in Gated Complex" },
    badge: { type: "top", ru: "Топ предложение", en: "Top Pick" },
    priceByn: 895000,
    priceUsd: 277000,
    specs: { area: 220, livingArea: 158, plotArea: 6, rooms: 4, floors: 2, floor: 2, mkadDistance: 4, year: 2024, newbuild: false },
    visualTheme: "townhouse-dusk",
    image: "./assets/images/prop-3.jpg",
    interiorImage: "./assets/images/prop-3-interior.jpg",
    terraceImage: "./assets/images/prop-3-terrace.jpg",
    mapCoords: { x: 292, y: 208 },
    description: {
      ru: "Двухуровневый таунхаус в охраняемом клубном квартале. Собственный участок, зона барбекю.",
      en: "Two-level townhouse in a gated club quarter. Private landscaped yard, BBQ patio."
    },
    features: [{ ru: "Закрытая охраняемая территория", en: "Gated security" }, { ru: "Собственная терраса", en: "Private terrace" }]
  },
  {
    id: "4",
    featured: true,
    dealGroup: "residential",
    category: "houses",
    subcategory: { ru: "Коттедж", en: "Cottage" },
    region: "minsk-region",
    city: { ru: "Минский р-н, д. Раубичи, ул. Сосновая, 18", en: "Raubichi, Sosnovaya St, 18" },
    title: { ru: "Семейный коттедж среди сосен", en: "Family Cottage Among Pines" },
    badge: { type: "agent", ru: "Выбор агента", en: "Agent's Choice" },
    priceByn: 638000,
    priceUsd: 197500,
    specs: { area: 286, livingArea: 195, plotArea: 18, rooms: 5, floors: 2, floor: 2, mkadDistance: 23, year: 2023, newbuild: false },
    visualTheme: "forest-cottage",
    image: "./assets/images/prop-4.jpg",
    interiorImage: "./assets/images/prop-4-interior.jpg",
    terraceImage: "./assets/images/prop-4-terrace.jpg",
    mapCoords: { x: 316, y: 158 },
    description: {
      ru: "Просторный семейный коттедж в экологически чистом районе Раубичи.",
      en: "Spacious family cottage in eco-friendly Raubichi."
    },
    features: [{ ru: "Каминная гостиная", en: "Fireplace lounge" }, { ru: "Участок 18 соток", en: "18-acre pine plot" }]
  },
  {
    id: "5",
    featured: true,
    dealGroup: "commercial",
    category: "commercial",
    subcategory: { ru: "Офис", en: "Office Space" },
    region: "minsk",
    city: { ru: "г. Минск, ул. Кальварийская, 21", en: "Minsk, Kalvaryiskaya St, 21" },
    title: { ru: "Светлый офис с видом на проспект", en: "Bright Avenue-View Office" },
    badge: { type: "commercial", ru: "Коммерция", en: "Commercial" },
    priceByn: 512400,
    priceUsd: 158700,
    specs: { area: 148, livingArea: 148, plotArea: 0, rooms: 4, floors: 12, floor: 6, mkadDistance: 0, year: 2022, newbuild: false },
    visualTheme: "glass-office",
    image: "./assets/images/prop-5.jpg",
    interiorImage: "./assets/images/prop-5-interior.jpg",
    terraceImage: "./assets/images/prop-5-terrace.jpg",
    mapCoords: { x: 258, y: 192 },
    description: {
      ru: "Современное офисное пространство формата open-space с переговорными в бизнес-центре класса А.",
      en: "Modern open-space office suite in a Class A business center."
    },
    features: [{ ru: "Бизнес-центр класса A", en: "Class A Business Center" }, { ru: "3 минуты до метро", en: "3 min walk to metro" }]
  },
  {
    id: "6",
    featured: true,
    dealGroup: "residential",
    category: "apartments",
    subcategory: { ru: "Лофт", en: "Loft Apartment" },
    region: "minsk",
    city: { ru: "г. Минск, ул. Орловская, 86", en: "Minsk, Orlovskaya St, 86" },
    title: { ru: "Дизайнерский лофт у воды", en: "Designer Waterfront Loft" },
    badge: { type: "exclusive", ru: "Эксклюзив", en: "Exclusive" },
    priceByn: 411900,
    priceUsd: 127500,
    specs: { area: 86.2, livingArea: 56, plotArea: 0, rooms: 2, floors: 16, floor: 9, mkadDistance: 0, year: 2024, newbuild: false },
    visualTheme: "minsk-tower",
    image: "./assets/images/prop-6.jpg",
    interiorImage: "./assets/images/prop-6-interior.jpg",
    terraceImage: "./assets/images/prop-6-terrace.jpg",
    mapCoords: { x: 268, y: 172 },
    description: {
      ru: "Дизайнерский лофт с высокими потолками у парка Победы.",
      en: "Designer loft with high ceilings near Victory Park."
    },
    features: [{ ru: "Вид на реку", en: "River view" }, { ru: "Дизайнерский ремонт", en: "Designer renovation" }]
  },
  {
    id: "7",
    featured: false,
    dealGroup: "residential",
    category: "apartments",
    subcategory: { ru: "Квартира", en: "Apartment" },
    region: "brest",
    city: { ru: "г. Брест, ул. Советская, 34", en: "Brest, Sovetskaya St, 34" },
    title: { ru: "Апартаменты в историческом центре Бреста", en: "Historic Center Apartments in Brest" },
    badge: { type: "top", ru: "Популярно", en: "Popular" },
    priceByn: 297500,
    priceUsd: 92000,
    specs: { area: 78.4, livingArea: 48, plotArea: 0, rooms: 3, floors: 5, floor: 3, mkadDistance: 0, year: 2021, newbuild: false },
    visualTheme: "brest-classic",
    image: "./assets/images/prop-7.jpg",
    interiorImage: "./assets/images/prop-7-interior.jpg",
    terraceImage: "./assets/images/prop-7-terrace.jpg",
    mapCoords: { x: 64, y: 275 },
    description: {
      ru: "Просторная трёхкомнатная квартира на пешеходной улице Советской в Бресте.",
      en: "Spacious 3-room apartment on pedestrian Sovetskaya street in Brest."
    },
    features: [{ ru: "Пешеходный центр", en: "Pedestrian center" }, { ru: "Высокие потолки", en: "High ceilings" }]
  },
  {
    id: "8",
    featured: false,
    dealGroup: "residential",
    category: "houses",
    subcategory: { ru: "Загородный дом", en: "Country House" },
    region: "brest",
    city: { ru: "Брестский р-н, аг. Гершоны, ул. Садовая, 7", en: "Gershony, Sadovaya St, 7" },
    title: { ru: "Уютная усадьба у реки Мухавец", en: "Cozy Estate Near Mukhavets River" },
    badge: { type: "agent", ru: "Выбор агента", en: "Agent's Choice" },
    priceByn: 452200,
    priceUsd: 140000,
    specs: { area: 210, livingArea: 145, plotArea: 15, rooms: 5, floors: 2, floor: 2, mkadDistance: 0, year: 2022, newbuild: false },
    visualTheme: "forest-cottage",
    image: "./assets/images/prop-8.jpg",
    interiorImage: "./assets/images/prop-8-interior.jpg",
    terraceImage: "./assets/images/prop-8-terrace.jpg",
    mapCoords: { x: 78, y: 290 },
    description: {
      ru: "Современный двухэтажный дом в тихом пригороде Бреста вблизи реки.",
      en: "Modern two-story house in a quiet Brest suburb near the river."
    },
    features: [{ ru: "Близко к реке", en: "Close to river" }, { ru: "Баня и гараж", en: "Bathhouse & garage" }]
  },
  {
    id: "9",
    featured: false,
    dealGroup: "residential",
    category: "apartments",
    subcategory: { ru: "Квартира", en: "Apartment" },
    region: "grodno",
    city: { ru: "г. Гродно, ул. Ожешко, 15", en: "Grodno, Ozheshko St, 15" },
    title: { ru: "Апартаменты с видом на старый Гродно", en: "Apartment Overlooking Old Grodno" },
    badge: { type: "new", ru: "Новинка", en: "New Listing" },
    priceByn: 322600,
    priceUsd: 99800,
    specs: { area: 84, livingArea: 52, plotArea: 0, rooms: 3, floors: 6, floor: 4, mkadDistance: 0, year: 2023, newbuild: false },
    visualTheme: "brest-classic",
    image: "./assets/images/prop-9.jpg",
    interiorImage: "./assets/images/prop-9-interior.jpg",
    terraceImage: "./assets/images/prop-9-terrace.jpg",
    mapCoords: { x: 74, y: 155 },
    description: {
      ru: "Трёхкомнатная квартира в историческом центре Гродно с видом на старинные костёлы.",
      en: "Three-room apartment in historic Grodno with cathedral views."
    },
    features: [{ ru: "Исторический центр", en: "Historic center" }, { ru: "Мебель и техника", en: "Furniture & appliances included" }]
  },
  {
    id: "10",
    featured: false,
    dealGroup: "residential",
    category: "houses",
    subcategory: { ru: "Таунхаус", en: "Townhouse" },
    region: "grodno",
    city: { ru: "Гродненский р-н, с. Коробчицы, ул. Полевая, 9", en: "Korobchitsy, Polevaya St, 9" },
    title: { ru: "Таунхаус в живописном пригороде", en: "Scenic Suburb Townhouse" },
    badge: { type: "exclusive", ru: "Эксклюзив", en: "Exclusive" },
    priceByn: 387600,
    priceUsd: 120000,
    specs: { area: 165, livingArea: 118, plotArea: 4.5, rooms: 4, floors: 2, floor: 2, mkadDistance: 0, year: 2024, newbuild: true },
    visualTheme: "townhouse-dusk",
    image: "./assets/images/prop-10.jpg",
    interiorImage: "./assets/images/prop-10-interior.jpg",
    terraceImage: "./assets/images/prop-10-terrace.jpg",
    mapCoords: { x: 62, y: 172 },
    description: {
      ru: "Новый таунхаус в популярном пригороде Гродно Коробчицы.",
      en: "New townhouse in the popular Grodno suburb of Korobchitsy."
    },
    features: [{ ru: "Новостройка", en: "New construction" }, { ru: "Закрытый двор", en: "Gated courtyard" }]
  },
  {
    id: "11",
    featured: false,
    dealGroup: "residential",
    category: "apartments",
    subcategory: { ru: "Квартира", en: "Apartment" },
    region: "vitebsk",
    city: { ru: "г. Витебск, ул. Ленина, 24", en: "Vitebsk, Lenina St, 24" },
    title: { ru: "Просторная квартира на улице Ленина", en: "Spacious Apartment on Lenina St" },
    badge: { type: "top", ru: "Топ предложение", en: "Top Pick" },
    priceByn: 264800,
    priceUsd: 82000,
    specs: { area: 91.5, livingArea: 60, plotArea: 0, rooms: 3, floors: 7, floor: 3, mkadDistance: 0, year: 2022, newbuild: false },
    visualTheme: "minsk-tower",
    image: "./assets/images/prop-11.jpg",
    interiorImage: "./assets/images/prop-11-interior.jpg",
    terraceImage: "./assets/images/prop-11-terrace.jpg",
    mapCoords: { x: 382, y: 84 },
    description: {
      ru: "Классическая квартира в центре культурной столицы Беларуси — Витебска.",
      en: "Classic apartment in the cultural capital of Belarus — Vitebsk."
    },
    features: [{ ru: "Центр Витебска", en: "Vitebsk center" }, { ru: "Развитая инфраструктура", en: "Developed infrastructure" }]
  },
  {
    id: "12",
    featured: false,
    dealGroup: "residential",
    category: "houses",
    subcategory: { ru: "Загородный дом", en: "Country House" },
    region: "vitebsk",
    city: { ru: "Витебский р-н, оз. Лукомское / аг. Октябрьская", en: "Vitebsk Region, Lake Area" },
    title: { ru: "Дом у живописного озера", en: "Scenic Lakeside Home" },
    badge: { type: "urgent", ru: "Срочная продажа", en: "Urgent Sale" },
    priceByn: 339150,
    priceUsd: 105000,
    specs: { area: 175, livingArea: 120, plotArea: 20, rooms: 4, floors: 2, floor: 2, mkadDistance: 0, year: 2023, newbuild: false },
    visualTheme: "forest-cottage",
    image: "./assets/images/prop-12.jpg",
    interiorImage: "./assets/images/prop-12-interior.jpg",
    terraceImage: "./assets/images/prop-12-terrace.jpg",
    mapCoords: { x: 412, y: 96 },
    description: {
      ru: "Уединённый дом с прямым выходом к чистейшему озеру в Витебской области.",
      en: "Secluded home with direct access to a pristine lake in Vitebsk region."
    },
    features: [{ ru: "Первая линия озера", en: "First lake line" }, { ru: "Участок 20 соток", en: "20-acre plot" }]
  },
  {
    id: "13",
    featured: false,
    dealGroup: "residential",
    category: "apartments",
    subcategory: { ru: "Квартира", en: "Apartment" },
    region: "gomel",
    city: { ru: "г. Гомель, ул. Советская, 48", en: "Gomel, Sovetskaya St, 48" },
    title: { ru: "Современные апартаменты в Гомеле", en: "Modern Gomel Apartments" },
    badge: { type: "new", ru: "Новинка", en: "New Listing" },
    priceByn: 284140,
    priceUsd: 88000,
    specs: { area: 82, livingArea: 53, plotArea: 0, rooms: 3, floors: 9, floor: 6, mkadDistance: 0, year: 2024, newbuild: true },
    visualTheme: "minsk-tower",
    image: "./assets/images/prop-13.jpg",
    interiorImage: "./assets/images/prop-13-interior.jpg",
    terraceImage: "./assets/images/prop-13-terrace.jpg",
    mapCoords: { x: 395, y: 268 },
    description: {
      ru: "Новая квартира с качественным евроремонтом в центральном районе Гомеля.",
      en: "New apartment with premium renovation in central Gomel district."
    },
    features: [{ ru: "Новостройка", en: "New construction" }, { ru: "Рядом парк", en: "Near central park" }]
  },
  {
    id: "14",
    featured: false,
    dealGroup: "residential",
    category: "houses",
    subcategory: { ru: "Коттедж", en: "Cottage" },
    region: "gomel",
    city: { ru: "Гомельский р-н, с. Чёнки, ул. Лесная, 12", en: "Chenki, Lesnaya St, 12" },
    title: { ru: "Коттедж в курортной зоне Чёнки", en: "Cottage in Chenki Resort Zone" },
    badge: { type: "agent", ru: "Выбор агента", en: "Agent's Choice" },
    priceByn: 419900,
    priceUsd: 130000,
    specs: { area: 240, livingArea: 168, plotArea: 14, rooms: 5, floors: 2, floor: 2, mkadDistance: 0, year: 2023, newbuild: false },
    visualTheme: "villa-pine",
    image: "./assets/images/prop-14.jpg",
    interiorImage: "./assets/images/prop-14-interior.jpg",
    terraceImage: "./assets/images/prop-14-terrace.jpg",
    mapCoords: { x: 416, y: 295 },
    description: {
      ru: "Коттедж в сосновом бору знаменитого курортного посёлка Чёнки на берегу Сожа.",
      en: "Cottage in the pine forest of Chenki resort on the Sozh river bank."
    },
    features: [{ ru: "Курортная зона", en: "Resort zone" }, { ru: "Сосновый бор", en: "Pine forest" }]
  },
  {
    id: "15",
    featured: false,
    dealGroup: "residential",
    category: "apartments",
    subcategory: { ru: "Квартира", en: "Apartment" },
    region: "mogilev",
    city: { ru: "г. Могилёв, ул. Первомайская, 31", en: "Mogilev, Pervomayskaya St, 31" },
    title: { ru: "Светлая квартира в центре Могилёва", en: "Bright Apartment in Central Mogilev" },
    badge: { type: "top", ru: "Топ", en: "Top Pick" },
    priceByn: 251540,
    priceUsd: 77900,
    specs: { area: 76, livingArea: 47, plotArea: 0, rooms: 3, floors: 8, floor: 5, mkadDistance: 0, year: 2022, newbuild: false },
    visualTheme: "brest-classic",
    image: "./assets/images/prop-15.jpg",
    interiorImage: "./assets/images/prop-15-interior.jpg",
    terraceImage: "./assets/images/prop-15-terrace.jpg",
    mapCoords: { x: 375, y: 175 },
    description: {
      ru: "Уютная трёшка на главной пешеходной улице Могилёва.",
      en: "Cozy 3-room apartment on the main pedestrian street of Mogilev."
    },
    features: [{ ru: "Центр города", en: "City center" }, { ru: "Отличное состояние", en: "Mint condition" }]
  },
  {
    id: "16",
    featured: false,
    dealGroup: "residential",
    category: "houses",
    subcategory: { ru: "Загородный дом", en: "Country House" },
    region: "mogilev",
    city: { ru: "Могилёвский р-н, д. Полыковичи, ул. Набережная, 5", en: "Polykovichi, Naberezhnaya St, 5" },
    title: { ru: "Дом на живописном берегу Днепра", en: "Dnieper Riverfront Home" },
    badge: { type: "exclusive", ru: "Эксклюзив", en: "Exclusive" },
    priceByn: 371450,
    priceUsd: 115000,
    specs: { area: 195, livingArea: 132, plotArea: 16, rooms: 4, floors: 2, floor: 2, mkadDistance: 0, year: 2024, newbuild: true },
    visualTheme: "townhouse-dusk",
    image: "./assets/images/prop-16.jpg",
    interiorImage: "./assets/images/prop-16-interior.jpg",
    terraceImage: "./assets/images/prop-16-terrace.jpg",
    mapCoords: { x: 390, y: 162 },
    description: {
      ru: "Новый дом с панорамными окнами и видом на реку Днепр.",
      en: "New home with panoramic windows and Dnieper river views."
    },
    features: [{ ru: "Вид на Днепр", en: "Dnieper views" }, { ru: "Терраса", en: "Terrace" }]
  },
  {
    id: "17",
    featured: false,
    dealGroup: "residential",
    category: "newbuild",
    subcategory: { ru: "Новостройка", en: "New Development" },
    region: "minsk-region",
    city: { ru: "Минская обл., г. Борисов, ул. Строителей, 10", en: "Borisov, Stiteley St, 10" },
    title: { ru: "ЖК «Северный квартал»", en: "Northern Quarter Residential Complex" },
    badge: { type: "new", ru: "Старт продаж", en: "Sales Start" },
    priceByn: 193800,
    priceUsd: 60000,
    specs: { area: 68.5, livingArea: 42, plotArea: 0, rooms: 2, floors: 10, floor: 7, mkadDistance: 68, year: 2026, newbuild: true },
    visualTheme: "minsk-tower",
    image: "./assets/images/prop-17.jpg",
    interiorImage: "./assets/images/prop-17-interior.jpg",
    terraceImage: "./assets/images/prop-17-terrace.jpg",
    mapCoords: { x: 345, y: 132 },
    description: {
      ru: "Современная двухкомнатная квартира в новом строящемся жилом комплексе Борисова.",
      en: "Modern 2-room apartment in a newly developing residential complex in Borisov."
    },
    features: [{ ru: "Рассрочка 0%", en: "0% Installment" }, { ru: "Детские площадки", en: "Playgrounds" }]
  },
  {
    id: "18",
    featured: false,
    dealGroup: "commercial",
    category: "commercial",
    subcategory: { ru: "Торговое помещение", en: "Retail Space" },
    region: "minsk",
    city: { ru: "г. Минск, ул. Немига, 3", en: "Minsk, Nemiga St, 3" },
    title: { ru: "Торговое помещение в центре Минска", en: "Retail Hub in Central Minsk" },
    badge: { type: "commercial", ru: "Коммерция", en: "Commercial" },
    priceByn: 1100000,
    priceUsd: 340557,
    specs: { area: 210, livingArea: 210, plotArea: 0, rooms: 3, floors: 5, floor: 1, mkadDistance: 0, year: 2023, newbuild: false },
    visualTheme: "glass-office",
    image: "./assets/images/prop-18.jpg",
    interiorImage: "./assets/images/prop-18-interior.jpg",
    terraceImage: "./assets/images/prop-18-terrace.jpg",
    mapCoords: { x: 265, y: 198 },
    description: {
      ru: "Помещение с отдельным входом и витронными окнами на оживленной улице Немига.",
      en: "Commercial space with separate entrance and storefront glass on busy Nemiga street."
    },
    features: [{ ru: "Интенсивный пешеходный трафик", en: "High foot traffic" }, { ru: "Витринные окна", en: "Storefront windows" }]
  },
  {
    id: "19",
    featured: true,
    dealGroup: "residential",
    category: "apartments",
    subcategory: { ru: "Квартира", en: "Apartment" },
    region: "brest",
    city: { ru: "г. Барановичи, ул. Советская, 80", en: "Baranovichi, Sovetskaya St, 80" },
    title: { ru: "Просторные апартаменты в Барановичах", en: "Spacious Baranovichi Apartments" },
    badge: { type: "top", ru: "Топ предложение", en: "Top Pick" },
    priceByn: 226100,
    priceUsd: 70000,
    specs: { area: 84, livingArea: 54, plotArea: 0, rooms: 3, floors: 9, floor: 4, mkadDistance: 140, year: 2024, newbuild: true },
    visualTheme: "brest-classic",
    image: "./assets/images/prop-19.jpg",
    interiorImage: "./assets/images/prop-19-interior.jpg",
    terraceImage: "./assets/images/prop-19-terrace.jpg",
    mapCoords: { x: 145, y: 220 },
    description: {
      ru: "Трёхкомнатная квартира в новом доме в центре Барановичей с качественным ремонтом.",
      en: "Three-room apartment in a new building in central Baranovichi."
    },
    features: [{ ru: "Новостройка", en: "New build" }, { ru: "Центр города", en: "City center" }]
  },
  {
    id: "20",
    featured: true,
    dealGroup: "residential",
    category: "houses",
    subcategory: { ru: "Загородный дом", en: "Country House" },
    region: "minsk-region",
    city: { ru: "г. Борисов, ул. Зелёная, 15", en: "Borisov, Zelenaya St, 15" },
    title: { ru: "Уютный дом с садом в Борисове", en: "Cozy Garden House in Borisov" },
    badge: { type: "agent", ru: "Выбор агента", en: "Agent's Choice" },
    priceByn: 290700,
    priceUsd: 90000,
    specs: { area: 160, livingArea: 110, plotArea: 10, rooms: 4, floors: 2, floor: 2, mkadDistance: 70, year: 2023, newbuild: false },
    visualTheme: "forest-cottage",
    image: "./assets/images/prop-20.jpg",
    interiorImage: "./assets/images/prop-20-interior.jpg",
    terraceImage: "./assets/images/prop-20-terrace.jpg",
    mapCoords: { x: 335, y: 128 },
    description: {
      ru: "Ухоженный коттедж с ландшафтным дизайном и беседкой в тихом районе Борисова.",
      en: "Well-maintained cottage with landscape design and gazebo in quiet Borisov district."
    },
    features: [{ ru: "Ландшафтный дизайн", en: "Landscape design" }, { ru: "Беседка и мангал", en: "Gazebo and BBQ" }]
  },
  {
    id: "21",
    featured: true,
    dealGroup: "commercial",
    category: "commercial",
    subcategory: { ru: "Коммерческое помещение", en: "Commercial Showroom" },
    region: "gomel",
    city: { ru: "г. Бобруйск, ул. Социалистическая, 45", en: "Bobruisk, Sotsialisticheskaya St, 45" },
    title: { ru: "Торговый шоурум в Бобруйске", en: "Commercial Showroom in Bobruisk" },
    badge: { type: "commercial", ru: "Коммерция", en: "Commercial" },
    priceByn: 419900,
    priceUsd: 130000,
    specs: { area: 190, livingArea: 190, plotArea: 0, rooms: 3, floors: 3, floor: 1, mkadDistance: 135, year: 2022, newbuild: false },
    visualTheme: "glass-office",
    image: "./assets/images/prop-21.jpg",
    interiorImage: "./assets/images/prop-21-interior.jpg",
    terraceImage: "./assets/images/prop-21-terrace.jpg",
    mapCoords: { x: 350, y: 245 },
    description: {
      ru: "Просторное помещение свободного назначения на центральной улице Бобруйска.",
      en: "Spacious multi-purpose commercial space on the main street of Bobruisk."
    },
    features: [{ ru: "Первая линия", en: "First line" }, { ru: "Отдельный вход", en: "Separate entrance" }]
  },
  {
    id: "22",
    featured: false,
    dealGroup: "residential",
    category: "houses",
    subcategory: { ru: "Таунхаус", en: "Townhouse" },
    region: "grodno",
    city: { ru: "г. Лида, ул. Советская, 12", en: "Lida, Sovetskaya St, 12" },
    title: { ru: "Современный таунхаус в Лиде", en: "Modern Townhouse in Lida" },
    badge: { type: "new", ru: "Новинка", en: "New Listing" },
    priceByn: 306850,
    priceUsd: 95000,
    specs: { area: 155, livingArea: 110, plotArea: 5, rooms: 4, floors: 2, floor: 2, mkadDistance: 165, year: 2024, newbuild: true },
    visualTheme: "townhouse-dusk",
    image: "./assets/images/prop-22.jpg",
    interiorImage: "./assets/images/prop-22-interior.jpg",
    terraceImage: "./assets/images/prop-22-terrace.jpg",
    mapCoords: { x: 110, y: 140 },
    description: {
      ru: "Двухуровневый таунхаус в тихом районе города Лида рядом с замком.",
      en: "Two-level townhouse in quiet Lida district near the historic castle."
    },
    features: [{ ru: "Рядом замок", en: "Near castle" }, { ru: "Свой участок", en: "Private plot" }]
  },
  {
    id: "23",
    featured: false,
    dealGroup: "residential",
    category: "apartments",
    subcategory: { ru: "Квартира", en: "Apartment" },
    region: "vitebsk",
    city: { ru: "г. Новополоцк, ул. Молодёжная, 72", en: "Novopolotsk, Molodyozhnaya St, 72" },
    title: { ru: "Панорамная квартира в Новополоцке", en: "Panoramic Apartment in Novopolotsk" },
    badge: { type: "top", ru: "Топ", en: "Top Pick" },
    priceByn: 209950,
    priceUsd: 65000,
    specs: { area: 74, livingArea: 48, plotArea: 0, rooms: 3, floors: 14, floor: 10, mkadDistance: 210, year: 2023, newbuild: false },
    visualTheme: "minsk-tower",
    image: "./assets/images/prop-23.jpg",
    interiorImage: "./assets/images/prop-23-interior.jpg",
    terraceImage: "./assets/images/prop-23-terrace.jpg",
    mapCoords: { x: 370, y: 55 },
    description: {
      ru: "Видовая трёхкомнатная квартира на верхнем этаже в Новополоцке.",
      en: "Panoramic 3-room apartment on upper floor in Novopolotsk."
    },
    features: [{ ru: "Панорамный вид", en: "Panoramic view" }, { ru: "С мебелью", en: "Furnished" }]
  },
  {
    id: "24",
    featured: false,
    dealGroup: "residential",
    category: "houses",
    subcategory: { ru: "Загородный дом", en: "Country House" },
    region: "gomel",
    city: { ru: "г. Жлобин, ул. Днепровская, 8", en: "Zhlobin, Dneprovskaya St, 8" },
    title: { ru: "Дом у реки в Жлобине", en: "Riverside Home in Zhlobin" },
    badge: { type: "urgent", ru: "Срочная продажа", en: "Urgent Sale" },
    priceByn: 322600,
    priceUsd: 99800,
    specs: { area: 180, livingArea: 125, plotArea: 12, rooms: 4, floors: 2, floor: 2, mkadDistance: 215, year: 2023, newbuild: false },
    visualTheme: "forest-cottage",
    image: "./assets/images/prop-24.jpg",
    interiorImage: "./assets/images/prop-24-interior.jpg",
    terraceImage: "./assets/images/prop-24-terrace.jpg",
    mapCoords: { x: 380, y: 225 },
    description: {
      ru: "Просторный дом в Жлобине вблизи реки Днепр с баней и гаражом.",
      en: "Spacious home in Zhlobin near Dnieper river with bathhouse and garage."
    },
    features: [{ ru: "Близко к Днепру", en: "Close to Dnieper river" }, { ru: "Баня", en: "Sauna" }]
  }
];

/**
 * Загружает XML-документ /data/properties.xml и преобразует узлы в объекты JS (с надежным fallback на массив)
 */
export async function loadPropertiesFromXml() {
  if (cachedCatalog) {
    return cachedCatalog;
  }

  try {
    const response = await fetch('./data/properties.xml', {cache: 'no-cache'});
    if (!response.ok) {
      throw new Error(`XML load failed: ${response.status}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Ошибка синтаксического анализа XML');
    }

    const propertyNodes = Array.from(xmlDoc.querySelectorAll('catalog > property'));
    if (!propertyNodes.length) {
      throw new Error('Пустой XML каталог');
    }

    cachedCatalog = propertyNodes.map((node) => {
      const getText = (selector) => node.querySelector(selector)?.textContent?.trim() || '';
      const getAttr = (selector, attr) => node.querySelector(selector)?.getAttribute(attr) || '';

      const features = Array.from(node.querySelectorAll('features > feature')).map((f) => ({
        ru: f.getAttribute('ru') || '',
        en: f.getAttribute('en') || '',
      }));

      return {
        id: node.getAttribute('id') || '',
        featured: node.getAttribute('featured') === 'true',
        dealGroup: node.getAttribute('dealGroup') || 'residential',
        category: getText('category'),
        subcategory: {
          ru: getAttr('subcategory', 'ru'),
          en: getAttr('subcategory', 'en'),
        },
        region: getText('region'),
        city: {
          ru: getAttr('city', 'ru'),
          en: getAttr('city', 'en'),
        },
        title: {
          ru: getAttr('title', 'ru'),
          en: getAttr('title', 'en'),
        },
        badge: {
          type: getAttr('badge', 'type') || 'top',
          ru: getAttr('badge', 'ru'),
          en: getAttr('badge', 'en'),
        },
        priceByn: Number(getAttr('price', 'byn')) || 0,
        priceUsd: Number(getAttr('price', 'usd')) || 0,
        specs: {
          area: Number(getText('specs > area')) || 0,
          livingArea: Number(getText('specs > livingArea')) || 0,
          plotArea: Number(getText('specs > plotArea')) || 0,
          rooms: Number(getText('specs > rooms')) || 0,
          floors: Number(getText('specs > floors')) || 1,
          floor: Number(getText('specs > floor')) || 1,
          mkadDistance: Number(getText('specs > mkadDistance')) || 0,
          year: Number(getText('specs > year')) || 2024,
          newbuild: getText('specs > newbuild') === 'true',
        },
        visualTheme: getText('visualTheme') || 'villa-pine',
        image: getText('image'),
        interiorImage: getText('interiorImage'),
        terraceImage: getText('terraceImage'),
        mapCoords: {
          x: Number(getAttr('mapCoords', 'x')) || 270,
          y: Number(getAttr('mapCoords', 'y')) || 190,
        },
        description: {
          ru: getAttr('description', 'ru'),
          en: getAttr('description', 'en'),
        },
        features,
      };
    });

    return cachedCatalog;
  } catch (err) {
    console.warn('Using embedded fallback properties catalog due to fetch error:', err);
    cachedCatalog = FALLBACK_PROPERTIES;
    return cachedCatalog;
  }
}

/**
 * Фильтрует массив объектов недвижимости по параметрам формы поиска
 */
export function filterProperties(properties, filters = {}) {
  return properties.filter((item) => {
    if (filters.dealGroup && filters.dealGroup !== 'all' && item.dealGroup !== filters.dealGroup) {
      return false;
    }

    if (filters.category && filters.category !== 'all') {
      if (filters.category === 'newbuild') {
        if (!item.specs.newbuild) return false;
      } else if (item.category !== filters.category) {
        return false;
      }
    }

    if (filters.region && filters.region !== 'all' && item.region !== filters.region) {
      return false;
    }

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      const haystack = `${item.title.ru} ${item.title.en} ${item.city.ru} ${item.city.en} ${item.subcategory.ru}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    const curr = filters.priceCurrency || 'BYN';
    const priceVal = curr === 'USD' ? item.priceUsd : item.priceByn;
    if (filters.priceMin && priceVal < Number(filters.priceMin)) return false;
    if (filters.priceMax && priceVal > Number(filters.priceMax)) return false;

    if (filters.rooms && filters.rooms !== 'any') {
      const r = Number(filters.rooms);
      if (r >= 4 ? item.specs.rooms < 4 : item.specs.rooms !== r) return false;
    }

    if (filters.areaMin && item.specs.area < Number(filters.areaMin)) return false;
    if (filters.areaMax && item.specs.area > Number(filters.areaMax)) return false;

    if (filters.livingMin && item.specs.livingArea < Number(filters.livingMin)) return false;
    if (filters.livingMax && item.specs.livingArea > Number(filters.livingMax)) return false;

    if (filters.plotMin && item.specs.plotArea < Number(filters.plotMin)) return false;
    if (filters.plotMax && item.specs.plotArea > Number(filters.plotMax)) return false;

    if (filters.mkadMax && item.specs.mkadDistance > Number(filters.mkadMax)) return false;

    return true;
  });
}

/**
 * Сортирует объекты недвижимости
 */
export function sortProperties(properties, sortBy = 'default') {
  const list = [...properties];
  switch (sortBy) {
    case 'price-asc':
      return list.sort((a, b) => a.priceByn - b.priceByn);
    case 'price-desc':
      return list.sort((a, b) => b.priceByn - a.priceByn);
    case 'area-desc':
      return list.sort((a, b) => b.specs.area - a.specs.area);
    default:
      return list;
  }
}
