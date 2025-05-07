#!/bin/sh

echo "=== Lancement du script ==="

echo "Compilation des fichiers TS"
npm run build

echo "Migration Prisma..."
npx prisma migrate deploy

echo "Affichage de la base de données sur le port 5554"
# changing the port to 5554 because 5555 is already used by the android emulator
npx prisma studio -p 5554 &

echo "Démarrage de l'application..."
npm run dev



