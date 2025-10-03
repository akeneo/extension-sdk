// Example of using the Asset v1 API capabilities
export async function assetExample(): Promise<void> {
  const assetApi = globalThis.PIM.api.asset_v1;

  try {
    // List assets from a specific asset family with proper filters
    console.log('Listing assets from the "packshots" family...');
    const listParams = {
      assetFamilyCode: 'packshot',
      channel: 'ecommerce',            // Get values for specific channel
      locales: 'en_US,fr_FR',         // Get values for specific locales
    };
    const assetList = await assetApi.list(listParams);
    console.log('First page of assets:', assetList);

    // Create a new asset using upsert
    console.log('\nCreating a new asset...');
    const assetData = {
      code: 'product_front_view',
      values: {
        label: [
          {
            locale: 'en_US',
            channel: null,
            data: 'Front view of the product',
          },
          {
            locale: 'fr_FR',
            channel: null,
            data: 'Vue de face du produit',
          },
        ],
      },
    };

    const upsertParams = {
      assetFamilyCode: 'packshot',
      asset: assetData,
    };
    await assetApi.upsert(upsertParams);
    console.log('Asset created successfully');

    // Get the created asset
    console.log('\nGetting the created asset...');
    const getParams = {
      assetFamilyCode: 'packshot',
      code: 'product_front_view',
    };
    const asset = await assetApi.get(getParams);
    console.log('Asset details:', {
      code: asset.code,
      assetFamilyCode: asset.assetFamilyCode,
      values: asset.values,
      created: asset.created,
      updated: asset.updated,
    });
    console.log('Asset details full list:', asset);

    // Update the existing asset with additional values
    console.log('\nUpdating the asset...');
    const updateData = {
      code: 'product_front_view',
      values: {
        ...asset.values,
        tags: [
          {
            locale: null,
            channel: null,
            data: ['table', 'blue', 'furniture'],
          },
        ],
      },
    };

    await assetApi.upsert({
      assetFamilyCode: 'packshot',
      asset: updateData,
    });
    console.log('Asset updated successfully');

  } catch (error) {
    console.error('An error occurred:', error);
    if ('response' in (error as any)) {
      console.error('API Response:', (error as any).response?.data);
    }
  }
}
