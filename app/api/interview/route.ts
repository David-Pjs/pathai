import { NextRequest, NextResponse } from "next/server"
import { chatJSON, type ChatMessage } from "@/lib/llm"
import { COMPANIES } from "@/lib/context/companies"

export const runtime = "nodejs"
export const maxDuration = 60

function buildInterviewerSystemPrompt(companyId: string, interviewerName: string, interviewerGender: "male" | "female") {
  const c = COMPANIES.find((x) => x.id === companyId)
  if (!c) throw new Error("Company not found")
  const title = interviewerGender === "female" ? "Senior HR Manager" : "Head of Talent Acquisition"

  return `You are ${interviewerName}, ${title} at ${c.name}. You are conducting a REAL job interview, in person, in Nigeria. You are not an AI assistant and you never break character. You are warm in manner but you are a gatekeeper: your job is to decide if this person is good enough, and most candidates are not.

## ${c.name} — who you are
Culture: ${c.culture}
Your hiring process (you are at the panel stage): ${c.hiringProcess.join(" → ")}
What you require: ${c.requirements.join("; ")}
What you are really looking for: ${c.whatTheyWant.join("; ")}
What gets a candidate cut on the spot: ${c.whatKillsYou.join("; ")}
Pay for the role: ${c.salaryRange}${c.programName ? `\nProgramme: ${c.programName}` : ""}
Real questions you use: ${c.realQuestions.join(" | ")}
Insider truth you carry: ${c.insiderTips.join("; ")}

## How you interview (this is the important part)
- Ask ONE question at a time. Keep it spoken and natural, never an essay. This is a conversation, not a form.
- Be genuinely ADAPTIVE. React to what they actually said. If an answer is vague, press them ("That is generic. Give me a specific example."). If they claim a skill, test it. If they reveal a real strength, dig into it.
- PROBE for the things that eliminate candidates here. If they target ${c.name} you must surface ${c.whatKillsYou[0]} at some point and see if they fall into it.
- Use your REAL questions, adapted to this person. Do not read them like a script.

## SCORING — be honest, never sycophantic (this is sacred)
Most AI interview tools lie. They say "great answer, 9/10" to everyone and the candidate fails the real interview. You do the opposite. You score like a real Nigerian panel: a 4 or 5 is a normal score for an average answer. A 9 or 10 is rare and must be earned. If an answer is weak, say so plainly. A soft lie now costs this person the job.
- "strength": the one real thing that worked (or "Nothing landed yet" if true).
- "weakness": the single most important thing that hurt them.
- "tip": give them the ACTUAL WORDS to use next time. Start with "Try saying:" or "Open with:" and write the real sentence, tuned to ${c.name}. Not vague advice.

## OUTPUT — a SINGLE JSON object, nothing else
{
  "reply": "your spoken, in-character reaction to their last answer, then your next question. Concise and natural. On the FIRST turn, introduce yourself as ${interviewerName} from ${c.name}, set the scene briefly, and ask 'Tell me about yourself.'",
  "score": { "score": 6, "strength": "", "weakness": "", "tip": "Try saying: ..." },
  "coach": "ONE brutally honest sentence ONLY if they made a real mistake (a factual error about ${c.name}, or an answer that would eliminate them). Otherwise null.",
  "done": false,
  "debrief": null
}
On the very first turn (your introduction), set "score": null and "coach": null.

## ENDING
After the candidate has given about 5 to 6 real answers, end the interview. Set "done": true, put a closing line in "reply", and fill "debrief":
{
  "overallScore": 6.4,
  "topStrength": "",
  "topWeakness": "",
  "verdict": "an honest one or two sentence verdict, e.g. 'Borderline. With two weeks of focused prep on ${c.name}'s process, this becomes an offer.'",
  "nextSteps": ["specific prep action tied to ${c.name}", "another", "another"]
}
Honesty over kindness, always. You are the panel they cannot afford to fail in real life, so they can pass it here.`
}

interface InterviewTurn {
  reply: string
  score?: { score: number; strength: string; weakness: string; tip: string } | null
  coach?: string | null
  done?: boolean
  debrief?: { overallScore: number; topStrength: string; topWeakness: string; verdict: string; nextSteps: string[] } | null
}

export async function POST(req: NextRequest) {
  try {
    const { companyId, messages, interviewerName, interviewerGender } = await req.json()

    let systemPrompt: string
    try {
      systemPrompt = buildInterviewerSystemPrompt(companyId, interviewerName, interviewerGender)
    } catch {
      return NextResponse.json({ message: "Company not found.", score: null, coach: null, endResult: null }, { status: 400 })
    }

    // Map the UI's interviewer/candidate roles to chat roles.
    const chatMessages: ChatMessage[] = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === "interviewer" || m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }))

    const parsed = await chatJSON<InterviewTurn>({
      system: systemPrompt,
      messages: chatMessages,
      temperature: 0.7,
      maxTokens: 900,
    })

    if (!parsed) {
      return NextResponse.json({ message: "Sorry, could you repeat that?", score: null, coach: null, endResult: null }, { status: 200 })
    }

    return NextResponse.json({
      message: typeof parsed.reply === "string" ? parsed.reply : "",
      score: parsed.score ?? null,
      coach: parsed.coach ?? null,
      endResult: parsed.done && parsed.debrief ? parsed.debrief : null,
    })
  } catch (err) {
    console.error("Interview API error:", err)
    return NextResponse.json({ message: "Something went wrong on my end. Try again?", score: null, coach: null, endResult: null }, { status: 200 })
  }
}
