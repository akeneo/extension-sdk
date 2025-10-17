// Example of using the Attribute Group v1 API capabilities
export async function attributeGroupExample(): Promise<void> {
    const attributeGroupApi = globalThis.PIM.api.attribute_group_v1;

    try {
      // List all attribute groups
      console.log('Listing all attribute groups...');
      const attributeGroupList = await attributeGroupApi.list({
        limit: 10,
        page: 1,
        with_count: true,
      });
      console.log(`Found ${attributeGroupList.count} attribute groups`);
      console.log('First page items:', attributeGroupList.items.map(item => ({
        code: item.code,
        sortOrder: item.sortOrder,
      })));

      // Create a new attribute group (check if it exists first)
      console.log('\nCreating a new attribute group for technical specifications...');
      try {
        await attributeGroupApi.get({ code: 'technical_specs' });
        console.log('Attribute group already exists, skipping creation...');
      } catch (error) {
        // Attribute group doesn't exist, create it
        await attributeGroupApi.create({
          data: {
            code: 'technical_specs',
            sort_order: 10,
            attributes: [
              'brand',
              'erp_name',
              'name',
            ],
            labels: {
              en_US: 'Technical Specifications',
              fr_FR: 'Spécifications techniques',
            },
          },
        });
        console.log('Attribute group created successfully');
      }

      // Get the created attribute group
      console.log('\nGetting the created attribute group...');
      const attributeGroup = await attributeGroupApi.get({
        code: 'technical_specs',
      });
      console.log('Attribute group details:', {
        code: attributeGroup.code,
        sortOrder: attributeGroup.sortOrder,
        attributes: attributeGroup.attributes,
        labels: attributeGroup.labels,
      });

      // Update the attribute group
      console.log('\nUpdating the attribute group...');
      await attributeGroupApi.patch({
        code: 'technical_specs',
        data: {
          // Update sort order and add a new attribute and label
          sort_order: 5,
          attributes: [
            ...attributeGroup.attributes || [],
            'meta_title',
          ],
          labels: {
            ...attributeGroup.labels,
            de_DE: 'Technische Spezifikationen',
          },
        },
      });
      console.log('Attribute group updated successfully');

      // Get the updated attribute group to verify changes
      console.log('\nGetting the updated attribute group to verify changes...');
      const updatedAttributeGroup = await attributeGroupApi.get({
        code: 'technical_specs',
      });
      console.log('Updated attribute group details:', {
        code: updatedAttributeGroup.code,
        sortOrder: updatedAttributeGroup.sortOrder,
        attributes: updatedAttributeGroup.attributes,
        labels: updatedAttributeGroup.labels,
      });

    } catch (error) {
      console.error('An error occurred:', error);
      if ('response' in (error as any)) {
        console.error('API Response:', (error as any).response?.data);
      }
    }
}
