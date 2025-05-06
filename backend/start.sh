#!/bin/sh

echo "=== Lancement du script ==="

echo "Migration Prisma..."
npx prisma migrate deploy
npx prisma migrate dev --name init

echo "Démarrage de l'application..."
npm start


