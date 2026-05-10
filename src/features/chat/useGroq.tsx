import { useState } from 'react';
import Groq from "groq-sdk";
import * as pdfjsLib from 'pdfjs-dist';

// Configuração do worker do PDF.js (necessário para funcionar no browser)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const groq = new Groq({ dangerouslyAllowBrowser:true, apiKey: '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' });
const model = "qwen/qwen3-32b";

export function useGroq() {
    const [loading, setLoading] = useState(false);

    // Função para extrair texto do PDF
    const extractTextFromPDF = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(" ");
            fullText += pageText + "\n";
        }
        return fullText;
    };

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
            let context = "";
            if (pdfFile) {
                const pdfText = await extractTextFromPDF(pdfFile);
                // Criamos um contexto delimitado para o modelo não se perder
                context = `Baseado no seguinte documento:\n\n"""\n${pdfText}\n"""\n\n Pergunta: `;
            }

            const response = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um assistente que analisa documentos para uma empresa de desenvolvimento de softwares. Responda de forma direta, sem as tags <think>."
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