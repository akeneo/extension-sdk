.PHONY: install dev build build-dev create create-dev update fast-update update-dev

PROJECT_PATH := $(CURDIR)

# Load environment variables from .env file if it exists
-include .env

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
create: build
	@echo "Creating extension on $(PIM_HOST)..."
	$(CREATE_EXTENSION_CMD)

# Upload the built file to Akeneo PIM by creating a new extension using optimized build for development
create-dev: build-dev
	@echo "Creating extension with optimized configuration for development on $(PIM_HOST)..."
	$(CREATE_EXTENSION_CMD)

# Credentials configuration for upload (uncomment to use)
create-with-credentials: build
	$(CREATE_EXTENSION_WITH_CREDENTIALS_CMD)

# Update an existing extension using its UUID (with full build)
update: build
	$(UPDATE_EXTENSION_CMD)

# Update using optimized build-dev
update-dev: build-dev
	@echo "Updating extension with UUID: $(EXTENSION_UUID) on $(PIM_HOST) using optimized build..."
	$(UPDATE_EXTENSION_CMD)

# Update an existing extension with credentials
update-with-credentials: build
	$(UPDATE_EXTENSION_WITH_CREDENTIALS_CMD)

# Watch for changes and automatically build/update (requires fswatch to be installed)
watch-and-update:
	@echo "Watching for changes and updating on file change..."
	@node watch.js

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
