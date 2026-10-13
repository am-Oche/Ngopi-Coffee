/* ============ ROUTER + SHELL ============
   Adding a page: add one entry here + (optionally) one entry in config.navigation */
const ROUTES = [
  { re: /^\/$/, el: () => <HomePage />, title: "Specialty coffee, meeting rooms & event spaces" },
  { re: /^\/menu$/, el: () => <MenuPage />, title: "Menu" },
  { re: /^\/product\/([\w-]+)$/, el: m => <ProductPage id={m[1]} />, title: m => getProduct(m[1])?.name },
  { re: /^\/beans$/, el: () => <BeansPage />, title: "Whole beans & subscriptions" },
  { re: /^\/spaces$/, el: () => <SpacesPage />, title: "Meeting rooms & event spaces" },
  { re: /^\/spaces\/([\w-]+)$/, el: m => <SpaceDetail id={m[1]} />, title: m => DATA.SPACES.find(s => s.id === m[1])?.name },
  { re: /^\/booking\/([\w-]+)$/, el: m => <BookingConfirm id={m[1]} />, title: "Booking confirmation" },
  { re: /^\/cart$/, el: () => <CartPage />, title: "Cart" },
  { re: /^\/checkout$/, el: () => <CheckoutPage />, title: "Checkout" },
  { re: /^\/order\/([\w-]+)$/, el: m => <OrderPage id={m[1]} />, title: "Order tracking" },
  { re: /^\/account$/, el: () => <AccountPage />, title: "Account" },
  { re: /^\/about$/, el: () => <AboutPage />, title: "About us" },
  { re: /^\/contact$/, el: () => <ContactPage />, title: "Contact" },
  { re: /^\/locations$/, el: () => <LocationsPage />, title: "Locations" },
  { re: /^\/blog$/, el: () => <BlogPage />, title: "Blog" },
  { re: /^\/blog\/([\w-]+)$/, el: m => <ArticlePage id={m[1]} />, title: m => CONTENT.posts.find(p => p.id === m[1])?.title },
  { re: /^\/faq$/, el: () => <FAQPage />, title: "FAQ" },
  { re: /^\/gift-cards$/, el: () => <GiftCardsPage />, title: "Gift cards" },
  { re: /^\/privacy$/, el: () => <LegalPage kind="privacy" />, title: "Privacy Policy" },
  { re: /^\/terms$/, el: () => <LegalPage kind="terms" />, title: "Terms & Conditions" },
  { re: /^\/admin$/, el: () => <AdminPage />, title: "Admin" },
];

function App() {
  const route = useRoute(); const ui = useUI(); const theme = useStore(s => s.theme);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const anchor = route.path.startsWith("/#") ? route.path.slice(2) : null; const path = anchor ? "/" : route.path;
  let match = null, R = null; for (const r of ROUTES) { const m = path.match(r.re); if (m) { match = m; R = r; break; } }
  useEffect(() => {
    const t = R ? (typeof R.title === "function" ? R.title(match) : R.title) : "Page not found";
    document.title = `${t || CFG.brand.name} · ${CFG.brand.name}`;
    if (anchor) setTimeout(() => { const el = document.getElementById(anchor); el && (window.__lenis ? window.__lenis.scrollTo(el, { offset: -70 }) : scrollTo({ top: el.offsetTop - 70 })); }, 120);
    else { window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0); }
  }, [path, anchor]);
  return <>
    <a href="#main" className="btn sm" style={{ position: "fixed", left: -9999, top: 10, zIndex: 999 }} onFocus={e => e.target.style.left = "10px"} onBlur={e => e.target.style.left = "-9999px"}>Skip to content</a>
    <Header route={{ ...route, path }} />
    <main id="main" key={path}>{R ? R.el(match) : <NotFound />}</main>
    <Footer />
    <BottomBar route={{ ...route, path }} />
    <MobileNav route={{ ...route, path }} />
    {ui.cart && <CartDrawer />}
    {ui.search && <SearchOverlay />}
    {ui.customize && <CustomizeSheet key={ui.customize.id} id={ui.customize.id} from={ui.customize.from} />}
    <Toasts />
  </>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
if (window.Lenis && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true }); window.__lenis = lenis;
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
}
