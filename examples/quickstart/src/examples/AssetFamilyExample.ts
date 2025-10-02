// Example of using the Asset Family v1 API capabilities
export async function assetFamilyExample(): Promise<void> {
    const assetFamilyApi = globalThis.PIM.api.asset_family_v1;

    try {
      // List all asset families (no parameters needed)
      console.log('Listing all asset families...');
      const families = await assetFamilyApi.list();
      console.log(`Found ${families.length} asset families`);
      console.log('Asset families:', families.map(family => ({
        code: family.code,
        labels: family.labels,
      })));

      // Get a specific asset family
      console.log('\nGetting the "packshot" asset family...');
      const family = await assetFamilyApi.get({
        code: 'packshot',
      });
      console.log('Asset family details:', {
        code: family.code,
        labels: family.labels,
        attributeAsMainMedia: family.attributeAsMainMedia,
        productLinkRules: family.productLinkRules,
        transformations: family.transformations,
        namingConvention: family.namingConvention,
      });

      // Create/Update asset families using upsert
      console.log('\nCreating/Updating asset families...');
      const upsertParams = {
        data: [
          {
            code: 'product_lifestyle',
            labels: {
              en_US: 'Product Lifestyle Images',
              fr_FR: 'Images Lifestyle des Produits',
            },
          },
          {
            code: '3d_renders',
            labels: {
              en_US: '3D Product Renders',
              fr_FR: 'Rendus 3D des Produits',
            },
          },
        ],
      };

      const result = await assetFamilyApi.upsert(upsertParams);
      console.log('Upsert result:', result.items.map(item => ({
        code: item.code,
        status: item.status,
        message: item.message,
      })));

      // Verify creation by getting one of the created families
      console.log('\nVerifying creation by getting the lifestyle family...');
      const createdFamily = await assetFamilyApi.get({
        code: 'product_lifestyle',
      });
      console.log('Created family details:', {
        code: createdFamily.code,
        labels: createdFamily.labels,
        attributeAsMainMedia: createdFamily.attributeAsMainMedia,
        namingConvention: createdFamily.namingConvention,
        productLinkRules: createdFamily.productLinkRules,
        transformations: createdFamily.transformations,
      });

    } catch (error) {
      console.error('An error occurred:', error);
      if ('response' in (error as any)) {
        console.error('API Response:', (error as any).response?.data);
      }
    }
}
