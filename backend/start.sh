#!/bin/sh

echo "=== Lancement du script ==="

echo "Compilation des fichiers TS"
npm run build

echo "Migration Prisma..."
npx prisma migrate deploy

echo "Affichage de la base de données sur le port 5555"
npx prisma studio &

echo "Démarrage de l'application..."
npm run dev



