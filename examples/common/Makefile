.PHONY: install dev build build-dev create create-dev update update-dev get-token copy-env watch start

PROJECT_PATH := $(CURDIR)

-include .env

start:
	@echo "Welcome to the Akeneo Extension SDK project! Let's set up your environment."
	@echo "---------------------------------------------------------------------"
	@echo "Installing common dependencies..."
	@(cd ../common && npm install)
	@echo "Installing dependencies..."
	@$(MAKE) install
	@echo "\nCopying environment file..."
	@$(MAKE) copy-env
	@echo "\nNow we need to configure your environment variables."
	@read -p "Do you already have an App Token? (y/n): " has_token; \
	if [ "$$has_token" = "y" ] || [ "$$has_token" = "Y" ]; then \
		read -p "Enter your PIM host URL (e.g., https://your-pim-instance.com): " pim_host && \
		node ../common/set-env.mjs PIM_HOST $$pim_host; \
		read -p "Enter your App Token: " app_token && \
		node ../common/set-env.mjs APP_TOKEN $$app_token; \
		echo "\nCreating UI extension..."; \
		$(MAKE) create-dev; \
	else \
		echo "Please provide the following information:"; \
		read -p "Enter your PIM host URL (e.g., https://your-pim-instance.com): " pim_host && \
		node ../common/set-env.mjs PIM_HOST $$pim_host; \
		read -p "Enter your CLIENT_ID: " client_id && \
		node ../common/set-env.mjs CLIENT_ID $$client_id; \
		read -p "Enter your CLIENT_SECRET: " client_secret && \
		node ../common/set-env.mjs CLIENT_SECRET $$client_secret; \
		read -p "Enter your USERNAME: " username && \
		node ../common/set-env.mjs USERNAME $$username; \
		read -p "Enter your PASSWORD: " password && \
		node ../common/set-env.mjs PASSWORD $$password; \
		echo "\nGenerating API token..."; \
		$(MAKE) get-token; \
		echo "\nCreating UI extension..."; \
		$(MAKE) create-dev; \
	fi
	@echo "\n✅ Setup complete!"
	@echo "Run 'update-dev' to update your extension after making changes."
	@echo "\nYou can run 'make watch' to enable hot reloading during development."
	@echo "This will automatically update your extension when you make changes to the code."
	@echo "\n🚀 Enjoy building your extension!"

install:
	npm install

dev:
	npm run dev

build:
	@echo "Building..."
	@echo "Project path: $(PROJECT_PATH)"
	npm run build

build-dev:
	@echo "Building with optimized configuration for development..."
	@echo "Project path: $(PROJECT_PATH)"
	npx vite build --mode development

create: build get-token
	@node ../common/create-extension.mjs

create-dev: build-dev get-token
	@node ../common/create-extension.mjs

create-with-credentials: build get-token
	@node ../common/create-extension.mjs --with-credentials

create-dev-with-credentials: build-dev get-token
	@node ../common/create-extension.mjs --with-credentials

update: build get-token
	@node ../common/update-extension.mjs

update-dev: build-dev get-token
	@node ../common/update-extension.mjs

update-with-credentials: build get-token
	@node ../common/update-extension.mjs --with-credentials

update-dev-with-credentials: build-dev get-token
	@node ../common/update-extension.mjs --with-credentials

watch:
	@echo "Watching for changes and updating on file change..."
	@node ../common/watch.mjs

get-token:
	@echo "Getting API token for Akeneo PIM..."
	@node ../common/token.mjs

copy-env:
	@if [ ! -f .env ]; then \
		echo "Creating .env file from .env.example..."; \
		cp .env.example .env; \
		echo ".env file created."; \
	else \
		echo ".env file already exists. No changes made."; \
	fi
