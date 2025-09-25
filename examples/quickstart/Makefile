.PHONY: install dev build build-dev create create-dev update update-dev get-token copy-env watch start

PROJECT_PATH := $(CURDIR)

# Load environment variables from .env file if it exists
-include .env

# Interactive command for new comers to set up their environment
start:
	@echo "Welcome to the Akeneo Extension SDK project! Let's set up your environment."
	@echo "---------------------------------------------------------------------"

	@echo "Installing dependencies..."
	@$(MAKE) install

	@echo "\nCopying environment file..."
	@$(MAKE) copy-env

	@echo "\nNow we need to configure your environment variables."
	@echo "Please provide the following information:"

	@read -p "Enter your PIM host URL (e.g., https://your-pim-instance.com): " pim_host && \
	node set-env.js PIM_HOST $$pim_host

	@read -p "Enter your CLIENT_ID: " client_id && \
	node set-env.js CLIENT_ID $$client_id

	@read -p "Enter your CLIENT_SECRET: " client_secret && \
	node set-env.js CLIENT_SECRET $$client_secret

	@read -p "Enter your USERNAME: " username && \
	node set-env.js USERNAME $$username

	@read -p "Enter your PASSWORD: " password && \
	node set-env.js PASSWORD $$password

	@echo "\nGenerating API token..."
	@$(MAKE) get-token

	@echo "\nCreating UI extension..."
	@$(MAKE) create-dev

	@echo "\n✅ Setup complete!"
	@echo "Run 'update-dev' to update your extension after making changes."
	@echo "\nYou can run 'make watch' to enable hot reloading during development."
	@echo "This will automatically update your extension when you make changes to the code."
	@echo "\n🚀 Enjoy building your extension!"

# Install dependencies
install:
	npm install

# Run development server
dev:
	npm run dev

# Build the project
build:
	@echo "Building..."
    @echo "Project path: $(PROJECT_PATH)"
	npm run build
	
# Build the project for development purpose with optimizations
build-dev:
	@echo "Building with optimized configuration for development..."
	@echo "Project path: $(PROJECT_PATH)"
	npx vite build --mode development

# Upload the built file to Akeneo PIM by creating a new extension
create: build get-token
	@node create-extension.js

# Upload the built file to Akeneo PIM by creating a new extension using optimized build for development
create-dev: build-dev get-token
	@node create-extension.js

# Credentials configuration for upload (uncomment to use)
create-with-credentials: build get-token
	@node create-extension.js --with-credentials

# Update an existing extension using its UUID (with full build)
update: build get-token
	@node update-extension.js

# Update using optimized build-dev
update-dev: build-dev get-token
	@node update-extension.js

# Update an existing extension with credentials
update-with-credentials: build get-token
	@node update-extension.js --with-credentials

# Watch for changes and automatically build/update (requires fswatch to be installed)
watch:
	@echo "Watching for changes and updating on file change..."
	@node watch.js

# Get a token for Akeneo API using credentials from .env file
# Uses refresh token if token is less than an hour old
get-token:
	@echo "Getting API token for Akeneo PIM..."
	@node token.js

# Create .env file from .env.example if it doesn't exist
copy-env:
	@if [ ! -f .env ]; then \
		echo "Creating .env file from .env.example..."; \
		cp .env.example .env; \
		echo ".env file created."; \
	else \
		echo ".env file already exists. No changes made."; \
	fi
