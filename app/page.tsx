"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, MapPin, Mic } from "lucide-react"
import Logo from "@/components/Logo"

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper-2 text-ink">

      {/* HERO — the route illustration is the hero */}
      <section className="relative isolate overflow-hidden">
        <Image src="/hero-path.png" alt="" fill priority sizes="100vw" className="object-cover" style={{ objectPosition: "72% center" }} />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(96deg, #F5F3E9 0%, rgba(245,243,233,0.92) 34%, rgba(245,243,233,0.55) 56%, rgba(245,243,233,0.05) 78%, transparent 100%)" }}
        />
        {/* mobile: keep the stacked content readable, reveal the path lower down */}
        <div
          className="absolute inset-0 sm:hidden"
          style={{ background: "linear-gradient(180deg, #F5F3E9 0%, rgba(245,243,233,0.94) 44%, rgba(245,243,233,0.45) 72%, rgba(245,243,233,0) 92%)" }}
        />

        <div className="relative max-w-6xl mx-auto px-5 md:px-10 min-h-[94vh] flex flex-col">
          <nav className="flex items-center justify-between py-6 md:py-7">
            <Logo size="sm" />
            <span className="t-label text-muted">Career navigator</span>
          </nav>

          <div className="flex-1 flex items-center pb-16 pt-4">
            <div className="max-w-xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
                className="t-display text-ink"
              >
                Stop guessing your career.<br />
                <span className="text-green">Get a real plan.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
                className="mt-6 text-[16px] leading-relaxed text-muted max-w-[40ch]"
              >
                The mentor first gen Nigerians never had. PathAI maps what to learn next, then drills the interview with an AI that knows how Nigeria actually hires.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
                className="mt-9 flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-[560px]"
              >
                <Link href="/pathmap" className="flex-1 group">
                  <div className="btn btn-primary w-full !justify-between !h-[74px] !px-4 gap-3">
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="w-10 h-10 rounded-xl bg-white/20 grid place-items-center flex-shrink-0"><MapPin size={18} /></span>
                      <span className="text-left leading-tight min-w-0">
                        <span className="block text-[15px]">Build my path</span>
                        <span className="block text-[12px] font-semibold text-white/75 truncate">5 questions, your roadmap</span>
                      </span>
                    </span>
                    <ArrowRight size={18} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>

                <Link href="/interview" className="flex-1 group">
                  <div className="btn btn-ghost w-full !justify-between !h-[74px] !px-4 gap-3 !bg-paper/80 backdrop-blur-sm">
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="relative w-10 h-10 rounded-xl bg-green-tint grid place-items-center flex-shrink-0">
                        <span className="absolute inset-0 rounded-xl ring-2 ring-green/40 animate-ring-pulse" />
                        <Mic size={18} className="text-green-deep relative" />
                      </span>
                      <span className="text-left leading-tight min-w-0">
                        <span className="block text-[15px]">Practice an interview</span>
                        <span className="block text-[12px] font-semibold text-muted truncate">Talk to a Nigerian recruiter</span>
                      </span>
                    </span>
                    <ArrowRight size={18} className="flex-shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 md:px-10">
        {/* GREEN PANEL — the moat */}
        <section className="rounded-[28px] bg-green text-white px-6 py-10 md:px-10 my-14 grid lg:grid-cols-[auto_1fr] gap-x-12 gap-y-6">
          <p className="t-label text-white/75 self-start">It knows how<br className="hidden lg:block" /> they really hire</p>
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-2 mb-5">
              {["GTBank", "Flutterwave", "MTN", "Access Bank", "Paystack", "KPMG", "Zenith", "Kuda", "Interswitch"].map((c) => (
                <span key={c} className="text-[13px] font-bold rounded-lg bg-white/15 px-2.5 py-1.5">{c}</span>
              ))}
            </div>
            <p className="text-[15px] leading-relaxed text-white/85">
              Trained on how 14 Nigerian companies really hire: the age caps, the elimination rounds, the answers that end an interview. The edge a connection used to give you, now anyone&apos;s.
            </p>
          </div>
        </section>

        {/* FOUNDERS */}
        <section className="pb-12 flex items-center gap-3">
          <div className="flex -space-x-2 flex-shrink-0">
            <span className="w-9 h-9 rounded-full bg-green grid place-items-center text-[12px] font-black text-white border-2 border-paper-2">D</span>
            <span className="w-9 h-9 rounded-full bg-ink grid place-items-center text-[12px] font-black text-white border-2 border-paper-2">I</span>
          </div>
          <p className="text-[13px] text-muted leading-snug">
            <span className="font-bold text-ink">David &amp; Ifeoluwa, Team BYTE.</span> Both 17, both first gen. We built the mentor we never had.
          </p>
        </section>
      </div>
    </main>
  )
}
