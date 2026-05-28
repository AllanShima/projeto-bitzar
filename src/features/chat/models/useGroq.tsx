import { useState } from 'react';
import Groq from "groq-sdk";



const API_KEY = import.meta.env?.VITE_GROQ_API_KEY || "";

const groq = new Groq({ dangerouslyAllowBrowser:true, apiKey: API_KEY });
const model = "qwen/qwen3-32b";

export function useGroq() {
    const [loading, setLoading] = useState(false);

    const generate = async (input: string) => {
        setLoading(true);
        try {
            const response = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: input,
                    },
                ],
                model: model,
            });         
            const text = response.choices[0]?.message?.content || "";
            // Remove tudo entre <think> e </think> antes de exibir
            const cleanedContent = text.replace(/<think>[\s\S]*?<\/think>/g, '');
            return cleanedContent;
        } catch (error) {
            console.error("Erro:", error);
            return "Erro ao buscar resposta.";
        } finally {
            setLoading(false);
        }
    };

    const generateWithPDF = async (input: string, pdfFile?: File) => {
        setLoading(true);
        try {
            

            const response = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um assistente que analisa documentos para uma empresa de desenvolvimento de softwares chamada 'Bitzar'. Responda de forma direta, sem as tags <think>."
                    },
                    {
                        role: "user",
                        content: `${context}${input}`,
                    },
                ],
                model: model,
            });

            const text = response.choices[0]?.message?.content || "";
            return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        } catch (error) {
            console.error("Erro:", error);
            return "Erro ao processar documento ou resposta.";
        } finally {
            setLoading(false);
        }
    };

    return { generate, loading, model };
}