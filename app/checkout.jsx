/* ============ CART / CHECKOUT / ORDER TRACKING ============ */
function CartPage() {
  const s = useStore(); const money = useMoney(); const t = cartTotals(s);
  return <div className="page"><PageHead crumbs={[{ label: "Cart" }]} title="Your bag" />
    <div className="wrap">{!s.cart.length ? <Empty title="Your bag is empty" text="Add a drink, a pastry or a bag of beans to get started." cta={<a className="btn" href="#/menu">Browse the menu <Arrow /></a>} /> :
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 30, alignItems: "start" }} className="co-grid">
        <div className="panel">{s.cart.map(l => <div className="line-item" key={l.key} style={{ gridTemplateColumns: "88px 1fr auto" }}><img src={l.img} alt="" style={{ width: 88, height: 88 }} /><div><a href={"#/product/" + l.id} style={{ fontWeight: 700, fontSize: 17 }}>{l.name}</a><div className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>{l.opts || "—"}</div><div style={{ display: "flex", gap: 10, marginTop: 10 }}><Qty v={l.qty} set={v => setQty(l.key, v)} min={0} /><button className="link-btn" onClick={() => setQty(l.key, 0)}>Remove</button></div></div><b>{money(l.unit * l.qty)}</b></div>)}</div>
        <div className="panel" style={{ position: "sticky", top: 100 }}><h2 className="serif" style={{ fontWeight: 500, marginTop: 0 }}>Summary</h2>
          <div className="sum-row"><span>Subtotal</span><span>{money(t.sub)}</span></div>{t.disc > 0 && <div className="sum-row"><span>Promo {s.promo}</span><span>−{money(t.disc)}</span></div>}<div className="sum-row"><span>Tax</span><span>{money(t.tax)}</span></div>
          <div className="sum-row tot"><span>Total</span><span>{money(t.total)}</span></div>
          <button className="btn cream block" style={{ marginTop: 18 }} onClick={() => nav("/checkout")}>Checkout <Arrow /></button>
          <div style={{ marginTop: 12, textAlign: "center" }}><WhatsAppButton className="link-btn" text={"Hi Ngopi! I'd like to order:\n" + s.cart.map(l => `• ${l.qty}× ${l.name}${l.opts ? " (" + l.opts + ")" : ""}`).join("\n") + `\nTotal approx. ${money(t.total)}`} /></div>
        </div>
      </div>}</div>
    <style>{`@media(max-width:900px){.co-grid{grid-template-columns:1fr!important}}`}</style><div style={{ height: 80 }} /></div>;
}

function CheckoutPage() {
  const s = useStore(); const money = useMoney(); const st = useStoreStatus();
  const steps = ["details", "payment", "review"];
  const [step, setStep] = useTabParam("step", "details", steps);
  const [f, setF] = useState(() => ({ name: s.user.name, phone: s.user.phone, email: s.user.email, when: st.open ? "asap" : "later", time: "", address: s.addresses[0]?.line || "", table: "", loc: CFG.locations[0].id, pay: "card", provider: "stripe", card: "4242 4242 4242 4242", exp: "12/28", cvc: "123", points: 0, notes: "" }));
  const [err, setErr] = useState({}); const [busy, setBusy] = useState(false);
  const set = (k, v) => setF(x => ({ ...x, [k]: v }));
  const t = cartTotals(s, f.points);
  const maxPts = Math.min(s.points, Math.floor(t.sub * 100 / 100) * 100);
  const slots = useMemo(() => { const r = []; const d = new Date(); const day = CFG.hours.find(h => h.day === d.getDay()); let m = Math.max(hm(day.open), Math.ceil((d.getHours() * 60 + d.getMinutes() + 20) / 15) * 15); for (; m < hm(day.close) - 15 && r.length < 24; m += 15) r.push(String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0")); if (!r.length) { const nd = CFG.hours.find(h => h.day === (d.getDay() + 1) % 7); for (let m2 = hm(nd.open); r.length < 16; m2 += 15) r.push("tmr " + String(Math.floor(m2 / 60)).padStart(2, "0") + ":" + String(m2 % 60).padStart(2, "0")); } return r; }, []);
  const validate = () => { const e = {}; if (f.name.trim().length < 2) e.name = "Please enter your name"; if (!/^[+\d][\d\s()-]{6,}$/.test(f.phone)) e.phone = "Enter a valid phone number"; if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email"; if (s.orderType === "delivery" && f.address.trim().length < 8) e.address = "Enter a delivery address"; if (s.orderType === "dinein" && !f.table) e.table = "Enter your table number (on the QR card)"; if (f.when === "later" && !f.time) e.time = "Choose a time"; setErr(e); return !Object.keys(e).length; };
  const validPay = () => { const e = {}; if (f.pay === "card") { if (f.card.replace(/\s/g, "").length < 15) e.card = "Card number looks incomplete"; if (!/^\d\d\/\d\d$/.test(f.exp)) e.exp = "MM/YY"; if (!/^\d{3,4}$/.test(f.cvc)) e.cvc = "3–4 digits"; } setErr(e); return !Object.keys(e).length; };
  if (!s.cart.length) return <div className="page"><PageHead crumbs={[{ label: "Checkout" }]} title="Checkout" /><div className="wrap"><Empty title="Nothing to check out" text="Your bag is empty." cta={<a className="btn" href="#/menu">Browse menu <Arrow /></a>} /></div></div>;
  const pay = async () => { setBusy(true); await new Promise(r => setTimeout(r, 1300)); const id = placeOrder({ type: s.orderType, when: f.when === "asap" ? "ASAP" : f.time, address: s.orderType === "delivery" ? f.address : CFG.locations.find(l => l.id === f.loc).name, payment: f.pay === "card" ? `${f.provider} ···· ${f.card.slice(-4)}` : f.pay, usePoints: f.points, name: f.name, phone: f.phone, table: f.table, notes: f.notes }); nav("/order/" + id); };
  const E = ({ k }) => err[k] ? <span className="err" role="alert">{err[k]}</span> : null;
  return <div className="page"><PageHead crumbs={[{ label: "Cart", href: "#/cart" }, { label: "Checkout" }]} title="Checkout">
    <div className="steps" style={{ marginTop: 26 }} aria-label="Checkout progress">{steps.map((x, i) => { const cur = steps.indexOf(step); return <React.Fragment key={x}><button className={"stp" + (i === cur ? " on" : i < cur ? " done" : "")} onClick={() => i < cur && setStep(x)} aria-current={i === cur ? "step" : undefined}><i>{i < cur ? "✓" : i + 1}</i>{["Order details", "Payment", "Review"][i]}</button>{i < 2 && <span style={{ width: 30, height: 1, background: "var(--line-2)" }} />}</React.Fragment>; })}</div>
  </PageHead>
    <div className="wrap"><div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 30, alignItems: "start" }} className="co-grid">
      <div className="panel"><Swap k={step}>
        {step === "details" ? <div style={{ display: "grid", gap: 20 }}>
          <div><div className="eyebrow">Order type</div><Tabs id="ot" label="Order type" value={s.orderType} onChange={v => setState({ orderType: v })} items={[{ value: "pickup", label: "Pickup" }, { value: "delivery", label: "Delivery" }, { value: "dinein", label: "Dine-in" }]} /></div>
          {s.orderType === "delivery" ? <div className="field"><label htmlFor="ad">Delivery address</label><input id="ad" className="inp" value={f.address} onChange={e => set("address", e.target.value)} /><E k="address" /><span className="muted" style={{ fontSize: 12.5 }}>Within 3 miles · {money(CFG.ordering.deliveryFee)} fee, free over {money(CFG.ordering.freeDeliveryOver)}</span></div>
            : <div className="field"><label htmlFor="loc">{s.orderType === "dinein" ? "Café" : "Pickup location"}</label><select id="loc" className="inp" value={f.loc} onChange={e => set("loc", e.target.value)}>{CFG.locations.map(l => <option key={l.id} value={l.id}>{l.name} — {l.address}</option>)}</select></div>}
          {s.orderType === "dinein" && <div className="field"><label htmlFor="tb"><Icon n="qr" s={14} /> Table number</label><input id="tb" className="inp" value={f.table} onChange={e => set("table", e.target.value)} placeholder="Printed on your table's QR card, e.g. 12" /><E k="table" /></div>}
          <div><div className="eyebrow">When</div><div className="seg"><button className={"opt" + (f.when === "asap" ? " on" : "")} disabled={!st.open} onClick={() => set("when", "asap")}>As soon as possible<small>{st.open ? `~${s.orderType === "delivery" ? 30 : CFG.ordering.prepMinutes} min` : "Closed now"}</small></button><button className={"opt" + (f.when === "later" ? " on" : "")} onClick={() => set("when", "later")}>Schedule<small>Pick a time</small></button></div>
            {f.when === "later" && <div className="slots" style={{ marginTop: 12 }}>{slots.map(x => <button key={x} className={"slot" + (f.time === x ? " on" : "")} onClick={() => set("time", x)}>{x.startsWith("tmr") ? "Tmr " + fmtTime(x.slice(4)) : fmtTime(x)}</button>)}</div>}<E k="time" /></div>
          <div className="grid2"><div className="field"><label htmlFor="nm">Name</label><input id="nm" className="inp" value={f.name} onChange={e => set("name", e.target.value)} autoComplete="name" /><E k="name" /></div><div className="field"><label htmlFor="ph">Phone</label><input id="ph" className="inp" value={f.phone} onChange={e => set("phone", e.target.value)} autoComplete="tel" /><E k="phone" /></div></div>
          <div className="field"><label htmlFor="em">Email for receipt</label><input id="em" className="inp" value={f.email} onChange={e => set("email", e.target.value)} autoComplete="email" /><E k="email" /></div>
          <div className="field"><label htmlFor="nt">Order notes (optional)</label><input id="nt" className="inp" value={f.notes} onChange={e => set("notes", e.target.value)} placeholder="e.g. Please ring the bell" /></div>
          <button className="btn cream" onClick={() => validate() && setStep("payment")}>Continue to payment <Arrow /></button>
        </div>
          : step === "payment" ? <div style={{ display: "grid", gap: 20 }}>
            <div><div className="eyebrow">Payment method</div><div className="seg">{[["card", "Card"], ["wallet", "Apple / Google Pay"], ["giftcard", "Gift card"], ...(s.orderType !== "delivery" ? [["counter", "Pay at counter"]] : [])].map(([v, l]) => <button key={v} className={"opt" + (f.pay === v ? " on" : "")} onClick={() => set("pay", v)}>{l}</button>)}</div></div>
            {f.pay === "card" && <><div className="field"><label>Processor (configured via env)</label><div className="seg">{["stripe", "paystack", "flutterwave"].map(pv => <button key={pv} className={"opt" + (f.provider === pv ? " on" : "")} onClick={() => set("provider", pv)} style={{ textTransform: "capitalize" }}>{pv}<small>mock</small></button>)}</div></div>
              <div className="field"><label htmlFor="cn">Card number</label><input id="cn" className="inp" inputMode="numeric" value={f.card} onChange={e => set("card", e.target.value.replace(/[^\d]/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "))} /><E k="card" /></div>
              <div className="grid2"><div className="field"><label htmlFor="ex">Expiry</label><input id="ex" className="inp" value={f.exp} onChange={e => set("exp", e.target.value)} placeholder="MM/YY" /><E k="exp" /></div><div className="field"><label htmlFor="cv">CVC</label><input id="cv" className="inp" value={f.cvc} onChange={e => set("cvc", e.target.value)} /><E k="cvc" /></div></div></>}
            {f.pay === "giftcard" && <div className="field"><label>Gift card code</label><input className="inp" placeholder="NGPI-XXXX-XXXX" /></div>}
            <div className="panel" style={{ background: "var(--card-2)" }}><div className="row"><b>Redeem loyalty points</b><span className="muted" style={{ fontSize: 13 }}>{s.points} available</span></div>
              <input type="range" min="0" max={Math.max(0, Math.min(s.points, Math.floor(t.sub * 100)))} step="10" value={f.points} onChange={e => set("points", Number(e.target.value))} style={{ width: "100%", accentColor: "var(--cream)", marginTop: 12 }} aria-label="Points to redeem" />
              <div className="muted" style={{ fontSize: 13.5 }}>Using <b style={{ color: "var(--cream)" }}>{f.points}</b> points = −{money(f.points * CFG.ordering.pointValue)}</div></div>
            <div className="row"><button className="link-btn" onClick={() => setStep("details")}>‹ Back</button><button className="btn cream" onClick={() => validPay() && setStep("review")}>Review order <Arrow /></button></div>
          </div>
            : <div style={{ display: "grid", gap: 16 }}>
              <h3 className="serif" style={{ fontWeight: 500, fontSize: 26, margin: 0 }}>Review & place order</h3>
              <table className="tbl"><tbody>
                <tr><td className="muted">Type</td><td>{{ pickup: "Pickup", delivery: "Delivery", dinein: "Dine-in" }[s.orderType]} {s.orderType === "dinein" && "· Table " + f.table}</td></tr>
                <tr><td className="muted">{s.orderType === "delivery" ? "Deliver to" : "Location"}</td><td>{s.orderType === "delivery" ? f.address : CFG.locations.find(l => l.id === f.loc).name}</td></tr>
                <tr><td className="muted">When</td><td>{f.when === "asap" ? "As soon as possible" : f.time}</td></tr>
                <tr><td className="muted">Contact</td><td>{f.name} · {f.phone}</td></tr>
                <tr><td className="muted">Payment</td><td style={{ textTransform: "capitalize" }}>{f.pay === "card" ? `${f.provider} ···· ${f.card.slice(-4)}` : f.pay}</td></tr>
              </tbody></table>
              <p className="muted" style={{ fontSize: 12.5 }}>By placing this order you agree to our Terms & Conditions. Payments run in mock mode until live keys are set.</p>
              <div className="row"><button className="link-btn" onClick={() => setStep("payment")}>‹ Back</button><button className="btn cream" disabled={busy} onClick={pay}>{busy ? "Processing…" : "Place order · " + money(t.total)} {!busy && <Arrow />}</button></div>
            </div>}
      </Swap></div>
      <aside className="panel" style={{ position: "sticky", top: 100 }}><h2 className="serif" style={{ fontWeight: 500, marginTop: 0, fontSize: 24 }}>Order summary</h2>
        {s.cart.map(l => <div key={l.key} className="row" style={{ padding: "8px 0", fontSize: 14 }}><span style={{ display: "flex", gap: 10, alignItems: "center" }}><img src={l.img} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} /><span>{l.qty}× {l.name}<br /><span className="muted" style={{ fontSize: 12 }}>{l.opts}</span></span></span><span>{money(l.unit * l.qty)}</span></div>)}
        <div style={{ height: 10 }} />
        <div className="sum-row"><span>Subtotal</span><span>{money(t.sub)}</span></div>
        {t.disc > 0 && <div className="sum-row"><span>Promo {s.promo}</span><span>−{money(t.disc)}</span></div>}
        {t.ptsVal > 0 && <div className="sum-row"><span>Points</span><span>−{money(t.ptsVal)}</span></div>}
        {s.orderType === "delivery" && <div className="sum-row"><span>Delivery</span><span>{t.del ? money(t.del) : "Free"}</span></div>}
        <div className="sum-row"><span>Tax ({CFG.ordering.taxRate * 100}%)</span><span>{money(t.tax)}</span></div>
        <div className="sum-row tot"><span>Total</span><span>{money(t.total)}</span></div>
        <p className="muted" style={{ fontSize: 13, marginBottom: 0 }}>✦ You'll earn {t.earn} loyalty points</p>
      </aside>
    </div></div>
    <style>{`@media(max-width:900px){.co-grid{grid-template-columns:1fr!important}.co-grid aside{position:static!important}}`}</style><div style={{ height: 80 }} /></div>;
}

function OrderPage({ id }) {
  const order = useStore(s => s.orders.find(o => o.id === id)); const money = useMoney();
  // Simulate live status progression
  useEffect(() => { if (!order || order.status >= 3) return; const t = setTimeout(() => setState(s => ({ orders: s.orders.map(o => o.id === id ? { ...o, status: Math.min(3, o.status + 1) } : o) })), 6000); return () => clearTimeout(t); }, [order?.status]);
  if (!order) return <NotFound />;
  const labels = order.type === "delivery" ? ["Received", "Brewing", "Ready", "Out for delivery"] : ["Received", "Brewing", "Ready", order.type === "dinein" ? "Served" : "Picked up"];
  const isNew = Date.now() - order.at < 120000;
  return <div className="page"><PageHead crumbs={[{ label: "Account", href: "#/account" }, { label: "Order " + order.id }]} title={isNew && order.status < 2 ? "Thank you — we're on it." : "Order " + order.id} sub={isNew ? `Order ${order.id} is confirmed. A receipt has been sent by email. This page updates live.` : undefined} />
    <div className="wrap">
      <div className="panel">
        <div className="row"><b>Live status</b><span className="tag ok">{labels[order.status]}</span></div>
        <div className="track" role="list"><div className="bar" style={{ width: `${order.status * 25}%` }} />{labels.map((l, i) => <div key={l} role="listitem" className={"st" + (i <= order.status ? " on" : "") + (i === order.status ? " cur" : "")}><i>{i < order.status ? "✓" : i + 1}</i>{l}</div>)}</div>
        <p className="muted center" style={{ margin: 0 }}>{["We've got your order and sent it to the bar.", "Your barista is pulling shots and steaming milk.", order.type === "delivery" ? "Packed and waiting for your courier." : "Ready on the pickup shelf — look for your name.", order.type === "delivery" ? "On the way! Your courier is about 10 minutes out." : "Enjoy! See you again soon."][order.status]}</p>
      </div>
      <div className="grid2" style={{ marginTop: 20, alignItems: "start" }}>
        <div className="panel"><h3 className="serif" style={{ fontWeight: 500, marginTop: 0 }}>Items</h3>{order.items.map(l => <div className="row" key={l.key} style={{ padding: "8px 0", fontSize: 14.5 }}><span>{l.qty}× {l.name}<br /><span className="muted" style={{ fontSize: 12.5 }}>{l.opts}</span></span><span>{money(l.unit * l.qty)}</span></div>)}<div className="sum-row tot"><span>Total paid</span><span>{money(order.total)}</span></div></div>
        <div className="panel"><h3 className="serif" style={{ fontWeight: 500, marginTop: 0 }}>Details</h3><table className="tbl"><tbody><tr><td className="muted">Type</td><td style={{ textTransform: "capitalize" }}>{order.type}</td></tr><tr><td className="muted">Where</td><td>{order.address || CFG.locations[0].name}</td></tr><tr><td className="muted">When</td><td>{order.when || "ASAP"}</td></tr><tr><td className="muted">Payment</td><td>{order.payment || "Card"}</td></tr>{order.earn != null && <tr><td className="muted">Points earned</td><td>+{order.earn}</td></tr>}</tbody></table>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}><button className="btn sm" onClick={() => { order.items.forEach(l => { const p = getProduct(l.id); if (p) addToCart(p, l.raw || {}, l.qty, l.unit, l.opts); }); }}>Reorder</button><a className="btn ghost sm" href="#/menu">Back to menu</a></div></div>
      </div>
    </div><div style={{ height: 80 }} /></div>;
}
Object.assign(window, { CartPage, CheckoutPage, OrderPage });
