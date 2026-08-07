# SafeRoute AI 🌊🗺️

**AI-powered flood-aware travel routing** — Navigate urban flooding with confidence using Google Gemini 2.5 Flash.

SafeRoute AI analyzes your travel requests in natural language and provides intelligent flood risk assessments, safer route alternatives, actionable safety tips, and an interactive conversational assistant for follow-up questions.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-orange)](https://ai.google.dev/)

---

## 🚀 Features

✅ **Natural Language Processing** — Describe your journey naturally: "I need to travel from Salt Lake to Park Street around 6 PM"  
✅ **Flood Risk Assessment** — Get real-time risk levels (Safe, Moderate, High, Critical)  
✅ **Alternative Route Suggestions** — Avoid flooded roads with AI-powered detour recommendations  
✅ **Safety Guidance** — Receive actionable travel tips tailored to your specific route  
✅ **Conversational Follow-Ups** — Ask follow-up questions about your route using an intelligent chat assistant  
✅ **Animated UI** — Smooth split-flap text effects, WebGL wave backgrounds, and responsive design  
✅ **TypeScript** — Fully typed codebase with strict type checking  

---

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **Google Gemini API Key** (free tier available at [Google AI Studio](https://aistudio.google.com/app/apikey))

---

## ⚡ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/sneha-codes07/Safe-Route-AI.git
cd Safe-Route-AI
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
```

> **⚠️ Security Note:** Never commit `.env.local` or any file containing your API key to Git. The `.gitignore` file already excludes `.env*` files.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Structure

```
saferoute-ai/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with SearchFlowProvider
│   ├── page.tsx              # Main page (idle/loading/results state machine)
│   └── globals.css           # Global styles + CSS variables
├── components/               # React components
│   ├── hero/                 # Hero section with animated headline
│   ├── home/                 # Landing page sections (About, How It Works)
│   ├── layout/               # Layout components (Navbar, Footer, AppShell, AnimatedBackground)
│   ├── results/              # Results view (RouteRecommendation, SafetyAdvice, Chat, Timeline)
│   ├── search/               # Search UI (SearchCard, LoadingExperience, SearchFlowContext)
│   └── ui/                   # Reusable UI primitives (Button, Card, Input, SplitFlapText, LineWaves, etc.)
├── lib/                      # Core utilities
│   ├── gemini.ts             # Gemini API initialization
│   ├── parser.ts             # Parse + sanitize Gemini JSON responses
│   ├── validator.ts          # Validate + map AI responses to typed RouteAnalysis
│   ├── mockData.ts           # Fallback mock data (used when AI fails)
│   └── utils.ts              # Utility functions (cn for className merging)
├── services/                 # Server Actions ("use server")
│   ├── routeAnalysis.ts      # Main route analysis server action
│   └── chatAnalysis.ts       # Follow-up chat server action
├── types/                    # TypeScript types
│   ├── route.ts              # RouteAnalysis, RiskLevel, TimelineStep
│   ├── chat.ts               # ConversationMessage, ConversationRequest, ConversationResponse
│   └── ai.ts                 # GeminiRouteAnalysis (raw AI response schema)
├── public/                   # Static assets
├── .env.example              # Environment variable template
├── .gitignore                # Git ignore patterns
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16.3 (App Router) |
| **Language** | TypeScript 5 (strict mode) |
| **UI Library** | React 19.2 |
| **AI Model** | Google Gemini 2.5 Flash |
| **Styling** | Tailwind CSS 4 + CSS Variables |
| **Animation** | Framer Motion 13 + GSAP 3 |
| **WebGL** | OGL (LineWaves background) |
| **Type Safety** | Zod (runtime validation) |
| **Testing** | Vitest + React Testing Library |

---

## 📖 Usage Guide

### Basic Route Analysis

1. Enter your travel request in natural language:
   ```
   "I need to go from downtown to the airport at 3 PM"
   ```

2. Click **Analyze Route**

3. View comprehensive results:
   - **Risk Level**: Safe / Moderate / High / Critical
   - **Travel Time**: Estimated duration with delays
   - **Roads to Avoid**: Flooded or high-risk roads
   - **Safe Route Steps**: Turn-by-turn guidance
   - **Safety Tips**: Context-specific advice
   - **Interactive Timeline**: Visual route breakdown

### Follow-Up Questions

After receiving route analysis, use the chat panel to ask:
- "What if I leave 2 hours later?"
- "Are there any alternate routes via the highway?"
- "What gear should I bring?"
- "Is public transport safer?"

The AI assistant maintains context of your current route and provides relevant answers.

---

## 🔒 Security Best Practices

✅ **API keys are server-side only** — Gemini SDK runs in Server Actions, keys never exposed to client  
✅ **Input validation** — All user inputs sanitized before AI processing  
✅ **Error sanitization** — Detailed errors logged server-side, generic messages shown to users  
✅ **Type safety** — Zod schemas validate all AI responses at runtime  
✅ **Rate limiting** — Per-session request throttling prevents abuse  

---

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variable:
   - Key: `GOOGLE_GENERATIVE_AI_API_KEY`
   - Value: Your Gemini API key
4. Deploy

### Deploy to other platforms

Ensure your platform supports:
- Node.js 18+
- Environment variables
- Server-side rendering (SSR)

Set the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable in your platform's settings.

---

## 🐛 Troubleshooting

### "API Key configuration error"

**Cause:** Missing or invalid `GOOGLE_GENERATIVE_AI_API_KEY`

**Solution:**
1. Verify `.env.local` exists and contains your key
2. Restart the dev server (`npm run dev`)
3. Check that your API key is active at [Google AI Studio](https://aistudio.google.com/app/apikey)

### AI returns mock data / "Fallback warning"

**Cause:** Gemini API timeout, rate limit, or malformed response

**Solution:**
- Check your internet connection
- Verify API key quota at Google AI Studio
- Simplify your query and try again
- Check browser console and server logs for detailed errors

### Build fails with TypeScript errors

**Cause:** Type mismatch or missing dependencies

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Development workflow:**
- Run `npm run lint` before committing
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

**Sneha** — [@sneha-codes07](https://github.com/sneha-codes07)

---

## 🙏 Acknowledgments

- **Google Gemini** — AI model powering route analysis
- **React Bits** — SplitFlapText, LineWaves, MagicBento components
- **Hack2Skill** — Hosting the hackathon challenge
- **Next.js Team** — Amazing framework

---

## 📬 Contact

For questions or support, open an issue on [GitHub](https://github.com/sneha-codes07/Safe-Route-AI/issues).

---

**Made with ❤️ for safer urban travel during flooding**
