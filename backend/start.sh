#!/bin/sh

echo "=== Lancement du script ==="

echo "Compilation des fichiers TS"
npm run build

echo "Migration Prisma..."
npx prisma db push

echo "Affichage de la base de données sur le port 5553"
# changing the port to 5553 because 5555 is already used by the android emulator
npx prisma studio -p 5553 &

echo "Compilation des fichiers TS en watchmode"
npm run builddev &

echo "Démarrage de l'application..."
npm run dev



