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