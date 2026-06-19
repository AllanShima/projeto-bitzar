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

## Para teste:
- Se n optar por usar bun: use 'npm install' msm
- Verifique se há 'Bun' instalado no PC: "bun --version"
- Se n, instale: "powershell -c "irm bun.sh/install.ps1 | iex"
- Clone o repositório:
    "git clone https://github.com/AllanShima/Projeto-Bitzar.git"
    "cd Projeto-Bitzar"
- Instale as dependencias do projeto: "bun install"
- Sempre que quiser rodar na máquina: "bun dev"

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
Pra organizar os componentes, hooks e fetch calls do firebase. Foi utilizado uma Arquitetura baseada em Features (Funcionalidades)
- Onde cada pasta representa o que ela faz:

src/

├── assets/          # Arquivos estáticos (fontes, imagens)

├── config/          # Configuração Firebase, API LLM

├── features/        # O Coração do app

│   ├── auth/        # Login, Signup, Auth hooks

│   ├── chat/        # Integração LLM, Componentes de mensagens

│   └── team/        # Componentes de login ou registro de times/grupo

│   └── members/     # Componentes de configuração dos membros do grupo

│   └── archives/    # Componentes de configuração dos arquivos do grupo

├── hooks/           # Hooks globais reutilizáveis

├── interfaces/      # Interfaces Globais

├── services/        # Serviços e funções Firestore Firebase

├── ui/              # Componentes genéricos (Buttons, Inputs, Modals)

└── utils/           # Funções de ajuda (Date formatting, String parsing)