export const handleTimeFormat = (dateSource: any): string => {
  if (!dateSource) return "00:00";

  let date: Date;

  if (typeof dateSource.toDate === 'function') {
    date = dateSource.toDate();
  } else if (typeof dateSource === 'object' && 'seconds' in dateSource) {
    date = new Date(dateSource.seconds * 1000);
  } else {
    date = new Date(dateSource);
  }

  if (isNaN(date.getTime())) return "00:00";

  // Retorna apenas as horas e minutos formatados com 2 dígitos (hh:mm)
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};