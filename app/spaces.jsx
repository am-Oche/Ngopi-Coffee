/* ============ SPACES & BOOKING ============ */
// deterministic pseudo-random "booked" slots per space/date (stands in for availability API)
function bookedSlots(spaceId, date) {
  let h = 0; for (const c of spaceId + date) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const out = new Set(); const n = 2 + (h % 4);
  for (let i = 0; i < n; i++) { h = (h * 1103515245 + 12345) >>> 0; const start = 8 + (h % 12); const len = 1 + (h >> 8) % 3; for (let k = 0; k < len * 2; k++) out.add(start * 60 + k * 30); }
  STATE_GET().bookings.filter(b => b.space === spaceId && b.date === date && b.status !== "rejected").forEach(b => { for (let m = hm(b.start); m < hm(b.end); m += 30) out.add(m); });
  return out;
}
const mm2s = m => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");

function SpaceCard({ s }) {
  const money = useMoney(); const loc = CFG.locations.find(l => l.id === s.loc);
  return <a href={"#/spaces/" + s.id} className="bcard" style={{ padding: 12 }}>
    <ArchImage corner={s.type === "meeting" ? "tr" : "tl"} src={s.img} alt={s.name} style={{ aspectRatio: 1.45 }} />
    <div style={{ padding: "16px 8px 0" }}>
      <div className="row"><h3 className="serif" style={{ margin: 0, fontWeight: 500, fontSize: 24 }}>{s.name}</h3><span className="tag"><Icon n="users" s={12} /> {s.guestsMin ? `${s.guestsMin}–${s.seats}` : s.seats} {s.type === "meeting" ? "seats" : "guests"}</span></div>
      <p className="muted" style={{ fontSize: 13.5, margin: "6px 0 12px" }}>{loc.name}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>{s.amen.slice(0, 4).map(a => <span key={a} className="tag">{a}</span>)}{s.amen.length > 4 && <span className="tag">+{s.amen.length - 4}</span>}</div>
      <div className="row"><span><b className="price">{money(s.price)}</b><span className="muted"> /hour</span></span><span className="muted" style={{ fontSize: 13.5 }}>{money(s.daily)} /day</span></div>
    </div>
  </a>;
}

function SpacesPage() {
  const [tab, setTab] = useTabParam("tab", "meeting", ["meeting", "event"]);
  const list = DATA.SPACES.filter(s => s.type === tab);
  return <div className="page">
    <PageHead crumbs={[{ label: "Spaces" }]} title="Meeting rooms & event spaces" sub="Book a quiet room for two or the whole house for a hundred and twenty. Every booking includes Wi-Fi and coffee service from our bar." />
    <div className="wrap">
      <Tabs id="sp" label="Space type" value={tab} onChange={setTab} items={[{ value: "meeting", label: "Meeting rooms", count: DATA.SPACES.filter(s => s.type === "meeting").length }, { value: "event", label: "Event spaces", count: DATA.SPACES.filter(s => s.type === "event").length }]} />
      <div id="sp-panel" role="tabpanel" style={{ marginTop: 34 }}><Swap k={tab} className="bgrid">{list.map(s => <SpaceCard key={s.id} s={s} />)}</Swap></div>
      <div className="panel" style={{ marginTop: 50, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
        {[["How it works", "Pick a space, choose a date and time — booked slots are greyed out. We confirm within two hours."], ["Coffee service", "A carafe of filter coffee, water and a barista taking drink orders at the start of every booking."], ["Cancellation", "Meeting rooms free up to 24h before. Event spaces free up to 7 days before."]].map(([a, b]) => <div key={a}><div className="serif" style={{ fontSize: 22, marginBottom: 6 }}>{a}</div><p className="muted" style={{ margin: 0, fontSize: 14.5 }}>{b}</p></div>)}
      </div>
    </div><div style={{ height: 80 }} /></div>;
}

function Calendar({ value, onChange }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [m, setM] = useState(() => { const d = new Date(value || today); d.setDate(1); return d; });
  const first = (m.getDay() + 6) % 7; const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  const max = new Date(today); max.setDate(max.getDate() + 90);
  return <div>
    <div className="row" style={{ marginBottom: 12 }}><button className="icon-btn" aria-label="Previous month" disabled={m <= new Date(today.getFullYear(), today.getMonth(), 1)} onClick={() => setM(new Date(m.getFullYear(), m.getMonth() - 1, 1))}><Icon n="chevL" /></button><b>{m.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</b><button className="icon-btn" aria-label="Next month" onClick={() => setM(new Date(m.getFullYear(), m.getMonth() + 1, 1))}><Icon n="chevR" /></button></div>
    <div className="cal" role="grid">{["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => <div key={d} className="dw">{d}</div>)}
      {Array.from({ length: first }).map((_, i) => <div key={"e" + i} />)}
      {Array.from({ length: days }).map((_, i) => { const d = new Date(m.getFullYear(), m.getMonth(), i + 1); const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`; const dis = d < today || d > max; return <button key={i} disabled={dis} className={(iso === value ? "on " : "") + (+d === +today ? "today" : "")} onClick={() => onChange(iso)} aria-label={d.toDateString()} aria-pressed={iso === value}>{i + 1}</button>; })}
    </div>
  </div>;
}

function SpaceDetail({ id }) { const s = DATA.SPACES.find(x => x.id === id); return s ? <SpaceInner key={id} s={s} /> : <NotFound />; }
function SpaceInner({ s }) {
  const money = useMoney(); const user = useStore(x => x.user); useStore(x => x.bookings);
  const [date, setDate] = useState(isoDay(1)); const [range, setRange] = useState([]); const [f, setF] = useState({ attendees: Math.min(s.seats, s.type === "meeting" ? 4 : 30), purpose: "", name: user.name, email: user.email, phone: user.phone, addons: [] }); const [err, setErr] = useState({});
  const booked = bookedSlots(s.id, date); const slots = []; for (let m = 8 * 60; m < 21 * 60; m += 30) slots.push(m);
  useEffect(() => setRange([]), [date]);
  const pick = m => { if (booked.has(m)) return; if (range.length !== 1) { setRange([m]); return; } let [a] = range; let lo = Math.min(a, m), hi = Math.max(a, m); for (let x = lo; x <= hi; x += 30) if (booked.has(x)) { setRange([m]); toast("That range overlaps a booked slot", "!"); return; } setRange([lo, hi]); };
  const start = range[0], end = range.length === 2 ? range[1] + 30 : range.length === 1 ? range[0] + 30 : null;
  const hours = start != null ? (end - start) / 60 : 0; const minH = s.type === "event" ? 3 : 1;
  const addons = s.type === "meeting" ? [{ id: "pastry", label: "Pastry platter", per: "guest", price: 4 }, { id: "lunch", label: "Lunch boxes", per: "guest", price: 14 }, { id: "beans", label: "Take-home bean bags", per: "guest", price: 9 }] : [{ id: "pkg1", label: s.packages[0], per: "guest", price: parseFloat(s.packages[0].match(/\$(\d+)/)?.[1] || 0) }, { id: "pkg2", label: s.packages[1], per: "guest", price: parseFloat(s.packages[1].match(/\$(\d+)/)?.[1] || 0) }, { id: "photo", label: "Event photographer (2h)", per: "flat", price: 240 }];
  const roomCost = hours >= 8 ? s.daily : hours * s.price; const addCost = f.addons.reduce((a, id) => { const x = addons.find(y => y.id === id); return a + (x.per === "guest" ? x.price * f.attendees : x.price); }, 0);
  const submit = () => { const e = {}; if (start == null) e.time = "Select a start and end time"; else if (hours < minH) e.time = `Minimum booking is ${minH} hour${minH > 1 ? "s" : ""}`; if (f.attendees < 1 || f.attendees > s.seats) e.att = `1–${s.seats} people`; if (f.purpose.trim().length < 3) e.purpose = "Tell us briefly what it's for"; if (f.name.trim().length < 2) e.name = "Required"; if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email"; setErr(e); if (Object.keys(e).length) return;
    const bid = "BK-" + (3103 + Math.floor(Math.random() * 800)); setState(st => ({ bookings: [{ id: bid, space: s.id, date, start: mm2s(start), end: mm2s(end), attendees: f.attendees, purpose: f.purpose, name: f.name, email: f.email, addons: f.addons, total: roomCost + addCost, status: CFG.bookings.autoConfirm ? "confirmed" : "pending", at: Date.now() }, ...st.bookings] })); nav("/booking/" + bid); };
  return <div className="page"><div className="wrap" style={{ paddingTop: 120 }}>
    <nav className="crumbs"><a href="#/">Home</a><span>/</span><a href={"#/spaces?tab=" + s.type}>Spaces</a><span>/</span><span style={{ color: "var(--cream)" }}>{s.name}</span></nav>
    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 14 }} className="sp-gal">
      <ArchImage corner="tl" src={s.img} alt={s.name} eager style={{ aspectRatio: 1.5 }} />
      <div style={{ display: "grid", gap: 14 }}><ArchImage corner="tr" src="img/cafe.jpg" alt="Café interior" style={{ aspectRatio: 2.2 }} /><ArchImage corner="br" src="img/barista2.jpg" alt="Coffee service" style={{ aspectRatio: 2.2 }} /></div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 40, marginTop: 40, alignItems: "start" }} className="sp-grid">
      <div>
        <span className="tag">{s.type === "meeting" ? "Meeting room" : "Event space"} · {CFG.locations.find(l => l.id === s.loc).name}</span>
        <h1 className="h-page" style={{ fontSize: "clamp(38px,4.5vw,58px)", marginTop: 12 }}>{s.name}</h1>
        <p className="muted" style={{ fontSize: 16.5 }}>{s.desc}</p>
        <div style={{ display: "flex", gap: 28, margin: "20px 0" }}><div><div className="muted" style={{ fontSize: 13 }}>Capacity</div><b className="serif" style={{ fontSize: 28 }}>{s.guestsMin ? `${s.guestsMin}–${s.seats}` : s.seats}</b></div><div><div className="muted" style={{ fontSize: 13 }}>Hourly</div><b className="serif" style={{ fontSize: 28 }}>{money(s.price)}</b></div><div><div className="muted" style={{ fontSize: 13 }}>Full day (8h+)</div><b className="serif" style={{ fontSize: 28 }}>{money(s.daily)}</b></div></div>
        <div className="eyebrow">Amenities</div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{s.amen.map(a => <span key={a} className="chip" style={{ pointerEvents: "none" }}>✓ {a}</span>)}</div>
        {s.packages && <><div className="eyebrow" style={{ marginTop: 24 }}>Packages</div><ul className="muted" style={{ lineHeight: 1.9, paddingLeft: 18 }}>{s.packages.map(p => <li key={p}>{p}</li>)}</ul></>}
      </div>
      <div className="panel" id="book">
        <h2 className="serif" style={{ fontWeight: 500, fontSize: 28, marginTop: 0 }}>Check availability</h2>
        <Calendar value={date} onChange={setDate} />
        <div className="row" style={{ margin: "22px 0 10px" }}><b>{new Date(date + "T00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</b><span className="muted" style={{ fontSize: 12.5 }}>Tap start, then end</span></div>
        <div className="slots">{slots.map(m => { const on = start != null && m >= start && m < end; return <button key={m} disabled={booked.has(m)} className={"slot" + (m === start || (range[1] === m) ? " on" : on ? " inr" : "")} onClick={() => pick(m)} aria-label={`${fmtTime(mm2s(m))}${booked.has(m) ? " booked" : ""}`}>{fmtTime(mm2s(m))}</button>; })}</div>
        {err.time && <p className="err">{err.time}</p>}
        <div style={{ display: "grid", gap: 14, marginTop: 22 }}>
          <div className="grid2"><div className="field"><label htmlFor="att">Attendees</label><input id="att" type="number" className="inp" min="1" max={s.seats} value={f.attendees} onChange={e => setF({ ...f, attendees: Number(e.target.value) })} />{err.att && <span className="err">{err.att}</span>}</div><div className="field"><label htmlFor="pur">Purpose</label><input id="pur" className="inp" value={f.purpose} onChange={e => setF({ ...f, purpose: e.target.value })} placeholder="e.g. Team offsite" />{err.purpose && <span className="err">{err.purpose}</span>}</div></div>
          <div className="grid2"><div className="field"><label htmlFor="bn">Name</label><input id="bn" className="inp" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />{err.name && <span className="err">{err.name}</span>}</div><div className="field"><label htmlFor="be">Email</label><input id="be" className="inp" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />{err.email && <span className="err">{err.email}</span>}</div></div>
          <div><div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>Add-ons</div><div className="seg">{addons.map(a => { const on = f.addons.includes(a.id); return <button key={a.id} className={"opt" + (on ? " on" : "")} aria-pressed={on} onClick={() => setF({ ...f, addons: on ? f.addons.filter(x => x !== a.id) : [...f.addons, a.id] })}>{a.label}<small>{money(a.price)}{a.per === "guest" ? "/guest" : ""}</small></button>; })}</div></div>
        </div>
        <div style={{ marginTop: 20, borderTop: "1px solid var(--line)", paddingTop: 14 }}>
          <div className="sum-row"><span>{start != null ? `${fmtTime(mm2s(start))} – ${fmtTime(mm2s(end))} · ${hours}h` : "No time selected"}</span><span>{money(roomCost)}</span></div>
          {addCost > 0 && <div className="sum-row"><span>Add-ons</span><span>{money(addCost)}</span></div>}
          <div className="sum-row tot"><span>Estimated total</span><span>{money(roomCost + addCost)}</span></div>
        </div>
        <button className="btn cream block" style={{ marginTop: 16 }} onClick={submit}>Request booking <Arrow /></button>
        <p className="muted" style={{ fontSize: 12.5, textAlign: "center", marginBottom: 0 }}>{CFG.bookings.autoConfirm ? "Bookings are confirmed instantly." : "No payment now — we'll confirm by email within 2 hours."}</p>
      </div>
    </div>
  </div>
    <style>{`@media(max-width:900px){.sp-grid,.sp-gal{grid-template-columns:1fr!important}}`}</style><div style={{ height: 80 }} /></div>;
}

function BookingConfirm({ id }) {
  const b = useStore(s => s.bookings.find(x => x.id === id)); const money = useMoney();
  if (!b) return <NotFound />; const s = DATA.SPACES.find(x => x.id === b.space);
  return <div className="page"><PageHead crumbs={[{ label: "Spaces", href: "#/spaces" }, { label: "Booking " + b.id }]} title={b.status === "confirmed" ? "You're booked." : "Request received."} sub={`We've emailed a summary to ${b.email}. ${b.status === "pending" ? "Our events team will confirm within two hours during opening times." : ""}`} />
    <div className="wrap"><div className="panel" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 26, alignItems: "center" }}>
      <ArchImage corner="tr" src={s.img} alt="" style={{ aspectRatio: 1 }} />
      <div><div className="row"><h2 className="serif" style={{ fontWeight: 500, margin: 0, fontSize: 30 }}>{s.name}</h2><span className={"tag " + (b.status === "confirmed" ? "ok" : b.status === "rejected" ? "bad" : "warn")} style={{ textTransform: "capitalize" }}>{b.status}</span></div>
        <table className="tbl" style={{ marginTop: 12 }}><tbody><tr><td className="muted">Reference</td><td>{b.id}</td></tr><tr><td className="muted">Date</td><td>{new Date(b.date + "T00:00").toDateString()}</td></tr><tr><td className="muted">Time</td><td>{fmtTime(b.start)} – {fmtTime(b.end)}</td></tr><tr><td className="muted">Attendees</td><td>{b.attendees}</td></tr><tr><td className="muted">Purpose</td><td>{b.purpose}</td></tr><tr><td className="muted">Estimated total</td><td><b>{money(b.total)}</b></td></tr></tbody></table>
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}><a className="btn sm" href="#/account?tab=bookings">View my bookings</a><a className="btn ghost sm" href="#/spaces">Book another</a></div></div>
    </div></div><div style={{ height: 80 }} /></div>;
}
Object.assign(window, { SpacesPage, SpaceDetail, BookingConfirm, Calendar });
