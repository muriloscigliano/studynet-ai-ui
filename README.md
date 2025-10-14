# StudyNet AI - UI Implementation

A modern, animated chat interface built with Astro, React, and GSAP. This UI is ready for AI backend integration.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Astro](https://img.shields.io/badge/Astro-4.x-orange)
![React](https://img.shields.io/badge/React-18.x-blue)
![GSAP](https://img.shields.io/badge/GSAP-3.x-green)

## 🎨 Live Demo

**Production:** [View Live Site](https://studynet-ai-pn5vnrnvb-murilosciglianos-projects.vercel.app)

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Pages & Components](#pages--components)
- [Animations (GSAP)](#animations-gsap)
- [Theming System](#theming-system)
- [AI Integration Guide](#ai-integration-guide)
- [Deployment](#deployment)
- [Font Setup](#font-setup)

---

## 🎯 Overview

This is a **UI-only implementation** of StudyNet AI chat interface. The design includes:

- ✅ Modern chat interface with animated entrance
- ✅ Pricing page with two plan options
- ✅ Dark/light theme support (system preference + manual toggle)
- ✅ SPA-style navigation (no page reloads)
- ✅ Smooth GSAP animations
- ✅ Pure CSS architecture (no Tailwind)
- ✅ Fully responsive design
- ✅ Production-ready on Vercel

**⚠️ Important:** This project contains **NO AI backend**. The chat functionality is a placeholder ready for integration.

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Astro** | 4.x | Static site framework, routing, layouts |
| **React** | 18.x | Interactive components (chat, animations) |
| **TypeScript** | 5.x | Type safety |
| **GSAP** | 3.x | Page entrance animations |
| **Lucide React** | Latest | Icons |
| **Pure CSS** | - | Styling (no frameworks) |

---

## 📁 Project Structure

```
studynet-ai-ui/
├── src/
│   ├── components/
│   │   ├── AnimatedText.tsx        # Split-text animation wrapper
│   │   ├── AppShell.astro          # Sidebar + main layout wrapper
│   │   ├── ChatComposer.tsx        # ⚠️ Chat input (needs AI integration)
│   │   └── PageAnimations.tsx      # GSAP entrance animations
│   │
│   ├── layouts/
│   │   └── Layout.astro            # Base HTML layout + theme script
│   │
│   ├── pages/
│   │   ├── index.astro             # Homepage (chat interface)
│   │   └── pricing.astro           # Pricing page
│   │
│   └── styles/
│       └── global.css              # All styles (pure CSS, variables)
│
├── public/
│   └── fonts/                      # ⚠️ Add Satoshi font files here
│
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/muriloscigliano/studynet-ai-ui.git
cd studynet-ai-ui

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:4321`

---

## 📄 Pages & Components

### **1. Homepage (`src/pages/index.astro`)**

**What it does:**
- Main chat interface
- Hero section with headline and subcopy
- Chat composer (text input)
- Suggestion chips
- "Upgrade Pro Plan" CTA button

**Content managed in:**
```typescript
const suggestions = [...];  // Chip suggestions
const copyItems = [...];    // Hero text
const buttonItems = [...];  // CTA button text
```

**Key features:**
- Uses `<AppShell>` for sidebar
- Loads `<ChatComposer>` React component
- Animated text with blur effect
- SPA navigation to pricing

---

### **2. Pricing Page (`src/pages/pricing.astro`)**

**What it does:**
- Shows two pricing plans (Free and Pro)
- Theme-aware Pro button styling
- No sidebar (full-width content)

**Content managed in:**
```typescript
const freePlan = {
  name: "Free Plan",
  description: "...",
  price: "$0.00",
  features: [...],
  cta: "Use for free"
};

const proPlan = {
  name: "Pro Plan",
  description: "...",
  price: "$9.90",
  period: "/ month",
  features: [...],
  cta: "Upgrade Pro Plan"
};
```

**Styling notes:**
- Pro button: White background in dark mode, primary color in light mode
- All content extracted to constants for easy updates

---

### **3. ChatComposer (`src/components/ChatComposer.tsx`)**

**⚠️ NEEDS AI INTEGRATION**

**Current functionality:**
- Text input with auto-growing textarea
- Send button
- Sparkles and Search icon placeholders
- Enter key to submit

**Placeholder callback:**
```typescript
function onSend(value: string) {
  // TODO: Replace with actual AI API call
  console.log("send:", value);
}
```

**How to integrate AI:**

1. **Add API endpoint** in `src/pages/api/chat.ts`:
```typescript
// Example structure
export async function POST({ request }) {
  const { message } = await request.json();
  
  // Call your AI service (OpenAI, Anthropic, etc.)
  const response = await yourAIService.chat(message);
  
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

2. **Update ChatComposer.tsx**:
```typescript
async function submit() {
  const trimmed = value.trim();
  if (!trimmed) return;
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmed })
    });
    
    const data = await response.json();
    // Handle AI response
    onSend?.(data);
  } catch (error) {
    console.error('Chat error:', error);
  }
  
  setValue("");
}
```

3. **Add conversation state** (recommend using React Context or Zustand)

4. **Create message bubbles** for chat history

---

### **4. AppShell (`src/components/AppShell.astro`)**

**What it does:**
- Wraps pages with persistent sidebar
- Handles SPA-style navigation
- Prevents full page reloads when switching pages

**Navigation script:**
- Intercepts clicks on `[data-navigate]` elements
- Fetches new page content
- Swaps only `<main>` content
- Updates browser URL with `history.pushState`

**To add new pages:**
```astro
<button data-navigate="/new-page">Go to New Page</button>
```

---

## 🎬 Animations (GSAP)

### **PageAnimations (`src/components/PageAnimations.tsx`)**

**Entrance sequence:**

1. **Sidebar** (first visit only)
   - Slides from left
   - Persisted in `localStorage`

2. **Plan pill** (0.4s)
   - Scales up with bounce
   - Easing: `back.out(1.5)`

3. **Headline** (0.5s)
   - Split-text blur reveal (30px → 0px)
   - Staggered by word

4. **Subcopy** (0.5s)
   - Same split-text effect
   - Overlaps with headline

5. **Composer** (0.6s)
   - Rises from bottom
   - Opacity fade

6. **Chips** (0.35s each)
   - Stagger: 0.06s delay
   - Scale + opacity

7. **Plan cards** (0.7s each, pricing page only)
   - Stagger: 0.2s delay
   - Slide up + opacity

**Key code:**
```typescript
// Set initial hidden state (CSS + JS)
gsap.set('.plan-pill', { opacity: 0, scale: 0.8, y: -20 });

// Animate to visible
tl.to('.plan-pill', {
  opacity: 1,
  scale: 1,
  y: 0,
  duration: 0.4,
  ease: 'back.out(1.5)'
});
```

**Preventing flash on navigation:**
- Elements hidden by default in `global.css`
- GSAP sets initial states immediately
- Animations start after 10ms delay

---

### **AnimatedText (`src/components/AnimatedText.tsx`)**

**What it does:**
- Splits text into words
- Animates each word with blur + slide up
- Used for headlines and subcopy

**Usage:**
```tsx
<AnimatedText 
  text="Your headline here" 
  className="headline" 
  delay={0.2} 
  client:load 
/>
```

---

## 🎨 Theming System

### **Implementation (`src/layouts/Layout.astro`)**

**Features:**
- Default: System preference (`prefers-color-scheme`)
- Manual toggle via header button
- Persisted in `localStorage`
- Live updates when OS theme changes

**CSS Variables (`src/styles/global.css`):**
```css
:root {
  /* Dark theme (default) */
  --bg: #111321;
  --panel: #1d1f33;
  --card: #1a1b2c;
  --primary: #9b2064;
  --text: #e9e9ee;
  --muted: #868797;
}

[data-theme="light"] {
  /* Light theme overrides */
  --bg: #ffffff;
  --panel: #f6f7fb;
  --card: #ffffff;
  --text: #0f1222;
  --muted: #6b7280;
}
```

**Theme toggle:**
```javascript
// Stored as: 'light' | 'dark' | 'system'
localStorage.getItem('themePreference');

// Applied to: <html data-theme="dark|light">
```

**Adding new themed colors:**
1. Add variable to `:root` (dark)
2. Add override to `[data-theme="light"]`
3. Use in CSS: `color: var(--your-variable);`

---

## 🤖 AI Integration Guide

### **Step 1: Choose Your AI Provider**

Options:
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Google (Gemini)
- Self-hosted (Llama, Mistral)

### **Step 2: Create API Routes**

Create `src/pages/api/chat.ts`:

```typescript
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message, conversationHistory } = await request.json();
    
    // Example: OpenAI integration
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful study advisor...' },
          ...conversationHistory,
          { role: 'user', content: message }
        ]
      })
    });
    
    const data = await response.json();
    
    return new Response(JSON.stringify({
      message: data.choices[0].message.content,
      timestamp: Date.now()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to process message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### **Step 3: Update ChatComposer**

Add conversation state management:

```typescript
// Create src/store/chat.ts
import { create } from 'zustand';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  clearMessages: () => set({ messages: [] })
}));
```

Update `ChatComposer.tsx`:

```typescript
import { useChatStore } from '../store/chat';

export default function ChatComposer({ onSend }: ChatComposerProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { messages, addMessage } = useChatStore();

  async function submit() {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: trimmed,
      timestamp: Date.now()
    };
    addMessage(userMessage);
    setValue("");
    setLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: trimmed,
          conversationHistory: messages 
        })
      });
      
      const data = await response.json();
      
      // Add AI response
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: data.timestamp
      });
      
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  }
  
  // ... rest of component
}
```

### **Step 4: Create Chat Message Display**

Create `src/components/ChatMessage.tsx`:

```typescript
interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  return (
    <div className={`message message-${role}`}>
      <div className="message-avatar">
        {role === 'user' ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        <p>{content}</p>
        <span className="message-time">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
```

Add styles to `global.css`:

```css
.message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.message-user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--panel);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.message-content {
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: 18px;
  padding: 12px 16px;
  max-width: 600px;
}

.message-user .message-content {
  background: var(--primary);
  color: white;
}

.message-time {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
  display: block;
}
```

### **Step 5: Environment Variables**

Create `.env`:

```bash
# AI Provider API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Rate limiting
RATE_LIMIT_PER_HOUR=100
```

Add to `.gitignore`:
```
.env
.env.local
```

### **Step 6: Add Loading States**

Update composer with loading indicator:

```typescript
{loading && (
  <div className="loading-indicator">
    <span className="loading-dot"></span>
    <span className="loading-dot"></span>
    <span className="loading-dot"></span>
  </div>
)}
```

---

## 🚀 Deployment

### **Vercel (Current)**

**Already configured:**
- Connected to GitHub: `muriloscigliano/studynet-ai-ui`
- Auto-deploys on push to `main`
- Production URL: [View Site](https://studynet-ai-pn5vnrnvb-murilosciglianos-projects.vercel.app)

**Adding environment variables:**
1. Go to Vercel dashboard
2. Project Settings → Environment Variables
3. Add your API keys
4. Redeploy

**Manual deploy:**
```bash
vercel --prod
```

### **Other Platforms**

**Netlify:**
```bash
npm run build
# Deploy ./dist folder
```

**Cloudflare Pages:**
- Build command: `npm run build`
- Build output: `dist`

---

## 🔤 Font Setup

### **Required Files**

The project uses **Satoshi** font (not included due to licensing).

Place these files in `public/fonts/`:
```
public/fonts/
├── Satoshi-Regular.woff2
├── Satoshi-Regular.woff
├── Satoshi-Medium.woff2
└── Satoshi-Medium.woff
```

### **Already Configured**

Font faces are defined in `src/styles/global.css`:

```css
@font-face {
  font-family: "Satoshi";
  src: url("/fonts/Satoshi-Regular.woff2") format("woff2"),
       url("/fonts/Satoshi-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### **Alternative Fonts**

To use a different font:

1. Replace font files in `public/fonts/`
2. Update `@font-face` declarations in `global.css`
3. Update `font-family` in `body` selector

---

## 📝 Scripts

```json
{
  "dev": "astro dev",           // Development server (port 4321)
  "build": "astro build",       // Production build
  "preview": "astro preview",   // Preview production build
  "astro": "astro"             // Astro CLI
}
```

---

## 🎯 Next Steps for AI Integration

### **Priority 1: Core Chat Functionality**
- [ ] Set up AI API endpoint
- [ ] Add conversation state management
- [ ] Create message display components
- [ ] Implement loading states
- [ ] Add error handling

### **Priority 2: Enhanced Features**
- [ ] Conversation history persistence
- [ ] Message editing/deletion
- [ ] Copy message content
- [ ] Code syntax highlighting
- [ ] Markdown rendering

### **Priority 3: Advanced Features**
- [ ] Multi-turn conversations
- [ ] Context awareness
- [ ] Conversation summarization
- [ ] Export conversation
- [ ] Search within chats

### **Priority 4: UX Improvements**
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Auto-scroll to new messages
- [ ] Keyboard shortcuts
- [ ] Voice input (optional)

---

## 🐛 Known Issues

1. **Satoshi fonts missing** - Build warnings are expected until font files are added
2. **Chat is placeholder** - No AI backend connected
3. **No conversation persistence** - Messages clear on refresh
4. **No authentication** - Open to implement

---

## 📚 Documentation Links

- [Astro Documentation](https://docs.astro.build)
- [GSAP Documentation](https://greensock.com/docs/)
- [React Documentation](https://react.dev)
- [Vercel Documentation](https://vercel.com/docs)

---

## 🤝 Handoff Notes

**UI Implementation by:** Murilo Scigliano  
**Status:** ✅ Production-ready UI  
**AI Integration:** ⚠️ Pending  

**What's Complete:**
- ✅ Full responsive design
- ✅ Theme system (dark/light)
- ✅ Smooth animations
- ✅ SPA navigation
- ✅ Component architecture
- ✅ Production deployment

**What Needs Work:**
- ⚠️ AI backend integration
- ⚠️ Message persistence
- ⚠️ User authentication
- ⚠️ Conversation management

**Questions?** Contact: dev@murilo.design

---

## 📄 License

[Your License Here]

---

**Built with ❤️ using Astro, React, and GSAP**
