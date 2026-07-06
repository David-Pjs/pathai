import { NextRequest, NextResponse } from "next/server"
import { chatJSON } from "@/lib/llm"
import { COMPANIES } from "@/lib/context/companies"

export const runtime = "nodejs"
export const maxDuration = 60

const BASE = `You are PathAI's CV writer, built for first-generation Nigerian job seekers. You turn whatever a person gives you, even thin, rough, or informal, into a strong one-page CV in the Nigerian format that a real recruiter would shortlist.

Rules:
- Present informal experience as real experience. A bookkeeping gig for an uncle's shop, designs for a church, helping a family business, a personal project, NYSC, volunteering: all of it counts and is written up with respect.
- HONESTY IS ABSOLUTE. Never invent an employer name, a job title, dates, a metric, a percentage, a tool, or a skill the person did not give you. This is a real CV a recruiter will probe in an interview, and the product's whole value is trust. A fabricated number gets the person caught.
- USE any years or durations the person gave (e.g. "2023-2024", "for 1 year"), exactly, in the "period" fields. NEVER replace a real date they gave with a placeholder.
- Only where a date/number/metric would strengthen a line but they gave NONE, insert a clear square-bracket placeholder for THEM to fill, e.g. "handling roughly [₦ amount] in daily sales", "reconciled cash to [X]% accuracy", "[year] – [year]". Never guess the value. If you do not know the employer's name, write a neutral descriptor like "Family retail business" rather than inventing "Emeka's Stores".
- Use strong action verbs (recorded, managed, served, built, reconciled). Strength comes from framing real work well, not from inventing achievements.
- Nigerian format: one page, clean, ATS-friendly. Lead with a sharp professional summary tailored to the target. Include NYSC status and class of degree where relevant.
- No fluff, no clichés ("hardworking team player"), no lies.
- Never use em dashes (the "—" character) in the summary, bullets, headline, or any prose. Use a plain hyphen only for date ranges (e.g. "2023-2024"). For a headline separator use a comma or slash, not a dash.
- Tailor the summary and the ordering of skills to the target role and, if given, what the target company actually values.

Output a SINGLE JSON object, nothing else:
{
  "fullName": "",
  "headline": "target role / professional title, e.g. 'Graduate Trainee, Banking & Finance'",
  "contact": { "phone": "", "email": "", "location": "", "linkedin": "" },
  "summary": "2 to 3 sentence professional summary tailored to the target",
  "experience": [{ "role": "", "org": "", "period": "", "location": "", "bullets": ["achievement-oriented bullet", "..."] }],
  "education": [{ "qualification": "e.g. BSc Accounting (Second Class Lower)", "school": "", "period": "", "details": "NYSC status, relevant coursework, awards" }],
  "skills": ["", ""],
  "certifications": [{ "name": "", "issuer": "", "year": "" }],
  "extras": [{ "title": "e.g. Projects / Volunteering", "items": ["", ""] }],
  "improvements": ["short note on what you strengthened and why, e.g. 'Reframed your shop bookkeeping as quantified financial experience'"]
}
Only include contact fields, certifications, or extras you actually have input for. Keep "improvements" to 3 to 5 punchy notes.`

interface CVRequest {
  profile?: Record<string, unknown>
  rawInput?: string
  contact?: { phone?: string; email?: string; location?: string; linkedin?: string }
  targetRole?: string
  targetCompanyId?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CVRequest
    const company = body.targetCompanyId ? COMPANIES.find((c) => c.id === body.targetCompanyId) : undefined

    const targetBlock = body.targetRole || company
      ? `\n\nTARGET:\nRole: ${body.targetRole || "(infer from profile)"}${company ? `\nCompany: ${company.name}\nThis company values: ${company.whatTheyWant.slice(0, 3).join("; ")}\nIt eliminates candidates for: ${company.whatKillsYou[0]}` : ""}`
      : ""

    const user = `PERSON'S PROFILE (from PathAI onboarding):\n${JSON.stringify(body.profile ?? {}, null, 2)}

CONTACT THEY PROVIDED:\n${JSON.stringify(body.contact ?? {}, null, 2)}

WHAT THEY WROTE / PASTED (their current CV or rough notes, may be empty):\n${(body.rawInput || "(nothing pasted, build from the profile above)").slice(0, 4000)}${targetBlock}

Write the strongest honest one-page Nigerian CV for this person.`

    const cv = await chatJSON({
      system: BASE,
      messages: [{ role: "user", content: user }],
      temperature: 0.5,
      maxTokens: 2200,
    })

    if (!cv) {
      return NextResponse.json({ error: "Could not generate the CV. Try again." }, { status: 200 })
    }

    return NextResponse.json({ cv })
  } catch (err) {
    console.error("cv error:", err)
    return NextResponse.json({ error: "Something went wrong generating your CV." }, { status: 200 })
  }
}
