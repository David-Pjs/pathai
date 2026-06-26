export interface CompanyProfile {
  id: string
  name: string
  sector: string
  type: "bank" | "fintech" | "telecom" | "fmcg" | "consulting" | "oil_gas" | "tech"
  size: "large" | "medium" | "startup"
  culture: string
  hiringProcess: string[]
  requirements: string[]
  realQuestions: string[]
  whatTheyWant: string[]
  whatKillsYou: string[]
  salaryRange: string
  programName?: string
  insiderTips: string[]
}

export const COMPANIES: CompanyProfile[] = [
  // ─── BANKS ───────────────────────────────────────────────
  {
    id: "gtbank",
    name: "GTBank (Guaranty Trust Bank)",
    sector: "Banking",
    type: "bank",
    size: "large",
    culture: "Conservative, formal, hierarchy-conscious. GTBank prides itself on discipline and professionalism. Dress code is strict. They value people who respect structure and escalate issues properly. If you're a maverick who hates process, GTBank is not your place.",
    hiringProcess: [
      "Online CBT (Computer Based Test) — English, Quantitative, Current Affairs, Banking Knowledge",
      "HR Chat + Written Essay — personality and communication screening",
      "Competency Panel Interview — 3-4 interviewers, structured questions",
      "Executive Interview — final stage, culture fit with senior management",
      "4-month Entry Level Programme (ELP) — training before full employment",
    ],
    requirements: [
      "Minimum Second Class Lower (2:2)",
      "NYSC discharge certificate required",
      "Maximum age 26 at time of application",
      "Minimum 5 WAEC credits including Mathematics and English",
      "No previous banking experience required",
    ],
    realQuestions: [
      "Tell me about yourself — keep it under 3 minutes, structure: background → education → relevant experience → why GTBank",
      "Why banking? Why GTBank specifically? — Research their GTCO rebrand, their fintech shift, Squad payments app",
      "You discover a colleague is falsifying customer records. What do you do? — Answer: report to supervisor immediately, do not confront colleague directly",
      "Describe a time you dealt with a difficult personality at work or school — use STAR method",
      "Describe a time a customer was upset and how you handled it — use STAR, show empathy first",
      "Where do you see yourself in 5 years? — Show ambition but within banking, mention leadership track",
      "What do you know about our products? — Know about GT World app, Squad, GTCrea8, GTCO Holdings",
      "How do you handle working under pressure? — Give a real example, not generic",
    ],
    whatTheyWant: [
      "Ethics and integrity above everything — they will probe for this heavily",
      "Respect for hierarchy — never say you would confront a superior",
      "Client service mindset — every answer should show you think about the customer",
      "Composure — they test stress tolerance in panel interviews deliberately",
      "Articulate communication — they watch HOW you speak, not just what you say",
    ],
    whatKillsYou: [
      "Saying you'd handle a fraud situation yourself instead of escalating",
      "Not knowing what GTBank actually does or their recent news",
      "Arriving late or dressing casually",
      "Speaking badly about previous employers or colleagues",
      "Saying you want to leave banking after 2 years — they invest in the ELP",
    ],
    salaryRange: "₦150,000 – ₦250,000/month entry level (2026)",
    programName: "Entry Level Programme (ELP)",
    insiderTips: [
      "The CBT is the first filter — practice banking aptitude tests on examplify.ng",
      "GTBank recruits in batches — applications open multiple times a year, not once",
      "The essay in round 2 tests written communication — short sentences, clear structure wins",
      "Panel interviewers often include a psychologist — body language matters",
      "GTCO owns Squad (payments app) — know this product, they love when candidates reference it",
    ],
  },
  {
    id: "access_bank",
    name: "Access Bank",
    sector: "Banking",
    type: "bank",
    size: "large",
    culture: "Aggressive growth culture. Access Bank acquired Diamond Bank and expanded continent-wide. They want ambitious people who want to move fast. Less conservative than GTBank, more performance-driven. They will work you hard.",
    hiringProcess: [
      "Online Application — choose ONE track only (Graduate, Retail, or Tech)",
      "Aptitude Test — Verbal, Numerical, Abstract Reasoning",
      "Psychometric Assessment — heavily tests honesty and integrity",
      "Assessment Centre — group exercises, presentations, case studies",
      "Panel Interview",
      "Final HR Interview",
      "4-month intensive training programme",
    ],
    requirements: [
      "Minimum Second Class Lower (2:2)",
      "NYSC discharge certificate",
      "Maximum age 26",
      "Must have a working laptop and reliable internet",
      "Willingness to relocate anywhere in Nigeria",
      "Apply to ONE track only — multiple applications lead to automatic disqualification",
    ],
    realQuestions: [
      "Why did you choose the Graduate/Retail/Tech track specifically?",
      "Describe a time you demonstrated leadership without a formal title",
      "Tell me about a time you failed and what you learned",
      "How do you handle competing priorities and tight deadlines?",
      "What do you know about Access Bank's expansion across Africa?",
      "Where do you see banking in 5 years? What's your role in that?",
      "Have you ever been in a situation where you were asked to do something unethical? What did you do?",
    ],
    whatTheyWant: [
      "Proven ambition — they want people who want to grow fast",
      "Integrity — psychometric test is serious, inconsistent answers get flagged",
      "Pan-African awareness — know about their operations in Kenya, Ghana, UK",
      "Fast learning ability — training is intense, they want coachable people",
      "Resilience — they will ask about failure and how you bounced back",
    ],
    whatKillsYou: [
      "Applying to multiple tracks — instant disqualification, they check",
      "Failing the psychometric — don't try to game it, just answer honestly",
      "Not researching their Africa expansion strategy",
      "Saying you're not willing to relocate",
      "Weak answers on failure — they want genuine reflection, not spin",
    ],
    salaryRange: "₦180,000 – ₦280,000/month entry level (2026)",
    programName: "Entry Level Training Programme (ELTP)",
    insiderTips: [
      "The psychometric test has trap questions — answer the same way on similar questions, they check for consistency",
      "Choose the Tech track if you have any coding or digital skills — smaller applicant pool",
      "Assessment centre group exercises: speak up early, but also listen — they watch team dynamics",
      "Know about Access Bank's Herbert Wigwe — their former CEO who died in 2024, a revered figure internally",
      "They place a premium on commercial acumen — understand basic financial products before you go in",
    ],
  },
  {
    id: "zenith_bank",
    name: "Zenith Bank",
    sector: "Banking",
    type: "bank",
    size: "large",
    culture: "Performance-oriented, data-driven, and results-focused. Zenith was founded on the principle that banking should be about profitability and efficiency. Formal culture, strong number focus. Analytics and financial modeling skills stand out.",
    hiringProcess: [
      "Online aptitude test — strong quantitative component",
      "HR screening interview",
      "Technical/competency panel",
      "Final executive interview",
      "Graduate Trainee Programme",
    ],
    requirements: [
      "Minimum 2:2",
      "NYSC discharge",
      "Not older than 26 at entry",
      "Strong numerical aptitude required",
    ],
    realQuestions: [
      "Walk me through your understanding of basic financial statements",
      "How would you convince a reluctant customer to open an account?",
      "Describe a time you used data to make a decision",
      "What do you know about Zenith Bank's digital banking strategy?",
      "How do you prioritize when given multiple urgent tasks?",
    ],
    whatTheyWant: [
      "Numerical sharpness — stronger quant focus than most banks",
      "Sales mindset — they want people who can bring in deposits and accounts",
      "Professionalism and poise under pressure",
      "Technology awareness — know about ZenithDirect, their mobile banking",
    ],
    whatKillsYou: [
      "Weak quantitative performance in the aptitude test",
      "No commercial awareness — not knowing what a bank actually earns money from",
      "Appearing passive or waiting to be told what to do",
    ],
    salaryRange: "₦160,000 – ₦260,000/month entry level (2026)",
    programName: "Graduate Trainee Programme",
    insiderTips: [
      "Zenith's aptitude test is harder than most banks — prep specifically for financial calculations",
      "They like when candidates know their share price and recent financials",
      "Dress very formally — Zenith culture is old-school corporate",
    ],
  },
  {
    id: "uba",
    name: "United Bank for Africa (UBA)",
    sector: "Banking",
    type: "bank",
    size: "large",
    culture: "Pan-African, customer-obsessed culture. UBA operates in 20+ African countries. They want people who think big geographically and have genuine customer empathy. Their brand promise is 'The Bank of Africa' — internalize this.",
    hiringProcess: [
      "Online aptitude and IQ test",
      "Video interview — recorded, AI-assessed in first round",
      "HR interview",
      "Competency-based panel interview",
      "UBA Business School training",
    ],
    requirements: [
      "Minimum 2:2",
      "NYSC discharge",
      "Maximum age 27 (slightly more flexible than others)",
      "Pan-African mindset is a plus",
    ],
    realQuestions: [
      "Why UBA and not GTBank or Access Bank?",
      "How would you handle a customer who is angry about a failed transaction?",
      "Tell me about a time you went above and beyond for someone",
      "What does pan-African banking mean to you?",
      "Where in Africa would you be willing to work?",
    ],
    whatTheyWant: [
      "Genuine customer empathy — not scripted service, real care",
      "Continental ambition — willingness to work outside Nigeria",
      "Initiative — UBA values people who do more than what's asked",
      "Adaptability — operating in 20+ countries means constant change",
    ],
    whatKillsYou: [
      "Only wanting to work in Lagos — they operate across Africa",
      "Robotic customer service answers — they want genuine warmth",
      "Not knowing UBA operates outside Nigeria",
    ],
    salaryRange: "₦150,000 – ₦240,000/month entry level (2026)",
    programName: "UBA Business School Graduate Programme",
    insiderTips: [
      "The video interview is AI-scored — speak clearly, pause between sentences, maintain eye contact with camera",
      "UBA loves community involvement stories — mention any volunteer or social impact work",
      "They actively post on LinkedIn — follow their page and reference recent news",
    ],
  },

  // ─── FINTECH ─────────────────────────────────────────────
  {
    id: "flutterwave",
    name: "Flutterwave",
    sector: "Fintech",
    type: "fintech",
    size: "large",
    culture: "Startup energy with scale. Flutterwave processes billions in payments across Africa. Fast-paced, product-thinking culture. They don't care much about your GPA — they care if you can think, build, and execute. Remote-friendly. Younger team.",
    hiringProcess: [
      "Online application — no aptitude test, just CV and cover letter",
      "Recruiter screening call — 15-30 minutes",
      "Hiring manager interview — conversational, practical questions",
      "Take-home task or case study (for some roles)",
      "Final team interview",
    ],
    requirements: [
      "Graduated December 2020 or later",
      "Less than 16 months of total work experience",
      "No minimum CGPA requirement",
      "Open to all disciplines — not just finance",
    ],
    realQuestions: [
      "Tell us about yourself — focus on what you've built or created, not your GPA",
      "Describe a product you use daily and how you would improve it",
      "Tell me about a time you took initiative without being asked",
      "How do you stay current with trends in payments and African fintech?",
      "What does financial inclusion mean to you personally?",
      "Give an example of a time you failed fast and pivoted",
      "What's broken about payments in Africa and how would you fix it?",
    ],
    whatTheyWant: [
      "Product thinking — can you spot problems and imagine solutions?",
      "Pan-African awareness — know the payments landscape: M-Pesa, MTN MoMo, Paystack",
      "Initiative and ownership — people who act without waiting to be told",
      "Curiosity — they want people who read, explore, and experiment",
      "Startup mentality — comfortable with ambiguity and fast change",
    ],
    whatKillsYou: [
      "Focusing on your CGPA or academic performance — they don't care",
      "Not knowing what Flutterwave actually does or their recent news",
      "Conservative or risk-averse answers — this isn't GTBank",
      "Saying you want stability over growth",
      "Not having any projects, side hustles, or things you've built",
    ],
    salaryRange: "₦350,000 – ₦600,000/month (2026) + equity for some roles",
    programName: "Graduate Programme (12 months, monthly stipend, 85% conversion to full-time)",
    insiderTips: [
      "Flutterwave interviews feel like conversations — be relaxed and genuine",
      "They love candidates who mention specific Flutterwave products: Flutterwave Store, Send App, Barter",
      "If you have side projects, freelance work, or have built anything — lead with that",
      "They care about financial inclusion — have a genuine opinion on it, not a textbook answer",
      "The take-home task matters more than the interview for some tracks — take it seriously",
    ],
  },
  {
    id: "paystack",
    name: "Paystack (Stripe subsidiary)",
    sector: "Fintech",
    type: "fintech",
    size: "medium",
    culture: "Elite engineering culture. Paystack was acquired by Stripe for $200M+ and inherited Stripe's obsession with craft and quality. Small team, exceptionally high bar. They want people who sweat the details and care deeply about their work.",
    hiringProcess: [
      "Application with portfolio or work samples required",
      "Initial technical/skills screening",
      "Multiple interview rounds — usually 3-5",
      "Work sample or take-home project",
      "Values and culture interview",
    ],
    requirements: [
      "Portfolio or demonstrated work is more important than degree",
      "Technical roles require strong coding ability",
      "No explicit CGPA requirement — performance matters",
      "English communication must be exceptional",
    ],
    realQuestions: [
      "Walk me through something you built and the decisions you made",
      "What's the hardest technical/design problem you've solved?",
      "How do you approach making something simple for users?",
      "Tell me about a time you disagreed with a decision and what you did",
      "What's broken about a product you use and how would you fix it?",
    ],
    whatTheyWant: [
      "Craft and quality — they want people who care about doing things properly",
      "Strong communication — written communication is tested heavily",
      "Autonomous workers — people who research problems deeply before asking",
      "High standards — they want people who are never satisfied with 'good enough'",
      "Intellectual curiosity — they want readers and thinkers",
    ],
    whatKillsYou: [
      "No portfolio or proof of work",
      "Poor written English — they communicate primarily in writing",
      "Not caring about product quality",
      "Expecting to be onboarded slowly — Paystack moves fast",
    ],
    salaryRange: "₦500,000 – ₦1,200,000/month (2026) — top of market",
    insiderTips: [
      "Apply with your best work — a GitHub with real projects or a strong portfolio",
      "Paystack blog posts reveal their thinking — read them before any interview",
      "They are remote-first but Lagos-headquartered",
      "Stripe connection matters — understand how Stripe operates globally",
      "Their bar is extremely high — if you don't get in now, improve and reapply in 1 year",
    ],
  },
  {
    id: "kuda",
    name: "Kuda Bank",
    sector: "Fintech",
    type: "fintech",
    size: "medium",
    culture: "Aggressive, consumer-obsessed, and challenger-brand energy. Kuda was built specifically to disrupt Nigerian banking. They hate bureaucracy and love speed. Young team, very digital-native. They want people who hate how traditional banks treat customers.",
    hiringProcess: [
      "Application with CV",
      "Skills assessment or take-home task",
      "Interview rounds — 2-3 rounds",
      "Values interview",
    ],
    requirements: [
      "Experience or projects in relevant area",
      "Strong alignment with challenger bank mentality",
      "Remote-friendly roles available",
    ],
    realQuestions: [
      "What do you hate about traditional Nigerian banks?",
      "Tell me about a product decision you disagreed with and what happened",
      "How would you acquire your first 10,000 users with zero marketing budget?",
      "Describe a time you delivered something faster than expected",
    ],
    whatTheyWant: [
      "Genuine frustration with traditional banking — they want believers in their mission",
      "Speed and execution — ideas without action mean nothing here",
      "Digital nativity — understand mobile-first consumer behaviour",
      "Commercial thinking — how does this make or save money?",
    ],
    whatKillsYou: [
      "Saying you want to work at a bank because it's stable — wrong culture entirely",
      "Being slow or indecisive in your answers",
      "Not using Kuda or knowing their product deeply",
    ],
    salaryRange: "₦300,000 – ₦700,000/month (2026)",
    insiderTips: [
      "Download and use Kuda before applying — reference specific features you like or want improved",
      "They move fast in hiring — if they like you, you'll know within a week",
      "Growth roles here require hustle — Lagos street-smart thinking combined with data",
    ],
  },

  // ─── TELECOM ──────────────────────────────────────────────
  {
    id: "mtn_nigeria",
    name: "MTN Nigeria",
    sector: "Telecoms",
    type: "telecom",
    size: "large",
    culture: "Strategic, data-driven, and increasingly tech-forward. MTN is evolving from a traditional telecom into a fintech company (MoMo PSB) and digital services provider. They want people who understand both the technical and commercial sides of telecoms.",
    hiringProcess: [
      "Online application and CV screening",
      "Aptitude test — logical reasoning, data interpretation, strictly timed",
      "Group presentation — team exercise assessed by panel",
      "Panel interview with 3 judges — structured competency questions",
      "HR final interview",
    ],
    requirements: [
      "Minimum Second Class Upper (2:1) — higher bar than banks",
      "NYSC discharge certificate",
      "Strong analytical and numerical skills",
      "Understanding of telecoms and digital services",
    ],
    realQuestions: [
      "What do you know about MTN Nigeria? — Know: 5G rollout, MoMo PSB, subscriber base (78M+), Ayoba app",
      "Where do you see telecoms in Nigeria in 5 years?",
      "Walk me through a time you analyzed data to solve a problem",
      "How would you improve MTN's customer retention?",
      "Tell me about a team project where you had to lead without authority",
      "What is the competitive threat to MTN from fintech companies?",
    ],
    whatTheyWant: [
      "Deep company research — they test this aggressively, surface knowledge is not enough",
      "Strategic thinking — they want people who see the bigger picture",
      "Data fluency — comfort with numbers and interpreting trends",
      "Commercial awareness — understand revenue streams, ARPU, churn",
      "Team leadership capability — group exercise is a major filter",
    ],
    whatKillsYou: [
      "Not knowing MTN's key metrics (subscriber count, 5G rollout, MoMo PSB details)",
      "Poor performance in the group presentation — being passive or domineering",
      "Weak aptitude test scores — this is a hard filter",
      "Generic answers about telecoms — they want MTN-specific thinking",
    ],
    salaryRange: "₦250,000 – ₦450,000/month entry level (2026)",
    programName: "MTN Graduate Trainee Programme",
    insiderTips: [
      "Study MTN's annual report before the interview — know their revenue figures and strategy",
      "The group exercise: take a leadership role early but demonstrate listening too",
      "MoMo PSB is their fintech play — they want every candidate to understand this",
      "Ayoba (their messaging app) and Chenosis (API marketplace) are signals of their direction",
      "Know Airtel and Glo's strategies too — they will ask about competitive landscape",
    ],
  },
  {
    id: "airtel_nigeria",
    name: "Airtel Nigeria",
    sector: "Telecoms",
    type: "telecom",
    size: "large",
    culture: "Leaner and more agile than MTN. Airtel Nigeria is part of the pan-African Airtel Africa group. Entrepreneurial spirit within a large corporate. They value speed to market and commercial hustle.",
    hiringProcess: [
      "Online application",
      "Aptitude test",
      "HR phone screen",
      "Panel interview",
      "Final offer",
    ],
    requirements: [
      "Minimum 2:2",
      "NYSC discharge",
      "Commercial or technical background preferred",
    ],
    realQuestions: [
      "Why Airtel over MTN?",
      "How would you grow Airtel Money penetration in rural Nigeria?",
      "Describe a time you executed a project with limited resources",
      "What do you know about Airtel Africa's financial services strategy?",
    ],
    whatTheyWant: [
      "Commercial hustle — they are always competing against MTN",
      "Pan-African mindset — Airtel operates across 14 African countries",
      "Execution focus — they want doers, not planners",
    ],
    whatKillsYou: [
      "Not being able to articulate why Airtel specifically",
      "Knowing nothing about their Airtel Money product",
    ],
    salaryRange: "₦220,000 – ₦380,000/month entry level (2026)",
    insiderTips: [
      "Airtel is often less competitive than MTN to enter — same quality of experience",
      "Know Airtel Money — this is their growth engine",
    ],
  },

  // ─── CONSULTING ───────────────────────────────────────────
  {
    id: "kpmg_nigeria",
    name: "KPMG Nigeria",
    sector: "Professional Services / Consulting",
    type: "consulting",
    size: "large",
    culture: "Rigorous, client-first, and detail-obsessed. KPMG Nigeria is one of the Big Four. They expect excellence in written and spoken communication, structured thinking, and the ability to handle ambiguity. Very formal culture, long hours, fast learning curve.",
    hiringProcess: [
      "Online application with CV, cover letter, and sometimes a video",
      "Online aptitude tests — numerical, verbal, logical, situational judgment",
      "First round interview — competency based",
      "Partner or Director interview",
      "Offer and background checks",
    ],
    requirements: [
      "Minimum 2:1",
      "NYSC discharge",
      "Strong academic record throughout",
      "Accounting or finance background preferred for audit/tax, but not mandatory",
    ],
    realQuestions: [
      "Why consulting? Why KPMG over Deloitte or PwC?",
      "Walk me through a time you solved a complex problem with limited information",
      "Describe a situation where you had to persuade someone who disagreed with you",
      "Tell me about a time you managed multiple deadlines simultaneously",
      "What does the Nigerian economy need to grow in the next decade?",
      "How do you handle receiving critical feedback?",
    ],
    whatTheyWant: [
      "Structured communication — think out loud in frameworks",
      "Intellectual rigor — they want sharp, analytical thinkers",
      "Client service instinct — everything is about delivering for clients",
      "Resilience — the work is demanding and they need people who can handle it",
      "Attention to detail — a misplaced decimal in audit has real consequences",
    ],
    whatKillsYou: [
      "Vague, unstructured answers — use STAR or structured frameworks",
      "Not knowing the difference between KPMG's service lines (Audit, Tax, Advisory)",
      "Weak numerical aptitude",
      "Being unable to explain your CV clearly and concisely",
    ],
    salaryRange: "₦200,000 – ₦350,000/month entry level (2026)",
    insiderTips: [
      "The situational judgment test is about professional ethics — don't overthink, choose the most ethical answer",
      "KPMG Nigeria recruits through their campus programmes — stay connected with your campus rep",
      "Advisory is the most competitive service line — Audit is usually the largest intake",
      "The partner interview is conversational — they want to see if they can put you in front of a client",
    ],
  },

  // ─── OIL & GAS ────────────────────────────────────────────
  {
    id: "nnpc",
    name: "NNPC / Nigerian National Petroleum Company",
    sector: "Oil & Gas",
    type: "oil_gas",
    size: "large",
    culture: "Process-heavy, government-influenced, hierarchical. NNPC is Nigeria's national oil company, recently corporatised. Political awareness matters here. The culture is formal and seniority-driven. Change is slow but the scale is massive.",
    hiringProcess: [
      "Competitive national examination (written)",
      "Oral interview",
      "Medical examination",
      "Background and reference checks",
      "Federal Character requirements — quota system by state of origin",
    ],
    requirements: [
      "Minimum 2:1 for professional roles",
      "NYSC discharge",
      "State of origin document — Federal Character quota system applies",
      "Engineering, sciences, or accounting background preferred",
      "No age restriction stated but typically under 30 preferred",
    ],
    realQuestions: [
      "What do you know about Nigeria's oil production capacity?",
      "How would you contribute to NNPC's commercialisation goals?",
      "Tell me about the Petroleum Industry Act (PIA) and what it means for NNPC",
      "Where do you see Nigerian energy in 20 years?",
      "Describe your technical or professional background relevant to this role",
    ],
    whatTheyWant: [
      "Technical competence — especially for engineering roles",
      "National consciousness — you're working for Nigeria's oil wealth",
      "Knowledge of the PIA and energy transition debates",
      "Patience and long-term thinking — careers here are long",
    ],
    whatKillsYou: [
      "Not knowing the Petroleum Industry Act (PIA) — it's the biggest recent change to the sector",
      "Federal Character issues — your state of origin affects your competitive position",
      "Expecting fast-paced startup culture — this is government-style",
    ],
    salaryRange: "₦300,000 – ₦600,000/month entry level (2026) + significant allowances",
    insiderTips: [
      "Federal Character quota means your state of origin is a real factor — research how competitive your state is",
      "Know the PIA inside out — it restructured NNPC into a commercial entity",
      "NNPC roles offer housing, transport, and medical allowances that significantly increase total compensation",
    ],
  },

  // ─── FMCG ─────────────────────────────────────────────────
  {
    id: "unilever_nigeria",
    name: "Unilever Nigeria",
    sector: "FMCG",
    type: "fmcg",
    size: "large",
    culture: "Purpose-driven, innovation-oriented, and consumer-obsessed. Unilever Nigeria runs Omo, Lipton, Close-Up, Vaseline, and more. They want people who understand Nigerian consumers deeply and can innovate within constraints. Global career path available.",
    hiringProcess: [
      "Online application",
      "Online digital interview (video questions)",
      "Discovery Centre / Assessment Centre — 1-2 day immersive assessment",
      "Final panel interview",
    ],
    requirements: [
      "Minimum 2:1",
      "NYSC discharge",
      "All disciplines considered",
      "Passion for consumer goods and marketing",
    ],
    realQuestions: [
      "Pick a Unilever product and tell me how you would re-launch it for Gen Z Nigerians",
      "Describe a time you had to understand a group of people different from yourself",
      "How would you grow Omo's market share in Northern Nigeria?",
      "Tell me about a time you failed at something and what you did differently",
      "What do you think is the next big trend in Nigerian consumer behaviour?",
    ],
    whatTheyWant: [
      "Consumer empathy — can you understand people who are different from you?",
      "Commercial creativity — combining imagination with business reality",
      "Leadership potential — Unilever builds future managers",
      "Sustainability awareness — Unilever's brand is tied to their sustainability commitments",
    ],
    whatKillsYou: [
      "Not knowing Unilever's product portfolio in Nigeria",
      "Generic marketing answers without Nigerian market specifics",
      "No evidence of leadership or initiative in university",
    ],
    salaryRange: "₦250,000 – ₦450,000/month entry level (2026)",
    programName: "Unilever Future Leaders Programme (UFLP)",
    insiderTips: [
      "The Discovery Centre is intense — you'll do case studies, presentations, and role plays in one day",
      "They love candidates who've done community leadership or student union roles",
      "Unilever's global programme means you could eventually rotate to Ghana, Kenya, or Europe",
      "Research their sustainability commitments (Unilever Compass) — they ask about this",
    ],
  },
  {
    id: "nestle_nigeria",
    name: "Nestlé Nigeria",
    sector: "FMCG",
    type: "fmcg",
    size: "large",
    culture: "Structured, quality-obsessed, and long-term. Nestlé Nigeria makes Milo, Maggi, Golden Morn, and more. Swiss parent company culture means discipline and process. Less entrepreneurial than fintech, but excellent training and career development.",
    hiringProcess: [
      "Online application",
      "Aptitude test",
      "HR interview",
      "Line manager interview",
      "Graduate Trainee Programme onboarding",
    ],
    requirements: [
      "Minimum 2:1",
      "NYSC discharge",
      "Science, engineering, or business background preferred",
    ],
    realQuestions: [
      "How would you improve Milo's relevance to Nigerian teenagers today?",
      "Tell me about a time you ensured quality under pressure",
      "What do you know about food safety and regulatory requirements in Nigeria?",
      "Describe a time you influenced people without formal authority",
    ],
    whatTheyWant: [
      "Quality mindset — Nestlé is obsessed with product quality and safety",
      "Consumer insight — deep understanding of Nigerian eating and drinking habits",
      "Discipline and attention to process",
      "Nutrition and health awareness — their brand is shifting toward healthier products",
    ],
    whatKillsYou: [
      "Not knowing their Nigerian product range",
      "Loose, imprecise communication — Nestlé values exactness",
    ],
    salaryRange: "₦230,000 – ₦400,000/month entry level (2026)",
    programName: "Nestlé Nigeria Graduate Trainee Programme",
    insiderTips: [
      "Nestlé's Swiss culture means punctuality is non-negotiable — arrive 15 minutes early",
      "They have a strong internal promotion culture — people spend 10-15 years here",
      "Supply chain and engineering roles are often easier to get in than marketing",
    ],
  },

  // ─── TECH ─────────────────────────────────────────────────
  {
    id: "interswitch",
    name: "Interswitch",
    sector: "Payments / Tech",
    type: "tech",
    size: "large",
    culture: "Engineering-driven, payments-infrastructure focused. Interswitch built the backbone of Nigerian payments — Verve card, Quickteller, the interbank switching network. Less flashy than Flutterwave but arguably more critical infrastructure. They value deep technical competence.",
    hiringProcess: [
      "Online application",
      "Technical assessment (for engineering roles)",
      "Panel interview",
      "HR interview",
    ],
    requirements: [
      "Technical roles: Strong coding ability required",
      "Engineering, computer science, or related degree preferred",
      "NYSC discharge",
    ],
    realQuestions: [
      "What do you know about payment switching and how it works in Nigeria?",
      "Walk me through a technical project you're proud of",
      "How would you improve Quickteller's user experience?",
      "Tell me about a bug you found and how you fixed it",
    ],
    whatTheyWant: [
      "Deep technical skills — this is an infrastructure company",
      "Understanding of payments ecosystem — NIP, NIBSS, card processing",
      "Problem solvers who like systems thinking",
    ],
    whatKillsYou: [
      "Weak technical skills for engineering roles",
      "Not understanding how Nigerian payments infrastructure actually works",
    ],
    salaryRange: "₦280,000 – ₦600,000/month (2026)",
    insiderTips: [
      "Interswitch is less known than Flutterwave but pays competitively and offers stability",
      "They process millions of transactions daily — systems reliability is their religion",
      "Know what NIBSS does and how it connects to Interswitch",
    ],
  },
]

export function getCompanyById(id: string): CompanyProfile | undefined {
  return COMPANIES.find((c) => c.id === id)
}

export function getCompaniesBySector(sector: string): CompanyProfile[] {
  return COMPANIES.filter((c) => c.sector.toLowerCase().includes(sector.toLowerCase()))
}

export function getCompanyByType(type: CompanyProfile["type"]): CompanyProfile[] {
  return COMPANIES.filter((c) => c.type === type)
}
