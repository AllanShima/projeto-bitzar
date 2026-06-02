export async function convertUrlToFile(url: string, defaultName: string = 'arquivo.pdf'): Promise<File> {
  // 1. Faz o download dos dados binários da URL
  const response = await fetch(url);
  const blob = await response.blob();

  // 2. Tenta extrair o nome real do arquivo a partir da URL do Firebase Storage
  // (O Firebase costuma codificar o nome após '/o/NomeDoArquivo.pdf?alt=media')
  let fileName = defaultName;
  try {
    const decodedUrl = decodeURIComponent(url);
    const matches = decodedUrl.match(/\/o\/(.+?)\?/);
    if (matches && matches[1]) {
      // Pega apenas a última parte se houver pastas no caminho do Storage
      fileName = matches[1].split('/').pop() || defaultName;
    }
  } catch (e) {
    console.error("Não foi possível extrair o nome do arquivo da URL:", e);
  }

  // 3. Cria e retorna o objeto File idêntico ao do <input type="file">
  return new File([blob], fileName, { type: blob.type });
}