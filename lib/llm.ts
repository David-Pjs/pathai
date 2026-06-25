// Model-agnostic LLM layer with cross-provider failover.
// Primary provider is set by LLM_PROVIDER; if it flakes (empty/garbled body),
// chatJSON automatically retries and then falls back to the OTHER provider.
// Both expose an OpenAI-compatible /chat/completions endpoint.

type ProviderId = "groq" | "deepseek"

interface ProviderConfig {
  baseURL: string
  model: string
  apiKey: string | undefined
}

const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  groq: {
    baseURL: "https://api.groq.com/openai/v1",
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY,
  },
  deepseek: {
    baseURL: "https://api.deepseek.com/v1",
    model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
    apiKey: process.env.DEEPSEEK_API_KEY,
  },
}

function primaryId(): ProviderId {
  const id = (process.env.LLM_PROVIDER as ProviderId) || "groq"
  return PROVIDERS[id] ? id : "groq"
}
function otherId(id: ProviderId): ProviderId {
  return id === "deepseek" ? "groq" : "deepseek"
}

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface ChatOptions {
  system: string
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  json?: boolean
  providerId?: ProviderId
}

/** Single chat completion against a specific provider. Returns raw assistant content. */
export async function chat({ system, messages, temperature = 0.6, maxTokens = 1800, json = false, providerId }: ChatOptions): Promise<string> {
  const cfg = PROVIDERS[providerId ?? primaryId()]
  if (!cfg.apiKey) throw new Error(`Missing API key for provider "${providerId ?? primaryId()}"`)

  const res = await fetch(`${cfg.baseURL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.apiKey}` },
    body: JSON.stringify({
      model: cfg.model,
      messages: [{ role: "system", content: system }, ...messages],
      temperature,
      max_tokens: maxTokens,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    throw new Error(`LLM ${cfg.model} failed (${res.status}): ${detail.slice(0, 200)}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ""
}

/** Extract a JSON object from a reply that may include code fences or stray prose. */
function parseLoose<T>(raw: string): T | null {
  if (!raw || !raw.trim()) return null
  let s = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
  const start = s.indexOf("{")
  const end = s.lastIndexOf("}")
  if (start !== -1 && end > start) s = s.slice(start, end + 1)
  try {
    return JSON.parse(s) as T
  } catch {
    return null
  }
}

/**
 * Returns parsed JSON, with a robust failover cascade so the UI never shows a
 * "could not parse" fallback in practice:
 *   1) primary provider, JSON mode  (x2)
 *   2) primary provider, plain mode  (x1)   — JSON mode sometimes returns empty
 *   3) fallback provider, JSON mode  (x2)
 * Any throw (timeout, 429, network) is caught and moves to the next attempt.
 */
export async function chatJSON<T>(opts: Omit<ChatOptions, "json" | "providerId">): Promise<T | null> {
  const primary = primaryId()
  const fallback = otherId(primary)

  // Plain mode FIRST: DeepSeek's json_object mode intermittently returns an empty
  // body, so we lead with plain completions (reliable) + loose extraction, and only
  // use json mode / the other provider as deeper backups.
  const plan: { provider: ProviderId; json: boolean }[] = [
    { provider: primary, json: false },
    { provider: primary, json: false },
    { provider: primary, json: true },
    { provider: fallback, json: false },
    { provider: fallback, json: true },
  ]

  for (const step of plan) {
    if (!PROVIDERS[step.provider].apiKey) continue
    try {
      const raw = await chat({ ...opts, json: step.json, providerId: step.provider })
      const parsed = parseLoose<T>(raw)
      if (parsed) return parsed
      console.warn(`chatJSON: empty/unparseable from ${step.provider} (json=${step.json}), len=${raw.length}`)
    } catch (err) {
      console.warn(`chatJSON: ${step.provider} threw —`, err instanceof Error ? err.message : err)
    }
  }
  return null
}
