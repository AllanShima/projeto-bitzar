import type { Team } from "@/interfaces/Interfaces";

export const handleGroupVerification = (allTeams: Team[], enterCode: string) => {
  // Verifica se o usuário está presente em algum grupo, como membro, ou dono
  if (allTeams && allTeams.length >= 1) {
    const foundCode = allTeams?.find(team => team.code === enterCode);
    if (foundCode) {
      return foundCode
    }
  } else {
    return [];
  }
}