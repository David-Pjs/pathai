interface LogoProps {
  size?: "sm" | "md" | "lg"
  showWordmark?: boolean
  invert?: boolean
}

export default function Logo({ size = "md", showWordmark = true, invert = false }: LogoProps) {
  const dim = size === "sm" ? 28 : size === "lg" ? 44 : 34
  const fontSize = size === "sm" ? 14 : size === "lg" ? 20 : 16
  const textColor = invert ? "#FFFFFF" : "#16211B"
  const accentColor = invert ? "#FFFFFF" : "#15994A"

  return (
    <div className="flex items-center gap-2.5 flex-shrink-0">
      <svg width={dim} height={dim} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="34" height="34" rx="8" fill="#15994A" />
        {/* Two founders dots rising to a point */}
        <circle cx="8.5" cy="24" r="2" fill="white" fillOpacity="0.45" />
        <circle cx="17" cy="17" r="2" fill="white" fillOpacity="0.7" />
        <path d="M8.5 24 L17 17 L25.5 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.5 9 L25.5 9 L25.5 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showWordmark && (
        <span className="font-bold tracking-tight" style={{ fontSize, color: textColor }}>
          path<span style={{ color: accentColor }}>ai</span>
        </span>
      )}
    </div>
  )
}
