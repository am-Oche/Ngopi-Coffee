/* ============ MENU / PRODUCT / BEANS ============ */
function MenuPage() {
  const prods = useProducts(); const { query } = useRoute();
  const [tab, setTab] = useTabParam("tab", "all", ["all", ...CFG.menuTabs]);
  const q = query.q || ""; const sort = query.sort || "popular"; const f = (query.f || "").split(",").filter(Boolean); const maxP = Number(query.max || 20);
  const toggleF = k => setQuery({ f: (f.includes(k) ? f.filter(x => x !== k) : [...f, k]).join(",") });
  const [loading, setLoading] = useState(true); useEffect(() => { const t = setTimeout(() => setLoading(false), 450); return () => clearTimeout(t); }, []);
  let list = prods.filter(p => tab === "all" || inCat(p, tab));
  if (q) list = list.filter(p => (p.name + p.desc + (p.notes || []).join()).toLowerCase().includes(q.toLowerCase()));
  if (f.includes("hot")) list = list.filter(p => p.temp?.includes("hot"));
  if (f.includes("iced")) list = list.filter(p => p.temp?.includes("iced"));
  if (f.includes("milkfree")) list = list.filter(p => !(p.allergens || []).includes("Milk"));
  if (f.includes("vegan")) list = list.filter(p => (p.tags || []).includes("Vegan"));
  if (f.includes("nutfree")) list = list.filter(p => !(p.allergens || []).includes("Tree nuts"));
  if (f.includes("decaf")) list = list.filter(p => (p.caffeine ?? 0) <= 1);
  if (f.includes("strong")) list = list.filter(p => (p.caffeine ?? 0) >= 3);
  list = list.filter(p => p.price <= maxP);
  list = [...list].sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : b.reviews - a.reviews);
  const filters = [["hot", "Hot"], ["iced", "Iced"], ["milkfree", "Milk-free"], ["vegan", "Vegan"], ["nutfree", "Nut-free"], ["decaf", "Low caffeine"], ["strong", "Extra strong"]];
  return <div className="page">
    <PageHead crumbs={[{ label: "Menu" }]} title="The full menu" sub="Every drink is made to order with beans roasted in-house this week. Tap + to customise size, milk, sweetness and extras." />
    <div className="wrap">
      <div style={{ position: "sticky", top: 78, zIndex: 20, background: "var(--bg)", padding: "14px 0", margin: "0 -4px" }}>
        <Tabs id="menu-tabs" label="Menu categories" value={tab} onChange={setTab} size="sm" items={[{ value: "all", label: "All", count: prods.length }, ...CFG.menuTabs.map(c => ({ value: c, label: CFG.categories[c], count: prods.filter(p => inCat(p, c)).length }))]} />
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", margin: "10px 0 30px" }}>
        <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 340 }}><span style={{ position: "absolute", left: 14, top: 14, color: "var(--muted)" }}><Icon n="search" s={19} /></span><input className="inp" style={{ paddingLeft: 42 }} value={q} onChange={e => setQuery({ q: e.target.value })} placeholder="Search the menu" aria-label="Search the menu" /></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{filters.map(([k, l]) => <button key={k} className={"chip" + (f.includes(k) ? " on" : "")} aria-pressed={f.includes(k)} onClick={() => toggleF(k)}>{l}</button>)}</div>
        <label className="chip" style={{ gap: 10 }}>Up to {useMoney()(maxP)}<input type="range" min="2" max="20" step="0.5" value={maxP} onChange={e => setQuery({ max: e.target.value === "20" ? "" : e.target.value })} style={{ accentColor: "var(--cream)", width: 90 }} aria-label="Max price" /></label>
        <select className="inp" style={{ width: 190, marginLeft: "auto" }} value={sort} onChange={e => setQuery({ sort: e.target.value === "popular" ? "" : e.target.value })} aria-label="Sort"><option value="popular">Most popular</option><option value="rating">Top rated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select>
      </div>
      <p className="muted" style={{ fontSize: 14, marginTop: -14 }} aria-live="polite">{list.length} item{list.length !== 1 && "s"}</p>
      <div id="menu-tabs-panel" role="tabpanel">
        {loading ? <div className="pgrid">{Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}</div> :
          list.length ? <Swap k={tab + q + f.join() + sort + maxP} className="pgrid">{list.map(p => <ProductCard key={p.id} p={p} />)}</Swap> :
            <Empty title="Nothing matches yet" text="Try removing a filter or searching for something else." cta={<button className="btn" onClick={() => setQuery({ f: "", q: "", max: "" })}>Clear filters</button>} />}
      </div>
    </div>
    <div style={{ height: 80 }} />
  </div>;
}

function Meter({ v, max = 3, label }) { return <div><div className="muted" style={{ fontSize: 12.5, marginBottom: 6 }}>{label}</div><div style={{ display: "flex", gap: 4 }} aria-label={`${label} ${v} of ${max}`}>{Array.from({ length: max }).map((_, i) => <span key={i} style={{ width: 26, height: 6, borderRadius: 3, background: i < v ? "var(--cream)" : "var(--line-2)" }} />)}</div></div>; }

function ProductPage({ id }) { const p = useProducts().find(x => x.id === id); return p ? <ProductInner key={id} p={p} id={id} /> : <NotFound />; }
function ProductInner({ p, id }) {
  const money = useMoney(); const favs = useStore(s => s.favs);
  const c = useCustomizer(p); const [qn, setQn] = useState(1); const btn = useRef(); const st = useStoreStatus();
  const [tab, setTab] = useTabParam("t", "description", ["description", "notes", "reviews", "brew"]);
  const [img, setImg] = useState(0); useEffect(() => { setImg(0); scrollTo(0, 0); }, [id]);
  const gallery = [p.img, ...getProducts().filter(x => x.cat === p.cat && x.img !== p.img).slice(0, 2).map(x => x.img)];
  const related = getProducts().filter(x => x.id !== p.id && (x.cat === p.cat)).slice(0, 4);
  const sold = p.stock === 0 || p.available === false; const fav = favs.includes(p.id);
  const closed = !st.open && !["beans", "merch"].includes(p.cat);
  const brew = p.cat === "beans" ? ["Espresso: 18g in, 36g out, 27–30s at 93°C.", "V60: 15g coffee, 250g water at 94°C, 3:00 total brew.", "French press: 30g coarse, 500g water, steep 4 min, plunge slowly.", "Moka pot: fill basket level without tamping, medium-low heat, pull off at the first gurgle."] :
    ["We pull a double shot (18g → 36g) for every espresso drink.", "Milk is steamed to 60–65°C — hot enough to sweeten, never scalded.", "Iced versions are built over ice with the shot poured last, so it stays bright.", "Want to recreate it at home? Use our House Blend and follow our latte art guide on the blog."];
  const reviews = [["Verified buyer · 2 weeks ago", 5, "Exactly as described — I order this almost daily."], ["Verified buyer · 1 month ago", 4.5, "Lovely balance. I go for oat milk and 25% sugar."], ["Verified buyer · 2 months ago", 5, "Consistent across all three locations."]];
  return <div className="page">
    <div className="wrap" style={{ paddingTop: 120 }}>
      <nav className="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><a href="#/menu">Menu</a><span>/</span><a href={"#/menu?tab=" + p.cat}>{CFG.categories[p.cat]}</a><span>/</span><span style={{ color: "var(--cream)" }}>{p.name}</span></nav>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 56, alignItems: "start" }} className="pd-grid">
        <div style={{ position: "sticky", top: 100 }}>
          <ArchImage key={gallery[img]} corner="tr" src={gallery[img]} alt={p.name} eager style={{ aspectRatio: 1 }} />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>{gallery.map((g, i) => <button key={i} onClick={() => setImg(i)} aria-label={"Image " + (i + 1)} style={{ width: 76, height: 76, borderRadius: 12, overflow: "hidden", outline: i === img ? "2px solid var(--cream)" : "1px solid var(--line)", outlineOffset: 2 }}><img src={g} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></button>)}</div>
        </div>
        <div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>{(p.tags || []).map(t => <span className="tag" key={t}>{t}</span>)}{sold && <span className="tag bad">Sold out</span>}{p.stock > 0 && p.stock <= 5 && <span className="tag warn">Only {p.stock} left today</span>}</div>
          <h1 className="h-page" style={{ fontSize: "clamp(36px,4.5vw,56px)" }}>{p.name}</h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "12px 0" }}><Stars value={p.rating} /><span className="muted" style={{ fontSize: 14 }}>{p.rating.toFixed(1)} · {p.reviews} reviews</span></div>
          <div className="price" style={{ fontSize: 28 }}>{money(c.unit)}</div>
          <p className="muted" style={{ fontSize: 16.5 }}>{p.long}</p>
          <div style={{ display: "flex", gap: 30, flexWrap: "wrap", margin: "18px 0 26px" }}>
            {p.caffeine != null && p.cat !== "pastries" && p.cat !== "merch" && <Meter v={p.caffeine} label="Caffeine" />}
            {p.roast && <Meter v={["Light", "Medium", "Medium-dark", "Dark"].indexOf(p.roast) + 1} max={4} label={"Roast · " + p.roast} />}
            {p.cal != null && <div><div className="muted" style={{ fontSize: 12.5, marginBottom: 2 }}>Calories</div><b>{p.cal} kcal</b></div>}
            {p.allergens && <div><div className="muted" style={{ fontSize: 12.5, marginBottom: 2 }}>Allergens</div><b style={{ fontSize: 14 }}>{p.allergens.length ? p.allergens.join(", ") : "None listed"}</b></div>}
          </div>
          {p.kind !== "simple" && <div className="panel" style={{ marginBottom: 20 }}><Customizer p={p} c={c} compact /></div>}
          {closed && <p className="muted" style={{ fontSize: 14 }}>☾ The bar is closed — ordering opens {st.next}. You can still schedule an order at checkout.</p>}
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <Qty v={qn} set={setQn} lg />
            <button ref={btn} disabled={sold} className="btn cream" style={{ flex: 1, justifyContent: "center", minWidth: 200 }} onClick={() => addToCart(p, c.raw, qn, c.unit, c.label, btn.current)}>{sold ? "Sold out" : "Add to bag · " + money(c.unit * qn)}</button>
            <button className={"icon-btn fav" + (fav ? " on" : "")} style={{ position: "static", width: 48, height: 48, border: "1px solid var(--line-2)", background: "transparent", color: "var(--cream)" }} onClick={() => toggleFav(p.id)} aria-pressed={fav} aria-label="Favourite"><Icon n="heart" /></button>
          </div>
          <div style={{ marginTop: 14 }}><WhatsAppButton className="link-btn" text={`Hi Ngopi! I'd like to order: ${qn}× ${p.name} (${c.label}). Pickup at ${CFG.locations[0].name}.`} /></div>

          <div style={{ marginTop: 44 }}>
            <Tabs id="pd" label="Product information" value={tab} onChange={setTab} size="sm" items={[{ value: "description", label: "Description" }, { value: "notes", label: "Tasting notes" }, { value: "reviews", label: "Reviews" }, { value: "brew", label: "Brewing guide" }]} />
            <div id="pd-panel" role="tabpanel" style={{ marginTop: 22, minHeight: 200 }}>
              <Swap k={tab}>{tab === "description" ? <div><p className="muted">{p.long}</p>{p.origin && <table className="tbl"><tbody>{[["Origin", p.origin], ["Region", p.region], ["Process", p.process], ["Roast", p.roast], ["Altitude", p.altitude]].map(([a, b]) => <tr key={a}><td className="muted">{a}</td><td>{b}</td></tr>)}</tbody></table>}</div>
                : tab === "notes" ? <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{(p.notes || []).map((n, i) => <div key={n} className="panel" style={{ padding: "18px 22px", flex: "1 1 140px" }}><div className="muted" style={{ fontSize: 12 }}>Note {i + 1}</div><div className="serif" style={{ fontSize: 24 }}>{n}</div></div>)}</div>
                  : tab === "reviews" ? <div style={{ display: "grid", gap: 12 }}><p className="muted" style={{ fontSize: 13, margin: 0 }}>Only customers with a completed order can review. Reviews are approved by our team before publishing.</p>{reviews.map(([w, r, t], i) => <div key={i} className="panel" style={{ padding: 18 }}><div className="row"><Stars value={r} size={14} /><span className="muted" style={{ fontSize: 12.5 }}>{w}</span></div><p style={{ margin: "8px 0 0" }}>{t}</p></div>)}</div>
                    : <ol className="muted" style={{ lineHeight: 1.9, paddingLeft: 20 }}>{brew.map(b => <li key={b}>{b}</li>)}</ol>}</Swap>
            </div>
          </div>
        </div>
      </div>
      {related.length > 0 && <div style={{ marginTop: 100 }}><p className="eyebrow">More {CFG.categories[p.cat]}</p><h2 className="h-sec" style={{ marginBottom: 34 }}>You might also like</h2><div className="pgrid">{related.map(r => <ProductCard key={r.id} p={r} />)}</div></div>}
    </div>
    <style>{`@media(max-width:900px){.pd-grid{grid-template-columns:1fr!important;gap:30px!important}.pd-grid>div:first-child{position:static!important}}`}</style>
    <div style={{ height: 80 }} />
  </div>;
}

function BeansPage() {
  const prods = useProducts().filter(p => p.cat === "beans"); const { query } = useRoute(); const money = useMoney();
  const sel = k => (query[k] || "").split(",").filter(Boolean);
  const tog = (k, v) => { const c = sel(k); setQuery({ [k]: (c.includes(v) ? c.filter(x => x !== v) : [...c, v]).join(",") }); };
  const roasts = ["Light", "Medium", "Medium-dark", "Dark"], origins = [...new Set(prods.map(p => p.origin))], procs = [...new Set(prods.map(p => p.process))], notes = ["Floral", "Citrus", "Caramel", "Chocolatey", "Nutty", "Earthy", "Bold"];
  let list = prods.filter(p => (!sel("roast").length || sel("roast").includes(p.roast)) && (!sel("origin").length || sel("origin").includes(p.origin)) && (!sel("process").length || sel("process").includes(p.process)) && (!sel("note").length || sel("note").some(n => p.notes.join(" ").toLowerCase().includes(n.toLowerCase().replace("chocolatey", "chocola")))));
  const Grp = ({ k, t, opts }) => <div><div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>{t}</div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{opts.map(o => <button key={o} className={"chip" + (sel(k).includes(o) ? " on" : "")} onClick={() => tog(k, o)} aria-pressed={sel(k).includes(o)}>{o}</button>)}</div></div>;
  return <div className="page">
    <PageHead crumbs={[{ label: "Beans" }]} title="Whole beans, roasted this week" sub="Six coffees, roasted twice a week in San Francisco in 12kg batches. Choose whole bean or let us grind for your brewer — and subscribe to save up to 15%." />
    <div className="wrap">
      <div className="panel" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 22, marginBottom: 34 }}>
        <Grp k="roast" t="Roast" opts={roasts} /><Grp k="origin" t="Origin" opts={origins} /><Grp k="process" t="Process" opts={procs} /><Grp k="note" t="Tasting notes" opts={notes} />
      </div>
      {list.length ? <Swap k={location.hash} className="pgrid">{list.map(p => <ProductCard key={p.id} p={p} />)}</Swap> : <Empty title="No coffees match" text="Loosen a filter to see more of our roasts." cta={<button className="btn" onClick={() => setQuery({ roast: "", origin: "", process: "", note: "" })}>Clear filters</button>} />}
      <section className="sec" style={{ paddingBottom: 0 }}>
        <div className="panel" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 40, padding: 36, alignItems: "center" }} >
          <ArchImage corner="tl" src="img/beanbag.jpg" alt="Bag of whole coffee beans" style={{ aspectRatio: 1.1 }} />
          <div><p className="eyebrow">Bean subscription</p><h2 className="h-sec">Never run out of good coffee</h2>
            <p className="muted">Pick any coffee, choose your grind and how often you brew. We roast to order and ship within 48 hours. Pause, skip or swap any time.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "22px 0" }}>{CFG.subscription.map(s => <div key={s.id} className="panel" style={{ padding: 16, background: "var(--card-2)" }}><div className="serif" style={{ fontSize: 30 }}>{s.discount}%</div><div className="muted" style={{ fontSize: 13 }}>off · {s.label}</div></div>)}</div>
            <button className="btn" onClick={() => setUI({ customize: { id: "house-blend" } })}>Start with House Blend <Arrow /></button>
          </div>
        </div>
      </section>
    </div>
    <div style={{ height: 80 }} />
  </div>;
}
Object.assign(window, { MenuPage, ProductPage, BeansPage });
