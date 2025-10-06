// Example of using the Association Type v1 API capabilities
export async function associationTypeExample(): Promise<void> {
    const associationTypeApi = globalThis.PIM.api.association_type_v1;

    try {
      // List all association types
      console.log('Listing all association types...');
      const associationTypeList = await associationTypeApi.list({
        limit: 10,
        page: 1,
        with_count: true,
      });
      console.log(`Found ${associationTypeList.count} association types`);
      console.log('First page items:', associationTypeList.items.map(item => item.code));

      // Create a new association type (check if it exists first)
      console.log('\nCreating a new bidirectional association type...');
      try {
        await associationTypeApi.get({ code: 'REPLACEMENT_PARTS' });
        console.log('Association type already exists, skipping creation...');
      } catch (error) {
        // Association type doesn't exist, create it
        await associationTypeApi.create({
          data: {
            code: 'REPLACEMENT_PARTS',
            labels: {
              en_US: 'Replacement Parts',
              fr_FR: 'Pièces de rechange',
            },
            is_two_way: true,     // This makes it bidirectional
          },
        });
        console.log('Association type created successfully');
      }

      // Get the created association type
      console.log('\nGetting the created association type...');
      const associationType = await associationTypeApi.get({
        code: 'REPLACEMENT_PARTS',
      });
      console.log('Association type details:', {
        code: associationType.code,
        labels: associationType.labels,
        isQuantified: associationType.isQuantified,
        isTwoWay: associationType.isTwoWay,
      });

      // Update the association type
      console.log('\nUpdating the association type...');
      await associationTypeApi.patch({
        code: 'REPLACEMENT_PARTS',
        data: {
          labels: {
            en_US: 'Spare Parts',          // Update English label
            fr_FR: 'Pièces détachées',     // Update French label
            de_DE: 'Ersatzteile',          // Add German label
          },
        },
      });
      console.log('Association type updated successfully');

      // Get the updated association type to verify changes
      console.log('\nGetting the updated association type to verify changes...');
      const updatedAssociationType = await associationTypeApi.get({
        code: 'REPLACEMENT_PARTS',
      });
      console.log('Updated association type details:', {
        code: updatedAssociationType.code,
        labels: updatedAssociationType.labels,
        isQuantified: updatedAssociationType.isQuantified,
        isTwoWay: updatedAssociationType.isTwoWay,
      });

    } catch (error) {
      console.error('An error occurred:', error);
      if ('response' in (error as any)) {
        console.error('API Response:', (error as any).response?.data);
      }
    }
}