# PathAI

### The AI career mentor for first-generation Nigerians

> "Stop guessing your career. Get a real plan."

**Live app: https://pathai-delta.vercel.app**

Career success in Nigeria runs on who your family knows. First-generation graduates get no network, no mentor, and no inside word on how hiring actually works. PathAI is the mentor they never had. It discovers what a person genuinely wants, builds them a real plan to get there, drills them in a live mock interview with a recruiter who knows how the company actually hires, and rewrites their CV to match.

Built for the **JAF BuildVerse Hackathon, Edition 1** by **Team BYTE**.

**Focus areas addressed:** **EdTech** (career skills, interview training, CV literacy) and **Social Impact & Inclusion** (closing the network and access gap for first-generation graduates who have no mentor or family connections in the formal job market).

---

## The problem

Roughly 15 million young Nigerians enter the job market every year, and for first-generation graduates the barrier is rarely talent. It is access. Nobody in their family has done formal white-collar hiring, so nobody can tell them the unwritten rules: that GTBank caps applicants by age, that Access Bank disqualifies you for applying to two tracks at once, or the exact answer that quietly ends an interview. Generic AI gives generic advice. It does not know any of this. The result is talented people locked out of the workforce by information they were simply never given.

This is a training and access gap, not a talent gap. PathAI is built to close it.

## What it does

PathAI is four connected tools, each powered by a hand-built knowledge base of how **14 real Nigerian companies** actually hire (`lib/context/companies.ts`).

| Surface | What it does |
|---|---|
| **The Path Map** (`/pathmap`) | An adaptive, hybrid intake (tick-box clues plus free text) that pulls even a totally unsure person out of confusion, then generates a personal, checkable roadmap toward what they actually want: a job, remote or global work, freelancing, a business, study, or relocation. |
| **The Interview Room** (`/interview`) | A live voice mock interview with a named Nigerian recruiter (for example Adaeze from GTBank) who runs that company's real process and scores every answer honestly, not the sycophantic "9 out of 10" of other tools. |
| **CV Studio** (`/cv`) | Turns rough notes or a pasted CV into a recruiter-ready, ATS-friendly Nigerian-format CV tailored to the target company, using honest placeholders instead of inventing facts. |
| **The roadmap to interview to CV loop** | Each tool hands off to the next. The user's profile persists locally and carries through, so the plan, the practice, and the CV all reinforce one another. |

## Why it is different

- **Honest, not agreeable.** Most AI interview tools tell everyone "great answer." PathAI scores like a real Lagos panel and names the exact thing that eliminates you, then tells you what to say instead.
- **Grounded in real Nigerian hiring data**, not generic advice. The moat is `lib/context/`: real processes, requirements, questions, and "what kills you" for 14 companies.
- **Starts from what you love**, not from a job title. It works for a confused secondary-school student, a graduate, a freelancer, or someone trying to relocate.
- **Voice-first and low-bandwidth** by design, for users on mid-range Androids and metered data.

## Who it is for

The primary user is a **first-generation Nigerian graduate or school-leaver, roughly 17 to 28, on a mid-range Android with metered data**, who is job-hunting or trying to choose a direction and has nobody in their family who has done formal white-collar hiring. Secondary users: NYSC corps members, bootcamp graduates (ALX, AltSchool, 3MTT, HNG), and anyone trying to relocate or go remote.

The product assumes no career-services office, no mentor, and no money to spare. That is why onboarding starts from what the person likes, not from a job title they may not even have yet.

## How AI is core, not bolted on

AI is not a feature of PathAI. It is PathAI. Every surface is a language model working against a hand-built Nigerian hiring knowledge base:

- **Adaptive intake.** The model reads free text plus tick-box clues and decides the next question, so a confused user and a clear-goal user get different paths.
- **Roadmap generation.** It produces a specific, checkable plan (named companies, real certifications, concrete first-week moves), constrained by a prompt that bans generic advice.
- **In-character recruiter.** It role-plays a named recruiter running a real company's process, and scores each answer honestly with a concrete "say this instead" fix.
- **CV rewriting.** It reframes informal experience into a recruiter-ready Nigerian-format CV without fabricating facts.

Reliability is engineered, not assumed. `lib/llm.ts` runs a **cross-provider failover cascade** (DeepSeek to Groq, plain-mode-first with loose JSON extraction) so the interface never dead-ends on a flaky model response.

## Tech stack

- **Next.js 16** (App Router) with **React 19**, **TypeScript**, and **Tailwind CSS v4**
- **Framer Motion** for motion
- **LLM:** model-agnostic layer (`lib/llm.ts`) that switches between **DeepSeek** and **Groq** with one environment variable
- **Voice:** Nigerian English text-to-speech (Microsoft `en-NG` neural via `api/tts.py`) plus speech-to-text (`/api/stt`, Groq Whisper)
- Deployed on **Vercel**

## Architecture

```
app/
  page.tsx             Landing
  pathmap/             The Path Map (onboarding to roadmap)
  interview/           The Interview Room (voice mock interview)
  cv/                  CV Studio
  api/
    pathmap/route.ts   Adaptive intake and roadmap generation
    interview/route.ts In-character recruiter and honest scoring
    cv/route.ts        Tailored CV generation
    stt/route.ts       Speech-to-text
api/tts.py             Nigerian English text-to-speech (en-NG)
lib/
  llm.ts               Model-agnostic LLM client with failover (DeepSeek, Groq)
  context/
    companies.ts       The moat: 14 Nigerian companies' real hiring data
    culture.ts         Nigerian career culture and resources
    system-prompt.ts   Shared prompt scaffolding
components/
  Logo.tsx
PRODUCT.md             Product context (users, brand, strategy)
DESIGN.md              Design system (tokens, components, motion)
```

## Running locally

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

Open http://localhost:3000.

### Environment variables (`.env.local`)

```
LLM_PROVIDER=deepseek          # or "groq"
DEEPSEEK_API_KEY=sk-...        # required if LLM_PROVIDER=deepseek
GROQ_API_KEY=gsk_...           # required for speech-to-text (Whisper), also LLM if provider=groq
```

A copy-ready template lives in [`.env.example`](.env.example).

## Real-world feasibility in Nigeria

- **Low-bandwidth first.** Text-driven flows, a compressed hero image, no heavy client bundles. Voice is optional, not required.
- **Runs on cheap Androids.** No native app and no install. A mobile browser is enough.
- **Cheap to serve.** DeepSeek keeps per-session inference cost low, which is what makes a free tier viable for users with no money to spare.
- **No login wall to get value.** The profile persists in `localStorage`, so a first-time user gets a full roadmap without creating an account.
- **Payments that fit the market.** Monetization is designed around Paystack (naira cards, bank transfer, USSD), not dollar-priced subscriptions.

## Scalability and growth

- **Credits model.** Pay-as-you-go top-ups (the airtime mental model) instead of subscriptions, so the cost matches what the market can actually pay.
- **B2B2C.** Universities, NYSC and SAED, and bootcamps buy credits in bulk for their students. One buyer, thousands of users, the same system.
- **Grant-funded free tier.** Social-impact funding keeps the job seeker's core experience free.
- **Extensible moat.** The knowledge base (`lib/context/`) grows company by company and can expand to new sectors, new countries, and employer-sponsored pipelines without re-architecting the app.

## Roadmap

- **Now (prototype).** Four working surfaces, 14 companies, honest scoring, voice interviews, live on Vercel.
- **Next 3 months.** CV upload and parsing, live Paystack credits, accounts and cross-device sync, 50-plus companies.
- **Next 6 months.** First university and NYSC partnerships, employer-sponsored interview pipelines, expansion beyond banking into tech, oil and gas, and public sector roles.

## Team

**Team BYTE.** Two first-generation computer science students building the mentor we never had.

- **David Uhumagho** leads technical development.
- **Ifeoluwa Ojo-Omoniyi** leads research and product direction.

We are the exact people this is for, and that is why it works.
