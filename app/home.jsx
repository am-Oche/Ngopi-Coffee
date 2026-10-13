/* ============ HOME ============ */
function Hero() {
  const [on, setOn] = useState(false); const row = useRef(); const [py, setPy] = useState(0);
  useEffect(() => { requestAnimationFrame(() => setTimeout(() => setOn(true), 60)); }, []);
  useEffect(() => { const f = () => setPy(Math.min(scrollY, 900)); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  // drag-to-scroll on mobile row
  useEffect(() => { const el = row.current; let d = null; const dn = e => { if (el.scrollWidth <= el.clientWidth) return; d = { x: e.clientX, s: el.scrollLeft }; }; const mv = e => { if (d) el.scrollLeft = d.s - (e.clientX - d.x); }; const up = () => d = null; el.addEventListener("pointerdown", dn); addEventListener("pointermove", mv); addEventListener("pointerup", up); return () => { el.removeEventListener("pointerdown", dn); removeEventListener("pointermove", mv); removeEventListener("pointerup", up); }; }, []);
  const H = CONTENT.hero; const rots = [-4, 3, -2, 4, -3];
  return <section className={"hero" + (on ? " in" : "")} aria-labelledby="hero-h">
    <div className="wrap">
      <h1 id="hero-h">{H.title.map((l, i) => <span className="mask" key={i}><span style={{ transitionDelay: 120 + i * 140 + "ms" }}>{l}</span></span>)}</h1>
      <p className="sub fade" style={{ transitionDelay: "500ms" }}>{H.sub}</p>
      <div className="center fade" style={{ transitionDelay: "650ms" }}><button className="btn" onClick={() => { const el = document.getElementById("products"); window.__lenis ? window.__lenis.scrollTo(el, { offset: -60 }) : scrollTo({ top: el.offsetTop - 60, behavior: "smooth" }); }}>Explore Product <Arrow /></button></div>
    </div>
    <div className="hero-row" ref={row}>
      {H.images.map((im, i) => <ArchImage key={i} eager corner={im.corner} src={im.src} alt={im.alt} style={{ "--rot": rots[i] + "deg", "--py": (-py * (i % 2 ? .08 : .14)) + "px", transitionDelay: 300 + i * 110 + "ms" }} />)}
    </div>
  </section>;
}

function Stats() {
  const [ref, v] = useInView({ threshold: .4 }); const vals = useStore(s => s.admin.stats);
  return <div className="wrap"><div ref={ref} className={"stats" + (v ? " in" : "")} title={CFG.statsNote}>
    {CFG.stats.map((s, i) => <div className="stat" key={i}><b><CountUp to={vals[i] ?? s.value} suffix={s.suffix} start={v} /></b><span>{s.label}</span></div>)}
  </div></div>;
}

function ProductsSection() {
  const prods = useProducts(); const per = usePerPage();
  const [tab, setTab] = useTabParam("tab", CFG.homeTabs[0], CFG.homeTabs);
  const [loading, setLoading] = useState(true); useEffect(() => { const t = setTimeout(() => setLoading(false), 650); return () => clearTimeout(t); }, []);
  const list = prods.filter(p => inCat(p, tab));
  const pages = chunk(list, per);
  return <Section id="products" eyebrow="Our Products" title="From Top Quality Materials" center>
    <Reveal className="center" style={{ margin: "34px 0 44px" }}><Tabs id="home-tabs" label="Product categories" value={tab} onChange={setTab} items={CFG.homeTabs.map(c => ({ value: c, label: CFG.categories[c] }))} /></Reveal>
    <div id="home-tabs-panel" role="tabpanel" aria-labelledby={"home-tabs-" + tab}>
      {loading ? <div className="pgrid">{Array.from({ length: per }).map((_, i) => <CardSkeleton key={i} />)}</div> :
        <Swap k={tab + per}><Carousel resetKey={tab} label={CFG.categories[tab] + " products"} pages={pages} renderPage={pg => <div className="pgrid reflow">{pg.map(p => <ProductCard key={p.id} p={p} />)}</div>} /></Swap>}
    </div>
    <div className="center" style={{ marginTop: 34 }}><a className="link-btn" href={"#/menu?tab=" + tab}>See the full {CFG.categories[tab]} menu ›</a></div>
  </Section>;
}

function AboutSection() {
  const ref = useRef(); const [o, setO] = useState(0);
  useEffect(() => { const f = () => { const r = ref.current?.getBoundingClientRect(); if (r) setO((r.top + r.height / 2 - innerHeight / 2) / innerHeight); }; f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  const A = CONTENT.about;
  return <section className="sec" id="about"><div className="wrap about">
    <Reveal><p className="eyebrow">{A.eyebrow}</p><h2 className="h-sec">{A.title}</h2>
      {A.paras.map((p, i) => <p key={i} className="muted" style={{ fontSize: 16 }}>{p}</p>)}
      <a className="btn" href="#/about" style={{ marginTop: 14 }}>Read More <Arrow /></a></Reveal>
    <div className="about-imgs" ref={ref}>
      <ArchImage className="a1" corner="tl" src="img/tamping.jpg" alt="Portafilter filled with fresh grounds" style={{ transform: `translateY(${o * 40}px)` }} />
      <ArchImage className="a2" corner="tr" src="img/beans-bowl2.jpg" alt="Coffee beans in a ceramic bowl" style={{ transform: `translateY(${o * -60}px)` }} />
    </div>
  </div></section>;
}

function TestimonialSection() {
  const appr = useStore(s => s.admin.testimonials); const per = typeof innerWidth !== "undefined" && innerWidth < 820 ? 1 : 3;
  const list = CONTENT.testimonials.filter((_, i) => appr.find(a => a.i === i)?.approved);
  return <Section id="testimonial" eyebrow="Testimonial" title="What our buyers say" center>
    <p className="center" style={{ marginTop: 12 }}><span className="demo-flag">Demo reviews — replace with verified buyers</span></p>
    <div style={{ marginTop: 40 }}><Carousel label="Testimonials" pages={chunk(list, per)} renderPage={pg => <div style={{ display: "grid", gridTemplateColumns: `repeat(${per},1fr)`, gap: 22, padding: "4px 0" }}>{pg.map((t, i) => <figure className="tcard" key={i} style={{ margin: 0 }}>
      <div className="who"><img src={t.avatar} alt="" loading="lazy" /><div><b>{t.name}</b><span className="muted" style={{ fontSize: 13 }}>{t.role}</span></div></div>
      <Stars value={t.rating} /><blockquote style={{ margin: 0 }}><p>“{t.text}”</p></blockquote></figure>)}</div>} /></div>
  </Section>;
}

function BlogCard({ p, i }) {
  const c = i % 2 ? "tl" : "tr";
  return <a className={"bcard c-" + c} href={"#/blog/" + p.id}>
    <ArchImage corner={c} src={p.img} alt="" />
    <div className="meta"><span>{p.author}</span><span>·</span><time dateTime={p.date}>{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time></div>
    <h3>{p.title}</h3><span className="link-btn">View details ›</span>
  </a>;
}
function BlogSection() {
  return <Section eyebrow="Blog" title="Read our articles" right={<a className="btn" href="#/blog">Read More <Arrow /></a>}>
    <div className="bgrid" style={{ marginTop: 44 }}>{CONTENT.posts.slice(0, 3).map((p, i) => <Reveal key={p.id} delay={i * 90}><BlogCard p={p} i={i} /></Reveal>)}</div>
  </Section>;
}

function SpacesTeaser() {
  const money = useMoney();
  return <Section eyebrow="Spaces" title="Rooms to meet, halls to celebrate" right={<a className="btn" href="#/spaces">Book a space <Arrow /></a>}>
    <div className="grid2" style={{ marginTop: 44, gap: 22 }}>
      {[["meeting", "Meeting rooms", "2–12 seats · screens, whiteboards & coffee service", "img/meeting1.jpg", "tr"], ["event", "Event spaces", "20–120 guests · catering packages & AV", "img/event1.jpg", "tl"]].map(([t, n, d, img, c], i) => <Reveal key={t} delay={i * 100}><a href={"#/spaces?tab=" + t} className="bcard" style={{ padding: 12 }}>
        <ArchImage corner={c} src={img} alt="" style={{ aspectRatio: 1.7 }} />
        <div className="row" style={{ padding: "18px 8px 4px" }}><div><h3 className="serif" style={{ margin: 0, fontWeight: 500, fontSize: 26 }}>{n}</h3><p className="muted" style={{ margin: "4px 0 0", fontSize: 14 }}>{d}</p></div><span className="muted" style={{ whiteSpace: "nowrap" }}>from {money(t === "meeting" ? 12 : 90)}/h</span></div>
      </a></Reveal>)}
    </div>
  </Section>;
}

function HomePage() {
  return <div className="page">
    <Hero /><Stats /><ProductsSection /><AboutSection /><SpacesTeaser /><TestimonialSection /><BlogSection />
  </div>;
}
Object.assign(window, { HomePage, BlogCard });
