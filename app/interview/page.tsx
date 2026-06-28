"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Send, Volume2, VolumeX, ArrowLeft, ArrowRight, PhoneOff, Mic, ChevronUp, ChevronDown, Play, FileText, RotateCcw, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { COMPANIES } from "@/lib/context/companies"
import Logo from "@/components/Logo"

interface Message { role: "interviewer" | "candidate"; content: string }
interface Score { score: number; strength: string; weakness: string; tip: string }
interface EndResult { overallScore: number; topStrength: string; topWeakness: string; verdict: string; nextSteps: string[] }
interface Interviewer { name: string; gender: "male" | "female"; title: string; initial: string }

const INTERVIEWERS: Record<string, Interviewer> = {
  gtbank:           { name: "Adaeze Okoye",      gender: "female", title: "Senior HR Manager",          initial: "AO" },
  access_bank:      { name: "Emeka Nwachukwu",   gender: "male",   title: "Head of Talent Acquisition", initial: "EN" },
  zenith_bank:      { name: "Ngozi Adeyemi",      gender: "female", title: "HR Business Partner",        initial: "NA" },
  uba:              { name: "Tunde Fashola",      gender: "male",   title: "Talent Manager",              initial: "TF" },
  flutterwave:      { name: "Chisom Eze",         gender: "female", title: "People Operations Lead",      initial: "CE" },
  paystack:         { name: "Femi Adeoye",        gender: "male",   title: "Head of People",              initial: "FA" },
  kuda:             { name: "Amara Obi",          gender: "female", title: "HR Lead",                     initial: "AO" },
  mtn_nigeria:      { name: "Bola Akinwande",     gender: "female", title: "Graduate Talent Manager",     initial: "BA" },
  airtel_nigeria:   { name: "Dele Ogun",          gender: "male",   title: "HR Manager",                  initial: "DO" },
  kpmg_nigeria:     { name: "Ifeoma Okeke",       gender: "female", title: "Campus Recruitment Manager",  initial: "IO" },
  nnpc:             { name: "Musa Garba",         gender: "male",   title: "HR Director",                 initial: "MG" },
  unilever_nigeria: { name: "Sola Adesanya",      gender: "female", title: "HR Business Partner",         initial: "SA" },
  nestle_nigeria:   { name: "Chuka Okafor",       gender: "male",   title: "Talent Acquisition Lead",     initial: "CO" },
  interswitch:      { name: "Yewande Bello",      gender: "female", title: "People Partner",              initial: "YB" },
}

const SECTOR_LABEL: Record<string, string> = {
  bank: "Banking", fintech: "Fintech", telecom: "Telecom",
  fmcg: "FMCG", consulting: "Consulting", oil_gas: "Oil & Gas", tech: "Tech",
}

type VoiceState = "idle" | "speaking" | "thinking" | "listening"

const WAVE = [6, 11, 17, 24, 17, 11, 6, 14, 21, 14, 9, 19, 12, 8, 15]

function VoiceOrb({ initial, state }: { initial: string; state: VoiceState }) {
  const speaking = state === "speaking"
  const listening = state === "listening"
  const thinking = state === "thinking"
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative grid place-items-center" style={{ width: "min(148px, 38vw)", height: "min(148px, 38vw)" }}>
        {speaking && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "#15994A", opacity: 0.18 }} />
            <span className="absolute rounded-full animate-ping" style={{ inset: -14, background: "#34D27B", opacity: 0.1, animationDelay: "0.3s" }} />
          </>
        )}
        {listening && <span className="absolute rounded-full border-2 animate-ping" style={{ inset: -10, borderColor: "#34D27B", opacity: 0.4 }} />}
        <div
          className="relative w-full h-full rounded-full grid place-items-center transition-all duration-500"
          style={{
            background: speaking ? "radial-gradient(circle at 40% 35%, #34D27B, #0C6E34)"
              : listening ? "radial-gradient(circle at 40% 35%, #34D27B, #15994A)"
              : "radial-gradient(circle at 40% 35%, rgba(21,153,74,0.35), rgba(21,153,74,0.08))",
            border: `2px solid ${speaking || listening ? "#34D27B" : "rgba(52,210,123,0.4)"}`,
            boxShadow: speaking ? "0 0 50px rgba(52,210,123,0.5), 0 0 100px rgba(21,153,74,0.25)"
              : listening ? "0 0 40px rgba(52,210,123,0.4)" : "none",
          }}
        >
          <span className="font-black select-none transition-all duration-300"
            style={{ fontSize: "clamp(1.4rem, 6vw, 2rem)", color: speaking || listening ? "#fff" : "#34D27B" }}>
            {initial}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-[3px]" style={{ height: 30 }}>
        {WAVE.map((h, i) => (
          <div key={i} className="w-[3px] rounded-full"
            style={{
              height: speaking ? `${h}px` : "3px",
              background: speaking ? "#34D27B" : "rgba(52,210,123,0.22)",
              animationName: speaking ? "wave-bar" : "none",
              animationDuration: `${0.5 + (i % 4) * 0.12}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDirection: "alternate",
              animationDelay: `${i * 0.05}s`,
            }} />
        ))}
      </div>

      <p className="text-[12px] font-extrabold tracking-wide transition-all duration-300"
        style={{ color: speaking ? "#34D27B" : thinking ? "#FBBF24" : listening ? "#34D27B" : "rgba(255,255,255,0.3)" }}>
        {speaking ? "Speaking" : thinking ? "Thinking…" : listening ? "Listening to you…" : "Ready"}
      </p>
    </div>
  )
}

export default function InterviewRoomPage() {
  const router = useRouter()
  const [stage, setStage] = useState<"select" | "room" | "debrief">("select")
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [interimText, setInterimText] = useState("")
  const [questionCount, setQuestionCount] = useState(0)
  const [lastScore, setLastScore] = useState<Score | null>(null)
  const [lastCoach, setLastCoach] = useState<string | null>(null)
  const [endResult, setEndResult] = useState<EndResult | null>(null)
  const [scoreHistory, setScoreHistory] = useState<Score[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const [micError, setMicError] = useState("")
  const [recordingVolume, setRecordingVolume] = useState(0)
  const [lastSpokenText, setLastSpokenText] = useState("")
  const [transcribing, setTranscribing] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const animFrameRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)
  const recTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const company = selectedCompany ? COMPANIES.find(c => c.id === selectedCompany) : null
  const interviewer = selectedCompany ? INTERVIEWERS[selectedCompany] : null
  const voiceState: VoiceState = isPlaying ? "speaking" : loading ? "thinking" : isRecording ? "listening" : "idle"

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, lastScore])

  useEffect(() => {
    if (stage === "room") timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [stage])

  useEffect(() => () => {
    cancelAnimationFrame(animFrameRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    if (recTimerRef.current) clearInterval(recTimerRef.current)
  }, [])

  function unlockAudio() {
    if (!audioRef.current) return
    const ctx = new AudioContext()
    const buf = ctx.createBuffer(1, 1, 22050)
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.connect(ctx.destination)
    src.start(0)
    src.onended = () => ctx.close()
    audioRef.current.muted = true
    audioRef.current.play().catch(() => {}).finally(() => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.muted = false }
    })
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  const speak = useCallback(async (text: string) => {
    if (!voiceEnabled) return
    setLastSpokenText(text)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = "" }
    setIsPlaying(false)
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 400), voice: interviewer?.gender || "female" }),
      })
      if (!res.ok) throw new Error("tts failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      if (!audioRef.current) return
      const el = audioRef.current
      el.src = url
      el.onended = () => { setIsPlaying(false); URL.revokeObjectURL(url); inputRef.current?.focus() }
      el.onerror = () => { setIsPlaying(false); URL.revokeObjectURL(url) }
      await el.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }, [voiceEnabled, interviewer])

  function startVolumeVisualizer(stream: MediaStream) {
    try {
      const ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)
      function tick() {
        analyser.getByteFrequencyData(data)
        const avg = data.slice(0, 32).reduce((a, b) => a + b, 0) / 32
        setRecordingVolume(Math.min(avg / 128, 1))
        animFrameRef.current = requestAnimationFrame(tick)
      }
      tick()
    } catch {}
  }

  function stopVolumeVisualizer() {
    cancelAnimationFrame(animFrameRef.current)
    setRecordingVolume(0)
  }

  async function startRecording() {
    setMicError(""); setInterimText(""); setInput(""); chunksRef.current = []; setRecordingSeconds(0)
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setMicError(msg.includes("Permission") || msg.includes("allowed")
        ? "Mic access denied. Click the lock icon in your browser bar and allow microphone."
        : `Mic error: ${msg}`)
      return
    }
    streamRef.current = stream
    startVolumeVisualizer(stream)
    recTimerRef.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000)
    const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"].find(t => MediaRecorder.isTypeSupported(t)) || ""
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    mediaRecorderRef.current = recorder
    recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = async () => {
      if (recTimerRef.current) { clearInterval(recTimerRef.current); recTimerRef.current = null }
      stopVolumeVisualizer()
      stream.getTracks().forEach(t => t.stop())
      streamRef.current = null
      setIsRecording(false); setRecordingSeconds(0)
      const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" })
      chunksRef.current = []
      if (blob.size < 100) { setMicError(`Nothing recorded (${blob.size}B). Mic may not be working.`); return }
      setTranscribing(true)
      try {
        const ext = blob.type.includes("ogg") ? "ogg" : blob.type.includes("mp4") ? "mp4" : "webm"
        const file = new File([blob], `audio.${ext}`, { type: blob.type })
        const form = new FormData()
        form.append("audio", file)
        const res = await fetch("/api/stt", { method: "POST", body: form })
        const data = await res.json()
        setTranscribing(false)
        if (data.text?.trim()) {
          setInput(data.text.trim()); setInterimText("")
          setTimeout(() => setInput(prev => { if (prev.trim()) { doSend(prev.trim()); return "" } return prev }), 1200)
        } else {
          setMicError("Could not hear that. Speak louder or type your answer.")
        }
      } catch {
        setTranscribing(false)
        setMicError("Transcription failed. Try typing instead.")
      }
    }
    recorder.start(100)
    setIsRecording(true)
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop()
  }
  function toggleMic() { isRecording ? stopRecording() : startRecording() }

  async function doSend(text: string) {
    if (!text.trim() || loading || !selectedCompany || !interviewer) return
    unlockAudio()
    const newMessages: Message[] = [...messages, { role: "candidate", content: text.trim() }]
    setMessages(newMessages); setInput(""); setLoading(true); setLastScore(null); setLastCoach(null)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = "" }
    setIsPlaying(false)
    const res = await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId: selectedCompany,
        interviewerName: interviewer.name,
        interviewerGender: interviewer.gender,
        messages: newMessages.map(m => ({ role: m.role === "interviewer" ? "assistant" : "user", content: m.content })),
      }),
    })
    const data = await res.json()
    if (data.score) { setLastScore(data.score); setScoreHistory(prev => [...prev, data.score]) }
    if (data.coach) setLastCoach(data.coach)
    if (data.endResult) {
      setEndResult(data.endResult)
      setMessages(prev => [...prev, { role: "interviewer", content: data.message }])
      setLoading(false)
      speak(data.message)
      setTimeout(() => setStage("debrief"), 3000)
      return
    }
    setMessages(prev => [...prev, { role: "interviewer", content: data.message }])
    setQuestionCount(q => q + 1)
    setLoading(false)
    speak(data.message)
  }

  async function sendTyped() {
    if (!input.trim() || loading || isPlaying) return
    await doSend(input)
  }

  async function startInterview() {
    if (!selectedCompany || !interviewer) return
    unlockAudio()
    setStage("room"); setLoading(true)
    const res = await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: selectedCompany, interviewerName: interviewer.name, interviewerGender: interviewer.gender, messages: [] }),
    })
    const data = await res.json()
    setMessages([{ role: "interviewer", content: data.message }])
    setLoading(false)
    speak(data.message)
  }

  function resetAll() {
    setStage("select"); setMessages([]); setScoreHistory([]); setEndResult(null)
    setQuestionCount(0); setLastScore(null); setLastCoach(null); setElapsed(0)
  }

  /* ─────────────────────── SELECT (light) ─────────────────────── */
  if (stage === "select") {
    const banks = COMPANIES.filter(c => c.type === "bank")
    const fintechs = COMPANIES.filter(c => c.type === "fintech")
    const others = COMPANIES.filter(c => !["bank", "fintech"].includes(c.type))
    return (
      <main className="min-h-screen bg-paper-2 text-ink">
        <div className="max-w-xl mx-auto px-5 pb-32">
          <nav className="flex items-center justify-between py-6">
            <button onClick={() => router.push("/")} className="w-9 h-9 grid place-items-center rounded-xl border-2 border-line text-muted hover:border-green hover:text-green-deep transition-colors"><ArrowLeft size={16} /></button>
            <Logo size="sm" />
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full bg-green-tint px-3 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span className="text-[12px] font-bold text-green-deep">Voice interview · real Nigerian recruiters</span>
          </div>
          <h1 className="t-h1 mb-3">Choose who<br />interviews you.</h1>
          <p className="text-[15px] text-muted leading-relaxed max-w-[40ch] mb-9">
            Each is trained on how that company actually hires. You speak your answers out loud. They score you honestly, the way a real panel would.
          </p>

          {[{ label: "Banks", items: banks }, { label: "Fintech", items: fintechs }, { label: "Other sectors", items: others }].map(group =>
            group.items.length === 0 ? null : (
              <div key={group.label} className="mb-7">
                <p className="t-label text-faint mb-3">{group.label}</p>
                <div className="space-y-2.5">
                  {group.items.map(c => {
                    const iv = INTERVIEWERS[c.id]
                    const selected = selectedCompany === c.id
                    return (
                      <button key={c.id} onClick={() => setSelectedCompany(c.id)}
                        className={`w-full text-left rounded-2xl border-2 transition-all active:scale-[0.99] ${selected ? "border-green bg-green-tint" : "border-line bg-paper hover:border-green/40"}`}>
                        <div className="flex items-center gap-3.5 px-4 py-3.5">
                          <div className={`w-11 h-11 rounded-2xl grid place-items-center text-[13px] font-black flex-shrink-0 ${selected ? "bg-green text-white" : "bg-green-tint text-green-deep"}`}>{iv?.initial}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[14px] font-extrabold text-ink truncate">{iv?.name}</p>
                              <span className="text-[9px] font-bold text-muted bg-paper-2 border border-line rounded-full px-1.5 py-0.5 flex-shrink-0">{SECTOR_LABEL[c.type] || c.sector}</span>
                            </div>
                            <p className="text-[12px] text-muted truncate">{iv?.title} · {c.name}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full grid place-items-center flex-shrink-0 ${selected ? "bg-green" : "border-2 border-line"}`}>{selected && <Check size={12} className="text-white" />}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-paper-2 via-paper-2 to-transparent pt-8 pb-safe px-5">
          <div className="max-w-xl mx-auto">
            <button onClick={startInterview} disabled={!selectedCompany} className="btn btn-primary w-full !min-h-[58px]">
              {selectedCompany && interviewer ? <>Enter the room with {interviewer.name.split(" ")[0]} <ArrowRight size={17} /></> : "Pick an interviewer"}
            </button>
          </div>
        </div>
      </main>
    )
  }

  /* ─────────────────────── DEBRIEF (light) ─────────────────────── */
  if (stage === "debrief" && endResult) {
    const s = endResult.overallScore
    const tone = s >= 8 ? { c: "#15994A", label: "You are ready." } : s >= 6 ? { c: "#C99A00", label: "Almost there." } : { c: "#E03A2E", label: "Not yet. Keep drilling." }
    return (
      <main className="min-h-screen bg-paper-2 text-ink">
        <div className="max-w-xl mx-auto px-5 py-8">
          <div className="flex items-center justify-between mb-7"><Logo size="sm" /><span className="mono text-[12px] text-faint">{formatTime(elapsed)}</span></div>
          <p className="t-label text-faint mb-1">Interview debrief</p>
          <p className="text-[13px] text-muted mb-6">{company?.name} · {interviewer?.name}</p>

          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 320, damping: 22 }} className="flex items-end gap-3 mb-2">
            <span className="mono font-black tabular-nums leading-none" style={{ fontSize: "5.5rem", color: tone.c }}>{s.toFixed(1)}</span>
            <span className="mono text-[18px] text-faint mb-3">/10</span>
          </motion.div>
          <p className="text-[18px] font-extrabold mb-7" style={{ color: tone.c }}>{tone.label}</p>

          <div className="bg-paper border-2 border-line rounded-2xl px-5 py-4 mb-3">
            <p className="t-label text-faint mb-1.5">Verdict</p>
            <p className="text-[14px] text-ink leading-relaxed">{endResult.verdict}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="rounded-2xl bg-green-tint border-2 border-green/20 px-4 py-4">
              <p className="t-label text-green-deep mb-1.5">Strength</p>
              <p className="text-[13px] text-ink leading-snug">{endResult.topStrength}</p>
            </div>
            <div className="rounded-2xl bg-danger-tint border-2 border-danger/20 px-4 py-4">
              <p className="t-label text-danger mb-1.5">Weakness</p>
              <p className="text-[13px] text-ink leading-snug">{endResult.topWeakness}</p>
            </div>
          </div>

          {scoreHistory.length > 0 && (
            <div className="bg-paper border-2 border-line rounded-2xl px-5 py-4 mb-3">
              <p className="t-label text-faint mb-3">Answer by answer</p>
              {scoreHistory.map((h, i) => (
                <div key={i} className="flex items-center gap-3 mb-2">
                  <span className="mono text-[11px] text-faint w-6 flex-shrink-0">Q{i + 1}</span>
                  <div className="flex-1 h-2 bg-line rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${h.score * 10}%`, background: h.score >= 8 ? "#15994A" : h.score >= 6 ? "#C99A00" : "#E03A2E" }} />
                  </div>
                  <span className="mono text-[11px] text-muted w-9 flex-shrink-0">{h.score}/10</span>
                </div>
              ))}
            </div>
          )}

          <div className="bg-ink text-white rounded-2xl px-5 py-5 mb-6">
            <p className="t-label text-green mb-3">Before the real thing</p>
            {endResult.nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 mb-2.5 last:mb-0">
                <span className="mono text-[12px] text-green font-bold flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-[13px] text-white/70 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <button onClick={() => router.push("/cv")} className="btn btn-primary w-full !min-h-[58px] mb-3"><FileText size={17} /> Fix your CV for this role <ArrowRight size={16} /></button>
          <div className="flex gap-3">
            <button onClick={resetAll} className="btn btn-ghost flex-1 !min-h-[52px]"><RotateCcw size={15} /> Try another</button>
            <button onClick={() => router.push("/")} className="btn btn-ghost flex-1 !min-h-[52px]">Done</button>
          </div>
        </div>
      </main>
    )
  }

  /* ─────────────────────── CONNECTING (ringing) ─────────────────────── */
  const connecting = messages.length === 0 && loading
  if (connecting && interviewer) {
    return (
      <main className="flex flex-col items-center justify-center text-white px-6" style={{ height: "100dvh", background: "#0F1713" }}>
        <div className="relative grid place-items-center mb-9" style={{ width: 240, height: 240 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="absolute rounded-full border border-green/40" style={{ width: 150, height: 150, animation: "ring-expand 1.9s ease-out infinite", animationDelay: `${i * 0.6}s` }} />
          ))}
          <div className="relative w-[112px] h-[112px] rounded-full grid place-items-center" style={{ background: "radial-gradient(circle at 40% 35%, #34D27B, #0C6E34)", boxShadow: "0 0 60px rgba(52,210,123,0.45)" }}>
            <span className="text-[2rem] font-black text-white">{interviewer.initial}</span>
          </div>
        </div>
        <p className="text-[20px] font-extrabold mb-1">Connecting to {interviewer.name.split(" ")[0]}…</p>
        <p className="text-[13px] text-white/40 mb-7">{interviewer.title} · {company?.name}</p>
        <div className="flex items-center gap-2 mb-14">
          <span className="text-[12px] font-extrabold text-green">Connecting</span>
          {[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-green" style={{ animation: `bounce-dot 1.2s ${i * 0.15}s infinite` }} />)}
        </div>
        <button onClick={() => { resetAll() }} className="flex flex-col items-center gap-1.5" style={{ color: "#F87171" }}>
          <div className="w-14 h-14 rounded-full bg-red-500/15 border-2 border-red-500/30 grid place-items-center"><PhoneOff size={20} /></div>
          <span className="text-[10px] font-bold">Cancel</span>
        </button>
      </main>
    )
  }

  /* ─────────────────────── ROOM (dark) ─────────────────────── */
  const lastInterviewerMsg = [...messages].reverse().find(m => m.role === "interviewer")
  return (
    <main className="text-white flex justify-center" style={{ height: "100dvh", maxHeight: "100dvh", background: "#0F1713" }}>
      <audio ref={audioRef} />
      <style>{`@keyframes wave-bar { from { transform: scaleY(0.4); } to { transform: scaleY(1.6); } }`}</style>

      <div className="w-full max-w-md flex flex-col min-h-0" style={{ height: "100dvh" }}>
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-green/15 border border-green/30 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            <span className="text-[10px] font-extrabold text-green mono">LIVE</span>
          </div>
          <span className="mono text-[11px] text-white/25">{formatTime(elapsed)}</span>
        </div>
        <div className="text-[12px] text-white/40 font-bold">{company?.name}</div>
        <span className="mono text-[11px] text-white/25">Q{questionCount + 1}</span>
      </div>

      {/* ORB + QUESTION */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-5 min-h-0 overflow-y-auto">
        {interviewer && <VoiceOrb initial={interviewer.initial} state={voiceState} />}
        <div className="text-center">
          <p className="text-[16px] font-extrabold text-white">{interviewer?.name}</p>
          <p className="text-[12px] text-white/35">{interviewer?.title}</p>
        </div>

        <AnimatePresence mode="wait">
          {lastInterviewerMsg && !loading && (
            <motion.div key={lastInterviewerMsg.content.slice(0, 20)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="max-w-sm w-full">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 max-h-[24vh] overflow-y-auto">
                <p className="text-[14px] text-white/80 leading-relaxed text-center">{lastInterviewerMsg.content}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(loading || transcribing) && (
          <div className="flex gap-1.5 items-center">
            {[0, 1, 2].map(i => <span key={i} className="w-2 h-2 bg-green/60 rounded-full" style={{ animation: `bounce-dot 1.2s ${i * 0.15}s infinite` }} />)}
            <span className="text-[11px] text-white/30 ml-1">{transcribing ? "Transcribing…" : `${interviewer?.name?.split(" ")[0]} is thinking`}</span>
          </div>
        )}

        {!loading && !isPlaying && lastSpokenText && (
          <button onClick={() => { unlockAudio(); speak(lastSpokenText) }} className="flex items-center gap-2 text-white/25 hover:text-white/55 transition-colors text-[11px]"><Play size={11} /> Replay</button>
        )}
      </div>

      {/* SCORE CARD */}
      <AnimatePresence>
        {(lastScore || lastCoach) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-4 mb-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 flex-shrink-0">
            {lastScore && (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1.5">
                  <p className="text-[12px] text-green-300" style={{ color: "#5FE08F" }}><span className="font-extrabold">+ </span>{lastScore.strength}</p>
                  <p className="text-[12px] text-white/55"><span className="font-extrabold" style={{ color: "#F87171" }}>− </span>{lastScore.weakness}</p>
                  <p className="text-[12px] font-semibold" style={{ color: "#5FE08F" }}>→ {lastScore.tip}</p>
                </div>
                <span className="mono text-[22px] font-black flex-shrink-0" style={{ color: lastScore.score >= 8 ? "#34D27B" : lastScore.score >= 6 ? "#FBBF24" : "#F87171" }}>{lastScore.score}<span className="text-[13px] text-white/30">/10</span></span>
              </div>
            )}
            {lastCoach && <p className="text-[12px] border-t border-white/10 pt-2.5 mt-2.5 leading-relaxed" style={{ color: "#FBBF24" }}><span className="font-extrabold">Coach: </span>{lastCoach}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TRANSCRIPT */}
      {messages.length > 1 && (
        <div className="mx-4 mb-1 flex-shrink-0">
          <button onClick={() => setTranscriptOpen(o => !o)} className="w-full flex items-center justify-center gap-1.5 text-[11px] text-white/25 hover:text-white/45 transition-colors py-1">
            {transcriptOpen ? <ChevronDown size={11} /> : <ChevronUp size={11} />}{transcriptOpen ? "Hide" : "View"} transcript ({messages.length})
          </button>
        </div>
      )}
      <AnimatePresence>
        {transcriptOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 120, opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mx-4 mb-1 overflow-y-auto space-y-2 flex-shrink-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "candidate" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed ${msg.role === "candidate" ? "bg-green/20 text-white/75" : "bg-white/5 text-white/55"}`}>{msg.content}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* INPUT + CONTROLS */}
      <div className="px-4 pt-2 pb-safe flex-shrink-0">
        {micError && <div className="flex justify-center mb-2"><p className="text-[11px] text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-xl px-3 py-2 text-center max-w-xs">{micError}</p></div>}
        {isRecording && interimText && <div className="flex justify-center mb-2"><p className="text-[12px] text-green bg-green/10 rounded-xl px-3 py-1.5 italic max-w-xs text-center">{interimText}</p></div>}

        {!isRecording && (
          <div className="flex gap-2 items-center mb-4">
            <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendTyped()}
              placeholder={loading || isPlaying ? "Wait…" : "Or type your answer…"} disabled={loading || isPlaying}
              className="flex-1 rounded-2xl px-4 py-3.5 text-[14px] text-white placeholder-white/25 bg-white/6 border-2 border-white/10 focus:border-green/60 focus:outline-none disabled:opacity-30 transition-colors" />
            <button onClick={sendTyped} disabled={!input.trim() || loading || isPlaying} className="w-12 h-12 grid place-items-center rounded-2xl bg-green text-white disabled:opacity-20 transition-all active:scale-95 flex-shrink-0" style={{ boxShadow: "0 4px 0 #0C6E34" }}><Send size={17} /></button>
          </div>
        )}

        <div className="flex items-center justify-center gap-10">
          <button onClick={toggleMic} disabled={loading || isPlaying || transcribing} className="flex flex-col items-center gap-1.5 transition-all disabled:opacity-30">
            <div className="w-16 h-16 rounded-full grid place-items-center transition-all"
              style={{ background: isRecording ? "rgba(21,153,74,0.2)" : "rgba(255,255,255,0.06)", border: isRecording ? "2px solid #34D27B" : "2px solid rgba(255,255,255,0.12)", boxShadow: isRecording ? `0 0 0 ${4 + recordingVolume * 18}px rgba(52,210,123,${0.1 + recordingVolume * 0.15})` : "none" }}>
              <Mic size={22} style={{ color: isRecording ? "#34D27B" : "rgba(255,255,255,0.55)" }} />
            </div>
            <span className="text-[10px] font-bold mono" style={{ color: isRecording ? "#34D27B" : "rgba(255,255,255,0.35)" }}>{transcribing ? "Transcribing…" : isRecording ? `${recordingSeconds}s · tap to send` : "Tap to speak"}</span>
          </button>

          <button onClick={() => { if (audioRef.current) audioRef.current.pause(); stopVolumeVisualizer(); router.push("/") }} className="flex flex-col items-center gap-1.5" style={{ color: "#F87171" }}>
            <div className="w-16 h-16 rounded-full bg-red-500/15 border-2 border-red-500/30 grid place-items-center"><PhoneOff size={22} /></div>
            <span className="text-[10px] font-bold">Leave</span>
          </button>

          <button onClick={() => { setVoiceEnabled(v => !v); if (isPlaying) { if (audioRef.current) audioRef.current.pause(); setIsPlaying(false) } }} className="flex flex-col items-center gap-1.5 transition-colors" style={{ color: voiceEnabled ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.25)" }}>
            <div className="w-16 h-16 rounded-full bg-white/6 border-2 border-white/12 grid place-items-center">{voiceEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}</div>
            <span className="text-[10px] font-bold">{voiceEnabled ? "Voice on" : "Muted"}</span>
          </button>
        </div>
      </div>
      </div>
    </main>
  )
}
