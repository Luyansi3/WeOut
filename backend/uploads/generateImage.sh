#!/bin/bash

# Nom du fichier source
source="./centralcee.jpg"

# Nom de base sans extension
base="${source%.*}"
ext="${source##*.}"

# Boucle de 1 à 20
for i in $(seq 1 20); do
    cp "$source" "${base}_${i}.${ext}"
done