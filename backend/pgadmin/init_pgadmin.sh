#!/bin/bash

# Script pour ajouter une connexion PostgreSQL à pgAdmin

echo "Ajout de la connexion PostgreSQL à pgAdmin..."

# Attendre que le serveur PostgreSQL soit prêt (optionnel mais utile)
sleep 10

# Ajouter la connexion via l'API REST de pgAdmin
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MyServer",
    "host": "db",
    "port": "5432",
    "username": "postgres",
    "password": "postgres"
  }' \
  http://admin:admin@localhost/api/servers/
