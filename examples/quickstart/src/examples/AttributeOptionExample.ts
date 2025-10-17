// Example of using the Attribute Option v1 API capabilities
export async function attributeOptionExample(): Promise<void> {
    const attributeOptionApi = globalThis.PIM.api.attribute_option_v1;

    try {
      // List attribute options for a specific attribute
      console.log('Listing attribute options for "size" attribute...');
      const attributeOptionList = await attributeOptionApi.list({
        attribute_code: 'size',
        limit: 10,
        page: 1,
        with_count: true,
      });
      console.log(`Found ${attributeOptionList.count} size options`);
      console.log('First page items:', attributeOptionList.items.map(item => ({
        code: item.code,
        sortOrder: item.sortOrder,
        labels: item.labels,
      })));

      // Create a new attribute option (check if it exists first)
      console.log('\nCreating a new size option...');
      try {
        await attributeOptionApi.get({ attribute_code: 'size', code: 'ZXXL' });
        console.log('Attribute option already exists, skipping creation...');
      } catch (error) {
        // Attribute option doesn't exist, create it
        await attributeOptionApi.create({
          attributeCode: 'size',
          data: {
            code: 'ZXXL',
            sort_order: 50, // Position after XL
            labels: {
              en_US: 'zuper Extra Extra Large',
              fr_FR: 'zuper Très Très Grand',
            },
          },
        });
        console.log('Attribute option created successfully');
      }

      // Get the created attribute option
      console.log('\nGetting the created attribute option...');
      const attributeOption = await attributeOptionApi.get({
        attribute_code: 'size',
        code: 'ZXXL',
      });
      console.log('Attribute option details:', {
        code: attributeOption.code,
        sortOrder: attributeOption.sortOrder,
        labels: attributeOption.labels,
        attribute: attributeOption.attribute, // The attribute code this option belongs to
      });

      // Update the attribute option
      console.log('\nUpdating the attribute option...');
      await attributeOptionApi.patch({
        attribute_code: 'size',
        code: 'ZXXL',
        data: {
          sort_order: 60, // Move it further down the list
          labels: {
            en_US: 'zuper Double Extra Large', // Update English label
            fr_FR: 'zupper Double Extra Large', // Update French label
            de_DE: 'zupper Doppelt Extra Groß', // Add German label
          },
        },
      });
      console.log('Attribute option updated successfully');

      // Get the updated attribute option to verify changes
      console.log('\nGetting the updated attribute option to verify changes...');
      const updatedAttributeOption = await attributeOptionApi.get({
        attribute_code: 'size',
        code: 'ZXXL',
      });
      console.log('Updated attribute option details:', {
        code: updatedAttributeOption.code,
        sortOrder: updatedAttributeOption.sortOrder,
        labels: updatedAttributeOption.labels,
        attribute: updatedAttributeOption.attribute,
      });

    } catch (error) {
      console.error('An error occurred:', error);
      if ('response' in (error as any)) {
        console.error('API Response:', (error as any).response?.data);
      }
    }
}
