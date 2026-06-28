import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

export const runtime = "nodejs"

let groq: Groq
function getGroq() {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  return groq
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audio = formData.get("audio") as File
    if (!audio) return NextResponse.json({ error: "no audio" }, { status: 400 })

    const transcription = await getGroq().audio.transcriptions.create({
      file: audio,
      model: "whisper-large-v3-turbo",
      response_format: "json",
      language: "en",
    })

    return NextResponse.json({ text: transcription.text?.trim() || "" })
  } catch (err) {
    console.error("STT error:", err)
    return NextResponse.json({ error: "transcription failed" }, { status: 500 })
  }
}
