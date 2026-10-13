/* ============ STORE (Zustand-style, persisted) ============ */
const CFG = window.NGOPI_CONFIG, DATA = window.NGOPI_DATA, CONTENT = window.NGOPI_CONTENT;
const { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect, useSyncExternalStore } = React;

const LS_KEY = "ngopi-store-v1";
const seedOrders = () => {
  const now = Date.now();
  return [
    { id: "NG-24817", at: now - 1000 * 60 * 60 * 26, type: "pickup", status: 2, items: [{ key: "a", id: "kopi-susu-gula-aren", name: "Kopi Susu Gula Aren", qty: 2, unit: 3.3, opts: "Medium · Iced · 50% sugar", img: "img/iced-pour.jpg" }, { key: "b", id: "butter-croissant", name: "Butter Croissant", qty: 1, unit: 2.5, opts: "", img: "img/croissant.jpg" }], total: 9.94, customer: "Amara O." },
  ];
};
const initialState = () => ({
  cart: [], favs: ["kopi-susu-gula-aren", "ethiopia-yirgacheffe"], orders: seedOrders(), bookings: [
    { id: "BK-3102", space: "kopi-room", date: isoDay(1), start: "10:00", end: "12:00", attendees: 4, purpose: "Quarterly planning", name: "Amara Okafor", email: "amara@example.com", status: "pending", total: 36, addons: [] },
  ],
  points: 640, user: { name: "Amara Okafor", email: "amara@example.com", phone: "+1 415 555 0101", role: "customer" },
  addresses: [{ id: 1, label: "Home", line: "1450 Guerrero St, Apt 3, San Francisco, CA 94110" }],
  subscriptions: [], subscribers: ["hello@example.com"], giftCards: [],
  currency: CFG.currency.code, theme: "dark", orderType: "pickup", promo: null,
  admin: { products: {}, testimonials: CONTENT.testimonials.map((t, i) => ({ i, approved: true })), announcement: CFG.brand.announcement, stats: CFG.stats.map(s => s.value), forceClosed: false },
});
function isoDay(off = 0) { const d = new Date(); d.setDate(d.getDate() + off); return d.toISOString().slice(0, 10); }

let STATE = (() => { try { const s = JSON.parse(localStorage.getItem(LS_KEY)); if (s) return { ...initialState(), ...s }; } catch (e) { } return initialState(); })();
const listeners = new Set();
function setState(fn) { STATE = { ...STATE, ...(typeof fn === "function" ? fn(STATE) : fn) }; try { localStorage.setItem(LS_KEY, JSON.stringify(STATE)); } catch (e) { } listeners.forEach(l => l()); }
function useStore(sel = s => s) { return useSyncExternalStore(cb => { listeners.add(cb); return () => listeners.delete(cb); }, () => sel(STATE)); }

/* ---- UI bus (drawers / sheets / toasts) ---- */
const UI = { state: { cart: false, search: false, customize: null, mnav: false, toasts: [] }, ls: new Set() };
function setUI(p) { UI.state = { ...UI.state, ...p }; UI.ls.forEach(l => l()); }
function useUI() { return useSyncExternalStore(cb => { UI.ls.add(cb); return () => UI.ls.delete(cb); }, () => UI.state); }
let toastId = 0;
function toast(msg, icon) { const id = ++toastId; setUI({ toasts: [...UI.state.toasts, { id, msg, icon }] }); setTimeout(() => setUI({ toasts: UI.state.toasts.filter(t => t.id !== id) }), 2600); }

/* ---- products with admin overrides ---- */
function getProducts() { const o = STATE.admin.products || {}; return DATA.PRODUCTS.map(p => o[p.id] ? { ...p, ...o[p.id] } : p).filter(p => !p.deleted); }
function useProducts() { const ov = useStore(s => s.admin.products); return useMemo(getProducts, [ov]); }
function getProduct(id) { return getProducts().find(p => p.id === id); }
function inCat(p, cat) { return p.cat === cat || p.alsoCat === cat; }

/* ---- currency ---- */
function useMoney() {
  const code = useStore(s => s.currency);
  return useCallback((usd) => {
    const c = CFG.currencies.find(x => x.code === code) || CFG.currencies[0];
    const v = usd * c.rate;
    return new Intl.NumberFormat(c.locale, { style: "currency", currency: c.code, maximumFractionDigits: c.rate > 100 ? 0 : 2, minimumFractionDigits: c.rate > 100 ? 0 : (v % 1 === 0 && v >= 10 ? 0 : 2) }).format(v);
  }, [code]);
}

/* ---- store hours ---- */
function hm(s) { const [h, m] = s.split(":").map(Number); return h * 60 + m; }
function fmtTime(s) { const [h, m] = s.split(":").map(Number); const ap = h >= 12 ? "pm" : "am"; return ((h + 11) % 12 + 1) + (m ? ":" + String(m).padStart(2, "0") : "") + ap; }
function storeStatus(d = new Date()) {
  if (STATE.admin.forceClosed) return { open: false, label: "Ordering paused", next: "soon" };
  const day = CFG.hours.find(h => h.day === d.getDay()); const mins = d.getHours() * 60 + d.getMinutes();
  if (mins >= hm(day.open) && mins < hm(day.close)) return { open: true, label: "Open now", until: fmtTime(day.close) };
  const nextDay = mins < hm(day.open) ? day : CFG.hours.find(h => h.day === (d.getDay() + 1) % 7);
  return { open: false, label: "Closed", next: (nextDay === day ? "today " : "tomorrow ") + fmtTime(nextDay.open) };
}
function useStoreStatus() { const fc = useStore(s => s.admin.forceClosed); const [t, setT] = useState(0); useEffect(() => { const i = setInterval(() => setT(x => x + 1), 60000); return () => clearInterval(i); }, []); return useMemo(() => storeStatus(), [fc, t]); }

/* ---- cart ---- */
function lineKey(id, opts) { return id + "|" + JSON.stringify(opts || {}); }
function addToCart(p, opts = {}, qty = 1, unit, label = "", fromEl) {
  const key = lineKey(p.id, opts); const u = unit ?? p.price;
  setState(s => { const ex = s.cart.find(l => l.key === key); return { cart: ex ? s.cart.map(l => l.key === key ? { ...l, qty: l.qty + qty } : l) : [...s.cart, { key, id: p.id, name: p.name, img: p.img, qty, unit: u, opts: label, raw: opts }] }; });
  if (fromEl) flyToCart(fromEl, p.img);
  pulseBadge();
  toast(`${p.name} added to bag`, "✓");
}
function setQty(key, qty) { setState(s => ({ cart: qty <= 0 ? s.cart.filter(l => l.key !== key) : s.cart.map(l => l.key === key ? { ...l, qty } : l) })); }
function cartQtyFor(id) { return STATE.cart.filter(l => l.id === id).reduce((a, l) => a + l.qty, 0); }
function toggleFav(id) { const on = STATE.favs.includes(id); setState(s => ({ favs: on ? s.favs.filter(x => x !== id) : [...s.favs, id] })); toast(on ? "Removed from favourites" : "Saved to favourites", on ? "♡" : "♥"); }
function cartTotals(s = STATE, usePoints = 0) {
  const sub = s.cart.reduce((a, l) => a + l.unit * l.qty, 0);
  let disc = 0; const pr = s.promo && CFG.promoCodes[s.promo];
  if (pr && (!pr.min || sub >= pr.min)) disc = pr.type === "pct" ? sub * pr.value / 100 : Math.min(pr.value, sub);
  const del = s.orderType === "delivery" && sub > 0 && sub < CFG.ordering.freeDeliveryOver ? CFG.ordering.deliveryFee : 0;
  const ptsVal = Math.min(usePoints * CFG.ordering.pointValue, Math.max(0, sub - disc));
  const tax = Math.max(0, sub - disc - ptsVal) * CFG.ordering.taxRate;
  const total = Math.max(0, sub - disc - ptsVal + tax + del);
  return { sub, disc, del, tax, ptsVal, total, earn: Math.floor((sub - disc) * CFG.ordering.pointsPerDollar), count: s.cart.reduce((a, l) => a + l.qty, 0) };
}

/* ---- fly to cart ---- */
function flyToCart(el, src) {
  const tgt = document.querySelector("[data-cart-target]"); if (!tgt || !el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const a = el.getBoundingClientRect(), b = tgt.getBoundingClientRect();
  const img = document.createElement("img"); img.src = src; img.className = "flyer";
  const sz = 64; Object.assign(img.style, { width: sz + "px", height: sz + "px", left: (a.left + a.width / 2 - sz / 2) + "px", top: (a.top + a.height / 2 - sz / 2) + "px" });
  document.body.appendChild(img);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  img.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${dx * .5}px,${dy - 120}px) scale(.8)`, opacity: 1, offset: .55 }, { transform: `translate(${dx}px,${dy}px) scale(.2)`, opacity: .4 }], { duration: 800, easing: "cubic-bezier(.5,0,.3,1)" }).onfinish = () => img.remove();
}
function pulseBadge() { setTimeout(() => document.querySelectorAll(".badge").forEach(b => { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); }), 650); }

/* ---- router (hash, URL-synced query) ---- */
function parseHash() { const h = location.hash.slice(1) || "/"; const [path, q] = h.split("?"); return { path: path || "/", query: Object.fromEntries(new URLSearchParams(q || "")) }; }
function useRoute() { const [r, setR] = useState(parseHash); useEffect(() => { const f = () => setR(parseHash()); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f); }, []); return r; }
function nav(to) { if (to.includes("#") && to.split("#").length > 2) { /* anchor */ } location.hash = to.replace(/^#/, ""); }
function setQuery(patch, replace = true) {
  const { path, query } = parseHash(); const q = { ...query, ...patch }; Object.keys(q).forEach(k => (q[k] === "" || q[k] == null) && delete q[k]);
  const qs = new URLSearchParams(q).toString(); const url = "#" + path + (qs ? "?" + qs : "");
  if (replace) { history.replaceState(null, "", url); dispatchEvent(new HashChangeEvent("hashchange")); } else location.hash = url.slice(1);
}

function placeOrder({ type, when, address, payment, usePoints, name, phone, table, notes }) {
  const t = cartTotals(STATE, usePoints);
  const id = "NG-" + (24818 + STATE.orders.length + Math.floor(Math.random() * 40));
  const order = { id, at: Date.now(), type, when, address, payment, items: STATE.cart, total: t.total, sub: t.sub, disc: t.disc, del: t.del, tax: t.tax, ptsVal: t.ptsVal, status: 0, customer: name, phone, table, notes, earn: t.earn };
  setState(s => ({ orders: [order, ...s.orders], cart: [], promo: null, points: s.points - usePoints + t.earn }));
  return id;
}

Object.assign(window, { CFG, DATA, CONTENT, useStore, setState, useUI, setUI, toast, getProducts, useProducts, getProduct, inCat, useMoney, storeStatus, useStoreStatus, fmtTime, hm, addToCart, setQty, cartQtyFor, toggleFav, cartTotals, flyToCart, useRoute, nav, setQuery, parseHash, placeOrder, isoDay, STATE_GET: () => STATE, initialState });
