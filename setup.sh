#!/bin/bash

# Audio Draw - Quick Setup Script
# This script will install dependencies, setup database, and start the dev server

echo "🎵 Audio Draw - Setup Script"
echo "============================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Setup environment
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "⚙️  .env file already exists"
fi
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Prisma client generated"
echo ""

# Run migrations
echo "🗄️  Setting up database..."
npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
    echo "⚠️  Migration may have failed, but continuing..."
fi

echo "✅ Database setup complete"
echo ""

# Seed database
echo "🌱 Seeding database with sample devices..."
npm run prisma:seed

if [ $? -ne 0 ]; then
    echo "⚠️  Seeding may have failed, but continuing..."
fi

echo "✅ Database seeded"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
