-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('HOMME', 'FEMME', 'AUTRE');

-- CreateEnum
CREATE TYPE "TypeLieux" AS ENUM ('BOITE', 'BAR', 'BARDANSANT', 'CAFE');

-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('ELECTRO', 'HOUSE', 'TECHNO', 'COMMERCIAL');

-- CreateTable
CREATE TABLE "Compte" (
    "id" TEXT NOT NULL,
    "hashedMdp" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Compte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "genre" "Genre" NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "dateActualisation" TIMESTAMP(3) NOT NULL,
    "compteId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organisme" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "note" DOUBLE PRECISION NOT NULL,
    "tags" "Tag"[],
    "compteId" TEXT NOT NULL,

    CONSTRAINT "Organisme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lieux" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "TypeLieux" NOT NULL,
    "note" DOUBLE PRECISION NOT NULL,
    "adresse" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "tags" "Tag"[],

    CONSTRAINT "Lieux_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Soiree" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoCouverturePath" TEXT NOT NULL,
    "debut" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "lieuId" INTEGER NOT NULL,
    "organismeId" TEXT NOT NULL,
    "tags" "Tag"[],

    CONSTRAINT "Soiree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Groupe" (
    "id" TEXT NOT NULL,
    "soireeId" INTEGER NOT NULL,

    CONSTRAINT "Groupe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "soireeId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commentaire" (
    "id" SERIAL NOT NULL,
    "contenu" TEXT NOT NULL,
    "soireeId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Commentaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Amis" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Amis_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_Bloque" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Bloque_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_Demande" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Demande_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GroupeToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GroupeToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_Likes" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Likes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Compte_email_key" ON "Compte"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_compteId_key" ON "User"("compteId");

-- CreateIndex
CREATE UNIQUE INDEX "Organisme_nom_key" ON "Organisme"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Organisme_compteId_key" ON "Organisme"("compteId");

-- CreateIndex
CREATE UNIQUE INDEX "Lieux_adresse_key" ON "Lieux"("adresse");

-- CreateIndex
CREATE UNIQUE INDEX "Photo_path_key" ON "Photo"("path");

-- CreateIndex
CREATE INDEX "_Amis_B_index" ON "_Amis"("B");

-- CreateIndex
CREATE INDEX "_Bloque_B_index" ON "_Bloque"("B");

-- CreateIndex
CREATE INDEX "_Demande_B_index" ON "_Demande"("B");

-- CreateIndex
CREATE INDEX "_GroupeToUser_B_index" ON "_GroupeToUser"("B");

-- CreateIndex
CREATE INDEX "_Likes_B_index" ON "_Likes"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_compteId_fkey" FOREIGN KEY ("compteId") REFERENCES "Compte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organisme" ADD CONSTRAINT "Organisme_compteId_fkey" FOREIGN KEY ("compteId") REFERENCES "Compte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Soiree" ADD CONSTRAINT "Soiree_lieuId_fkey" FOREIGN KEY ("lieuId") REFERENCES "Lieux"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Soiree" ADD CONSTRAINT "Soiree_organismeId_fkey" FOREIGN KEY ("organismeId") REFERENCES "Organisme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Groupe" ADD CONSTRAINT "Groupe_soireeId_fkey" FOREIGN KEY ("soireeId") REFERENCES "Soiree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_soireeId_fkey" FOREIGN KEY ("soireeId") REFERENCES "Soiree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_soireeId_fkey" FOREIGN KEY ("soireeId") REFERENCES "Soiree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commentaire" ADD CONSTRAINT "Commentaire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Amis" ADD CONSTRAINT "_Amis_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Amis" ADD CONSTRAINT "_Amis_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Bloque" ADD CONSTRAINT "_Bloque_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Bloque" ADD CONSTRAINT "_Bloque_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Demande" ADD CONSTRAINT "_Demande_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Demande" ADD CONSTRAINT "_Demande_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupeToUser" ADD CONSTRAINT "_GroupeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Groupe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupeToUser" ADD CONSTRAINT "_GroupeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Likes" ADD CONSTRAINT "_Likes_A_fkey" FOREIGN KEY ("A") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Likes" ADD CONSTRAINT "_Likes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
