// Example of using the Attribute API capabilities
export async function attributeExample(): Promise<void> {
    const attributeApi = globalThis.PIM.api.attribute_v1;

    try {
      // List attributes to find reference attributes
      console.log('Listing attributes...');
      const attributeList = await attributeApi.list({
        limit: 10,
        page: 1,
        withCount: true,
      });
      console.log(`Found ${attributeList.count} attributes`);
      console.log('First page items:', attributeList.items.map(item => item.code));

      // We need at least one existing attribute to use as reference
      if (attributeList.items.length === 0) {
        console.log('No attributes found. Cannot proceed with the example.');
        return;
      }

      // Get a reference attribute to use its properties
      const referenceAttribute = attributeList.items[0];
      if (!referenceAttribute.code || !referenceAttribute.type) {
        console.log('Reference attribute is missing required properties. Cannot proceed with the example.');
        return;
      }

      // Display some information about the reference attribute
      console.log('\nReference attribute details:', {
        code: referenceAttribute.code,
        type: referenceAttribute.type,
        group: referenceAttribute.group,
        localizable: referenceAttribute.localizable,
        scopable: referenceAttribute.scopable
      });

      // Get a specific attribute by code
      console.log(`\nRetrieving a specific attribute: ${referenceAttribute.code}`);
      const specificAttribute = await attributeApi.get({
        code: referenceAttribute.code,
      });
      console.log('Specific attribute details:', {
        code: specificAttribute.code,
        type: specificAttribute.type,
        group: specificAttribute.group,
        usableInGrid: specificAttribute.usableInGrid
      });

      // Create a new attribute that we'll use for patch operations
      const testAttributeCode = `test_attr_${Date.now()}`;
      console.log(`\nCreating a new attribute for testing: ${testAttributeCode}`);

      // Get an attribute group from our reference attribute
      const attributeGroup = referenceAttribute.group || 'other';

      try {
        // Create the test attribute (check if it exists first)
        try {
          await attributeApi.get({ code: testAttributeCode });
          console.log('Test attribute already exists, skipping creation...');
        } catch (error) {
          // Attribute doesn't exist, create it
          await attributeApi.create({
            data: {
              code: testAttributeCode,
              type: 'pim_catalog_text', // Simple text attribute
              group: attributeGroup,
              labels: {
                en_US: 'Test Attribute',
                fr_FR: 'Attribut de Test'
              },
              localizable: true,
              scopable: true,
              sort_order: 10,
              max_characters: 255,
              unique: false,
              usable_in_grid: true
            }
          });
          console.log('Test attribute created successfully!');
        }

        // Get the newly created attribute
        console.log(`\nRetrieving the test attribute: ${testAttributeCode}`);
        const testAttribute = await attributeApi.get({
          code: testAttributeCode
        });
        console.log('Test attribute details:', {
          code: testAttribute.code,
          type: testAttribute.type,
          group: testAttribute.group,
          localizable: testAttribute.localizable,
          scopable: testAttribute.scopable
        });

        // Update the test attribute
        console.log(`\nUpdating the test attribute: ${testAttributeCode}`);
        await attributeApi.patch({
          code: testAttributeCode,
          data: {
            labels: {
              en_US: 'Updated Test Attribute',
              fr_FR: 'Attribut de Test Mis à Jour'
            },
            max_characters: 100, // Increase max characters
            usable_in_grid: false // Change grid usage
          }
        });
        console.log('Test attribute updated successfully!');

        // Get the updated attribute
        console.log(`\nRetrieving the updated test attribute: ${testAttributeCode}`);
        const updatedAttribute = await attributeApi.get({
          code: testAttributeCode
        });
        console.log('Updated attribute details:', {
          code: updatedAttribute.code,
          labels: updatedAttribute.labels,
          maxCharacters: updatedAttribute.maxCharacters,
          usableInGrid: updatedAttribute.usableInGrid
        });
      } catch (createError) {
        console.error('Error during attribute create/update operations:', createError);
      }
    } catch (error) {
      console.error('Error in attribute example:', error);
    }
}
