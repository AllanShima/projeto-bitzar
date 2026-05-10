import { useState } from 'react';
import ollama from 'ollama'

const model = 'qwen3.6';

export function useOllama() {
    const [loading, setLoading] = useState(false);

    const generate = async (input: string) => {
        setLoading(true);
        try {
            const response = await ollama.chat({
                model: model,
                messages: [{role: 'user', content: input}],
            })            
            const text = response.message.content;
            return text; // Opcional: retornar o texto diretamente também
        } catch (error) {
            console.error("Erro:", error);
            return "Erro ao buscar resposta.";
        } finally {
            setLoading(false);
        }
    };

    return { generate, loading };
}