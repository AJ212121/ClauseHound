# ClauseHound

**AI-Powered Contract Risk Analysis**

ClauseHound is a modern web app that provides instant, professional contract risk analysis, safer clause alternatives, and negotiation strategies—powered by advanced AI. Designed for freelancers, agencies, and businesses seeking executive-level legal insights in minutes.

---

## 🚀 Features
- **Upload Contracts:** PDF/DOCX upload with drag-and-drop
- **AI Risk Analysis:** Executive summary, clause-by-clause risk, actionable recommendations
- **Safer Alternatives:** Instantly rewrite risky clauses with AI
- **Professional UI/UX:** Modern, accessible, and mobile-friendly design
- **PDF Export:** Download full analysis or rewritten contract as PDF
- **Copy to Clipboard:** One-click copy for any clause or rewritten contract
- **Jurisdiction & Context:** Select from 15+ global legal jurisdictions, roles, and project types
- **Accessibility:** Keyboard navigation, ARIA labels, color contrast, and screen reader support

---

## 🛠️ Tech Stack
- **React** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (utility-first styling)
- **react-select** (custom dropdowns)
- **OpenAI API** (AI contract analysis)
- **html2pdf.js** (PDF export)
- **pdfjs-dist** (PDF parsing)

---

## ⚡ Getting Started

### 1. **Install dependencies**
```bash
npm install
```

### 2. **Set up environment variables**
Create a `.env` file with your OpenAI API key:
```
VITE_OPENAI_API_KEY=your-openai-key-here
```

### 3. **Run locally**
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173)

### 4. **Build for production**
```bash
npm run build
```
Output is in the `dist/` folder.

---

## 🌍 Deployment

### **Vercel / Netlify / Static Hosting**
- Deploy the `dist/` folder as a static site.
- Set the `VITE_OPENAI_API_KEY` environment variable in your host's dashboard.
- For Vercel/Netlify: drag-and-drop the folder or connect your repo for CI/CD.

---

## ♿ Accessibility & UX Highlights
- Keyboard navigation for all interactive elements
- ARIA labels and roles for screen readers
- High color contrast and focus indicators
- Responsive/mobile-friendly layout
- Animated feedback for uploads, actions, and modals

---

## 🤝 Contact & Support
- **Questions or issues?** Open an issue or email: [support@clausehound.com](mailto:support@clausehound.com)
- **Contributions:** PRs and suggestions welcome!

---

© ClauseHound. For educational use only. Not a substitute for legal advice.
