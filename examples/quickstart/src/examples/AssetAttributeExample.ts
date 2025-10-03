// Example of using the Asset Attribute v1 API capabilities
export async function assetAttributeExample(): Promise<void> {
    const assetAttributeApi = globalThis.PIM.api.asset_attribute_v1;

    try {
      // List attributes for a specific asset family
      console.log('Listing attributes for the "packshot" asset family...');
      const listParams = {
        assetFamilyCode: 'packshot',
      };

      const attributeList = await assetAttributeApi.list(listParams);
      console.log(`Found ${attributeList.length} attributes`);
      console.log('Attributes:', attributeList.map(attr => ({
        code: attr.code,
        type: attr.type,
        labels: attr.labels,
      })));

      // Create a new text attribute
      console.log('\nCreating a new text attribute...');
      const createParams = {
        assetFamilyCode: 'packshot',
        code: 'resolution',
        data: {
          code: 'resolution',
          labels: {
            en_US: 'Resolution',
            fr_FR: 'Résolution',
          },
          type: 'text',
        },
      };

      await assetAttributeApi.upsert(createParams);
      console.log('Text attribute created successfully');

      // Create a media attribute
      console.log('\nCreating a new media attribute...');
      const mediaAttributeParams = {
        assetFamilyCode: 'packshot',
        code: 'product_image',
        data: {
          code: 'product_image',
          labels: {
            en_US: 'Product Image',
            fr_FR: 'Image du Produit',
          },
          type: 'media_file',
        },
      };

      await assetAttributeApi.upsert(mediaAttributeParams);
      console.log('Media attribute created successfully');

      // Get a specific attribute
      console.log('\nGetting the created text attribute...');
      const getParams = {
        assetFamilyCode: 'packshot',
        code: 'resolution',
      };

      const attribute = await assetAttributeApi.get(getParams);
      console.log('Attribute details:', {
        code: attribute.code,
        type: attribute.type,
        labels: attribute.labels,
      });

      // Update an existing attribute
      console.log('\nUpdating the text attribute...');
      const updateParams = {
        assetFamilyCode: 'packshot',
        code: 'resolution',
        data: {
          labels: {
            ...attribute.labels,
            de_DE: 'Auflösung', // Add German label
          },
        },
      };

      await assetAttributeApi.upsert(updateParams);
      console.log('Attribute updated successfully');

    } catch (error) {
      console.error('An error occurred:', error);
      if ('response' in (error as any)) {
        console.error('API Response:', (error as any).response?.data);
      }
    }
}
