import { v4 } from 'uuid';

// Example of using the Product UUID API capabilities
export async function productUuidExample(): Promise<void> {
  const productUuidApi = globalThis.PIM.api.product_uuid_v1;

  try {
    // List products
    console.log('Listing products...');
    const productList = await productUuidApi.list({
      limit: 10,
      page: 1,
      withCount: true,
      withCompletenesses: true
    });
    console.log(`Found ${productList.count} products`);
    console.log('First page items:', productList.items.map(item => ({
      uuid: item.uuid,
      completness: item.completenesses,
    })));

    if (productList.items.length > 0) {
      const firstProduct = productList.items[0];

      // Check if we have a valid product with UUID
      if (!firstProduct.uuid) {
        console.log('Unable to proceed: First product has no UUID');
        return;
      }

      // Get a specific product by UUID
      console.log(`\nGetting product with UUID: ${firstProduct.uuid}`);
      const product = await productUuidApi.get({
        uuid: firstProduct.uuid,
        withCompletenesses: true
      });

      console.log('Product details:', {
        uuid: product.uuid,
        enabled: product.enabled,
        family: product.family,
        categories: product.categories,
        attributeCount: product.values ? Object.keys(product.values).length : 0,
        completness: product.completenesses
      });

       // Example of attribute values (showing one or two attributes if they exist)
      if (product.values) {
        const attributeCodes = Object.keys(product.values).slice(0, 2);
        console.log('\nSample attribute values:');
        attributeCodes.forEach(code => {
          // Use type assertion to tell TypeScript that values can be indexed with a string
          console.log(`${code}:`, (product.values as Record<string, any>)[code]);
        });
      } 

       // Create a new product
      console.log('\nDemonstrating product creation...');
      // const newProductName = `test_product_${Date.now()}`;
      const newProductUuid = v4();

      try {
        console.log(`Creating new product with uuid: ${newProductUuid}`);

        // Type definition for product values
        interface ProductValue {
          locale?: string;
          scope?: string;
          data: any;
        }

        // Prepare creation data using the reference product's family
        const createData: {
          uuid: string;
          enabled: boolean;
          family: string | null | undefined;
          categories: string[];
          values: Record<string, ProductValue[]>;
        } = {
          uuid: newProductUuid,
          enabled: true,
          family: product.family, // Use the family from our reference product
          categories: ['brands'],
          values: {}
        };

        // Add a simple value if the reference product has any values
        if (product.values) {
          // Find a text attribute to copy
          const textAttribute = Object.entries(product.values as Record<string, any[]>).find(([_code, values]) => {
            return values.some(v => typeof v.data === 'string' && v.locale && v.scope);
          });

          if (textAttribute) {
            const [attrCode, values] = textAttribute;
            const template = values.find(v => typeof v.data === 'string' && v.locale && v.scope);
            if (template) {
              createData.values[attrCode] = [{
                locale: template.locale,
                scope: template.scope,
                data: `Test value for ${newProductUuid}`
              }];
            }
          }
        }

        console.log('Create data:', createData);

        // Check if product exists before creating
        try {
          await productUuidApi.get({ uuid: newProductUuid });
          console.log('Product already exists, skipping creation...');
        } catch (error) {
          // Product doesn't exist, create it
          await productUuidApi.create({
            data: createData
          });
          console.log('Product created successfully');
        }

        // Verify the creation by getting the new product
        console.log('\nVerifying product creation...');
        const createdProduct = await productUuidApi.get({
          uuid: newProductUuid
        });

        console.log('Created product details:', {
          uuid: createdProduct.uuid,
          enabled: createdProduct.enabled,
          family: createdProduct.family,
          categories: createdProduct.categories
        });

        // Update the created product
        console.log(`\nUpdating newly created product: ${createdProduct.uuid}`);

        // Prepare update data - we'll toggle the enabled status and update a category
        const updateData = {
          enabled: false,
          categories: [...(createdProduct.categories || []), 'home_appliances']
        };

        console.log('Update data:', updateData);

        await productUuidApi.patch({
          uuid: createdProduct.uuid,
          data: updateData
        });
        console.log('Product updated successfully');

        // Verify the update by getting the product again
        const updatedProduct = await productUuidApi.get({
          uuid: createdProduct.uuid
        });

        console.log('\nVerifying update...');
        console.log('Updated product details:', {
          uuid: updatedProduct.uuid,
          enabled: updatedProduct.enabled, // Should be toggled to false
          categories: updatedProduct.categories // Should include the new category
        });

        // Demonstrate search capability with filtering
        console.log('\nSearching for specific products with filtering...');
        const searchResult = await productUuidApi.list({
          search: {
            enabled: [{"operator":"=","value":false}]
          },
          withCount: true
        });

        console.log(`Found ${searchResult.count} products matching search criteria`);

        // Clean up by deleting the test product
        console.log('\nCleaning up - deleting the test product...');

        await productUuidApi.delete({
          uuid: newProductUuid
        });
        console.log('Test product deleted successfully');

        // Verify deletion
        try {
          await productUuidApi.get({
            uuid: newProductUuid
          });
          console.log('Warning: Product still exists after deletion attempt');
        } catch (error) {
          console.log('Verified deletion: Product no longer exists');
        }

      } catch (operationError) {
        console.error('Error during product operations:', operationError);
        if ('response' in (operationError as any)) {
          console.error('API Response:', (operationError as any).response?.data);
        }
      } 
 
      // Also demonstrate update operation on the original product
      console.log(`\nUpdating original product: ${product.identifier || product.uuid}`);

      // Prepare update data - we'll toggle the enabled status and update a category
      const originalUpdateData = {
        enabled: !product.enabled,
        categories: [...(product.categories || []), 'cameras_sales']
      };

      console.log('Update data:', originalUpdateData);

      try {
        await productUuidApi.patch({
          uuid: product.uuid,
          data: originalUpdateData
        });
        console.log('Original product updated successfully');

        // Verify the update by getting the product again
        const updatedOriginalProduct = await productUuidApi.get({
          uuid: product.uuid
        });

        console.log('\nVerifying original product update...');
        console.log('Updated product details:', {
          uuid: updatedOriginalProduct.uuid,
          identifier: updatedOriginalProduct.identifier,
          enabled: updatedOriginalProduct.enabled,
          categories: updatedOriginalProduct.categories
        });

      } catch (updateError) {
        console.error('Error updating original product:', updateError);
        if ('response' in (updateError as any)) {
          console.error('API Response:', (updateError as any).response?.data);
        }
      }
    } else {
      console.log('No products found to demonstrate get, patch, and delete operations');
    }

  } catch (error) {
    console.error('An error occurred:', error);
    if ('response' in (error as any)) {
      console.error('API Response:', (error as any).response?.data);
    }
  }
}
