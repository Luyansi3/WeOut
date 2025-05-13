export type UserProfileResponse = {
    id:string,
    prenom:string,
    nom:string,
    genre:string,
    longitude:number,
    latitude:number,
    compte: string
    compteId: string,
    ami: UserProfileResponse[],
    nombreSoiree: number,
}

export type UserProfileUsable = {
    prenom:string,
    nom:string,
    compte:string
}

/*
model User {
  id     String @id @default(uuid())
  prenom String
  nom    String
  genre  Genre

  // Geolocalisation
  longitude         Float
  latitude          Float
  dateActualisation DateTime @updatedAt

  // Relation d'amities
  ami   User[] @relation("Amis")
  amiDe User[] @relation("Amis")   //Nécessité de bidirectionnalité, mais nous l'ignorerons !

  // Relatoin de blockage
  bloque   User[] @relation("Bloque")
  bloquant User[] @relation("Bloque")

  // Demandes envoyées et reçues
  demandeEnvoye User[] @relation("Demande")
  demandeRecue  User[] @relation("Demande")

  // Groupes d'appartenance
  groupes Groupe[]

  // Commentaires rédigés 
  commentaires Commentaire[]

  // Photos (likés et postés)
  likes  Photo[] @relation("Likes")
  photos Photo[]

  // Compte associé
  compte   Compte @relation(fields: [compteId], references: [id])
  compteId String @unique
}

*/