export const doDatesOverlaps = (start1 : Date, end1: Date,
                                start2 : Date, end2: Date
                                ) => {
    // On vérifie que les dates sont valides
    if (start1 > end1 || start2 > end2) {
        throw new Error("start date should be anterior to end date");
    }

    // Deux intervalles [start1, end1] et [start2, end2] se chevauchent s'ils ne sont pas complètement séparés
    return start1 <= end2 && start2 <= end1;
};



export const isDateBefore = (before : Date, after : Date) : boolean => {
    return (before < after);
}



export const parseDate = (raw: any): Date | null => {
  // Si raw est vide (null, undefined, ou une chaîne vide), retourne null
  if (raw === null || raw === undefined || raw === '') {
    return null;
  }

  // Vérifie si raw est une chaîne de caractères
  if (typeof raw !== 'string') {
    throw new Error(`Expected a string for date, but received: ${typeof raw}`);
  }

  // Crée une nouvelle instance Date à partir de raw
  const date = new Date(raw);
  
  // Si la date est invalide, lance une erreur
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: "${raw}".`);
  }
  return date;
};
