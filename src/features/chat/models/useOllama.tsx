import { useState } from 'react';
import { Ollama } from 'ollama/browser'
import type { File } from '@/interfaces/Interfaces';
import { extractTextFromPDF } from '../utils/PdfTextExtract';


const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });
const model = 'qwen2.5:latest';

export function useOllama() {
    const [loading, setLoading] = useState(false);




    const generate = async (input: string, pdfFile?: File) => {
        setLoading(true);

        let context = "";
        if (pdfFile) {
            const pdfText = await extractTextFromPDF(pdfFile);
            // Criamos um contexto delimitado para o modelo não se perder
            context = `Baseado no seguinte documento:\n\n"""\n${pdfFile.name}\n"""\n\n Pergunta: `;
        }

        try {


            const response = await ollama.chat({
                model: model,
                messages: [
                    {
                        role: "system",
                        content: "Você é um assistente que analisa documentos para uma empresa de desenvolvimento de softwares chamada 'Bitzar'. Responda de forma direta, sem as tags <think>."
                    },
                    {
                        role: 'user', 
                        content: `${context}${input}`
                    }
                ],
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

    return { generate, loading, model };
}