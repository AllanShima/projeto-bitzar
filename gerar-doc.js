// gerar-doc.js
const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Diretrizes de Arquitetura - TechFlow</title>
</head>
<body class="bg-gray-50 text-gray-800 p-10 font-sans">
    <div class="max-w-4xl mx-auto bg-white p-12 rounded-lg shadow-sm border border-gray-200">
        <div class="border-b-4 border-blue-600 pb-4 mb-8">
            <h1 class="text-3xl font-extrabold uppercase tracking-tight text-gray-900">TechFlow S.A.</h1>
            <p class="text-sm font-semibold text-blue-600 tracking-wider uppercase mt-1">Diretrizes de Arquitetura e Padrões Front-End — v2026.1</p>
        </div>

        <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 mb-3 border-b pb-1">1. Stack Tecnológica Padrão</h2>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong class="text-blue-700">Runtime & Package Manager:</strong> Bun (substituto oficial do Node.js). Todos os scripts do ecossistema e instalações devem ser executados estritamente via <code class="bg-gray-100 px-1 py-0.5 rounded text-red-600 font-mono">bun run</code>.</li>
                <li><strong class="text-blue-700">Framework Base:</strong> React (versão 18+ baseado estritamente em Hooks e Functional Components).</li>
                <li><strong class="text-blue-700">Suporte Tipado:</strong> TypeScript. O modo <code class="font-mono text-xs">strict</code> é obrigatório em todos os arquivos de configuração. É terminantemente proibido o uso de <code class="font-mono text-xs">any</code>.</li>
                <li><strong class="text-blue-700">Estilização:</strong> Tailwind CSS. Devem ser seguidas estritamente as classes utilitárias, evitando CSS inline ou CSS Modules.</li>
            </ul>
        </section>

        <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 mb-3 border-b pb-1">2. Arquitetura de Pastas e Componentes</h2>
            <p class="mb-3">Adotamos uma variação baseada em Features isoladas por domínio de negócio:</p>
            <ul class="list-disc pl-6 space-y-1">
                <li><code class="font-mono bg-gray-100 text-xs px-1 rounded">src/components/</code>: Componentes globais e reutilizáveis da interface (Botões, Modais, Inputs).</li>
                <li><code class="font-mono bg-gray-100 text-xs px-1 rounded">src/features/</code>: Divisão por contexto de negócio. Cada feature (ex: <code class="font-mono text-xs">chat</code>, <code class="font-mono text-xs">auth</code>) deve conter suas próprias subpastas de componentes, hooks, services e utils.</li>
                <li><code class="font-mono bg-gray-100 text-xs px-1 rounded">src/interfaces/</code>: Contratos e tipagens globais do TypeScript.</li>
            </ul>
        </section>

        <section class="mb-8">
            <h2 class="text-xl font-bold text-gray-900 mb-3 border-b pb-1">3. Fluxo de Trabalho e Atribuições da Equipe</h2>
            <p class="mb-4 text-sm text-gray-600 italic">A esteira de engenharia é dividida estritamente pelas competências configuradas no painel corporativo do colaborador:</p>
            
            <div class="space-y-4">
                <div class="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                    <h3 class="font-bold text-blue-900">Desenvolvedor Sênior / Arquiteto</h3>
                    <p class="text-sm mt-1">Responsável exclusivo pela criação de Custom Hooks complexos, gerenciamento de estados globais, configuração do bundler (Bun) e design patterns estruturais. Apenas perfis Sêniores possuem credenciais para aprovar Pull Requests que alterem a raiz de pastas ou integrações de APIs base de serviços (<code class="font-mono text-xs">services/</code>).</p>
                </div>

                <div class="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
                    <h3 class="font-bold text-gray-700">Desenvolvedor Pleno / Júnior</h3>
                    <p class="text-sm mt-1">Foco no desenvolvimento de componentes visuais locais, páginas de features, validações de formulários e consumo dos hooks e contextos providos pela arquitetura base de nível Sênior.</p>
                </div>
            </div>
        </section>

        <section>
            <h2 class="text-xl font-bold text-gray-900 mb-3 border-b pb-1">4. Padrões de Código e Performance</h2>
            <ul class="list-disc pl-6 space-y-2">
                <li><strong>State Management:</strong> Preferir estados locais (<code class="font-mono text-xs">useState</code>) ou Context API para dados compartilhados da feature. Evitar ferramentas pesadas sem justificativa de arquitetura.</li>
                <li><strong>Mutabilidade:</strong> Todos os arrays devem ser tratados como imutáveis utilizando obrigatoriamente operadores spread (<code class="font-mono text-xs">...</code>) ao atualizar estados.</li>
                <li><strong>Efeitos:</strong> Hooks de <code class="font-mono text-xs">useEffect</code> devem manter dependências limpas e focar apenas em sincronização com APIs externas.</li>
            </ul>
        </section>
    </div>
</body>
</html>
`;

await Bun.write('padroes-desenvolvimento-frontend.html', htmlContent);
console.log("✅ Arquivo 'padroes-desenvolvimento-frontend.html' gerado com sucesso!");
console.log("👉 Abra ele no navegador, aperte Ctrl+P e escolha 'Salvar como PDF'.");