.PHONY: help install build-animation build-web build start clean

# Default target
help:
	@echo "🎨 \033[1;36mRainLib Project Makefile\033[0m"
	@echo "Usage: make [target]"
	@echo ""
	@echo "  \033[1;32minstall\033[0m          Install dependencies for both Web and Animation"
	@echo "  \033[1;32mbuild-animation\033[0m  Build Motion Canvas animations (output to static/animation)"
	@echo "  \033[1;32mbuild-web\033[0m        Build Docusaurus website"
	@echo "  \033[1;32mbuild\033[0m            Build EVERYTHING (Animation -> Web)"
	@echo "  \033[1;32mstart\033[0m            Build animations and start Docusaurus dev server"
	@echo "  \033[1;32mclean\033[0m            Clean build artifacts"
	@echo ""

install:
	@echo "📦 \033[1;33mInstalling Website Dependencies...\033[0m"
	npm install
	@echo "📦 \033[1;33mInstalling Animation Dependencies...\033[0m"
	cd animation && npm install
	@echo "✅ \033[1;32mInstallation Complete!\033[0m"

build-animation:
	@echo "🎬 \033[1;33mBuilding Animations...\033[0m"
	rm -rf static/animation/*
	cd animation && npm run build
	@echo "✅ \033[1;32mAnimations Built!\033[0m"

build-web:
	@echo "🕸️  \033[1;33mBuilding Docusaurus Website...\033[0m"
	npm run build
	@echo "✅ \033[1;32mWebsite Built!\033[0m"

build: build-animation build-web
	@echo "🚀 \033[1;32mFull Build Complete!\033[0m"

start: build-animation
	@echo "💻 \033[1;33mStarting Development Server...\033[0m"
	npm run start

clean:
	@echo "🧹 \033[1;33mCleaning up...\033[0m"
	rm -rf build
	rm -rf .docusaurus
	rm -rf static/animation/*.js
	rm -rf animation/dist
	@echo "✨ \033[1;32mCleaned!\033[0m"

stop:
	@echo "🛑 \033[1;33mStopping servers...\033[0m"
	@-lsof -t -i:3000 | xargs kill -9 2>/dev/null || true
	@-lsof -t -i:9500 | xargs kill -9 2>/dev/null || true
	@echo "✅ \033[1;32mStopped!\033[0m"
