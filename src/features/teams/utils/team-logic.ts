import type { Team } from "@/interfaces/Interfaces";

export const handleGroupVerification = (allTeams: Team[], userId: string, enterCode: string) => {
    if (allTeams && allTeams.length >= 1) {
      const isOwner = allTeams?.some(team => team.ownerId === userId);
      
      const isMember = allTeams?.some(team => 
        // 2. Look through the members array of each team
        team.members?.some(member => member.user?.id === userId)
      );
      
      if (isOwner || isMember) {
        const foundCode = allTeams?.some(team => team.code === enterCode);
        if (foundCode) {
          return true;
        }
      }

      return false;

    } else {
      return false;
    }
}