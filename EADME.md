
# 🧠 Explainer AI — Turn Any Article into a Video You Can Watch

Explainer AI is a tool that helps you **instantly transform long-form content**—like articles, roadmaps, research papers, or documentation—into **short, digestible explainer videos** with AI-generated narration and visuals.

> “Don’t read it. Watch it.”

## ✨ Features

- 🔗 Paste a URL or upload any document (PDF, DOCX, TXT)
- 🧠 Automatically summarizes complex content using LLMs
- 🗣️ Converts AI-generated script to voice using TTS
- 🎞️ Generates short explainer video segments
- 🎥 Simple video player with chapter-style breakdown
- 💾 (Planned) Download or share video content

## 🚀 Demo

Try it live here:  
👉 [https://explainer-ai.vercel.app/](https://explainer-ai.vercel.app/)

> *Paste a link like [https://roadmap.sh/ai-engineer/](https://roadmap.sh/ai-engineer/) to see how it works.*

## 📦 Tech Stack

- **Frontend:** React + Next.js + Tailwind CSS
- **Backend:** Node.js (Planned: Express/Fastify)
- **AI Models:** OpenAI GPT-4 (or local LLaMA/Mixtral via Ollama)
- **TTS:** OpenAI TTS, ElevenLabs, or XTTS (planned)
- **Video Rendering:** Remotion or FFmpeg (in progress)

## 🛠️ Getting Started (Local Development)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/explainer-ai.git
cd explainer-ai
````

### 2. Install dependencies

```bash
npm install
# or
yarn
```

### 3. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## ⚙️ Environment Variables

Create a `.env.local` file and add:

```env
OPENAI_API_KEY=your_openai_api_key
```

> For local LLM or TTS, configure your Ollama/XTTS server setup accordingly.

## 🧩 Roadmap

* [x] Clean UI with URL and file upload
* [x] LLM-powered summarization
* [ ] TTS integration with voice customization
* [ ] Visual suggestion per script section
* [ ] Scene-based video generation (via Remotion)
* [ ] Downloadable video output
* [ ] User login + history (optional)
* [ ] Stripe/Paystack monetization

## 🧪 Example Input

Paste this to test:

```text
https://roadmap.sh/ai-engineer/
```

## 💡 Use Cases

* Students who prefer visual learning
* Professionals who need quick insights
* Content creators converting blogs to video
* Teachers turning documents into explainers

## 🤝 Contributing

PRs welcome! Please open an issue first for major changes.

## 📜 License

[MIT](LICENSE)

## 👤 Author

Built by [Samuel Mintah](https://github.com/samuelmintah)
💬 Contact: [mintahsamuel01@gmail.com](mailto:mintahsamuel01@gmail.com)
🌍 Ghana
