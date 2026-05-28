export const handleDateFormat = (dateSource: any): string => {
  if (!dateSource) return "";

  let date: Date;

  // 1. Se for o objeto estendido do SDK do Firebase
  if (typeof dateSource.toDate === 'function') {
    date = dateSource.toDate();
  } 
  // 2. Se for o objeto JSON desidratado do banco {seconds, nanoseconds}
  else if (typeof dateSource === 'object' && 'seconds' in dateSource) {
    date = new Date(dateSource.seconds * 1000);
  } 
  // 3. Se já for um Date ou uma String ISO (como "2026-05-28T...")
  else {
    date = new Date(dateSource);
  }

  // Validação para evitar "Invalid Date" na tela se o dado vier corrompido
  if (isNaN(date.getTime())) return "";

  // Retorna no formato brasileiro: dd/mm/aaaa
  return date.toLocaleDateString('pt-BR');
};