"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Send, Check, Mic, Target, Calendar, TrendingUp, BookOpen,
  AlertTriangle, ExternalLink, ArrowRight, Building2, Sparkles, Plus,
  CheckCircle2, Circle, Globe, ScanLine, Flag, FileText,
} from "lucide-react"

type InputType = "text" | "single" | "multi"

interface KnownFacts {
  name?: string; degree?: string; school?: string; city?: string; situation?: string
  industry?: string; role?: string; dreamCompany?: string; why?: string
  skills?: string[]; experience?: string; urgency?: string; stage?: number
}

interface Roadmap {
  name: string; goal?: string; target: string; city: string; currentState: string
  thisWeek: string[]; month1: string[]; month3: string[]; month6: string
  targetCompanies: { name: string; reason: string; programme?: string; city?: string; activelyHiring?: boolean }[]
  certifications: { name: string; link: string; cost: string; time: string }[]
  dangerZones: string[]
  freeResources: { name: string; link: string; why: string }[]
  interviewCompany?: string; salaryExpectation?: string
}

interface Turn { question: string; answer: string }

const STAGES = ["You", "Place", "Goal", "Skills", "Limits"]

const CITY_OPPORTUNITIES: Record<string, { company: string; role: string; status: string; tag: string }[]> = {
  Lagos: [
    { company: "Flutterwave", role: "Product & Engineering", status: "Actively hiring", tag: "Fintech" },
    { company: "GTBank", role: "Entry Level Programme", status: "Batch opening soon", tag: "Banking" },
    { company: "Paystack", role: "Engineering & Ops", status: "Rolling applications", tag: "Fintech" },
    { company: "Interswitch", role: "Tech & Business", status: "Actively hiring", tag: "Tech" },
  ],
  Abuja: [
    { company: "MTN Nigeria", role: "Graduate Management", status: "Applications open", tag: "Telecom" },
    { company: "KPMG Nigeria", role: "Audit & Advisory", status: "Recruiting now", tag: "Consulting" },
    { company: "Access Bank", role: "Management Trainee", status: "Rolling", tag: "Banking" },
  ],
  "Port Harcourt": [
    { company: "SLB", role: "Field Engineer Trainee", status: "Recruiting", tag: "Oil & Gas" },
    { company: "Zenith Bank", role: "Entry Level", status: "Always recruiting", tag: "Banking" },
  ],
  Ibadan: [
    { company: "Nestlé Nigeria", role: "Graduate Trainee", status: "Annual intake", tag: "FMCG" },
    { company: "Zenith Bank", role: "Entry Level", status: "Rolling", tag: "Banking" },
  ],
  Kano: [
    { company: "MTN Nigeria", role: "Graduate Management", status: "Northern offices", tag: "Telecom" },
    { company: "UBA", role: "Entry Level", status: "Rolling", tag: "Banking" },
  ],
}

const FACT_ORDER: { key: keyof KnownFacts; label: string }[] = [
  { key: "name", label: "Name" }, { key: "degree", label: "Field" }, { key: "school", label: "School" },
  { key: "city", label: "City" }, { key: "situation", label: "Status" }, { key: "industry", label: "Target" },
  { key: "role", label: "Role" }, { key: "dreamCompany", label: "Dream" }, { key: "urgency", label: "Urgency" },
]

/* ───────────── Progress stepper ───────────── */
function Stepper({ stage }: { stage: number }) {
  return (
    <div className="flex gap-1.5">
      {STAGES.map((label, i) => {
        const done = stage > i + 1
        const active = stage === i + 1
        return (
          <div key={label} className="flex-1">
            <div className={`h-2 rounded-full mb-1 transition-all duration-500 ${done ? "bg-green" : active ? "bg-green/40" : "bg-line"}`} />
            <p className={`text-[9px] font-extrabold text-center ${done || active ? "text-green-deep" : "text-faint"}`}>{label}</p>
          </div>
        )
      })}
    </div>
  )
}

/* ───────────── Live "what PathAI knows" pills ───────────── */
function KnownPills({ known }: { known: KnownFacts }) {
  const facts = FACT_ORDER.map((f) => ({ ...f, value: known[f.key] })).filter((f) => f.value && typeof f.value === "string")
  if (facts.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-faint">
        <Sparkles size={11} className="text-green" /> PathAI knows
      </span>
      <AnimatePresence>
        {facts.map((f) => (
          <motion.span
            key={f.key}
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="text-[11px] font-bold rounded-full bg-green-tint text-green-deep px-2.5 py-1"
          >
            {f.value as string}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ───────────── City opportunity scan ───────────── */
function OpportunityScan({ city, scanning }: { city: string; scanning: boolean }) {
  const opps = CITY_OPPORTUNITIES[city]
  if (!opps) return null
  return (
    <div className="bg-paper border-2 border-line rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
        {scanning ? <ScanLine size={13} className="text-green animate-pulse" /> : <Globe size={13} className="text-green" />}
        <p className="t-label text-muted">{scanning ? `Scanning ${city}…` : `Live in ${city}`}</p>
      </div>
      <div className="divide-y divide-line">
        {opps.map((o, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: scanning ? 0.3 : 1, x: 0 }} transition={{ delay: i * 0.12 }} className="px-4 py-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-extrabold text-ink">{o.company}</p>
              <span className="text-[9px] font-bold rounded-full bg-green-tint text-green-deep px-2 py-0.5">{o.tag}</span>
            </div>
            <p className="text-[11px] text-muted">{o.role} · <span className="text-green-deep font-bold">{o.status}</span></p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ───────────── Roadmap payoff ───────────── */
function RoadmapView({ roadmap, onPractice, onPolishCV }: { roadmap: Roadmap; onPractice: () => void; onPolishCV: () => void }) {
  const [done, setDone] = useState<Record<string, boolean>>({})
  useEffect(() => {
    try { setDone(JSON.parse(localStorage.getItem("pathai_done") || "{}")) } catch {}
  }, [])
  function toggle(item: string) {
    setDone((prev) => {
      const next = { ...prev, [item]: !prev[item] }
      localStorage.setItem("pathai_done", JSON.stringify(next))
      return next
    })
  }
  const completed = roadmap.thisWeek.filter((s) => done[s]).length

  return (
    <div className="space-y-3">
      {/* GOAL hero */}
      <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="rounded-[22px] bg-green text-white px-5 py-5" style={{ boxShadow: "0 6px 0 var(--color-green-edge)" }}>
        <div className="flex items-center gap-2 mb-2"><Flag size={14} className="text-white/80" /><p className="t-label text-white/80">Your goal</p></div>
        <p className="text-[19px] font-extrabold leading-snug mb-1">{roadmap.goal || roadmap.target}</p>
        <p className="text-[13px] text-white/80">{roadmap.target} · {roadmap.city}</p>
      </motion.div>

      <div className="bg-paper border-2 border-line rounded-2xl px-4 py-3.5">
        <p className="text-[13px] text-ink leading-relaxed"><span className="font-extrabold">Where you stand: </span>{roadmap.currentState}</p>
      </div>

      {/* THIS WEEK — checkable */}
      <div className="bg-paper border-2 border-line rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-line">
          <div className="flex items-center gap-2"><Calendar size={14} className="text-green" /><p className="text-[13px] font-extrabold text-ink">This week</p></div>
          <p className="text-[11px] font-extrabold mono text-green-deep">{completed}/{roadmap.thisWeek.length} done</p>
        </div>
        <div className="divide-y divide-line">
          {roadmap.thisWeek.map((item, i) => (
            <button key={i} onClick={() => toggle(item)} className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-paper-2 transition-colors">
              {done[item] ? <CheckCircle2 size={20} className="text-green flex-shrink-0 mt-px" /> : <Circle size={20} className="text-line flex-shrink-0 mt-px" />}
              <p className={`text-[13px] leading-snug ${done[item] ? "text-faint line-through" : "text-ink"}`}>{item}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {[
        { icon: TrendingUp, title: "First 30 days", items: roadmap.month1 },
        { icon: BookOpen, title: "90 days", items: roadmap.month3 },
      ].map((s) => (
        <div key={s.title} className="bg-paper border-2 border-line rounded-2xl px-4 py-4">
          <div className="flex items-center gap-2 mb-3"><s.icon size={14} className="text-green" /><p className="text-[13px] font-extrabold text-ink">{s.title}</p></div>
          <div className="space-y-2">
            {s.items?.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-green mt-1.5 flex-shrink-0" /><p className="text-[13px] text-muted leading-snug">{item}</p></div>
            ))}
          </div>
        </div>
      ))}

      {/* 6-month vision */}
      <div className="rounded-2xl bg-ink text-white px-5 py-4">
        <p className="t-label text-green mb-1.5">6 months from now</p>
        <p className="text-[14px] font-semibold leading-relaxed">{roadmap.month6}</p>
        {roadmap.salaryExpectation && <p className="text-[12px] text-white/55 mt-2 mono">{roadmap.salaryExpectation}</p>}
      </div>

      {/* Target companies */}
      {roadmap.targetCompanies?.length > 0 && (
        <div className="bg-paper border-2 border-line rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-line"><Building2 size={14} className="text-green" /><p className="text-[13px] font-extrabold text-ink">Aim at these</p></div>
          <div className="divide-y divide-line">
            {roadmap.targetCompanies.map((c, i) => (
              <div key={i} className="px-4 py-3">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="text-[13px] font-extrabold text-ink">{c.name}</p>
                  {c.activelyHiring && <span className="text-[9px] font-bold rounded-full bg-green-tint text-green-deep px-2 py-0.5">Hiring</span>}
                  {c.programme && <span className="text-[9px] font-bold rounded-full bg-paper-2 border border-line text-muted px-2 py-0.5">{c.programme}</span>}
                </div>
                <p className="text-[12px] text-muted leading-snug">{c.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications + resources */}
      {[
        { title: "Certifications to land", items: roadmap.certifications?.map((c) => ({ name: c.name, sub: `${c.cost} · ${c.time}`, link: c.link })) },
        { title: "Start with these", items: roadmap.freeResources?.map((r) => ({ name: r.name, sub: r.why, link: r.link })) },
      ].map((g) => g.items?.length ? (
        <div key={g.title} className="bg-paper border-2 border-line rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-line"><p className="text-[13px] font-extrabold text-ink">{g.title}</p></div>
          <div className="divide-y divide-line">
            {g.items.map((it, i) => (
              <div key={i} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0"><p className="text-[13px] font-bold text-ink truncate">{it.name}</p><p className="text-[11px] text-muted leading-snug">{it.sub}</p></div>
                <a href={it.link.startsWith("http") ? it.link : `https://${it.link}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] font-extrabold text-green-deep flex-shrink-0">Open <ExternalLink size={11} /></a>
              </div>
            ))}
          </div>
        </div>
      ) : null)}

      {/* Danger zones */}
      {roadmap.dangerZones?.length > 0 && (
        <div className="rounded-2xl bg-danger-tint border-2 border-danger/25 px-4 py-4">
          <div className="flex items-center gap-2 mb-3"><AlertTriangle size={14} className="text-danger" /><p className="t-label text-danger">What eliminates people like you</p></div>
          <div className="space-y-2">
            {roadmap.dangerZones.map((d, i) => (
              <div key={i} className="flex items-start gap-2"><span className="text-danger font-extrabold text-[13px] leading-none mt-0.5">✕</span><p className="text-[13px] text-ink leading-snug">{d}</p></div>
            ))}
          </div>
        </div>
      )}

      {/* CTA — path-aware */}
      {roadmap.interviewCompany ? (
        <button onClick={onPractice} className="btn btn-primary w-full !min-h-[60px]">
          <Mic size={17} /> Now rehearse the interview <ArrowRight size={17} />
        </button>
      ) : (
        <div className="rounded-2xl bg-green-tint border-2 border-green/20 px-5 py-4">
          <p className="text-[13px] font-extrabold text-green-deep mb-0.5">This plan is yours, and it is alive.</p>
          <p className="text-[13px] text-ink leading-snug">Tick off what you finish above. Come back any time and PathAI adjusts the plan around how far you have come.</p>
        </div>
      )}

      <button onClick={onPolishCV} className="btn btn-ghost w-full !min-h-[56px]">
        <FileText size={16} /> Polish your CV for this
      </button>
    </div>
  )
}

/* ───────────── Page ───────────── */
export default function PathMapPage() {
  const router = useRouter()
  const [turns, setTurns] = useState<Turn[]>([])
  const [question, setQuestion] = useState("First, what should I call you?")
  const [options, setOptions] = useState<string[]>([])
  const [inputType, setInputType] = useState<InputType>("text")
  const [allowText, setAllowText] = useState(true)
  const [input, setInput] = useState("")
  const [picked, setPicked] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [known, setKnown] = useState<KnownFacts>({})
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [savedRoadmap, setSavedRoadmap] = useState<Roadmap | null>(null)
  const [scanning, setScanning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [question, loading, roadmap])

  // Load a previously saved plan so the user can pick up where they left off.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("pathai_roadmap") || "null")
      if (saved && typeof saved === "object" && saved.goal) setSavedRoadmap(saved)
    } catch {}
  }, [])

  async function send(answer: string) {
    const content = answer.trim()
    if (!content || loading) return
    const updated = [...turns, { question, answer: content }]
    setTurns(updated); setInput(""); setPicked([]); setLoading(true); setOptions([])

    const messages = updated.flatMap((t) => [
      { role: "assistant" as const, content: t.question },
      { role: "user" as const, content: t.answer },
    ])

    try {
      const res = await fetch("/api/pathmap", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages }),
      })
      const data = await res.json()

      if (data.known && Object.keys(data.known).length) {
        setKnown((prev) => {
          const merged = { ...prev, ...data.known }
          if (data.known.city && !prev.city && CITY_OPPORTUNITIES[data.known.city]) {
            setScanning(true); setTimeout(() => setScanning(false), 1800)
          }
          return merged
        })
      }

      if (data.roadmap) {
        setRoadmap(data.roadmap)
        localStorage.setItem("pathai_roadmap", JSON.stringify(data.roadmap))
        localStorage.setItem("pathai_profile", JSON.stringify({ ...known, ...data.known }))
      } else {
        setQuestion(data.message || "Tell me a bit more?")
        setOptions(data.options || [])
        setInputType((data.inputType as InputType) || "text")
        setAllowText(!!data.allowText)
      }
    } catch {
      setQuestion("Network hiccup. Say that again?")
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }

  function togglePick(opt: string) {
    setPicked((p) => (p.includes(opt) ? p.filter((x) => x !== opt) : [...p, opt]))
  }

  const stage = known.stage ?? 1
  const showBottomBar = !roadmap && (inputType === "text" || allowText) && inputType !== "multi"

  return (
    <main className="min-h-screen bg-paper-2 text-ink">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-paper border-b border-line">
        <div className="max-w-xl mx-auto px-5 pt-4 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => router.push("/")} className="w-9 h-9 grid place-items-center rounded-xl border-2 border-line text-muted hover:border-green hover:text-green-deep transition-colors">
              <ArrowLeft size={16} />
            </button>
            <div className="flex-1">
              <p className="text-[14px] font-extrabold text-ink leading-none">Build your path</p>
              <p className="text-[11px] text-muted mt-0.5">{roadmap ? "Your plan is ready" : known.name ? `Mapping ${known.name}'s route` : "PathAI is getting to know you"}</p>
            </div>
            {roadmap && (
              <button onClick={() => router.push("/interview")} className="text-[12px] font-extrabold text-green-deep flex items-center gap-1"><Mic size={13} /> Practice</button>
            )}
          </div>
          {!roadmap && <Stepper stage={stage} />}
        </div>
      </header>

      <div className="max-w-xl mx-auto px-5 pt-5 pb-40 space-y-4">

        {/* Resume a saved plan */}
        {savedRoadmap && !roadmap && turns.length === 0 && (
          <div className="rounded-2xl bg-green-tint border-2 border-green/25 px-4 py-3.5">
            <p className="text-[13px] font-extrabold text-green-deep mb-0.5">Welcome back, {savedRoadmap.name}.</p>
            <p className="text-[12px] text-ink leading-snug mb-3">You have a saved plan: <span className="font-semibold">{savedRoadmap.goal || savedRoadmap.target}</span></p>
            <div className="flex gap-2">
              <button onClick={() => setRoadmap(savedRoadmap)} className="btn btn-primary flex-1 !min-h-[46px] !text-[13px]">Resume my plan</button>
              <button onClick={() => setSavedRoadmap(null)} className="btn btn-ghost !min-h-[46px] !px-4 !text-[13px]">Start fresh</button>
            </div>
          </div>
        )}

        {/* Live profile */}
        {!roadmap && <KnownPills known={known} />}

        {/* City scan */}
        {!roadmap && known.city && CITY_OPPORTUNITIES[known.city] && <OpportunityScan city={known.city} scanning={scanning} />}

        {/* Active question + hybrid input */}
        {!roadmap && (
          <div className="bg-paper border-2 border-green/30 rounded-[22px] overflow-hidden" style={{ boxShadow: "0 4px 0 var(--color-green-tint)" }}>
            <div className="flex items-center gap-2 px-5 py-3 bg-green-tint border-b border-green/15">
              <Sparkles size={13} className="text-green-deep" />
              <p className="t-label text-green-deep">PathAI asks</p>
            </div>
            <div className="px-5 py-5">
              {loading ? (
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => <span key={i} className="w-2 h-2 rounded-full bg-green/60" style={{ animation: `bounce-dot 1.2s ${i * 0.15}s infinite` }} />)}
                  <span className="text-[13px] text-muted ml-1.5">thinking…</span>
                </div>
              ) : (
                <p className="text-[17px] font-bold text-ink leading-snug">{question}</p>
              )}

              {/* SINGLE — tap to send */}
              {!loading && inputType === "single" && options.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {options.map((opt) => (
                    <button key={opt} onClick={() => send(opt)}
                      className="text-left text-[13px] font-bold text-ink border-2 border-line rounded-2xl px-3.5 py-3 hover:border-green hover:bg-green-tint transition-colors active:scale-[0.98]">
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* MULTI — tick + continue */}
              {!loading && inputType === "multi" && options.length > 0 && (
                <div className="mt-4">
                  <p className="t-label text-faint mb-2.5">Tick all that fit</p>
                  <div className="grid grid-cols-2 gap-2">
                    {options.map((opt) => {
                      const on = picked.includes(opt)
                      return (
                        <button key={opt} onClick={() => togglePick(opt)}
                          className={`flex items-center gap-2 text-left text-[13px] font-bold rounded-2xl px-3 py-3 border-2 transition-all active:scale-[0.98] ${on ? "bg-green text-white border-green" : "text-ink border-line hover:border-green/60"}`}>
                          <span className={`w-4 h-4 rounded-md grid place-items-center flex-shrink-0 ${on ? "bg-white/25" : "border-2 border-line"}`}>{on && <Check size={11} />}</span>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {allowText && (
                    <div className="flex gap-2 mt-2.5">
                      <input value={input} onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { togglePick(input.trim()); setInput("") } }}
                        placeholder="Add your own…" className="flex-1 bg-paper-2 border-2 border-line rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:border-green" />
                      <button onClick={() => { if (input.trim()) { togglePick(input.trim()); setInput("") } }} className="w-11 grid place-items-center rounded-xl border-2 border-line text-muted hover:border-green hover:text-green-deep"><Plus size={16} /></button>
                    </div>
                  )}
                  <button onClick={() => send(picked.join(", "))} disabled={picked.length === 0} className="btn btn-primary w-full mt-3 !min-h-[52px]">
                    Continue{picked.length ? ` with ${picked.length}` : ""} <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Roadmap */}
        {roadmap && <RoadmapView roadmap={roadmap} onPractice={() => router.push("/interview")} onPolishCV={() => router.push("/cv")} />}

        <div ref={bottomRef} />
      </div>

      {/* Bottom input bar */}
      {showBottomBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-paper border-t border-line px-4 pt-3 pb-safe">
          <div className="max-w-xl mx-auto flex gap-2">
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) send(input) }}
              placeholder={loading ? "thinking…" : options.length ? "Type your own answer…" : "Type your answer…"}
              disabled={loading}
              className="flex-1 bg-paper-2 border-2 border-line rounded-2xl px-4 py-3.5 text-[14px] placeholder-faint focus:outline-none focus:border-green focus:bg-paper disabled:opacity-50 transition-colors" />
            <button onClick={() => send(input)} disabled={!input.trim() || loading} className="btn btn-primary !min-h-[52px] !px-4">
              <Send size={17} />
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
