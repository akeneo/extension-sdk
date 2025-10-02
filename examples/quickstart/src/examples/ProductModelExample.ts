// Example of using the Product Model API capabilities
export async function productModelExample(): Promise<void> {
    const productModelApi = globalThis.PIM.api.product_model_v1;

    try {
      // List product models to find a reference model
      console.log('Listing product models...');
      const productModelList = await productModelApi.list({
        limit: 10,
        page: 1,
        withCount: true,
      });
      console.log(`Found ${productModelList.count} product models`);
      console.log('First page items:', productModelList.items.map(item => item.code));

      // We need at least one existing product model to use as reference
      if (productModelList.items.length === 0) {
        console.log('No product models found. Cannot proceed with the example.');
        return;
      }

      // Get a reference model to use its family and family_variant
      const referenceModel = productModelList.items[0];
      if (!referenceModel.code || !referenceModel.family || !referenceModel.family_variant) {
        console.log('Reference model is missing required properties. Cannot proceed with the example.');
        return;
      }

      // Display some information about the reference model
      console.log('\nReference model details:', {
        code: referenceModel.code,
        family: referenceModel.family,
        familyVariant: referenceModel.family_variant
      });

      // Create a new product model that we'll use for patch and delete operations
      const testModelCode = `TEST_MODEL_${Date.now()}`;
      console.log(`\nCreating a new product model for testing: ${testModelCode}`);

      try {
        // Create the test product model
        await productModelApi.post({
          data: {
            code: testModelCode,
            family: referenceModel.family,
            family_variant: referenceModel.family_variant,
            categories: [],
            values: {}
          }
        });
        console.log('Test product model created successfully!');

        // Get the newly created model
        console.log(`\nRetrieving the test product model: ${testModelCode}`);
        const testModel = await productModelApi.get({
          code: testModelCode
        });
        console.log('Test product model details:', {
          code: testModel.code,
          family: testModel.family,
          familyVariant: testModel.family_variant
        });

        // Update the test product model
        console.log(`\nUpdating the test product model: ${testModelCode}`);

        // Find a text attribute from the reference model that we can use
        let textAttribute = null;
        if (referenceModel.values) {
          textAttribute = Object.entries(referenceModel.values).find(([_attrCode, values]) => {
            const firstValue = values[0];
            return typeof firstValue.data === 'string' && firstValue.locale && firstValue.scope;
          });
        }

        // Prepare the update data
        const updateData: {
          categories: string[],
          values?: {
            [attributeCode: string]: Array<{
              locale?: string;
              scope?: string;
              data: any;
            }>;
          }
        } = {
          categories: ['headphones'], // Add a test category
        };

        // If we found a text attribute, use it
        if (textAttribute) {
          const [attrCode, values] = textAttribute;
          const firstValue = values[0];

          console.log(`Adding text attribute: ${attrCode}`);
          updateData.values = {
            [attrCode]: [
              {
                locale: firstValue.locale,
                scope: firstValue.scope,
                data: `Test value - ${new Date().toISOString()}`
              }
            ]
          };
        }

        // Perform the update
        await productModelApi.patch({
          code: testModelCode,
          data: updateData
        });
        console.log('Test product model updated successfully');

        // Verify the update
        console.log(`\nVerifying the update of test product model: ${testModelCode}`);
        const updatedModel = await productModelApi.get({
          code: testModelCode
        });
        console.log('Updated categories:', updatedModel.categories);

        if (textAttribute) {
          const [attrCode] = textAttribute;
          console.log(`Updated attribute ${attrCode}:`, updatedModel.values?.[attrCode]);
        }

        // Delete the test product model
        console.log(`\nDeleting the test product model: ${testModelCode}`);
        await productModelApi.delete({
          code: testModelCode
        });
        console.log('Test product model deleted successfully');

        // Verify the deletion
        console.log(`\nVerifying the deletion of test product model: ${testModelCode}`);
        try {
          await productModelApi.get({
            code: testModelCode
          });
          console.log('Warning: Test product model still exists after deletion!');
        } catch (error) {
          console.log('Verified: Test product model was successfully deleted');
        }

      } catch (error) {
        console.error('An error occurred during test:', error);
        if ('response' in (error as any)) {
          console.error('API Response:', (error as any).response?.data);
        }

        // Attempt to clean up if something failed
        try {
          console.log(`\nAttempting to clean up test product model: ${testModelCode}`);
          await productModelApi.delete({
            code: testModelCode
          });
          console.log('Clean-up successful');
        } catch (cleanupError) {
          console.log('Clean-up failed or product model already deleted');
        }
      }

    } catch (error) {
      console.error('An error occurred:', error);
      if ('response' in (error as any)) {
        console.error('API Response:', (error as any).response?.data);
      }
    }
}
