#co#!/bin/bash
# Quick Start Script para Backend

echo "=================================================="
echo "QUICK START - Backend Gestión de Transporte"
echo "=================================================="
echo ""

# 1. Verificar Node.js
echo "1️⃣ Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi
NODE_VERSION=$(node -v)
echo "✓ Node.js $NODE_VERSION"

# 2. Instalar dependencias
echo ""
echo "2️⃣ Instalando dependencias..."
if [ -f "package.json" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error instalando dependencias"
        exit 1
    fi
    echo "✓ Dependencias instaladas"
else
    echo "❌ package.json no encontrado"
    exit 1
fi

# 3. Configurar variables de entorno
echo ""
echo "3️⃣ Configurando variables de entorno..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✓ Archivo .env creado desde .env.example"
    echo "⚠️  IMPORTANTE: Edita .env con tus credenciales de PostgreSQL"
else
    echo "✓ .env ya existe"
fi

# 4. Resetear Base de Datos
echo ""
echo "4️⃣ Preparando Base de Datos..."
read -p "¿Deseas resetear y sembrar la BD? (y/n): " reset_db
if [[ $reset_db == "y" ]]; then
    npm run db:reset && npm run db:seed
    echo "✓ BD preparada"
fi

# 5. Iniciar servidor
echo ""
echo "5️⃣ Iniciando servidor..."
echo "=================================================="
echo "✅ Backend listo!"
echo "=================================================="
echo ""
echo "Próximos pasos:"
echo "  1. npm run dev          → Iniciar en modo desarrollo"
echo "  2. npm test             → Ejecutar tests"
echo "  3. npm run lint         → Verificar código"
echo "  4. npm run lint:fix     → Arreglar código automáticamente"
echo ""
echo "Archivo de pruebas: requests.http"
echo "Abre con REST Client plugin para probar endpoints"
echo ""
echo "Logs disponibles en: ./logs/"
echo ""
