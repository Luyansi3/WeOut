#!/bin/sh

echo "=== Lancement du script ==="

echo "Migration Prisma..."
npx prisma migrate dev --name init

echo "Affichage de la base de données"
npx prisma studio &

echo "Démarrage de l'application..."
npm start



