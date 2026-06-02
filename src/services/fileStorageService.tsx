import { db, storage } from "@/config/firebase";
import { addDoc, collection, doc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const fileStorageService = {
  // Criar/Salvar novo arquivo
  async saveFile(teamTitle: string, fileData: File) {
    if (!fileData) {
      throw new Error("Nenhum arquivo fornecido para upload.");
    }

    try {
      const fileRef = ref(storage, `${teamTitle}/pdf/${fileData.name}`);

      // Aguarda o upload do arquivo
      const snapshot = await uploadBytes(fileRef, fileData);
      // console.log('Upload concluído!', snapshot);

      // 4. Obtém o tamanho do arquivo
      const fileSize = snapshot.metadata.size;

      // 5. Aguarda a obtenção da URL de download
      const downloadURL = await getDownloadURL(snapshot.ref);
      // console.log('URL de download:', downloadURL);

      // 6. Retorna o objeto desejado
      return {
        size: fileSize,
        url: downloadURL
      };

    } catch (error) {
      // console.error("Erro ao salvar o arquivo no Cloud Storage:", error);
      throw error; // Re-lança o erro para que quem chamou a função possa tratá-lo
    }
  },

  async deleteFileByPath(fullPath: string) {
    if (!fullPath) {
      throw new Error("O caminho completo do arquivo é necessário para exclusão.");
    }

    try {
      const fileRef = ref(storage, fullPath);
      // Apaga o arquivo
      await deleteObject(fileRef);
      // console.log(`Arquivo '${fullPath}' apagado com sucesso.`);
      return true; // Ou qualquer indicador de sucesso
    } catch (error) {
      // console.error(`Erro ao apagar o arquivo '${fullPath}':`, error);
      throw error; // Re-lança o erro para que quem chamou a função possa tratá-lo
    }
  }
};