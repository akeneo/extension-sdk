.PHONY: install dev build fast-build create fast-create update fast-update

# Load environment variables from .env file if it exists
-include .env

# Install dependencies
install:
	npm install

# Run development server
dev:
	npm run dev

# Build the project (full build with type checking)
build:
	npm run build
	
# Quick build (skips type checking for faster builds)
fast-build:
	npx vite build --mode development

# Upload the built file to Akeneo PIM by creating a new extension
create: build
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

# Fast create (quick build + create)
fast-create: fast-build
	@echo "Fast-uploading extension to $(PIM_HOST)..."
	@echo "Opening $(PROJECT_PATH)/dist/demo.js"
	@curl --location '$(PIM_HOST)/api/rest/v1/ui-extensions' \
		--header 'Authorization: Bearer $(API_TOKEN)' \
		--form 'name="sdk_script_extension"' \
		--form 'type="sdk_script"' \
		--form 'position="pim.product.panel"' \
		--form 'file=@"$(PROJECT_PATH)/dist/demo.js"' \
		--form 'configuration[labels][en_US]="SDK script test extension"' \
		--form 'configuration[default_label]="SDK script test extension"'
	@echo "Fast upload complete!"

# Credentials configuration for upload (uncomment to use)
# upload-with-credentials: build
# 	@echo "Uploading extension with credentials to $(PIM_HOST)..."
# 	@curl --location '$(PIM_HOST)/api/rest/v1/ui-extensions' \
# 		--header 'Authorization: Bearer $(API_TOKEN)' \
# 		--form 'name="sdk_script_extension"' \
# 		--form 'type="sdk_script"' \
# 		--form 'position="pim.product.panel"' \
# 		--form 'file=@"$(PROJECT_PATH)/dist/demo.js"' \
# 		--form 'configuration[labels][en_US]="SDK script test extension"' \
# 		--form 'configuration[default_label]="SDK script test extension"' \
# 		--form 'credentials[0][code]="credential_code_example"' \
# 		--form 'credentials[0][type]="Bearer Token"' \
# 		--form 'credentials[0][value]="token_value"'
# 	@echo "Upload with credentials complete!"

	@echo "Upload complete!"

# Update an existing extension using its UUID (with full build)
update: build
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

# Fast update (quick build + update)
fast-update: fast-build
	@echo "Fast-updating extension with UUID: $(EXTENSION_UUID) on $(PIM_HOST)..."
	@curl -X POST '$(PIM_HOST)/api/rest/v1/ui-extensions/$(EXTENSION_UUID)' \
		-H "Content-Type: multipart/form-data" \
		--header 'Authorization: Bearer $(API_TOKEN)' \
		--form 'name="sdk_script_extension"' \
		--form 'type="sdk_script"' \
		--form 'position="pim.activity.navigation.tab"' \
		--form 'file=@"$(PROJECT_PATH)/dist/demo.js"' \
		--form 'configuration[labels][en_US]="SDK script test extension"' \
		--form 'configuration[default_label]="SDK script test extension"'
	@echo "Fast update complete!"

# Watch for changes and automatically build/update (requires fswatch to be installed)
watch-and-update:
	@echo "Watching for changes and updating on file change..."
	@fswatch -o src/ | xargs -n1 -I{} make fast-update

# Update an existing extension with credentials
# update-with-credentials: build
# 	@echo "Updating extension with credentials - UUID: $(EXTENSION_UUID) on $(PIM_HOST)..."
# 	@curl -X POST '$(PIM_HOST)/api/rest/v1/ui-extensions/$(EXTENSION_UUID)' \
# 		-H "Content-Type: multipart/form-data" \
# 		--header 'Authorization: Bearer $(API_TOKEN)' \
# 		--form 'name="sdk_script_extension"' \
# 		--form 'type="sdk_script"' \
# 		--form 'position="pim.activity.navigation.tab"' \
# 		--form 'file=@"$(PROJECT_PATH)/dist/demo.js"' \
# 		--form 'configuration[labels][en_US]="SDK script test extension"' \
# 		--form 'configuration[default_label]="SDK script test extension"' \
# 		--form 'credentials[0][code]="credential_code_example"' \
# 		--form 'credentials[0][type]="Bearer Token"' \
# 		--form 'credentials[0][value]="token_value"'
# 	@echo "Update with credentials complete!"
