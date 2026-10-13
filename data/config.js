/* ==========================================================
   NGOPI — SITE CONFIG
   Edit this file to change brand, nav, stats, hours, currency,
   footer and tab definitions. No component changes needed.
   ========================================================== */
window.NGOPI_CONFIG = {
  brand: {
    name: "Ngopi",
    tagline: "Enjoy Your Favorite Coffee with Ngopi",
    blurb: "A neighbourhood specialty coffee house roasting in small batches — and a calm place to work, meet and celebrate.",
    email: "hello@ngopi.coffee",
    phone: "+1 (415) 555-0142",
    whatsapp: "14155550142", // international format, no "+"
    address: "218 Valencia Street, San Francisco, CA 94103",
    announcement: "Free oat milk on all lattes this week · Pickup ready in 8 minutes",
  },
  // Currency formatter: change code/locale (e.g. "NGN","en-NG" for ₦)
  currency: { code: "USD", locale: "en-US" },
  currencies: [
    { code: "USD", locale: "en-US", rate: 1 },
    { code: "NGN", locale: "en-NG", rate: 1550 },
    { code: "IDR", locale: "id-ID", rate: 15800 },
    { code: "EUR", locale: "de-DE", rate: 0.92 },
  ],
  // Add / remove / rename / reorder nav items here
  navigation: [
    { label: "Products", href: "#/menu" },
    { label: "Beans", href: "#/beans" },
    { label: "Spaces", href: "#/spaces" },
    { label: "About us", href: "#/about" },
    { label: "Blog", href: "#/blog" },
    { label: "Contact", href: "#/contact" },
  ],
  // CLIENT TO CONFIRM — placeholder figures from the design
  stats: [
    { value: 30, suffix: "+", label: "Coffee Variant" },
    { value: 20, suffix: "+", label: "Meeting room" },
    { value: 25, suffix: "+", label: "Event space" },
    { value: 40, suffix: "+", label: "Global Achievement" },
  ],
  statsNote: "client to confirm",
  // Home product tabs (category ids from catalog)
  homeTabs: ["latte", "robusta", "arabica"],
  // Menu page tabs
  menuTabs: ["latte", "robusta", "arabica", "coldbrew", "noncoffee", "pastries", "beans", "merch"],
  categories: {
    latte: "Latte", robusta: "Robusta", arabica: "Arabica", coldbrew: "Cold Brew",
    noncoffee: "Non-Coffee", pastries: "Pastries", beans: "Beans", merch: "Merch",
  },
  // 0 = Sunday
  hours: [
    { day: 0, open: "08:00", close: "21:00" },
    { day: 1, open: "07:00", close: "22:00" },
    { day: 2, open: "07:00", close: "22:00" },
    { day: 3, open: "07:00", close: "22:00" },
    { day: 4, open: "07:00", close: "22:00" },
    { day: 5, open: "07:00", close: "23:00" },
    { day: 6, open: "08:00", close: "23:00" },
  ],
  ordering: { prepMinutes: 8, deliveryFee: 2.5, freeDeliveryOver: 25, taxRate: 0.08, pointsPerDollar: 10, pointValue: 0.01 },
  promoCodes: { NGOPI10: { type: "pct", value: 10, label: "10% off" }, WELCOME5: { type: "flat", value: 5, label: "$5 off orders over $15", min: 15 }, FREESHOT: { type: "flat", value: 0.6, label: "Free extra shot" } },
  bookings: { autoConfirm: false },
  subscription: [
    { id: "weekly", label: "Weekly", discount: 15 },
    { id: "biweekly", label: "Every 2 weeks", discount: 12 },
    { id: "monthly", label: "Monthly", discount: 10 },
  ],
  footer: {
    quick: [
      { label: "Menu", href: "#/menu" }, { label: "Spaces", href: "#/spaces" },
      { label: "About us", href: "#/about" }, { label: "Testimonial", href: "#/#testimonial" },
      { label: "Gift cards", href: "#/gift-cards" }, { label: "Locations", href: "#/locations" },
    ],
    resources: [
      { label: "Support & FAQ", href: "#/faq" }, { label: "Privacy Policy", href: "#/privacy" },
      { label: "Terms & Conditions", href: "#/terms" }, { label: "Track an order", href: "#/account?tab=orders" },
      { label: "Admin", href: "#/admin" },
    ],
    social: [
      { id: "facebook", href: "https://facebook.com" }, { id: "x", href: "https://x.com" },
      { id: "instagram", href: "https://instagram.com" }, { id: "linkedin", href: "https://linkedin.com" },
      { id: "youtube", href: "https://youtube.com" },
    ],
  },
  locations: [
    { id: "mission", name: "Ngopi Mission", address: "218 Valencia Street, San Francisco, CA 94103", phone: "+1 (415) 555-0142", lat: 37.7698, lng: -122.4222, spaces: true, note: "Flagship · roastery · meeting rooms & event hall" },
    { id: "soma", name: "Ngopi SoMa", address: "88 Townsend Street, San Francisco, CA 94107", phone: "+1 (415) 555-0178", lat: 37.7799, lng: -122.3897, spaces: true, note: "Workspace café · 4 meeting rooms" },
    { id: "oakland", name: "Ngopi Temescal", address: "4901 Telegraph Ave, Oakland, CA 94609", phone: "+1 (510) 555-0119", lat: 37.8355, lng: -122.2626, spaces: false, note: "Neighbourhood café · garden seating" },
  ],
};
