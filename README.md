# Projeto DocPilot
> Projeto desenvolvido para a empresa Bitzar-Solutions de Marília.
> Uma plataforma com criação de grupos em que o chatbot RAG elabora resposta com base nos documentos empresariais e usuários presentes no grupo.

#### Período de desenvolvimento do projeto: 06/02/2026 - 12/06/2026

## Tabela de Conteúdo
- [Tecnologias Principais](#tecnologias-principais)
- [Preview](#preview)
- [Empresa](#empresa)
- [Problema](#problema)
- [Solução](#solução)
- [Projeto](#projeto)
- [Exemplo](#exemplo)
- [Extesões e Bibliotecas](#extesões-e-bibliotecas)
- [Arquitetura e Organização](#arquitetura-e-organização)

## Tecnologias Principais
- Tailwind;
- React e Typescript;
- Firebase Services (Auth, Firestore, Hosting, Storage);
- Bun;
- Tanstack Query;

## Preview
> Vale constar que dependendo do papél do usuário do grupo ele não tem acesso à todas as abas

- Tab principal de chat
<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/5ceca386-d57e-41e0-8629-549dcef6c752" />

- Tab de arquivos
<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/cadb7118-348b-465b-a317-8391fca993f7" />

- Tab de Configuração do grupo
<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/38319195-b475-4efd-851e-3d5133ebffa6" />

## Empresa
> Bitzar Solutions é uma fábrica de software que propõe, cria e desenvolve soluções com excelência, usando tecnologias que permitem eficiência na resolução de problemas. Desenvolve soluções variadas, simples ou complexas, para pequenas empresas e multinacionais. Trabalha principalmente com tecnologias Microsoft, em Cloud Computing e Business Intelligence

## Problema
> As empresas de desenvolvimento de software como a Bitzar Solutions, possuem um vasto mar de documentos e padrões que devem ser seguidos para garantir a melhor qualidade dos seus produtos para os clientes. Com essa quantidade massiva de documentos, a visualização delas pode acabar levando um certo tempo e atrapalhando os novos agentes na empresa, que precisam levantar e visualizar esses arquivos várias vezes a fim de acomodar com o padrão estabelecido no ambiente de trabalho.

## Solução
> Uma das soluções modernas para esse problema, é o uso de inteligências artificiais generativas, que podem resumir o documento para o desenvolvedor na hora que ele quiser. No entando, um outro problema que surge a partir do uso de LLM comuns, é a falta de armazenamento permanente desses documentos, embora a LLM seja capaz de lembrar as mensagens por cada chat, ela não consegue armazenar esses arquivos.

## Projeto
> Esse projeto foi feito para resolver esse problema. A partir de um Copiloto Chatbot com RAG, o desenvolvedor consegue fazer o armazenamento permanente desses arquivos. E afim de ampliar a ideia, foi desenvolvido uma plataforma em que o usuário (cadastrando o seu respectivo cargo de trabalho) consegue criar um grupo, fazendo o chatbot interagir, indicar e recomendar usuários presentes nesse grupo. O chatbot sendo uma LLM RAG embutida na própria máquina (para DEMONSTRAÇÃO nesse projeto), consegue fazer a leitura dos documentos que foram salvos na plataforma + dos usuários presentes no grupo, que elabora uma resposta com esses dados com base na pergunta do usuário. Segue com as principais funcionalidades:
- Inserção e manipulação dos arquivos;
- Inserção e manipulação dos usuários no grupo;
- Criação de grupos com código customizado;
- Login e Registro do usuário;
- Diferentes acessos para usuários com papéis diferentes;
- Armazenamento do chat completo para cada usuário;

## Exemplo
1. O usuário Allan Shinhama, Cargo: Desenvolvedor Sênior de React, sendo o único membro desse grupo, faz o upload de um arquivo sobre padrões de desenvolvimento front-end;
2. Esse usuário faz o prompt para o chat: 'Eu sou o Allan Shinhama e alterei um ficheiro dentro de src/features/chat/services/. Segundo as nossas diretrizes, posso aprovar o meu próprio Pull Request?'
3. A máquina responde: 'BASEADO NO TEXTO FORNECIDO E NAS REGRAS ABSOLUTAS DE EXECUÇÃO, Allan Shinhama (Desenvolvedor Sênior / Arquiteto) PODE aprovar seu próprio Pull Request para alterar um ficheiro dentro de src/features/chat/services/, pois está especificado que Desenvolvedores Sêniores / Arquitetos são responsáveis exclusivos pela criação de Custom Hooks complexos....'

## Template
> O projeto foi criado com o seguinte template: bun-react-tailwind-template

### Site-preview
> Em particular

## Para teste:
- Se n optar por usar bun: use 'npm install' msm
- Verifique se há 'Bun' instalado no PC: "bun --version"
- Se n, instale: "powershell -c "irm bun.sh/install.ps1 | iex"
- Clone o repositório:
    "git clone https://github.com/AllanShima/Projeto-Bitzar.git"
    "cd Projeto-Bitzar"
- Instale as dependencias do projeto: "bun install"
- Sempre que quiser rodar na máquina: "bun dev"

## Extesões e Bibliotecas
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

## Arquitetura e Organização
Pra organizar os componentes, hooks e fetch calls do firebase. Foi utilizado uma Arquitetura baseada em Features (Funcionalidades), onde cada pasta representa o que ela faz:

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
