// Example of using the Category API capabilities
export async function categoryExample(): Promise<void> {
    const categoryApi = globalThis.PIM.api.category_v1;

    try {
      // List categories
      console.log('Listing categories...');
      const categoryList = await categoryApi.list({
        limit: 10,
        page: 1,
        withCount: true,
        withPosition: true
      });
      console.log(`Found ${categoryList.count} categories`);
      console.log('First page items:', categoryList.items.map(item => item.code));

      // We need at least one existing category to use as reference
      if (categoryList.items.length === 0) {
        console.log('No categories found. Cannot proceed with the example.');
        return;
      }

      // Get a reference category
      const referenceCategory = categoryList.items[0];
      console.log('\nReference category details:', {
        code: referenceCategory.code,
        parent: referenceCategory.parent,
        labels: referenceCategory.labels,
        position: referenceCategory.position
      });

      // Create a new test category
      const testCategoryCode = `TEST_CATEGORY_${Date.now()}`;
      console.log(`\nCreating a new category for testing: ${testCategoryCode}`);

      try {
        // Create the test category (check if it exists first)
        try {
          await categoryApi.get({ code: testCategoryCode });
          console.log('Test category already exists, skipping creation...');
        } catch (error) {
          // Category doesn't exist, create it
          await categoryApi.create({
            data: {
              code: testCategoryCode,
              parent: referenceCategory.code,
              labels: {
                en_US: 'Test Category',
                fr_FR: 'Catégorie de Test'
              }
            }
          });
          console.log('Test category created successfully!');
        }

        // Get the newly created category
        console.log(`\nRetrieving the test category: ${testCategoryCode}`);
        const testCategory = await categoryApi.get({
          code: testCategoryCode,
          withPosition: true
        });
        console.log('Test category details:', {
          code: testCategory.code,
          parent: testCategory.parent,
          labels: testCategory.labels,
          position: testCategory.position
        });

        // Update the test category
        console.log(`\nUpdating the test category: ${testCategoryCode}`);
        await categoryApi.patch({
          code: testCategoryCode,
          data: {
            code: testCategoryCode,
            labels: {
              en_US: 'Updated Test Category',
              fr_FR: 'Catégorie de Test Mise à Jour',
              de_DE: 'Test Kategorie'
            }
          }
        });
        console.log('Test category updated successfully');

        // Verify the update
        console.log(`\nVerifying the update of test category: ${testCategoryCode}`);
        const updatedCategory = await categoryApi.get({
          code: testCategoryCode
        });
        console.log('Updated labels:', updatedCategory.labels);

        const subCategoryCode = `${testCategoryCode}_SUB`;
        console.log(`\nCreating a subcategory: ${subCategoryCode}`);
        try {
          await categoryApi.get({ code: subCategoryCode });
          console.log('Subcategory already exists, skipping creation...');
        } catch (error) {
          // Subcategory doesn't exist, create it
          await categoryApi.create({
            data: {
              code: subCategoryCode,
              parent: testCategoryCode,
              labels: {
                en_US: 'Test Subcategory',
                fr_FR: 'Sous-catégorie de Test'
              }
            }
          });
          console.log('Subcategory created successfully');
        }

        // Get the created subcategory to verify parent-child relationship
        const subCategory = await categoryApi.get({
          code: subCategoryCode
        });
        console.log('Subcategory details:', {
          code: subCategory.code,
          parent: subCategory.parent,
          labels: subCategory.labels
        });

      } catch (error) {
        console.error('An error occurred during test:', error);
        if ('response' in (error as any)) {
          console.error('API Response:', (error as any).response?.data);
        }
      }

    } catch (error) {
      console.error('An error occurred:', error);
      if ('response' in (error as any)) {
        console.error('API Response:', (error as any).response?.data);
      }
    }
}
