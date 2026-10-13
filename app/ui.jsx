/* ============ SHARED UI PRIMITIVES ============ */
const Icon = ({ n, s = 20, sw = 1.6, ...r }) => {
  const p = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    bag: <><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h10" /></>,
    x: <><path d="M6 6l12 12M18 6 6 18" /></>,
    heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
    home: <><path d="M4 11 12 4l8 7v9H4z" /><path d="M10 20v-5h4v5" /></>,
    cup: <><path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9Z" /><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    arrowDR: <path d="M7 7l10 10M17 9v8H9" />,
    chevR: <path d="m9 6 6 6-6 6" />, chevL: <path d="m15 6-6 6 6 6" />,
    trash: <><path d="M5 7h14M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></>,
    pin: <><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" /><circle cx="12" cy="9" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" /></>,
    check: <path d="m5 12 4.5 4.5L19 7" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />,
    wa: <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20Zm5-11c0 3 3 6 6 6l1.2-1.4-2-1-1 .8a5 5 0 0 1-2.6-2.6l.8-1-1-2L9 9Z" />,
    facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v7h4v-7h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" />,
    x_: <path d="M4 4l16 16M20 4 4 20" />,
    instagram: <><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.5" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></>,
    linkedin: <><rect x="4" y="9" width="3" height="11" /><circle cx="5.5" cy="5.5" r="1.6" /><path d="M11 20V9h3v1.6A3.5 3.5 0 0 1 20 13v7h-3v-6a1.5 1.5 0 0 0-3 0v6Z" /></>,
    youtube: <><rect x="3" y="6" width="18" height="12" rx="4" /><path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor" /></>,
    gift: <><rect x="4" y="9" width="16" height="11" rx="1.5" /><path d="M3 9h18M12 9v11M12 9S9 4 7.5 5.5 9 9 12 9Zm0 0s3-5 4.5-3.5S15 9 12 9Z" /></>,
    star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.2 9.5l6.1-.9Z" />,
    qr: <><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" /></>,
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  }[n === "x" && r.brand ? "x_" : n];
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...r}>{p}</svg>;
};

const Arrow = () => <span className="arr" aria-hidden="true">↘</span>;

function ArchImage({ src, alt = "", corner = "tr", className = "", style, eager, imgStyle }) {
  const [ld, setLd] = useState(false);
  return <div className={`arch arch-${corner} ${className}`} style={style}>
    <div className={"arch-in" + (ld ? " ld" : "")}><img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" onLoad={() => setLd(true)} className={ld ? "ld" : ""} style={imgStyle} /></div>
  </div>;
}

function Img({ src, alt = "", ...r }) { const [ld, setLd] = useState(false); return <img src={src} alt={alt} loading="lazy" decoding="async" onLoad={() => setLd(true)} className={ld ? "ld" : ""} {...r} />; }

function Stars({ value, size = 15 }) {
  return <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
    {[0, 1, 2, 3, 4].map(i => { const f = Math.max(0, Math.min(1, value - i)); return <span key={i} style={{ position: "relative", width: size, height: size, display: "inline-block" }}>
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", inset: 0 }}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.2 9.5l6.1-.9Z" fill="rgba(245,181,10,.22)" /></svg>
      <span style={{ position: "absolute", inset: 0, width: f * 100 + "%", overflow: "hidden" }}><svg width={size} height={size} viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.2 9.5l6.1-.9Z" fill="#F5B50A" /></svg></span>
    </span>; })}
  </span>;
}
function Rating({ r, n }) { return <div className="rating"><span className="star">★</span><b style={{ color: "var(--cream)" }}>{r.toFixed(1)}</b><span>({n} reviews)</span></div>; }

function Qty({ v, set, min = 1, lg, label = "Quantity" }) {
  return <div className={"qty" + (lg ? " lg" : "")} role="group" aria-label={label}>
    <button onClick={() => set(Math.max(min, v - 1))} aria-label="Decrease">−</button><span aria-live="polite">{v}</span><button onClick={() => set(v + 1)} aria-label="Increase">+</button>
  </div>;
}

/* ---- Reveal on scroll ---- */
function useInView(opts = { threshold: .18 }) {
  const ref = useRef(); const [v, setV] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return; const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect(); } }, opts); io.observe(el); return () => io.disconnect(); }, []);
  return [ref, v];
}
function Reveal({ children, as: T = "div", className = "", delay = 0, ...r }) { const [ref, v] = useInView(); return <T ref={ref} className={`reveal ${v ? "in" : ""} ${className}`} style={{ transitionDelay: delay + "ms", ...(r.style || {}) }} {...r}>{children}</T>; }

function CountUp({ to, suffix = "", start }) {
  const [v, setV] = useState(0);
  useEffect(() => { if (!start) return; if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(to); return; } let raf, t0; const run = t => { t0 ??= t; const k = Math.min(1, (t - t0) / 1800); setV(Math.round(to * (1 - Math.pow(1 - k, 4)))); if (k < 1) raf = requestAnimationFrame(run); }; raf = requestAnimationFrame(run); return () => cancelAnimationFrame(raf); }, [start, to]);
  return <>{v}{suffix}</>;
}

/* ---- Tabs: sliding pill, ARIA, keyboard, URL sync ---- */
function Tabs({ items, value, onChange, label, size, id = "tabs" }) {
  const ref = useRef(); const [pill, setPill] = useState({ left: 5, width: 0 });
  const measure = useCallback(() => { const el = ref.current?.querySelector(`[data-v="${value}"]`); if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth }); }, [value]);
  useLayoutEffect(() => { measure(); }, [measure, items.length]);
  useEffect(() => { addEventListener("resize", measure); document.fonts?.ready.then(measure); return () => removeEventListener("resize", measure); }, [measure]);
  useEffect(() => { const el = ref.current?.querySelector(`[data-v="${value}"]`); const c = ref.current; if (el && c && c.scrollWidth > c.clientWidth) c.scrollTo({ left: el.offsetLeft - c.clientWidth / 2 + el.offsetWidth / 2, behavior: "smooth" }); }, [value]);
  const onKey = e => { const i = items.findIndex(t => t.value === value); let n = null; if (e.key === "ArrowRight") n = (i + 1) % items.length; if (e.key === "ArrowLeft") n = (i - 1 + items.length) % items.length; if (e.key === "Home") n = 0; if (e.key === "End") n = items.length - 1; if (n != null) { e.preventDefault(); onChange(items[n].value); ref.current.querySelector(`[data-v="${items[n].value}"]`)?.focus(); } };
  return <div className={"tabs" + (size === "sm" ? " sm" : "")} role="tablist" aria-label={label} ref={ref} onKeyDown={onKey}>
    <span className="tab-pill" style={{ left: pill.left, width: pill.width }} aria-hidden="true" />
    {items.map(t => <button key={t.value} role="tab" id={`${id}-${t.value}`} aria-controls={`${id}-panel`} data-v={t.value} aria-selected={t.value === value} tabIndex={t.value === value ? 0 : -1} className="tab" onClick={() => onChange(t.value)}>{t.label}{t.count != null && <span style={{ opacity: .6, marginLeft: 6, fontSize: 12 }}>{t.count}</span>}</button>)}
  </div>;
}
// URL-synced tab hook
function useTabParam(key, def, allowed) { const { query } = useRoute(); let v = query[key] || def; if (allowed && !allowed.includes(v)) v = def; return [v, (nv) => setQuery({ [key]: nv === def ? "" : nv })]; }

/* animated content swap for tab panels */
function Swap({ k, children, className = "" }) {
  const [shown, setShown] = useState({ k, c: children }); const [phase, setPhase] = useState("in");
  useEffect(() => { if (k === shown.k) { setShown({ k, c: children }); return; } setPhase("out"); const t = setTimeout(() => { setShown({ k, c: children }); setPhase("in"); }, 200); return () => clearTimeout(t); }, [k, children]);
  return <div className={`${className} ${phase === "out" ? "out" : "reflow"}`} key={shown.k + phase}>{shown.c}</div>;
}

/* ---- Carousel with dots, swipe, keyboard ---- */
function Carousel({ pages, label = "carousel", renderPage, resetKey, autoplay }) {
  const [i, setI] = useState(0); const track = useRef(); const drag = useRef(null); const [dx, setDx] = useState(0);
  useEffect(() => setI(0), [resetKey]);
  const n = pages.length; const go = j => setI(Math.max(0, Math.min(n - 1, j)));
  useEffect(() => { if (!autoplay || n < 2) return; const t = setInterval(() => setI(x => (x + 1) % n), autoplay); return () => clearInterval(t); }, [autoplay, n, i]);
  const down = e => { drag.current = { x: e.clientX, y: e.clientY, w: track.current.offsetWidth, moved: false }; };
  const move = e => { if (!drag.current) return; const d = e.clientX - drag.current.x; if (Math.abs(d) > 6) drag.current.moved = true; setDx(d); };
  const up = () => { if (!drag.current) return; const d = dx, w = drag.current.w; if (d < -w * .15) go(i + 1); else if (d > w * .15) go(i - 1); setDx(0); setTimeout(() => drag.current = null, 0); };
  return <div role="region" aria-roledescription="carousel" aria-label={label} onKeyDown={e => { if (e.key === "ArrowRight") go(i + 1); if (e.key === "ArrowLeft") go(i - 1); }}>
    <div className="car" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} onClickCapture={e => { if (drag.current?.moved) { e.stopPropagation(); e.preventDefault(); } }}>
      <div ref={track} className={"car-track" + (dx ? " drag" : "")} style={{ transform: `translateX(calc(${-i * 100}% + ${dx}px))` }}>
        {pages.map((p, k) => <div className="car-page" key={k} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`} aria-hidden={k !== i}>{renderPage(p, k)}</div>)}
      </div>
    </div>
    {n > 1 && <div className="dots" role="tablist" aria-label={label + " pages"}>
      {pages.map((_, k) => <button key={k} className="dot-hit" role="tab" aria-selected={k === i} aria-label={`Go to page ${k + 1}`} onClick={() => go(k)}><span className={"dot" + (k === i ? " on" : "")} style={{ display: "block" }} /></button>)}
    </div>}
  </div>;
}
function chunk(a, n) { const r = []; for (let i = 0; i < a.length; i += n) r.push(a.slice(i, i + n)); return r; }
function usePerPage() { const calc = () => innerWidth < 820 ? 2 : innerWidth < 1080 ? 3 : 4; const [n, setN] = useState(calc); useEffect(() => { const f = () => setN(calc()); addEventListener("resize", f); return () => removeEventListener("resize", f); }, []); return n; }

/* ---- Product card ---- */
function ProductCard({ p }) {
  const money = useMoney(); const favs = useStore(s => s.favs); const cart = useStore(s => s.cart); const st = useStoreStatus();
  const fav = favs.includes(p.id); const q = cart.filter(l => l.id === p.id).reduce((a, l) => a + l.qty, 0);
  const sold = p.stock === 0 || p.available === false; const low = p.stock > 0 && p.stock <= 5;
  const simpleLine = cart.find(l => l.id === p.id && l.key === p.id + "|{}");
  const plusRef = useRef();
  const add = e => { e.stopPropagation(); if (!st.open && p.cat !== "beans" && p.cat !== "merch") { toast(`We're closed — ordering opens ${st.next}`, "☾"); return; } if (p.kind === "simple") addToCart(p, {}, 1, p.price, "", plusRef.current); else setUI({ customize: { id: p.id, from: plusRef.current } }); };
  return <article className={"pcard" + (sold ? " soldout" : "")} onClick={() => nav("/product/" + p.id)} tabIndex={0} onKeyDown={e => e.key === "Enter" && e.target === e.currentTarget && nav("/product/" + p.id)} aria-label={p.name}>
    <div className="ph">
      <Img src={p.img} alt={p.name} />
      <div className="tags">{sold ? <span className="tag">Sold out</span> : low ? <span className="tag">Only {p.stock} left</span> : null}{(p.tags || []).slice(0, 1).map(t => <span key={t} className="tag">{t}</span>)}</div>
      <button className={"fav" + (fav ? " on" : "")} onClick={e => { e.stopPropagation(); toggleFav(p.id); }} aria-label={fav ? "Remove from favourites" : "Add to favourites"} aria-pressed={fav}><Icon n="heart" s={18} /></button>
    </div>
    <h3>{p.name}</h3>
    <Rating r={p.rating} n={p.reviews} />
    <p>{p.desc}</p>
    <div className="foot">
      <span className="price">{money(p.price)}</span>
      {simpleLine && p.kind === "simple" ? <div className="mini-step" onClick={e => e.stopPropagation()}><button onClick={() => setQty(simpleLine.key, simpleLine.qty - 1)} aria-label="Decrease">−</button><span>{simpleLine.qty}</span><button onClick={() => setQty(simpleLine.key, simpleLine.qty + 1)} aria-label="Increase">+</button></div>
        : <button ref={plusRef} className="plus" onClick={add} disabled={sold} aria-label={`Add ${p.name}`}>{q > 0 && p.kind !== "simple" ? <span style={{ fontSize: 14, fontWeight: 700 }}>{q}+</span> : "+"}</button>}
    </div>
  </article>;
}
function CardSkeleton() { return <div className="pcard-sk"><div className="sk" style={{ aspectRatio: "1/.86", borderRadius: 16 }} /><div className="sk" style={{ height: 16, width: "70%", margin: "16px 4px 8px" }} /><div className="sk" style={{ height: 12, width: "40%", margin: "0 4px 12px" }} /><div className="sk" style={{ height: 12, margin: "0 4px 6px" }} /><div className="sk" style={{ height: 12, width: "80%", margin: "0 4px 18px" }} /><div style={{ display: "flex", justifyContent: "space-between", margin: "0 4px" }}><div className="sk" style={{ height: 20, width: 60 }} /><div className="sk" style={{ height: 42, width: 42 }} /></div></div>; }

function Accordion({ items }) { const [o, setO] = useState(0); return <div>{items.map((it, i) => <div key={i} className={"acc" + (o === i ? " open" : "")}><button className="q" aria-expanded={o === i} aria-controls={"acc-" + i} onClick={() => setO(o === i ? -1 : i)}>{it.q}<span className="pm" aria-hidden="true">+</span></button><div className="a" id={"acc-" + i} role="region"><div><p>{it.a}</p></div></div></div>)}</div>; }

function Section({ eyebrow, title, children, center, className = "", id, right }) {
  return <section className={"sec " + className} id={id}><div className="wrap">
    {(eyebrow || title) && <Reveal className={center ? "center" : ""} style={right ? { display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" } : null}>
      <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}{title && <h2 className="h-sec">{title}</h2>}</div>{right}
    </Reveal>}
    {children}
  </div></section>;
}
function PageHead({ crumbs = [], title, sub, children }) {
  return <header className="phead"><div className="wrap">
    <nav className="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>{crumbs.map((c, i) => <React.Fragment key={i}><span aria-hidden="true">/</span>{c.href ? <a href={c.href}>{c.label}</a> : <span aria-current="page" style={{ color: "var(--cream)" }}>{c.label}</span>}</React.Fragment>)}</nav>
    <h1 className="h-page">{title}</h1>{sub && <p className="muted" style={{ maxWidth: 620, fontSize: 17, marginTop: 16 }}>{sub}</p>}{children}
  </div></header>;
}
function Empty({ title, text, cta }) { return <div className="panel center" style={{ padding: "60px 24px" }}><div className="serif" style={{ fontSize: 28, marginBottom: 8 }}>{title}</div><p className="muted" style={{ margin: "0 auto 22px", maxWidth: 420 }}>{text}</p>{cta}</div>; }

Object.assign(window, { Icon, Arrow, ArchImage, Img, Stars, Rating, Qty, useInView, Reveal, CountUp, Tabs, useTabParam, Swap, Carousel, chunk, usePerPage, ProductCard, CardSkeleton, Accordion, Section, PageHead, Empty });
