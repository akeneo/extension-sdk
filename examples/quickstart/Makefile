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
	sed -i "s|^PIM_HOST=.*|PIM_HOST=$$pim_host|" .env

	@read -p "Enter your CLIENT_ID: " client_id && \
	sed -i "s|^CLIENT_ID=.*|CLIENT_ID=$$client_id|" .env

	@read -p "Enter your CLIENT_SECRET: " client_secret && \
	sed -i "s|^CLIENT_SECRET=.*|CLIENT_SECRET=$$client_secret|" .env

	@read -p "Enter your USERNAME: " username && \
	sed -i "s|^USERNAME=.*|USERNAME=$$username|" .env

	@read -p "Enter your PASSWORD: " password && \
	sed -i "s|^PASSWORD=.*|PASSWORD=$$password|" .env

	@echo "\nGenerating API token..."
	@$(MAKE) get-token

	@echo "\nCreating UI extension..."
	@$(MAKE) create-dev

	@echo "\n✅ Setup complete!"
	@echo "Add the UUID of your UI extension to your .env file as EXTENSION_UUID=your-uuid-here"
	@echo "You can find your extension UUID at $$(grep -o '^PIM_HOST=.*' .env | sed 's/^PIM_HOST=//')/#/ui-extensions/view_all_ui_extensions"
	@echo "\nOnce you've added the EXTENSION_UUID, you can run 'make watch' to enable hot reloading during development."
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
	npm run build
	
# Build the project for development purpose with optimizations
build-dev:
	@echo "Building with optimized configuration for development..."
	@echo "Project path: $(PROJECT_PATH)"
	npx vite build --mode development

# Upload the built file to Akeneo PIM by creating a new extension
create: build get-token
	@echo "Creating extension on $(PIM_HOST)..."
	$(CREATE_EXTENSION_CMD)

# Upload the built file to Akeneo PIM by creating a new extension using optimized build for development
create-dev: build-dev get-token
	@echo "Creating extension with optimized configuration for development on $(PIM_HOST)..."
	$(CREATE_EXTENSION_CMD)

# Credentials configuration for upload (uncomment to use)
create-with-credentials: build get-token
	$(CREATE_EXTENSION_WITH_CREDENTIALS_CMD)

# Update an existing extension using its UUID (with full build)
update: build get-token
	$(UPDATE_EXTENSION_CMD)

# Update using optimized build-dev
update-dev: build-dev get-token
	@echo "Updating extension with UUID: $(EXTENSION_UUID) on $(PIM_HOST) using optimized build..."
	$(UPDATE_EXTENSION_CMD)

# Update an existing extension with credentials
update-with-credentials: build get-token
	$(UPDATE_EXTENSION_WITH_CREDENTIALS_CMD)

# Watch for changes and automatically build/update (requires fswatch to be installed)
watch:
	@echo "Watching for changes and updating on file change..."
	@node watch.js

# Get a token for Akeneo API using credentials from .env file
# Uses refresh token if token is less than an hour old
get-token:
	@echo "Getting API token..."
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

# Define common curl command for extension creation
define CREATE_EXTENSION_CMD
	@echo "Uploading extension to $(PIM_HOST)..."
	@echo "Opening $(PROJECT_PATH)/dist/demo.js"
	@curl --location '$(PIM_HOST)/api/rest/v1/ui-extensions' \
		--header 'Authorization: Bearer $(API_TOKEN)' \
		--form 'name="sdk_script_extension"' \
		--form 'type="sdk_script"' \
		--form 'position="pim.product.panel"' \
		--form 'file=@"$(PROJECT_PATH)/dist/demo.js"' \
		--form 'configuration[labels][en_US]="SDK script test extension"' \
		--form 'configuration[default_label]="SDK script test extension"'
	@echo "Upload complete!"
endef

# Define common curl command for extension update
define UPDATE_EXTENSION_CMD
	@echo "Updating extension with UUID: $(EXTENSION_UUID) on $(PIM_HOST)..."
	@curl -X POST '$(PIM_HOST)/api/rest/v1/ui-extensions/$(EXTENSION_UUID)' \
		-H "Content-Type: multipart/form-data" \
		--header 'Authorization: Bearer $(API_TOKEN)' \
		--form 'name="sdk_script_extension"' \
		--form 'type="sdk_script"' \
		--form 'position="pim.activity.navigation.tab"' \
		--form 'file=@"$(PROJECT_PATH)/dist/demo.js"' \
		--form 'configuration[labels][en_US]="SDK script test extension"' \
		--form 'configuration[default_label]="SDK script test extension"'
	@echo "Update complete!"
endef

# Define common curl command for extension creation with credentials
define CREATE_EXTENSION_WITH_CREDENTIALS_CMD
	@echo "Uploading extension with credentials to $(PIM_HOST)..."
	@echo "Opening $(PROJECT_PATH)/dist/demo.js"
	@curl --location '$(PIM_HOST)/api/rest/v1/ui-extensions' \
		--header 'Authorization: Bearer $(API_TOKEN)' \
		--form 'name="sdk_script_extension"' \
		--form 'type="sdk_script"' \
		--form 'position="pim.product.panel"' \
		--form 'file=@"$(PROJECT_PATH)/dist/demo.js"' \
		--form 'configuration[labels][en_US]="SDK script test extension"' \
		--form 'configuration[default_label]="SDK script test extension"' \
		--form 'credentials[0][code]="credential_code_example"' \
		--form 'credentials[0][type]="Bearer Token"' \
		--form 'credentials[0][value]="token_value"'
	@echo "Upload with credentials complete!"
endef

# Define common curl command for extension update with credentials
define UPDATE_EXTENSION_WITH_CREDENTIALS_CMD
	@echo "Updating extension with credentials - UUID: $(EXTENSION_UUID) on $(PIM_HOST)..."
	@curl -X POST '$(PIM_HOST)/api/rest/v1/ui-extensions/$(EXTENSION_UUID)' \
		-H "Content-Type: multipart/form-data" \
		--header 'Authorization: Bearer $(API_TOKEN)' \
		--form 'name="sdk_script_extension"' \
		--form 'type="sdk_script"' \
		--form 'position="pim.activity.navigation.tab"' \
		--form 'file=@"$(PROJECT_PATH)/dist/demo.js"' \
		--form 'configuration[labels][en_US]="SDK script test extension"' \
		--form 'configuration[default_label]="SDK script test extension"' \
		--form 'credentials[0][code]="credential_code_example"' \
		--form 'credentials[0][type]="Bearer Token"' \
		--form 'credentials[0][value]="token_value"'
	@echo "Update with credentials complete!"
endef
