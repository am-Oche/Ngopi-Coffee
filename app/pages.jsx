/* ============ CONTENT PAGES ============ */
function AboutPage() {
  return <div className="page">
    <PageHead crumbs={[{ label: "About us" }]} title="Slow coffee for busy people" sub="Ngopi started in 2019 as a two-group espresso cart outside a Mission Street bookshop. Today we roast our own coffee and run three cafés — but we still measure every shot." />
    <div className="wrap">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="ab-row">
        <ArchImage corner="tr" src="img/barista2.jpg" alt="Barista at work" style={{ aspectRatio: .8 }} />
        <ArchImage corner="top" src="img/cafe.jpg" alt="Ngopi café interior" style={{ aspectRatio: .8, marginTop: 40 }} />
        <ArchImage corner="tl" src="img/beans-bowl.jpg" alt="Freshly roasted beans" style={{ aspectRatio: .8 }} />
      </div>
      <Section eyebrow="Our story" title="Named for a habit" className="" >
        <div className="grid2" style={{ marginTop: 30, gap: 40 }}>{CONTENT.about.paras.map((p, i) => <p key={i} className="muted" style={{ fontSize: 16.5, margin: 0 }}>{p}</p>)}<p className="muted" style={{ fontSize: 16.5, margin: 0 }}>In Indonesian, <i>ngopi</i> means more than drinking coffee — it means sitting down together, putting your phone away and letting the afternoon stretch. That's the feeling we try to brew in every cup and build into every room.</p></div>
      </Section>
      <div className="stats in" style={{ marginTop: 0 }}>{[["12kg", "Batch size"], ["3 wks", "Max shelf age"], ["120h", "Barista training"], ["6", "Origins we buy"]].map(([a, b]) => <div className="stat" key={b}><b>{a}</b><span>{b}</span></div>)}</div>
      <Section eyebrow="Visit" title="Come and stay a while" right={<a className="btn" href="#/locations">Find a café <Arrow /></a>} />
    </div>
    <style>{`@media(max-width:700px){.ab-row{grid-template-columns:1fr 1fr!important}.ab-row>:last-child{display:none}}`}</style>
  </div>;
}

function ContactPage() {
  const [f, setF] = useState({ name: "", email: "", topic: "General", msg: "" }); const [err, setErr] = useState({}); const [sent, setSent] = useState(false); const [last, setLast] = useState(0);
  const send = e => { e.preventDefault(); const er = {}; if (f.name.trim().length < 2) er.name = "Please enter your name"; if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email"; if (f.msg.trim().length < 10) er.msg = "A little more detail, please (10+ characters)"; setErr(er); if (Object.keys(er).length) return; if (Date.now() - last < 30000) { toast("Please wait a moment before sending again", "!"); return; } setLast(Date.now()); setSent(true); };
  return <div className="page"><PageHead crumbs={[{ label: "Contact" }]} title="Say hello" sub="Questions about an order, a booking or wholesale? We reply within one working day." />
    <div className="wrap"><div className="grid2" style={{ gap: 30, alignItems: "stretch" }}>
      <div className="panel">{sent ? <div style={{ padding: "40px 0" }} className="center"><div className="serif" style={{ fontSize: 34 }}>Thanks, {f.name.split(" ")[0]}.</div><p className="muted">We've received your message and will reply to {f.email} soon.</p><button className="btn ghost sm" onClick={() => { setSent(false); setF({ name: "", email: "", topic: "General", msg: "" }); }}>Send another</button></div> :
        <form onSubmit={send} noValidate style={{ display: "grid", gap: 16 }}>
          <div className="grid2"><div className="field"><label htmlFor="cn1">Name</label><input id="cn1" className="inp" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />{err.name && <span className="err">{err.name}</span>}</div><div className="field"><label htmlFor="ce1">Email</label><input id="ce1" className="inp" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />{err.email && <span className="err">{err.email}</span>}</div></div>
          <div className="field"><label>Topic</label><div className="seg">{["General", "Order", "Booking", "Wholesale", "Careers"].map(t => <button type="button" key={t} className={"opt" + (f.topic === t ? " on" : "")} onClick={() => setF({ ...f, topic: t })}>{t}</button>)}</div></div>
          <div className="field"><label htmlFor="cm1">Message</label><textarea id="cm1" className="inp" rows="5" value={f.msg} onChange={e => setF({ ...f, msg: e.target.value })} />{err.msg && <span className="err">{err.msg}</span>}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button className="btn cream" type="submit">Send message <Arrow /></button><WhatsAppButton label="Chat on WhatsApp" text="Hi Ngopi! I have a question:" /></div>
        </form>}</div>
      <div style={{ display: "grid", gap: 16 }}>
        <div className="map"><iframe title="Map of Ngopi Mission" loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=-122.430%2C37.764%2C-122.414%2C37.776&layer=mapnik&marker=37.7698%2C-122.4222`} /></div>
        <div className="panel grid2" style={{ gap: 18 }}>
          <div><div className="eyebrow">Address</div><p style={{ margin: 0 }}>{CFG.brand.address}</p><p className="muted" style={{ margin: "8px 0 0" }}>{CFG.brand.phone}<br />{CFG.brand.email}</p></div>
          <div><div className="eyebrow">Hours</div><Hours /></div>
        </div>
      </div>
    </div></div><div style={{ height: 80 }} /></div>;
}
function Hours() { const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; const td = new Date().getDay(); return <table style={{ fontSize: 14, width: "100%" }}><tbody>{[1, 2, 3, 4, 5, 6, 0].map(d => { const h = CFG.hours.find(x => x.day === d); return <tr key={d} style={{ color: d === td ? "var(--cream)" : "var(--muted)", fontWeight: d === td ? 700 : 400 }}><td style={{ padding: "2px 0" }}>{names[d]}</td><td style={{ textAlign: "right" }}>{fmtTime(h.open)} – {fmtTime(h.close)}</td></tr>; })}</tbody></table>; }

function LocationsPage() {
  const [sel, setSel] = useState(CFG.locations[0].id); const [q, setQ] = useState(""); const st = useStoreStatus();
  const L = CFG.locations.filter(l => (l.name + l.address).toLowerCase().includes(q.toLowerCase())); const cur = CFG.locations.find(l => l.id === sel);
  const bbox = `${cur.lng - .012}%2C${cur.lat - .007}%2C${cur.lng + .012}%2C${cur.lat + .007}`;
  return <div className="page"><PageHead crumbs={[{ label: "Locations" }]} title="Find your nearest Ngopi" />
    <div className="wrap"><div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24 }} className="co-grid">
      <div style={{ display: "grid", gap: 12, alignContent: "start" }}><input className="inp" placeholder="Search by city or street" value={q} onChange={e => setQ(e.target.value)} aria-label="Search locations" />
        {L.map(l => <button key={l.id} onClick={() => setSel(l.id)} className="panel" style={{ textAlign: "left", padding: 20, borderColor: sel === l.id ? "var(--cream)" : undefined }}>
          <div className="row"><b className="serif" style={{ fontSize: 22, fontWeight: 500 }}>{l.name}</b><span className={"tag " + (st.open ? "ok" : "")}>{st.open ? "Open" : "Closed"}</span></div>
          <p className="muted" style={{ margin: "6px 0", fontSize: 14 }}>{l.address}</p><p style={{ margin: 0, fontSize: 13.5 }}>{l.note}</p>
          <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 13.5 }}><a className="link-btn" href={`https://www.openstreetmap.org/directions?to=${l.lat},${l.lng}`} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}>Directions ›</a><a className="link-btn" href={"tel:" + l.phone.replace(/[^\d+]/g, "")} onClick={e => e.stopPropagation()}>Call</a>{l.spaces && <a className="link-btn" href="#/spaces" onClick={e => e.stopPropagation()}>Spaces</a>}</div>
        </button>)}</div>
      <div className="map" style={{ minHeight: 520 }}><iframe key={sel} title={"Map of " + cur.name} loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${cur.lat}%2C${cur.lng}`} /></div>
    </div></div><style>{`@media(max-width:900px){.co-grid{grid-template-columns:1fr!important}}`}</style><div style={{ height: 80 }} /></div>;
}

function BlogPage() {
  const [cat, setCat] = useTabParam("cat", "All", CONTENT.blogCategories);
  const list = CONTENT.posts.filter(p => cat === "All" || p.cat === cat);
  return <div className="page"><PageHead crumbs={[{ label: "Blog" }]} title="Read our articles" sub="Brewing guides, origin stories and notes from behind the bar." />
    <div className="wrap"><Tabs id="blog" label="Categories" value={cat} onChange={setCat} size="sm" items={CONTENT.blogCategories.map(c => ({ value: c, label: c }))} />
      <div id="blog-panel" role="tabpanel" style={{ marginTop: 34 }}><Swap k={cat} className="bgrid">{list.map((p, i) => <BlogCard key={p.id} p={p} i={i} />)}</Swap></div>
    </div><div style={{ height: 80 }} /></div>;
}

function ArticlePage({ id }) {
  const p = CONTENT.posts.find(x => x.id === id); const [prog, setProg] = useState(0);
  useEffect(() => { scrollTo(0, 0); const f = () => { const h = document.documentElement; setProg(scrollY / Math.max(1, h.scrollHeight - innerHeight)); }; addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, [id]);
  if (!p) return <NotFound />;
  const more = CONTENT.posts.filter(x => x.id !== id).slice(0, 3);
  return <div className="page"><div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: "var(--cream)", transformOrigin: "left", transform: `scaleX(${prog})`, zIndex: 70 }} />
    <article><header className="wrap" style={{ paddingTop: 130, maxWidth: 900 }}>
      <nav className="crumbs"><a href="#/">Home</a><span>/</span><a href="#/blog">Blog</a><span>/</span><a href={"#/blog?cat=" + p.cat}>{p.cat}</a></nav>
      <h1 className="h-page" style={{ fontSize: "clamp(36px,5vw,62px)" }}>{p.title}</h1>
      <div className="muted" style={{ display: "flex", gap: 12, margin: "18px 0 34px", fontSize: 14.5 }}><span>By {p.author}</span><span>·</span><time dateTime={p.date}>{new Date(p.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time><span>·</span><span>{p.read} min read</span></div>
    </header>
      <div className="wrap" style={{ maxWidth: 1100 }}><ArchImage corner="tr" src={p.img} alt="" eager style={{ aspectRatio: 2.1 }} /></div>
      <div className="wrap"><div className="article" style={{ paddingTop: 40 }}>
        <p style={{ fontSize: 21, color: "var(--cream)" }}>{p.excerpt}</p>
        {p.body.map(([t, c], i) => t === "h" ? <h2 key={i}>{c}</h2> : t === "p" ? <p key={i}>{c}</p> : t === "ol" ? <ol key={i}>{c.map(x => <li key={x}>{x}</li>)}</ol> : <ul key={i}>{c.map(x => <li key={x}>{x}</li>)}</ul>)}
      </div></div></article>
    <Section eyebrow="Keep reading" title="More from the blog"><div className="bgrid" style={{ marginTop: 34 }}>{more.map((m, i) => <BlogCard key={m.id} p={m} i={i} />)}</div></Section>
  </div>;
}

function FAQPage() { return <div className="page"><PageHead crumbs={[{ label: "FAQ" }]} title="Questions, answered" sub="Can't find what you need? Message us on WhatsApp or use the contact form." /><div className="wrap" style={{ maxWidth: 900 }}><Accordion items={CONTENT.faqs} /><div style={{ marginTop: 34, display: "flex", gap: 10 }}><a className="btn" href="#/contact">Contact us <Arrow /></a><WhatsAppButton label="WhatsApp" text="Hi Ngopi! I have a question:" /></div></div><div style={{ height: 80 }} /></div>; }

function GiftCardsPage() {
  const money = useMoney(); const [amt, setAmt] = useState(25); const [f, setF] = useState({ to: "", email: "", from: "", msg: "Have a coffee on me ☕" }); const [err, setErr] = useState(""); const btn = useRef();
  const add = () => { if (!/^\S+@\S+\.\S+$/.test(f.email) || f.to.trim().length < 2) { setErr("Add the recipient's name and a valid email"); return; } setErr(""); addToCart(getProduct("gift-card"), { a: amt, e: f.email }, 1, amt, `${money(amt)} to ${f.to} (${f.email})`, btn.current); };
  return <div className="page"><PageHead crumbs={[{ label: "Gift cards" }]} title="Give the gift of good coffee" sub="Delivered by email instantly, redeemable in any café or online, and never expires." />
    <div className="wrap"><div className="grid2" style={{ gap: 40, alignItems: "center" }}>
      <div className="gift" aria-label="Gift card preview"><div className="row"><span className="logo" style={{ fontSize: 22 }}>{CFG.brand.name}</span><span style={{ fontSize: 13, opacity: .8 }}>GIFT CARD</span></div><div><div className="amt">{money(amt)}</div><div style={{ opacity: .85, fontSize: 14 }}>{f.to ? "For " + f.to : "For someone special"}{f.from && " · from " + f.from}</div><div style={{ opacity: .7, fontSize: 13, marginTop: 6, fontStyle: "italic" }}>{f.msg}</div></div></div>
      <div className="panel" style={{ display: "grid", gap: 16 }}>
        <div className="field"><label>Amount</label><div className="seg">{DATA.OPTIONS.gift.map(a => <button key={a} className={"opt" + (amt === a ? " on" : "")} onClick={() => setAmt(a)} style={{ minWidth: 80 }}>{money(a)}</button>)}</div></div>
        <div className="grid2"><div className="field"><label htmlFor="gt">Recipient name</label><input id="gt" className="inp" value={f.to} onChange={e => setF({ ...f, to: e.target.value })} /></div><div className="field"><label htmlFor="ge">Recipient email</label><input id="ge" className="inp" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div></div>
        <div className="field"><label htmlFor="gf">From</label><input id="gf" className="inp" value={f.from} onChange={e => setF({ ...f, from: e.target.value })} /></div>
        <div className="field"><label htmlFor="gm">Message</label><input id="gm" className="inp" maxLength={90} value={f.msg} onChange={e => setF({ ...f, msg: e.target.value })} /></div>
        {err && <p className="err">{err}</p>}
        <button ref={btn} className="btn cream" onClick={add}>Add gift card · {money(amt)} <Arrow /></button>
      </div>
    </div></div><div style={{ height: 80 }} /></div>;
}

function LegalPage({ kind }) {
  const P = kind === "privacy" ? { t: "Privacy Policy", s: [["What we collect", "When you order, book a space or subscribe we collect your name, email, phone number, delivery address and order history. Payment details are handled directly by our payment processor; we never store full card numbers."], ["How we use it", "To fulfil orders and bookings, send receipts and status updates, run our loyalty programme and — only if you opt in — send our newsletter."], ["Cookies", "We use essential cookies to keep your bag and session working. Analytics cookies are only set after consent."], ["Your rights", "You can request a copy of your data, correct it or delete your account at any time by emailing " + CFG.brand.email + "."], ["Retention", "Order records are kept for 7 years for tax purposes. Marketing preferences are deleted immediately on unsubscribe."]] }
    : { t: "Terms & Conditions", s: [["Orders", "Prices include ingredients and preparation; tax is added at checkout. We may cancel an order if an item becomes unavailable, with a full refund."], ["Pickup & delivery", "Pickup orders are held for 30 minutes after they're marked ready. Delivery is available within 3 miles during opening hours."], ["Space bookings", "Bookings are requests until confirmed by email. Meeting rooms can be cancelled free up to 24 hours before; event spaces up to 7 days before, after which 50% of the hire fee is charged."], ["Loyalty points & gift cards", "Points have no cash value and may be changed with 30 days' notice. Gift cards never expire and cannot be exchanged for cash."], ["Subscriptions", "Bean subscriptions renew automatically at your chosen frequency until paused or cancelled from your account."]] };
  return <div className="page"><PageHead crumbs={[{ label: P.t }]} title={P.t} sub={"Last updated October 2026."}><p style={{ marginTop: 14 }}><span className="demo-flag">Draft — for legal review before launch</span></p></PageHead>
    <div className="wrap"><div className="article" style={{ marginLeft: 0 }}>{P.s.map(([h, b]) => <React.Fragment key={h}><h2>{h}</h2><p>{b}</p></React.Fragment>)}</div></div><div style={{ height: 80 }} /></div>;
}

function NotFound() { return <div className="page"><div className="wrap center" style={{ paddingTop: 180, paddingBottom: 100 }}><div className="serif" style={{ fontSize: "clamp(90px,16vw,200px)", lineHeight: 1, color: "var(--cream)" }}>404</div><h1 className="h-sec" style={{ marginTop: 10 }}>This cup is empty</h1><p className="muted">The page you're looking for has moved or never existed.</p><div style={{ display: "flex", gap: 10, justifyContent: "center" }}><a className="btn" href="#/">Back home <Arrow /></a><a className="btn ghost" href="#/menu">See the menu</a></div></div></div>; }

Object.assign(window, { AboutPage, ContactPage, LocationsPage, BlogPage, ArticlePage, FAQPage, GiftCardsPage, LegalPage, NotFound, Hours });
