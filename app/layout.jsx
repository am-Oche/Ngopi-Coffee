/* ============ HEADER / FOOTER / OVERLAYS ============ */
function Logo() {
  return <a href="#/" className="logo" aria-label={CFG.brand.name + " home"}>
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <g className="steam"><path d="M11 9c-1.5-1.5 1.5-3 0-5" /><path d="M15.5 9c-1.5-1.5 1.5-3 0-5" /><path d="M20 9c-1.5-1.5 1.5-3 0-5" /></g>
      <path d="M6 13h18v5a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8v-5Z" /><path d="M24 15h1.5a3 3 0 0 1 0 6H23" />
    </svg>{CFG.brand.name}
  </a>;
}

function Header({ route }) {
  const [solid, setSolid] = useState(false); const count = useStore(s => s.cart.reduce((a, l) => a + l.qty, 0)); const theme = useStore(s => s.theme);
  const ann = useStore(s => s.admin.announcement); const st = useStoreStatus();
  useEffect(() => { const f = () => setSolid(scrollY > 40); f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  const isActive = h => { const p = h.replace("#", ""); return p !== "/" && route.path.startsWith(p.split("?")[0]); };
  return <>
    <header className={"hdr" + (solid || route.path !== "/" ? " solid" : "")}>
      {ann && !solid && route.path === "/" && <div className="announce" style={{ background: "transparent", color: "var(--muted)" }}>{st.open ? "● " : "○ "}{st.open ? `${st.label} until ${st.until}` : `${st.label} · opens ${st.next}`} · {ann}</div>}
      <div className="wrap hdr-in">
        <button className="icon-btn burger" onClick={() => setUI({ mnav: true })} aria-label="Open menu"><Icon n="menu" /></button>
        <Logo />
        <nav className="nav" aria-label="Main">{CFG.navigation.map(n => <a key={n.href} href={n.href} className={isActive(n.href) ? "on" : ""}>{n.label}</a>)}</nav>
        <div className="hdr-act">
          <button className="icon-btn hide-m" onClick={() => setState({ theme: theme === "dark" ? "cream" : "dark" })} aria-label="Toggle cream theme"><Icon n={theme === "dark" ? "sun" : "moon"} s={19} /></button>
          <button className="icon-btn" onClick={() => setUI({ search: true })} aria-label="Search"><Icon n="search" /></button>
          <a className="icon-btn hide-m" href="#/account" aria-label="Account"><Icon n="user" /></a>
          <button className="icon-btn" style={{ position: "relative" }} data-cart-target onClick={() => setUI({ cart: true })} aria-label={`Bag, ${count} items`}><Icon n="bag" />{count > 0 && <span className="badge">{count}</span>}</button>
        </div>
      </div>
    </header>
  </>;
}

function MobileNav({ route }) {
  const ui = useUI();
  useEffect(() => { setUI({ mnav: false }); }, [route.path]);
  return <div className={"mnav" + (ui.mnav ? " open" : "")} aria-hidden={!ui.mnav}>
    <div className="scrim" onClick={() => setUI({ mnav: false })} />
    <div className="panel" role="dialog" aria-label="Menu">
      <div className="row" style={{ marginBottom: 20 }}><Logo /><button className="icon-btn" onClick={() => setUI({ mnav: false })} aria-label="Close menu"><Icon n="x" /></button></div>
      <a href="#/" className={route.path === "/" ? "on" : ""}>Home</a>
      {CFG.navigation.map(n => <a key={n.href} href={n.href} className={route.path.startsWith(n.href.slice(1)) ? "on" : ""}>{n.label}</a>)}
      <a href="#/account">Account</a><a href="#/gift-cards">Gift cards</a><a href="#/faq">FAQ</a>
      <div style={{ marginTop: "auto" }}><button className="btn ghost sm" onClick={() => setState(s => ({ theme: s.theme === "dark" ? "cream" : "dark" }))}>Toggle theme</button></div>
    </div>
  </div>;
}

function BottomBar({ route }) {
  const count = useStore(s => s.cart.reduce((a, l) => a + l.qty, 0));
  const it = (href, n, l) => <a href={href} className={route.path === href.slice(1) ? "on" : ""}><Icon n={n} s={21} />{l}</a>;
  return <nav className="bbar" aria-label="Quick">
    {it("#/", "home", "Home")}{it("#/menu", "cup", "Menu")}
    <button onClick={() => setUI({ search: true })}><Icon n="search" s={21} />Search</button>
    <button onClick={() => setUI({ cart: true })} data-cart-target style={{ position: "relative" }}><Icon n="bag" s={21} />Cart{count > 0 && <span className="badge" style={{ right: "calc(50% - 22px)", top: 2 }}>{count}</span>}</button>
    {it("#/account", "user", "Account")}
  </nav>;
}

function Footer() {
  const [email, setEmail] = useState(""); const [err, setErr] = useState(""); const [ok, setOk] = useState(false);
  const submit = e => { e.preventDefault(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setErr("Enter a valid email address, like name@domain.com"); return; } setErr(""); setOk(true); setState(s => ({ subscribers: [...new Set([...s.subscribers, email])] })); };
  return <footer className="ftr">
    <div className="wrap">
      <div className="ftr-grid">
        <div><Logo /><p className="muted" style={{ fontSize: 14.5, maxWidth: 320, margin: "16px 0 18px" }}>{CFG.brand.blurb}</p>
          <div style={{ display: "grid", gap: 10, fontSize: 14.5 }}>
            <a href={"mailto:" + CFG.brand.email} style={{ display: "flex", gap: 10, alignItems: "center" }}><Icon n="mail" s={18} />{CFG.brand.email}</a>
            <a href={"tel:" + CFG.brand.phone.replace(/[^\d+]/g, "")} style={{ display: "flex", gap: 10, alignItems: "center" }}><Icon n="phone" s={18} />{CFG.brand.phone}</a>
          </div></div>
        <div><h4>Quick Links</h4><ul>{CFG.footer.quick.map(l => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}</ul></div>
        <div><h4>Resources</h4><ul>{CFG.footer.resources.map(l => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}</ul></div>
        <div><h4>Social Media</h4>
          <div className="socials">{CFG.footer.social.map(s => <a key={s.id} href={s.href} target="_blank" rel="noopener" aria-label={s.id}><Icon n={s.id} brand={s.id === "x"} s={18} /></a>)}</div>
          <h4 style={{ marginTop: 28, marginBottom: 4 }}>Subscribe</h4>
          {ok ? <p style={{ color: "var(--ok)", fontSize: 14.5 }}>✓ You're on the list. Fresh-roast news coming soon.</p> :
            <form className="sub-form" onSubmit={submit} noValidate><label className="sr" htmlFor="sub-email" style={{ position: "absolute", left: -9999 }}>Email</label><input id="sub-email" type="email" placeholder="name@domain.com" value={email} onChange={e => setEmail(e.target.value)} aria-invalid={!!err} /><button className="btn sm" type="submit">Send</button></form>}
          {err && <p className="err" role="alert">{err}</p>}
          <p className="muted" style={{ fontSize: 12 }}>By subscribing you agree to our Privacy Policy. <span style={{ opacity: .7 }}>(legal review)</span></p>
        </div>
      </div>
      <div className="ftr-bot"><span>© {new Date().getFullYear()} {CFG.brand.name} Coffee Co. All rights reserved.</span><span>{CFG.brand.address}</span></div>
    </div>
  </footer>;
}

/* ---- overlay shell with focus trap ---- */
function Overlay({ onClose, children, kind = "drawer", label }) {
  const [closing, setClosing] = useState(false); const ref = useRef();
  const close = () => { setClosing(true); setTimeout(onClose, 260); };
  useEffect(() => {
    const prev = document.activeElement; window.__lenis?.stop(); document.body.style.overflow = "hidden";
    setTimeout(() => ref.current?.querySelector("button, [href], input, select")?.focus(), 60);
    const k = e => { if (e.key === "Escape") close(); if (e.key === "Tab") { const f = [...ref.current.querySelectorAll("button:not([disabled]), [href], input, select, textarea")]; if (!f.length) return; const a = f[0], b = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); } else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); } } };
    addEventListener("keydown", k); return () => { removeEventListener("keydown", k); window.__lenis?.start(); document.body.style.overflow = ""; prev?.focus?.(); };
  }, []);
  return <div className={"ovl" + (closing ? " closing" : "")} role="dialog" aria-modal="true" aria-label={label}>
    <div className="scrim" onClick={close} /><div className={kind} ref={ref}>{children(close)}</div>
  </div>;
}

function CartDrawer() {
  const s = useStore(); const money = useMoney(); const t = cartTotals(s); const [code, setCode] = useState(""); const [cerr, setCerr] = useState("");
  const st = useStoreStatus();
  const suggest = getProducts().filter(p => ["butter-croissant", "choc-chip-cookie", "banana-bread", "almond-croissant", "kopi-susu-gula-aren"].includes(p.id) && !s.cart.some(l => l.id === p.id) && p.stock !== 0).slice(0, 3);
  const apply = () => { const c = code.trim().toUpperCase(); if (CFG.promoCodes[c]) { setState({ promo: c }); setCerr(""); toast(`Promo ${c} applied`, "✓"); } else setCerr("That code isn't valid. Try NGOPI10."); };
  return <Overlay onClose={() => setUI({ cart: false })} label="Shopping bag">{close => <>
    <div className="ov-head"><h2>Your bag {t.count > 0 && <span className="muted" style={{ fontSize: 16, fontFamily: "var(--sans)" }}>· {t.count}</span>}</h2><button className="icon-btn" onClick={close} aria-label="Close bag"><Icon n="x" /></button></div>
    <div className="ov-body">
      {!s.cart.length ? <div className="center" style={{ padding: "60px 10px" }}><div className="serif" style={{ fontSize: 28 }}>Your bag is empty</div><p className="muted">Start with our signature Kopi Susu Gula Aren.</p><button className="btn" onClick={() => { close(); nav("/menu"); }}>Browse menu <Arrow /></button></div> : <>
        {s.cart.map(l => <div className="line-item" key={l.key}>
          <img src={l.img} alt="" />
          <div><div style={{ fontWeight: 700 }}>{l.name}</div>{l.opts && <div className="muted" style={{ fontSize: 12.5, marginTop: 3, lineHeight: 1.45 }}>{l.opts}</div>}
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}><Qty v={l.qty} set={v => setQty(l.key, v)} min={0} /><button className="icon-btn" style={{ width: 38, height: 38 }} onClick={() => setQty(l.key, 0)} aria-label={"Remove " + l.name}><Icon n="trash" s={17} /></button></div></div>
          <b>{money(l.unit * l.qty)}</b>
        </div>)}
        <div style={{ marginTop: 20 }}>
          <div className="eyebrow" style={{ fontSize: 13 }}>Order type</div>
          <div className="seg">{[["pickup", "Pickup", `Ready in ~${CFG.ordering.prepMinutes} min`], ["delivery", "Delivery", "25–35 min"], ["dinein", "Dine-in", "Scan table QR"]].map(([v, l, d]) => <button key={v} className={"opt" + (s.orderType === v ? " on" : "")} onClick={() => setState({ orderType: v })} style={{ flex: 1 }}>{l}<small>{d}</small></button>)}</div>
        </div>
        <div style={{ marginTop: 18 }}><div className="eyebrow" style={{ fontSize: 13 }}>Promo code</div>
          {s.promo ? <div className="row panel" style={{ padding: "12px 16px" }}><span><b>{s.promo}</b> · <span className="muted">{CFG.promoCodes[s.promo].label}</span></span><button className="link-btn" onClick={() => setState({ promo: null })}>Remove</button></div> :
            <div style={{ display: "flex", gap: 8 }}><input className="inp" value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. NGOPI10" onKeyDown={e => e.key === "Enter" && apply()} aria-label="Promo code" /><button className="btn sm" onClick={apply}>Apply</button></div>}
          {cerr && <p className="err">{cerr}</p>}
        </div>
        <div className="panel" style={{ marginTop: 18, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center" }}><span style={{ fontSize: 22 }} aria-hidden="true">✦</span><div style={{ fontSize: 14 }}>You'll earn <b>{t.earn} points</b> with this order. You have <b>{s.points}</b> ({money(s.points * CFG.ordering.pointValue)}) to redeem at checkout.</div></div>
        {suggest.length > 0 && <div style={{ marginTop: 22 }}><div className="eyebrow" style={{ fontSize: 13 }}>You may also like</div>
          <div style={{ display: "grid", gap: 10 }}>{suggest.map(p => <div key={p.id} className="row panel" style={{ padding: 10 }}><div style={{ display: "flex", gap: 12, alignItems: "center" }}><img src={p.img} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }} /><div><div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div><div className="muted" style={{ fontSize: 13 }}>{money(p.price)}</div></div></div><button className="plus" style={{ width: 38, height: 38 }} onClick={e => p.kind === "simple" ? addToCart(p, {}, 1, p.price, "") : setUI({ customize: { id: p.id } })} aria-label={"Add " + p.name}>+</button></div>)}</div></div>}
      </>}
    </div>
    {s.cart.length > 0 && <div className="ov-foot">
      <div className="sum-row"><span>Subtotal</span><span>{money(t.sub)}</span></div>
      {t.disc > 0 && <div className="sum-row"><span>Discount</span><span>−{money(t.disc)}</span></div>}
      {s.orderType === "delivery" && <div className="sum-row"><span>Delivery</span><span>{t.del ? money(t.del) : "Free"}</span></div>}
      {!st.open && <p className="muted" style={{ fontSize: 13, margin: "6px 0" }}>☾ We're closed now — you can schedule for when we open {st.next}.</p>}
      <button className="btn cream block" style={{ marginTop: 12 }} onClick={() => { close(); nav("/checkout"); }}>Checkout · {money(t.total)} <Arrow /></button>
      <button className="link-btn" style={{ width: "100%", justifyContent: "center", marginTop: 10 }} onClick={() => { close(); nav("/cart"); }}>View full cart</button>
    </div>}
  </>}</Overlay>;
}

/* ---- Customize sheet ---- */
function useCustomizer(p) {
  const O = DATA.OPTIONS;
  const [o, setO] = useState(() => ({ size: "M", milk: p.defaultMilk || "whole", sugar: "50%", ice: "Normal", temp: p.temp?.[0] || "hot", extras: [], notes: "", grind: "Whole bean", weight: "250g", amount: 25, sub: "" }));
  const unit = useMemo(() => {
    if (p.kind === "bean") { const w = O.weight.find(x => x.id === o.weight); let v = p.price * w.mult; if (o.sub) v *= 1 - CFG.subscription.find(x => x.id === o.sub).discount / 100; return Math.round(v * 100) / 100; }
    if (p.kind === "gift") return o.amount;
    let v = p.price + O.size.find(x => x.id === o.size).delta; if (p.milk) v += O.milk.find(x => x.id === o.milk).delta; o.extras.forEach(e => v += O.extras.find(x => x.id === e).delta); return Math.round(v * 100) / 100;
  }, [o, p]);
  const label = p.kind === "bean" ? [o.weight, o.grind, o.sub && "Subscribe · " + CFG.subscription.find(x => x.id === o.sub).label].filter(Boolean).join(" · ")
    : p.kind === "gift" ? `$${o.amount} gift card` :
      [O.size.find(x => x.id === o.size).label, p.temp?.length > 1 ? (o.temp === "iced" ? "Iced" : "Hot") : null, p.milk ? O.milk.find(x => x.id === o.milk).label + " milk" : null, o.sugar !== "50%" ? o.sugar + " sugar" : null, o.temp === "iced" && o.ice !== "Normal" ? o.ice + " ice" : null, ...o.extras.map(e => O.extras.find(x => x.id === e).label), o.notes && `“${o.notes}”`].filter(Boolean).join(" · ");
  const raw = p.kind === "bean" ? { w: o.weight, g: o.grind, s: o.sub } : p.kind === "gift" ? { a: o.amount } : { ...o, notes: o.notes };
  return { o, setO, unit, label, raw };
}
function G({ t, children }) { return <fieldset style={{ border: 0, padding: 0, margin: "0 0 22px" }}><legend style={{ fontWeight: 700, marginBottom: 10, fontSize: 15 }}>{t}</legend>{children}</fieldset>; }
function Customizer({ p, c, compact }) {
  const O = DATA.OPTIONS; const money = useMoney(); const { o, setO } = c; const set = (k, v) => setO(x => ({ ...x, [k]: v }));
  if (p.kind === "gift") return <G t="Amount"><div className="seg">{O.gift.map(a => <button key={a} className={"opt" + (o.amount === a ? " on" : "")} onClick={() => set("amount", a)} style={{ minWidth: 80 }}>{money(a)}</button>)}</div></G>;
  if (p.kind === "bean") return <>
    <G t="Bag size"><div className="seg">{O.weight.map(w => <button key={w.id} className={"opt" + (o.weight === w.id ? " on" : "")} onClick={() => set("weight", w.id)}>{w.label}<small>{money(p.price * w.mult)}</small></button>)}</div></G>
    <G t="Grind"><div className="seg">{O.grind.map(g => <button key={g} className={"opt" + (o.grind === g ? " on" : "")} onClick={() => set("grind", g)}>{g}</button>)}</div></G>
    <G t="Purchase"><div className="seg"><button className={"opt" + (!o.sub ? " on" : "")} onClick={() => set("sub", "")}>One-time</button>{CFG.subscription.map(s => <button key={s.id} className={"opt" + (o.sub === s.id ? " on" : "")} onClick={() => set("sub", s.id)}>{s.label}<small>Save {s.discount}%</small></button>)}</div></G>
  </>;
  return <>
    {p.temp?.length > 1 && <G t="Hot or iced"><div className="seg">{p.temp.map(t => <button key={t} className={"opt" + (o.temp === t ? " on" : "")} onClick={() => set("temp", t)} style={{ minWidth: 90 }}>{t === "hot" ? "Hot" : "Iced"}</button>)}</div></G>}
    <G t="Size"><div className="seg">{O.size.map(s => <button key={s.id} className={"opt" + (o.size === s.id ? " on" : "")} onClick={() => set("size", s.id)} style={{ minWidth: 92 }}>{s.label}<small>{s.ml}{s.delta ? " · +" + money(s.delta) : ""}</small></button>)}</div></G>
    {p.milk && <G t="Milk"><div className="seg">{O.milk.map(m => <button key={m.id} className={"opt" + (o.milk === m.id ? " on" : "")} onClick={() => set("milk", m.id)}>{m.label}{m.delta ? <small>+{money(m.delta)}</small> : <small>Included</small>}</button>)}</div></G>}
    <div className="grid2" style={{ gap: 0, columnGap: 24 }}>
      <G t="Sugar level"><div className="seg">{O.sugar.map(s => <button key={s} className={"opt" + (o.sugar === s ? " on" : "")} onClick={() => set("sugar", s)} style={{ padding: "10px 11px" }}>{s}</button>)}</div></G>
      {o.temp === "iced" && <G t="Ice level"><div className="seg">{O.ice.map(s => <button key={s} className={"opt" + (o.ice === s ? " on" : "")} onClick={() => set("ice", s)} style={{ padding: "10px 11px" }}>{s}</button>)}</div></G>}
    </div>
    <G t="Extras"><div className="seg">{O.extras.map(e => { const on = o.extras.includes(e.id); return <button key={e.id} aria-pressed={on} className={"opt" + (on ? " on" : "")} onClick={() => set("extras", on ? o.extras.filter(x => x !== e.id) : [...o.extras, e.id])}>{on ? "✓ " : ""}{e.label}<small>+{money(e.delta)}</small></button>; })}</div></G>
    {!compact && <G t="Notes for the barista"><input className="inp" maxLength={80} value={o.notes} onChange={e => set("notes", e.target.value)} placeholder="e.g. extra hot, no lid" /></G>}
  </>;
}
function CustomizeSheet({ id, from }) {
  const p = getProduct(id); const c = useCustomizer(p); const [q, setQ] = useState(1); const money = useMoney(); const btn = useRef();
  return <Overlay onClose={() => setUI({ customize: null })} kind="sheet" label={"Customise " + p.name}>{close => <>
    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 18, padding: "20px 24px", borderBottom: "1px solid var(--line)", alignItems: "center" }}>
      <img src={p.img} alt="" style={{ width: 120, height: 100, objectFit: "cover", borderRadius: "10px 50px 10px 10px" }} />
      <div><h2 className="serif" style={{ margin: 0, fontWeight: 500, fontSize: 28 }}>{p.name}</h2><Rating r={p.rating} n={p.reviews} /><p className="muted" style={{ margin: "6px 0 0", fontSize: 14 }}>{p.desc}</p></div>
      <button className="icon-btn" onClick={close} aria-label="Close" style={{ alignSelf: "start" }}><Icon n="x" /></button>
    </div>
    <div className="ov-body"><Customizer p={p} c={c} /></div>
    <div className="ov-foot row"><Qty v={q} set={setQ} lg /><button ref={btn} className="btn cream" style={{ flex: 1, justifyContent: "center" }} onClick={() => { addToCart(p, c.raw, q, c.unit, c.label, btn.current); close(); }}>Add to bag · {money(c.unit * q)}</button></div>
  </>}</Overlay>;
}

function SearchOverlay() {
  const [q, setQ] = useState(""); const [act, setAct] = useState(0); const money = useMoney();
  const res = useMemo(() => { const s = q.trim().toLowerCase(); if (!s) return []; const prods = getProducts().filter(p => (p.name + " " + p.desc + " " + (p.notes || []).join(" ") + " " + CFG.categories[p.cat]).toLowerCase().includes(s)).map(p => ({ t: "p", p })); const posts = CONTENT.posts.filter(p => p.title.toLowerCase().includes(s)).map(p => ({ t: "b", p })); const sp = DATA.SPACES.filter(p => (p.name + " " + p.type).toLowerCase().includes(s)).map(p => ({ t: "s", p })); return [...prods, ...sp, ...posts].slice(0, 9); }, [q]);
  const go = (r, close) => { close(); nav(r.t === "p" ? "/product/" + r.p.id : r.t === "b" ? "/blog/" + r.p.id : "/spaces/" + r.p.id); };
  return <Overlay onClose={() => setUI({ search: false })} kind="search-ovl" label="Search">{close => <div className="wrap" style={{ paddingTop: 70, paddingBottom: 60, maxWidth: 860 }}>
    <div className="row"><span className="eyebrow">Search Ngopi</span><button className="icon-btn" onClick={close} aria-label="Close search"><Icon n="x" /></button></div>
    <input className="big" autoFocus value={q} onChange={e => { setQ(e.target.value); setAct(0); }} placeholder="Latte, Yirgacheffe, meeting room…" aria-label="Search" onKeyDown={e => { if (e.key === "ArrowDown") { e.preventDefault(); setAct(a => Math.min(res.length - 1, a + 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setAct(a => Math.max(0, a - 1)); } if (e.key === "Enter" && res[act]) go(res[act], close); }} />
    {!q && <div style={{ marginTop: 26, display: "flex", gap: 8, flexWrap: "wrap" }}>{["Kopi Susu", "Oat", "Cold brew", "Croissant", "Ethiopia", "Boardroom", "Latte art"].map(s => <button key={s} className="chip" onClick={() => setQ(s)}>{s}</button>)}</div>}
    <div style={{ marginTop: 20, display: "grid", gap: 4 }} role="listbox">
      {res.map((r, i) => <button key={r.t + r.p.id} role="option" aria-selected={i === act} className={"sres" + (i === act ? " act" : "")} onMouseEnter={() => setAct(i)} onClick={() => go(r, close)} style={{ textAlign: "left" }}>
        <img src={r.p.img} alt="" /><div><div style={{ fontWeight: 600 }}>{r.p.name || r.p.title}</div><div className="muted" style={{ fontSize: 13 }}>{r.t === "p" ? CFG.categories[r.p.cat] : r.t === "s" ? (r.p.type === "meeting" ? "Meeting room" : "Event space") + " · up to " + r.p.seats : "Article · " + r.p.cat}</div></div>
        <span className="muted">{r.t === "p" ? money(r.p.price) : r.t === "s" ? money(r.p.price) + "/h" : "Read ›"}</span></button>)}
      {q && !res.length && <p className="muted" style={{ marginTop: 20 }}>No results for “{q}”. Try “latte” or “beans”.</p>}
    </div>
  </div>}</Overlay>;
}

function Toasts() { const { toasts } = useUI(); return <div className="toasts" aria-live="polite">{toasts.map(t => <div className="toast" key={t.id}><span aria-hidden="true">{t.icon}</span>{t.msg}</div>)}</div>; }

function WhatsAppButton({ text, label = "Order on WhatsApp", className = "btn ghost" }) {
  return <a className={className} href={`https://wa.me/${CFG.brand.whatsapp}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener"><Icon n="wa" s={18} />{label}</a>;
}

Object.assign(window, { Logo, Header, MobileNav, BottomBar, Footer, Overlay, CartDrawer, CustomizeSheet, SearchOverlay, Toasts, useCustomizer, Customizer, WhatsAppButton });
