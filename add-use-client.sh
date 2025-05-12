#!/bin/bash

# Lista de arquivos a serem atualizados
files=(
  "/home/eu/Documentos/grr/sa/app/stores/atividadesStore.ts"
  "/home/eu/Documentos/grr/sa/app/stores/autoconhecimentoStore.ts"
  "/home/eu/Documentos/grr/sa/app/stores/concursosStore.ts"
  "/home/eu/Documentos/grr/sa/app/stores/financasStore.ts"
  "/home/eu/Documentos/grr/sa/app/stores/hiperfocosStore.ts"
  "/home/eu/Documentos/grr/sa/app/stores/historicoSimuladosStore.ts"
  "/home/eu/Documentos/grr/sa/app/stores/pomodoroStore.ts"
  "/home/eu/Documentos/grr/sa/app/stores/prioridadesStore.ts"
  "/home/eu/Documentos/grr/sa/app/stores/questoesStore.ts"
  "/home/eu/Documentos/grr/sa/app/stores/receitasStore.ts"
  "/home/eu/Documentos/grr/sa/app/stores/registroEstudosStore.ts"
  "/home/eu/Documentos/grr/sa/app/stores/sugestoesStore.ts"
  "/home/eu/Documentos/grr/sa/app/stores/perfilStore.ts"
)

for file in "${files[@]}"
do
  if [ -f "$file" ]; then
    # Verifica se o arquivo já tem 'use client'
    if ! grep -q "'use client'" "$file"; then
      # Adiciona 'use client' no início do arquivo
      sed -i "1i'use client';\n" "$file"
      echo "Adicionado 'use client' ao arquivo $file"
    else
      echo "Arquivo $file já contém 'use client'"
    fi
  else
    echo "Arquivo $file não encontrado"
  fi
done
