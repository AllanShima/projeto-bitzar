import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export const extractChunksFromPDF = async (file: File): Promise<string[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const chunks: string[] = [];

  // Indexa página por página para manter o contexto visual e estrutural intacto
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    const pageText = textContent.items
      .map((item: any) => {
        // Garante compatibilidade caso o objeto tenha estrutura diferente
        if (typeof item === 'string') return item;
        return item?.str || item?.text || ""; 
      })
      .join(" ")
      .trim(); // Remove espaços extras nas pontas

    // Se mesmo assim falhar, coloca um log para você pegar no console na hora
    if (!pageText) {
      console.warn(`⚠️ Alerta: Nenhum texto extraído da Página ${i}. Verifique a estrutura do PDF.`);
    }

    // 🚀 O PULO DO GATO: Injeta metadados no topo do chunk. 
    // Isso blinda o modelo local (3b) dando a ele a localização exata da informação.
    const structuredChunk = `[Origem: Documento "${file.name}" | Página: ${i}]\n---\n${pageText}`;
    
    chunks.push(structuredChunk);
  }

  return chunks; // Retorna cada página estruturada como um chunk único
};