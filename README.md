# bun-react-tailwind-template

To install dependencies:
```bash
bun install
```

To start a development server:
```bash
bun dev
```

To run for production:
```bash
bun start
```

---

## Se for rodar o código, siga esses passos:
- Se n optar por usar bun: use 'npm install' msm
- Verifique se há 'Bun' instalado no PC: "bun --version"
- Se n, instale: "powershell -c "irm bun.sh/install.ps1 | iex"
- Clone o repositório:
    "git clone https://github.com/AllanShima/Projeto-Bitzar.git"
    "cd Projeto-Bitzar"
- Instale as dependencias do projeto: "bun install"
- Sempre que quiser rodar: "bun dev"

#### Hosteando: https://bitzar-docpilot.web.app

---

#### Extesões e Bibliotecas
- bun install firebase
- bun install -g firebase-tools
- bun install react-icons --save
- bun install react-router
- bun install @headlessui/react
- bun install react-hot-toast
- npm install --save-dev jsdoc
- bun install @tanstack/react-query

- bun install @google/genai
- bun install ollama
- bun install --save groq-sdk
- bun add vector-storage

- bun install pdfjs-dist          Biblioteca pra ler pdfs no navegador

- bun install react-markdown

---

#### Arquitetura utilizada
Pra organizar os componentes, hooks e fetch calls do firebase. Foi utilizado uma Arquitetura Baseada em Features
- Onde cada pasta representa o que ela faz:

src/
├── assets/          # Static files (images, fonts)
├── config/          # Firebase config, LLM API constants
├── features/        # The core of your app
│   ├── auth/        # Login, Signup, Auth hooks
│   ├── chat/        # LLM integration, Message components, Streaming logic
│   └── dashboard/   # Data fetching, User stats
├── hooks/           # Global reusable hooks (e.g., useLocalStorage)
├── interfaces/      # Global reusable modals
├── services/        # Firebase & API fetch wrappers (The "Data Layer")
├── ui/              # Generic Tailwind components (Buttons, Inputs, Modals)
└── utils/           # Helper functions (Date formatting, String parsing)