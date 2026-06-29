"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, FileText, Sparkles, Printer, RotateCcw, Mail, Phone, MapPin, Link2, Wand2, Check } from "lucide-react"

interface CV {
  fullName: string
  headline: string
  contact?: { phone?: string; email?: string; location?: string; linkedin?: string }
  summary: string
  experience?: { role: string; org: string; period: string; location?: string; bullets: string[] }[]
  education?: { qualification: string; school: string; period: string; details?: string }[]
  skills?: string[]
  certifications?: { name: string; issuer?: string; year?: string }[]
  extras?: { title: string; items: string[] }[]
  improvements?: string[]
}

const COMPANY_OPTIONS = [
  { id: "", name: "Not sure yet" },
  { id: "gtbank", name: "GTBank" }, { id: "access_bank", name: "Access Bank" },
  { id: "zenith_bank", name: "Zenith Bank" }, { id: "flutterwave", name: "Flutterwave" },
  { id: "paystack", name: "Paystack" }, { id: "kuda", name: "Kuda" },
  { id: "mtn_nigeria", name: "MTN Nigeria" }, { id: "kpmg_nigeria", name: "KPMG Nigeria" },
  { id: "interswitch", name: "Interswitch" },
]

export default function CVPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [targetCompanyId, setTargetCompanyId] = useState("")
  const [raw, setRaw] = useState("")
  const [loading, setLoading] = useState(false)
  const [cv, setCv] = useState<CV | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("pathai_profile") || "null")
      if (p && typeof p === "object") {
        setProfile(p)
        if (p.name) setName(p.name)
        if (p.city) setLocation(p.city)
        if (p.role) setTargetRole(p.role)
      }
      const rm = JSON.parse(localStorage.getItem("pathai_roadmap") || "null")
      if (rm && typeof rm === "object") {
        if (rm.interviewCompany && COMPANY_OPTIONS.some((c) => c.id === rm.interviewCompany)) setTargetCompanyId(rm.interviewCompany)
        if (rm.target && !p?.role) setTargetRole(String(rm.target))
      }
    } catch {}
  }, [])

  async function generate() {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: { ...(profile || {}), name: name || (profile?.name as string) },
          rawInput: raw,
          contact: { phone, email, location, linkedin },
          targetRole,
          targetCompanyId,
        }),
      })
      const data = await res.json()
      if (data.cv) setCv(data.cv)
    } finally {
      setLoading(false)
    }
  }

  function copyText() {
    if (!cv) return
    const lines: string[] = [cv.fullName, cv.headline]
    const c = cv.contact || {}
    lines.push([c.phone, c.email, c.location, c.linkedin].filter(Boolean).join("  |  "))
    lines.push("", cv.summary, "")
    cv.experience?.forEach((e) => {
      lines.push(`${e.role} — ${e.org} (${e.period})`)
      e.bullets.forEach((b) => lines.push(`  • ${b}`))
      lines.push("")
    })
    cv.education?.forEach((e) => lines.push(`${e.qualification}, ${e.school} (${e.period})`))
    if (cv.skills?.length) lines.push("", "Skills: " + cv.skills.join(", "))
    navigator.clipboard.writeText(lines.join("\n"))
    setCopied(true); setTimeout(() => setCopied(false), 1600)
  }

  const canGenerate = name.trim() && (raw.trim() || profile)

  return (
    <main className="min-h-screen bg-paper-2 text-ink">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-paper border-b border-line no-print">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => router.push("/")} className="w-9 h-9 grid place-items-center rounded-xl border-2 border-line text-muted hover:border-green hover:text-green-deep transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <p className="text-[14px] font-extrabold leading-none">CV Studio</p>
            <p className="text-[11px] text-muted mt-0.5">{cv ? "Your CV is ready" : "A recruiter-ready CV in one step"}</p>
          </div>
          <FileText size={18} className="text-green" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-6">
        {!cv ? (
          /* ───────── FORM ───────── */
          <div className="space-y-4">
            {profile && (
              <div className="flex items-center gap-2 rounded-2xl bg-green-tint border-2 border-green/20 px-4 py-3">
                <Sparkles size={14} className="text-green-deep flex-shrink-0" />
                <p className="text-[12px] text-green-deep font-bold">Using your PathAI profile{profile.name ? ` for ${profile.name as string}` : ""}. Just confirm your contact details below.</p>
              </div>
            )}

            <div className="bg-paper border-2 border-line rounded-2xl p-4 space-y-3">
              <p className="t-label text-faint">Contact details</p>
              <div className="grid grid-cols-2 gap-2.5">
                <Field label="Full name" value={name} onChange={setName} placeholder="Chidi Okeke" />
                <Field label="Phone" value={phone} onChange={setPhone} placeholder="0803…" />
                <Field label="Email" value={email} onChange={setEmail} placeholder="you@email.com" />
                <Field label="City" value={location} onChange={setLocation} placeholder="Lagos" />
                <div className="col-span-2"><Field label="LinkedIn (optional)" value={linkedin} onChange={setLinkedin} placeholder="linkedin.com/in/you" /></div>
              </div>
            </div>

            <div className="bg-paper border-2 border-line rounded-2xl p-4 space-y-3">
              <p className="t-label text-faint">Target</p>
              <div className="grid grid-cols-2 gap-2.5">
                <Field label="Role you want" value={targetRole} onChange={setTargetRole} placeholder="Graduate Trainee" />
                <div>
                  <label className="block text-[11px] font-bold text-muted mb-1">Company</label>
                  <select value={targetCompanyId} onChange={(e) => setTargetCompanyId(e.target.value)}
                    className="w-full bg-paper-2 border-2 border-line rounded-xl px-3 py-2.5 text-[13px] font-semibold focus:outline-none focus:border-green">
                    {COMPANY_OPTIONS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-paper border-2 border-line rounded-2xl p-4 space-y-2">
              <p className="t-label text-faint">Your story</p>
              <p className="text-[12px] text-muted">Paste your current CV, or write what you have done, <span className="font-bold text-ink">and include WHEN</span> (the years, or how long). Jobs, school, gigs, church work, projects, skills. Rough is fine.</p>
              <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={6}
                placeholder="e.g. Accounting at UNILAG, 2021–2024, 2:2. NYSC 2024. Bookkeeping at my uncle's shop for 1 year (2023–2024), handled daily sales. Good with Excel. Built a budget tracker in Google Sheets…"
                className="w-full bg-paper-2 border-2 border-line rounded-xl px-3.5 py-3 text-[13px] leading-relaxed placeholder-faint focus:outline-none focus:border-green resize-none" />
            </div>

            <button onClick={generate} disabled={!canGenerate || loading} className="btn btn-primary w-full !min-h-[58px]">
              {loading ? <><span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" /> Writing your CV…</> : <><Wand2 size={17} /> Build my CV</>}
            </button>
          </div>
        ) : (
          /* ───────── RESULT ───────── */
          <div className="space-y-4">
            {/* Improvements */}
            {cv.improvements?.length ? (
              <div className="rounded-2xl bg-green-tint border-2 border-green/20 px-4 py-3.5 no-print">
                <div className="flex items-center gap-2 mb-2"><Sparkles size={14} className="text-green-deep" /><p className="t-label text-green-deep">What PathAI strengthened</p></div>
                <ul className="space-y-1.5">
                  {cv.improvements.map((im, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-ink leading-snug"><Check size={13} className="text-green flex-shrink-0 mt-0.5" />{im}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Actions */}
            <div className="flex gap-2 no-print">
              <button onClick={() => window.print()} className="btn btn-primary flex-1 !min-h-[50px] !text-[14px]"><Printer size={16} /> Download PDF</button>
              <button onClick={copyText} className="btn btn-ghost !min-h-[50px] !px-4 !text-[14px]">{copied ? <Check size={16} className="text-green" /> : "Copy"}</button>
              <button onClick={() => setCv(null)} className="btn btn-ghost !min-h-[50px] !px-4"><RotateCcw size={16} /></button>
            </div>

            {/* CV document */}
            <article id="cv-doc" className="bg-white border-2 border-line rounded-2xl px-7 py-7 print:border-0 print:rounded-none">
              <h1 className="text-[26px] font-black tracking-tight text-ink leading-none">{cv.fullName}</h1>
              <p className="text-[14px] font-bold text-green-deep mt-1">{cv.headline}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-[11.5px] text-muted">
                {cv.contact?.phone && <span className="flex items-center gap-1"><Phone size={11} />{cv.contact.phone}</span>}
                {cv.contact?.email && <span className="flex items-center gap-1"><Mail size={11} />{cv.contact.email}</span>}
                {cv.contact?.location && <span className="flex items-center gap-1"><MapPin size={11} />{cv.contact.location}</span>}
                {cv.contact?.linkedin && <span className="flex items-center gap-1"><Link2 size={11} />{cv.contact.linkedin}</span>}
              </div>

              <Section title="Profile">
                <p className="text-[12.5px] text-ink leading-relaxed">{cv.summary}</p>
              </Section>

              {cv.experience?.length ? (
                <Section title="Experience">
                  <div className="space-y-3">
                    {cv.experience.map((e, i) => (
                      <div key={i}>
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="text-[13px] font-bold text-ink">{e.role} <span className="text-muted font-semibold">· {e.org}</span></p>
                          <p className="text-[11px] text-faint whitespace-nowrap mono">{e.period}</p>
                        </div>
                        <ul className="mt-1 space-y-0.5">
                          {e.bullets.map((b, j) => (
                            <li key={j} className="flex gap-2 text-[12px] text-ink leading-snug"><span className="text-green mt-1.5 w-1 h-1 rounded-full bg-green flex-shrink-0" />{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}

              {cv.education?.length ? (
                <Section title="Education">
                  <div className="space-y-2">
                    {cv.education.map((e, i) => (
                      <div key={i}>
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="text-[13px] font-bold text-ink">{e.qualification} <span className="text-muted font-semibold">· {e.school}</span></p>
                          <p className="text-[11px] text-faint whitespace-nowrap mono">{e.period}</p>
                        </div>
                        {e.details && <p className="text-[11.5px] text-muted leading-snug">{e.details}</p>}
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}

              {cv.skills?.length ? (
                <Section title="Skills">
                  <div className="flex flex-wrap gap-1.5">
                    {cv.skills.map((s, i) => <span key={i} className="text-[11.5px] font-semibold rounded-md bg-paper-2 border border-line px-2 py-0.5 print:border-line">{s}</span>)}
                  </div>
                </Section>
              ) : null}

              {cv.certifications?.length ? (
                <Section title="Certifications">
                  <ul className="space-y-0.5">
                    {cv.certifications.map((c, i) => (
                      <li key={i} className="text-[12px] text-ink"><span className="font-bold">{c.name}</span>{c.issuer ? ` — ${c.issuer}` : ""}{c.year ? ` (${c.year})` : ""}</li>
                    ))}
                  </ul>
                </Section>
              ) : null}

              {cv.extras?.map((ex, i) => (
                <Section key={i} title={ex.title}>
                  <ul className="space-y-0.5">{ex.items.map((it, j) => <li key={j} className="flex gap-2 text-[12px] text-ink leading-snug"><span className="text-green mt-1.5 w-1 h-1 rounded-full bg-green flex-shrink-0" />{it}</li>)}</ul>
                </Section>
              ))}

              <p className="text-[10.5px] text-faint mt-5 print:hidden">Referees available on request.</p>
            </article>
          </div>
        )}
      </div>
    </main>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-muted mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-paper-2 border-2 border-line rounded-xl px-3 py-2.5 text-[13px] placeholder-faint focus:outline-none focus:border-green focus:bg-paper transition-colors" />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-green-deep border-b-2 border-line pb-1 mb-2">{title}</h2>
      {children}
    </section>
  )
}
