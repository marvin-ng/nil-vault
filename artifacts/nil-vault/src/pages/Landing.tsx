import { useEffect, useRef, useState } from "react";

const GOLD = "#E8B84B";
const GOLD_LIGHT = "#f5d07a";
const BG = "#070707";
const SURFACE = "#0f0f0f";
const SURFACE2 = "#161616";
const BORDER = "rgba(255,255,255,0.06)";
const BORDER2 = "rgba(255,255,255,0.1)";
const TEXT = "#EBEBEB";
const MUTED = "#5a5a5a";
const MUTED2 = "#888";

const TICKER_ITEMS = [
  "Deal Pipeline","Instagram DMs","Gmail Integration","FTC Compliance",
  "Contract Storage","Deadline Alerts","Payment Tracker","Tax Estimator",
  "Compliance Export","University Dashboard",
];

const PIPELINE_STAGES = [
  { num: "01", name: "Inquiry", desc: "Brand reached out. Unvetted. Logged with source — DM, email, or direct." },
  { num: "02", name: "Negotiating", desc: "Terms in progress. Amount and deliverables being defined." },
  { num: "03", name: "Signed", desc: "Contract uploaded. Deadlines and deliverables locked. Done chasing DMs." },
  { num: "04", name: "Posted", desc: "Deliverable complete. FTC disclosure confirmed. Compliance logged." },
  { num: "05", name: "Paid", desc: "Payment received and recorded. Deal closed. Money in the vault." },
];

const FEATURES = [
  { icon: "⚡", num: "01", name: "Deal Pipeline", desc: "Five-stage Kanban board. <strong>Drag deals from inquiry to paid.</strong> Every brand partnership visible in one view." },
  { icon: "📅", num: "02", name: "Deadline Tracker", desc: "Color-coded urgency on every deliverable. <strong>Email alerts 3 days and 1 day out</strong> so nothing slips through practice." },
  { icon: "📁", num: "03", name: "Contract Storage", desc: "Upload every contract per deal. <strong>No more hunting through camera roll</strong> when a brand disputes a term." },
  { icon: "💸", num: "04", name: "Payment Tracker", desc: "Log every Venmo, PayPal, and check. <strong>Know which brands paid and which still owe.</strong> Tax-ready year-end summary." },
  { icon: "🏛️", num: "05", name: "Tax Estimator", desc: "NIL income is self-employment income. <strong>Know your SE tax and quarterly payment dates</strong> before April blindsides you." },
  { icon: "✅", num: "06", name: "FTC Compliance", desc: "Paste your caption. <strong>We flag missing #ad or #sponsored</strong> before you post. Compliance history logged per deal." },
];

const WHO_SPORTS = [
  { sport: "Football", div: "D2 · D3 · NAIA" },
  { sport: "Basketball", div: "Mid-Major · JUCO" },
  { sport: "Track & Field", div: "All Divisions" },
  { sport: "Soccer", div: "D1 · D2 · D3" },
  { sport: "Volleyball", div: "All Divisions" },
  { sport: "Baseball", div: "D2 · D3 · NAIA" },
  { sport: "Swimming", div: "All Divisions" },
  { sport: "Any Sport", div: "If you have deals — you need this" },
];

function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Something went wrong. Please try again.");
      } else {
        setDone(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: SURFACE, border: `1px solid ${BORDER2}`,
          padding: "48px 40px", maxWidth: 460, width: "100%",
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 20,
            background: "none", border: "none", cursor: "pointer",
            color: MUTED, fontSize: 20, lineHeight: 1,
          }}
        >×</button>

        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900, fontSize: 40,
              textTransform: "uppercase", color: "#fff", marginBottom: 12,
            }}>You're In.</div>
            <p style={{
              fontFamily: "'Lora', serif", fontSize: 15,
              color: MUTED2, fontStyle: "italic", lineHeight: 1.7,
            }}>
              We'll reach out when NIL Vault is ready for early access.
              <br />Keep stacking those deals.
            </p>
          </div>
        ) : (
          <>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 10,
              letterSpacing: 4, textTransform: "uppercase",
              color: GOLD, marginBottom: 16,
            }}>Early Access</div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900, fontSize: 48,
              textTransform: "uppercase", lineHeight: 0.93,
              color: "#fff", marginBottom: 16,
            }}>
              Join the<br /><span style={{ color: GOLD, fontStyle: "italic" }}>Waitlist.</span>
            </div>
            <p style={{
              fontFamily: "'Lora', serif", fontSize: 14,
              color: MUTED2, fontStyle: "italic", lineHeight: 1.7,
              marginBottom: 28,
            }}>
              Free for athletes, forever. Be first to know when we launch.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="email"
                placeholder="your@email.edu"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(null); }}
                required
                style={{
                  background: SURFACE2, border: `1px solid ${error ? "#ef4444" : BORDER2}`,
                  color: TEXT, padding: "14px 16px",
                  fontFamily: "'DM Mono', monospace", fontSize: 13,
                  outline: "none", width: "100%",
                }}
              />
              {error && (
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#ef4444", letterSpacing: 1 }}>
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? MUTED : GOLD,
                  color: "#000", padding: "14px 0",
                  fontFamily: "'DM Mono', monospace", fontSize: 11,
                  letterSpacing: 2, textTransform: "uppercase",
                  fontWeight: 500, border: "none", cursor: "pointer",
                  transition: "background .2s",
                }}
              >
                {loading ? "Saving..." : "Secure My Spot →"}
              </button>
            </form>
            <p style={{
              fontFamily: "'DM Mono', monospace", fontSize: 10,
              color: MUTED, letterSpacing: 1, marginTop: 12,
            }}>
              No spam. No credit card. <span style={{ color: GOLD }}>Athletes always free.</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function Landing() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const curDotRef = useRef<HTMLDivElement>(null);
  const curRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = curDotRef.current;
    const ring = curRingRef.current;
    if (!dot || !ring) return;
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
    };
    document.addEventListener("mousemove", onMove);
    let raf: number;
    const loop = () => {
      rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onEnter = () => { ring.style.width = "52px"; ring.style.height = "52px"; };
    const onLeave = () => { ring.style.width = "32px"; ring.style.height = "32px"; };
    document.querySelectorAll("a,button").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll(".lv-reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const revealStyle = (delay = 0): React.CSSProperties => ({
    opacity: 0,
    transform: "translateY(36px)",
    transition: `opacity .75s ease ${delay}s, transform .75s ease ${delay}s`,
  });

  return (
    <div style={{ background: BG, color: TEXT, fontFamily: "'Lora', Georgia, serif", overflowX: "hidden", cursor: "none" }}>
      <style>{`
        @keyframes riseIn { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ticker { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes scrollPulse { 0%,100%{opacity:.3;} 50%{opacity:1;} }
        .lv-nav-link { font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};text-decoration:none;transition:color .2s;background:none;border:none;cursor:pointer; }
        .lv-nav-link:hover { color:${GOLD}; }
        .lv-btn-gold { font-family:'DM Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;background:${GOLD};color:#000;padding:16px 32px;text-decoration:none;font-weight:500;display:inline-block;transition:all .2s;border:none;cursor:pointer; }
        .lv-btn-gold:hover { background:${GOLD_LIGHT}; transform:translateY(-2px); }
        .lv-nav-pill { font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;background:${GOLD};color:#000;padding:9px 20px;text-decoration:none;font-weight:500;transition:background .2s;border:none;cursor:pointer; }
        .lv-nav-pill:hover { background:${GOLD_LIGHT}; }
        .lv-story-stat { background:${SURFACE};border:1px solid ${BORDER};padding:26px 28px;display:flex;align-items:flex-start;gap:20px;transition:border-color .3s,background .3s;position:relative;overflow:hidden; }
        .lv-story-stat::before { content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:${GOLD};opacity:0;transition:opacity .3s; }
        .lv-story-stat:hover { border-color:rgba(232,184,75,.25); }
        .lv-story-stat:hover::before { opacity:1; }
        .lv-pipe-col { flex:1;border-right:1px solid ${BORDER};padding:28px 24px;background:${SURFACE};position:relative;transition:background .3s; }
        .lv-pipe-col:last-child { border-right:none; }
        .lv-pipe-col:hover { background:${SURFACE2}; }
        .lv-pipe-col::after { content:'›';position:absolute;right:-9px;top:50%;transform:translateY(-50%);color:${GOLD};font-size:18px;font-family:'Barlow Condensed',sans-serif;font-weight:700;z-index:2; }
        .lv-pipe-col:last-child::after { display:none; }
        .lv-feat-card { background:${SURFACE};padding:36px 30px;border:1px solid transparent;transition:background .3s,border-color .3s; }
        .lv-feat-card:hover { background:${SURFACE2};border-color:rgba(232,184,75,.12); }
        .lv-who-card { background:${SURFACE};padding:24px 20px;border-top:2px solid transparent;transition:border-color .25s,background .25s; }
        .lv-who-card:hover { border-top-color:${GOLD};background:${SURFACE2}; }
        .lv-export-btn { font-family:'DM Mono',monospace;font-size:9px;letter-spacing:1px;text-transform:uppercase;background:${GOLD};color:#000;padding:6px 12px;border:none;cursor:pointer; }
        @media (max-width: 768px) {
          .lv-nav-links { display:none!important; }
          .lv-hero-content { padding:0 20px 64px!important; }
          .lv-hero-bottom { flex-direction:column!important;align-items:flex-start!important; }
          .lv-hero-cta-block { align-items:flex-start!important; }
          .lv-story-grid { grid-template-columns:1fr!important;padding:80px 20px!important; }
          .lv-pipeline-section,.lv-features,.lv-who,.lv-compliance,.lv-two-sided,.lv-final-cta { padding:80px 20px!important; }
          .lv-pipeline { flex-direction:column!important; }
          .lv-features-grid { grid-template-columns:1fr!important; }
          .lv-compliance-grid { grid-template-columns:1fr!important; }
          .lv-sided-grid { grid-template-columns:1fr!important; }
          .lv-who-grid { grid-template-columns:repeat(2,1fr)!important; }
          .lv-final-cta { flex-direction:column!important;align-items:flex-start!important; }
          .lv-cta-right { align-items:flex-start!important; }
          .lv-section-header { flex-direction:column!important;align-items:flex-start!important;gap:8px!important; }
        }
      `}</style>

      {/* Custom cursor */}
      <div ref={curDotRef} style={{ position:"fixed",width:8,height:8,background:GOLD,borderRadius:"50%",pointerEvents:"none",zIndex:9999,transform:"translate(-50%,-50%)",mixBlendMode:"difference" }} />
      <div ref={curRingRef} style={{ position:"fixed",width:32,height:32,border:`1px solid rgba(232,184,75,0.35)`,borderRadius:"50%",pointerEvents:"none",zIndex:9998,transform:"translate(-50%,-50%)",transition:"width .3s,height .3s" }} />

      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}

      {/* NAV */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 52px",height:60,borderBottom:`1px solid ${BORDER}`,background:"rgba(7,7,7,0.92)",backdropFilter:"blur(16px)" }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,letterSpacing:4,textTransform:"uppercase",color:"#fff" }}>
          NIL <span style={{ color: GOLD }}>Vault</span>
        </div>
        <ul className="lv-nav-links" style={{ display:"flex",gap:36,listStyle:"none" }}>
          {["How It Works","Features","Compliance","Pricing"].map((l, i) => (
            <li key={l}><a href={["#pipeline","#features","#compliance","#pricing"][i]} className="lv-nav-link">{l}</a></li>
          ))}
        </ul>
        <button className="lv-nav-pill" onClick={() => setShowWaitlist(true)}>Join Waitlist</button>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh",display:"grid",gridTemplateRows:"1fr auto",padding:0,position:"relative",overflow:"hidden",paddingTop:60 }}>
        <div style={{ position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(232,184,75,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(232,184,75,0.03) 1px,transparent 1px)`,backgroundSize:"72px 72px",maskImage:"radial-gradient(ellipse 90% 70% at 50% 10%, black 20%, transparent 100%)" }} />
        <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-52%)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(200px,35vw,460px)",letterSpacing:-8,color:"transparent",WebkitTextStroke:"1px rgba(232,184,75,0.055)",pointerEvents:"none",userSelect:"none",lineHeight:1,whiteSpace:"nowrap" }}>VAULT</div>

        <div className="lv-hero-content" style={{ display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"0 52px 72px",position:"relative",zIndex:2 }}>
          <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:5,textTransform:"uppercase",color:GOLD,marginBottom:20,opacity:0,animation:"riseIn .9s .15s forwards" }}>
            For College Athletes · Deal Management · Built Different
          </div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(64px,11.5vw,152px)",lineHeight:0.88,textTransform:"uppercase",letterSpacing:-1,color:"#fff",opacity:0,animation:"riseIn .9s .3s forwards",margin:0 }}>
            Brand Deals<br />
            <span style={{ fontStyle:"italic",color:GOLD }}>Without</span><br />
            <span style={{ fontWeight:300,color:MUTED2 }}>The Chaos.</span>
          </h1>
          <div className="lv-hero-bottom" style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:40,marginTop:44,opacity:0,animation:"riseIn .9s .5s forwards" }}>
            <p style={{ fontFamily:"'Lora',serif",fontSize:"clamp(15px,1.6vw,18px)",color:MUTED2,maxWidth:480,lineHeight:1.75,fontStyle:"italic" }}>
              400 DMs. Three missed deadlines. A compliance meeting Thursday.{" "}
              <strong style={{ color:TEXT,fontStyle:"normal",fontWeight:600 }}>The contract is a screenshot somewhere between chemistry notes and a Halloween selfie.</strong>{" "}
              NIL was supposed to be the upside. NIL Vault makes it one.
            </p>
            <div className="lv-hero-cta-block" style={{ flexShrink:0,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:14 }}>
              <button className="lv-btn-gold" onClick={() => setShowWaitlist(true)}>Join Waitlist →</button>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:MUTED,letterSpacing:1,textAlign:"right" }}>
                Free for athletes · <span style={{ color:GOLD }}>Forever</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height:80,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:20,position:"relative",zIndex:2,opacity:0,animation:"riseIn .9s .7s forwards" }}>
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
            <span style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:3,textTransform:"uppercase",color:MUTED }}>Scroll</span>
            <div style={{ width:1,height:32,background:`linear-gradient(to bottom,${GOLD},transparent)`,animation:"scrollPulse 2s infinite" }} />
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{ overflow:"hidden",borderTop:`1px solid ${BORDER}`,borderBottom:`1px solid ${BORDER}`,padding:"12px 0",background:SURFACE }}>
        <div style={{ display:"flex",gap:56,animation:"ticker 28s linear infinite",width:"max-content" }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:3,textTransform:"uppercase",color:MUTED,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:20 }}>
              {item}<span style={{ color:GOLD,fontSize:7 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* STORY */}
      <section className="lv-story-grid lv-reveal" style={{ ...revealStyle(0),padding:"120px 52px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:100,alignItems:"center",borderBottom:`1px solid ${BORDER}` }}>
        <div>
          <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:4,textTransform:"uppercase",color:GOLD,marginBottom:20 }}>The Problem</div>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(44px,5.5vw,72px)",textTransform:"uppercase",lineHeight:0.93,color:"#fff",marginBottom:28 }}>
            No Agent.<br />No System.<br /><em style={{ color:GOLD }}>No Safety Net.</em>
          </h2>
          <p style={{ fontFamily:"'Lora',serif",fontSize:17,color:MUTED2,lineHeight:1.8,fontStyle:"italic" }}>
            She's a 20-year-old with four brand deals, 15 credit hours, and practice at 6am.{" "}
            <strong style={{ color:TEXT,fontStyle:"normal" }}>The protein bar company says she owes them a post.</strong>{" "}
            The contract is in her camera roll. The compliance office gets a call Thursday. Her parents drive four hours.{" "}
            <br /><br />
            <strong style={{ color:TEXT,fontStyle:"normal" }}>NIL Vault is the back office she never got.</strong> Every deal in one pipeline. Every deadline visible. Every payment tracked. Every disclosure compliant.
          </p>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:2 }}>
          {[
            { big:"480K", label:"Student athletes now eligible for NIL deals", sub:"Most without agents, advisors, or any system to manage it." },
            { big:"15.3%", label:"Self-employment tax most athletes don't know they owe", sub:"NIL income = self-employment income. Quarterly taxes apply." },
            { big:"$0", label:"Cost to athletes. Forever.", sub:"Universities pay for the compliance dashboard. Athletes stay free." },
          ].map(s => (
            <div key={s.big} className="lv-story-stat">
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:52,color:GOLD,lineHeight:1,minWidth:80 }}>{s.big}</div>
              <div>
                <div style={{ fontSize:14,fontWeight:600,color:TEXT,marginBottom:4 }}>{s.label}</div>
                <div style={{ fontSize:13,color:MUTED2,fontStyle:"italic",lineHeight:1.5,fontFamily:"'Lora',serif" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PIPELINE */}
      <section className="lv-pipeline-section" id="pipeline" style={{ padding:"100px 52px",borderBottom:`1px solid ${BORDER}` }}>
        <div className="lv-section-header lv-reveal" style={{ ...revealStyle(0),display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:48 }}>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(40px,5vw,64px)",textTransform:"uppercase",lineHeight:.93,color:"#fff",margin:0 }}>
            The 5-Stage<br /><em style={{ color:GOLD }}>Deal Pipeline</em>
          </h2>
          <span style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:MUTED,letterSpacing:2,textTransform:"uppercase" }}>From DM to Paid</span>
        </div>
        <div className="lv-pipeline lv-reveal" style={{ ...revealStyle(.1),display:"flex",overflow:"hidden" }}>
          {PIPELINE_STAGES.map(s => (
            <div key={s.num} className="lv-pipe-col">
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:GOLD,letterSpacing:2,marginBottom:10 }}>{s.num}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:22,textTransform:"uppercase",color:"#fff",letterSpacing:.5,marginBottom:8 }}>{s.name}</div>
              <p style={{ fontFamily:"'Lora',serif",fontSize:13,color:MUTED2,lineHeight:1.6,fontStyle:"italic" }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="lv-reveal" style={{ ...revealStyle(.2),marginTop:40,background:SURFACE,border:`1px solid ${BORDER2}`,overflow:"hidden",maxWidth:680 }}>
          <div style={{ background:SURFACE2,padding:"12px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${BORDER}` }}>
            <div style={{ width:10,height:10,borderRadius:"50%",background:"#ef4444" }} />
            <div style={{ width:10,height:10,borderRadius:"50%",background:"#f59e0b" }} />
            <div style={{ width:10,height:10,borderRadius:"50%",background:"#22c55e" }} />
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:MUTED,letterSpacing:2,textTransform:"uppercase",marginLeft:"auto" }}>Deal Card · Signed</div>
          </div>
          <div style={{ padding:20,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            {[
              { label:"Brand", val:"Ascent Protein Co.", cls:"" },
              { label:"Amount", val:"$1,200", cls:"gold" },
              { label:"Deliverable", val:"2× Instagram posts + story", cls:"" },
              { label:"Deadline", val:"⚠ 3 days remaining", cls:"yellow" },
            ].map(f => (
              <div key={f.label}>
                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:MUTED,marginBottom:4 }}>{f.label}</div>
                <div style={{ fontSize:14,fontWeight:600,color:f.cls==="gold"?GOLD:f.cls==="yellow"?"#f59e0b":TEXT }}>{f.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="lv-features" id="features" style={{ padding:"100px 52px",borderBottom:`1px solid ${BORDER}` }}>
        <div className="lv-section-header lv-reveal" style={{ ...revealStyle(0),display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:48 }}>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(40px,5vw,64px)",textTransform:"uppercase",lineHeight:.93,color:"#fff",margin:0 }}>
            Every Tool<br />You <em style={{ color:GOLD }}>Actually</em> Need
          </h2>
          <span style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:MUTED,letterSpacing:2,textTransform:"uppercase" }}>06 Features</span>
        </div>
        <div className="lv-features-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2 }}>
          {FEATURES.map((f, i) => (
            <div key={f.num} className="lv-feat-card lv-reveal" style={{ ...revealStyle(i * 0.05) }}>
              <span style={{ fontSize:26,marginBottom:18,display:"block" }}>{f.icon}</span>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:GOLD,letterSpacing:2,marginBottom:10 }}>{f.num}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:24,textTransform:"uppercase",color:"#fff",marginBottom:10,lineHeight:1.1 }}>{f.name}</div>
              <p style={{ fontFamily:"'Lora',serif",fontSize:14,color:MUTED2,lineHeight:1.65,fontStyle:"italic" }} dangerouslySetInnerHTML={{ __html: f.desc }} />
            </div>
          ))}
        </div>
      </section>

      {/* COMPLIANCE */}
      <section className="lv-compliance lv-compliance-grid" id="compliance" style={{ padding:"100px 52px",background:SURFACE,borderTop:`1px solid ${BORDER}`,borderBottom:`1px solid ${BORDER}`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center" }}>
        <div className="lv-reveal" style={revealStyle(0)}>
          <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"#000",background:GOLD,display:"inline-block",padding:"4px 10px",marginBottom:24 }}>🏫 For Athletic Departments</div>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(44px,5.5vw,72px)",textTransform:"uppercase",lineHeight:.93,color:"#fff",marginBottom:24 }}>
            When the<br />NCAA Asks,<br />You Have Answers.
          </h2>
          <p style={{ fontFamily:"'Lora',serif",fontSize:16,color:MUTED2,lineHeight:1.8,fontStyle:"italic" }}>
            Compliance offices are the ones fielding calls when deals go sideways.{" "}
            <strong style={{ color:TEXT,fontStyle:"normal" }}>NIL Vault gives every athletic director a real-time view of their entire program's deal activity</strong>{" "}
            — brands, amounts, deliverables, FTC status — exportable to PDF in one click.
            <br /><br />
            <strong style={{ color:TEXT,fontStyle:"normal" }}>Once one program requires it, athletes stop being users and start being inventory.</strong>
          </p>
        </div>
        <div className="lv-reveal" style={revealStyle(.2)}>
          <div style={{ background:"#050505",border:`1px solid ${BORDER2}`,padding:24 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,paddingBottom:14,borderBottom:`1px solid ${BORDER}` }}>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:2,textTransform:"uppercase",color:TEXT }}>Program Compliance Report · Spring 2025</div>
              <button className="lv-export-btn">Export PDF</button>
            </div>
            {[
              { brand:"Ascent Protein Co.", amount:"$1,200", status:"FTC ✓", ok:true },
              { brand:"Local Ford Dealer", amount:"$400", status:"FTC ✓", ok:true },
              { brand:"GameTime Energy", amount:"$750", status:"Missing #ad", ok:false },
              { brand:"Campus Barbershop", amount:"$200", status:"FTC ✓", ok:true },
            ].map(r => (
              <div key={r.brand} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid #111`,fontSize:13 }}>
                <span style={{ color:TEXT,fontWeight:500 }}>{r.brand}</span>
                <span style={{ fontFamily:"'DM Mono',monospace",fontSize:12,color:GOLD }}>{r.amount}</span>
                <span style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1,textTransform:"uppercase",padding:"3px 8px",background:r.ok?"rgba(34,197,94,.15)":"rgba(239,68,68,.15)",color:r.ok?"#22c55e":"#ef4444" }}>{r.status}</span>
              </div>
            ))}
            <div style={{ marginTop:16,paddingTop:12,borderTop:`1px solid ${BORDER}`,fontFamily:"'DM Mono',monospace",fontSize:10,color:MUTED,letterSpacing:1 }}>
              4 deals · $2,550 total · 1 compliance flag · Generated May 2025
            </div>
          </div>
        </div>
      </section>

      {/* TWO-SIDED */}
      <section className="lv-two-sided" id="pricing" style={{ padding:"100px 52px",borderBottom:`1px solid ${BORDER}` }}>
        <div className="lv-section-header lv-reveal" style={{ ...revealStyle(0),display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:48 }}>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(40px,5vw,64px)",textTransform:"uppercase",lineHeight:.93,color:"#fff",margin:0 }}>
            Two Users.<br /><em style={{ color:GOLD }}>One Platform.</em>
          </h2>
          <span style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:MUTED,letterSpacing:2,textTransform:"uppercase" }}>Freemium Model</span>
        </div>
        <div className="lv-sided-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:2 }}>
          <div className="lv-reveal" style={{ ...revealStyle(0),background:SURFACE,padding:"48px 40px",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",bottom:-20,right:-10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:120,color:"rgba(232,184,75,0.05)",lineHeight:1,pointerEvents:"none" }}>ATH</div>
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:3,textTransform:"uppercase",color:GOLD,marginBottom:16 }}>For Athletes</div>
            <h3 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(40px,5vw,64px)",textTransform:"uppercase",lineHeight:.93,color:"#fff",marginBottom:20 }}>Your Deals.<br />Your Vault.</h3>
            <p style={{ fontFamily:"'Lora',serif",fontSize:15,lineHeight:1.8,fontStyle:"italic",color:MUTED2 }}>
              Manage your pipeline, store contracts, track payments, and stay FTC-compliant.{" "}
              <strong style={{ color:TEXT,fontStyle:"normal" }}>No agent needed. No experience required.</strong> Just log in and run your business.
            </p>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:48,color:GOLD,marginTop:28,lineHeight:1 }}>Free</div>
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:1,color:MUTED,marginTop:6 }}>Forever · No credit card · No catch</div>
          </div>
          <div className="lv-reveal" style={{ ...revealStyle(.2),background:GOLD,padding:"48px 40px",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",bottom:-20,right:-10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:120,color:"rgba(0,0,0,0.1)",lineHeight:1,pointerEvents:"none" }}>UNI</div>
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"rgba(0,0,0,0.5)",marginBottom:16 }}>For Universities</div>
            <h3 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(40px,5vw,64px)",textTransform:"uppercase",lineHeight:.93,color:"#000",marginBottom:20 }}>Program-Wide<br />Visibility.</h3>
            <p style={{ fontFamily:"'Lora',serif",fontSize:15,lineHeight:1.8,fontStyle:"italic",color:"rgba(0,0,0,0.65)" }}>
              Real-time dashboard of every athlete's deal status across your program.{" "}
              <strong style={{ color:"#000",fontStyle:"normal" }}>One-click compliance export when the NCAA comes calling.</strong> Know before it becomes a crisis.
            </p>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:48,color:"#000",marginTop:28,lineHeight:1 }}>$10K–25K</div>
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:1,color:"rgba(0,0,0,0.5)",marginTop:6 }}>Per program annually · Scales with roster size</div>
          </div>
        </div>
      </section>

      {/* WHO */}
      <section className="lv-who" style={{ padding:"100px 52px",borderBottom:`1px solid ${BORDER}` }}>
        <div className="lv-section-header lv-reveal" style={{ ...revealStyle(0),display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:48 }}>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(40px,5vw,64px)",textTransform:"uppercase",lineHeight:.93,color:"#fff",margin:0 }}>
            Built For<br /><em style={{ color:GOLD }}>Every Athlete.</em><br />Every Level.
          </h2>
          <span style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:MUTED,letterSpacing:2,textTransform:"uppercase" }}>D1 · D2 · D3 · NAIA · JUCO</span>
        </div>
        <div className="lv-who-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2 }}>
          {WHO_SPORTS.map((s, i) => (
            <div key={s.sport} className="lv-who-card lv-reveal" style={revealStyle(i * 0.05)}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:22,textTransform:"uppercase",color:"#fff",letterSpacing:.5,marginBottom:4 }}>{s.sport}</div>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:GOLD,letterSpacing:1 }}>{s.div}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="lv-final-cta lv-reveal" style={{ ...revealStyle(0),padding:"100px 52px",background:SURFACE,borderBottom:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:60,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",right:-20,top:"50%",transform:"translateY(-50%)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:220,color:"rgba(232,184,75,0.04)",lineHeight:1,pointerEvents:"none",whiteSpace:"nowrap" }}>VAULT</div>
        <div style={{ position:"relative",zIndex:1 }}>
          <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:3,textTransform:"uppercase",color:GOLD,marginBottom:16 }}>Free for athletes · Start today</div>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(52px,7vw,96px)",textTransform:"uppercase",lineHeight:.93,color:"#fff",margin:0 }}>
            Stop<br />Losing<br /><em style={{ color:GOLD }}>Deals.</em>
          </h2>
        </div>
        <div className="lv-cta-right" style={{ flexShrink:0,display:"flex",flexDirection:"column",gap:12,alignItems:"flex-end",position:"relative",zIndex:1 }}>
          <p style={{ fontFamily:"'Lora',serif",fontSize:15,color:MUTED2,fontStyle:"italic",textAlign:"right",maxWidth:280,lineHeight:1.6 }}>
            500,000 college athletes became small business owners overnight. The infrastructure is finally catching up.
          </p>
          <button className="lv-btn-gold" onClick={() => setShowWaitlist(true)}>Join Waitlist →</button>
          <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:MUTED,letterSpacing:1 }}>No credit card · Free forever for athletes</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:"36px 52px",display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:`1px solid ${BORDER}` }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,letterSpacing:4,textTransform:"uppercase",color:"#fff" }}>
          NIL <span style={{ color:GOLD }}>Vault</span>
        </div>
        <span style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:MUTED,letterSpacing:1,textTransform:"uppercase" }}>© 2025 NIL Vault · Built for the athlete with no agent</span>
        <ul style={{ display:"flex",gap:28,listStyle:"none" }}>
          {["Privacy","Terms","Universities","Contact"].map(l => (
            <li key={l}><a href="#" className="lv-nav-link">{l}</a></li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
