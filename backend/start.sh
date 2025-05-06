#!/bin/sh

echo "=== Lancement du script ==="

echo "Migration Prisma..."
npx prisma migrate deploy

echo "Démarrage de l'application..."
npm start

npx prisma migrate dev --name init

