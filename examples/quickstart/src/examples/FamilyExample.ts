// Example of using the Family API capabilities
export async function familyExample(): Promise<void> {
    const familyApi = globalThis.PIM.api.family_v1;

    try {
      // List families
      console.log('Listing families...');
      const familyList = await familyApi.list({
        limit: 10,
        page: 1,
        withCount: true
      });
      console.log(`Found ${familyList.count} families`);
      console.log('First page items:', familyList.items.map(item => item.code));

      // We need at least one existing family to use as reference
      if (familyList.items.length === 0) {
        console.log('No families found. Cannot proceed with the example.');
        return;
      }

      // Get a reference family
      const referenceFamily = familyList.items[0];
      console.log('\nReference family details:', {
        code: referenceFamily.code,
        labels: referenceFamily.labels,
        attributeAsLabel: referenceFamily.attributeAsLabel,
        attributeAsImage: referenceFamily.attributeAsImage,
        attributes: referenceFamily.attributes ? referenceFamily.attributes.length : 0
      });

      // Create a new test family
      const testFamilyCode = `TEST_FAMILY_${Date.now()}`;
      console.log(`\nCreating a new family for testing: ${testFamilyCode}`);

      try {
        // Create the test family (check if it exists first)
        try {
          await familyApi.get({ code: testFamilyCode });
          console.log('Test family already exists, skipping creation...');
        } catch (error) {
          // Family doesn't exist, create it
          await familyApi.create({
            data: {
              code: testFamilyCode,
              labels: {
                en_US: 'Test Family',
                fr_FR: 'Famille de Test'
              },
              attribute_as_label: 'sku',
              attributes: referenceFamily.attributes ?
                referenceFamily.attributes.slice(0, 5) : // Take first 5 attributes from reference family
                ['sku'] // Fallback to just sku
            }
          });
          console.log('Test family created successfully!');
        }

        // Get the newly created family
        console.log(`\nRetrieving the test family: ${testFamilyCode}`);
        const testFamily = await familyApi.get({
          code: testFamilyCode
        });
        console.log('Test family details:', {
          code: testFamily.code,
          labels: testFamily.labels,
          attributeAsLabel: testFamily.attributeAsLabel,
          attributes: testFamily.attributes ? testFamily.attributes.length : 0
        });

        // Update the test family
        console.log(`\nUpdating the test family: ${testFamilyCode}`);
        await familyApi.patch({
          code: testFamilyCode,
          data: {
            code: testFamilyCode,
            labels: {
              en_US: 'Updated Test Family',
              fr_FR: 'Famille de Test Mise à Jour',
              de_DE: 'Test Familie'
            },
          }
        });
        console.log('Test family updated successfully');

        // Verify the update
        console.log(`\nVerifying the update of test family: ${testFamilyCode}`);
        const updatedFamily = await familyApi.get({
          code: testFamilyCode
        });
        console.log('Updated labels:', updatedFamily.labels);

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
