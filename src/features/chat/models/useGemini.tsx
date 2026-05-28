import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyB9zXI-r48C75emMsxKSz5QtyKVXAcLH0U");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export function useGemini() {
    const [loading, setLoading] = useState(false);

    const generate = async (input: string) => {
        setLoading(true);
        try {
            const result = await model.generateContent(input);
            const text = result.response.text();
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