#!/bin/bash

# Quick Deployment Script for Render.com

echo "🚀 Preparing for deployment..."

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📁 Initializing Git repository..."
    git init
    git branch -M main
fi

# Create .gitignore if not exists
if [ ! -f .gitignore ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << EOF
# Backend
backend/venv/
backend/__pycache__/
backend/.env
backend/uploads/*
!backend/uploads/.gitkeep

# Frontend
frontend/node_modules/
frontend/dist/
frontend/.env
frontend/.env.local

# General
*.pyc
*.log
.DS_Store
EOF
fi

# Add all files
echo "➕ Adding files to git..."
git add .

# Commit
echo "💾 Creating commit..."
git commit -m "Ready for deployment - $(date '+%Y-%m-%d %H:%M:%S')"

echo ""
echo "✅ Repository prepared!"
echo ""
echo "📋 Next steps:"
echo "1. Create a repository on GitHub"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/freelance.git"
echo "3. Run: git push -u origin main"
echo "4. Follow DEPLOYMENT_GUIDE.md for Render.com deployment"
echo ""
