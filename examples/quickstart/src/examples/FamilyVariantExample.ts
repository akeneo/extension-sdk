// Example of using the Family Variant API capabilities
export async function familyVariantExample(): Promise<void> {
    const familyVariantApi = globalThis.PIM.api.family_variant_v1;

    try {
      // List all family variants for a specific family
      console.log('Listing all family variants for a family...');
      const familyVariantList = await familyVariantApi.list({
        familyCode: 'clothing',
        limit: 10,
        page: 1,
        withCount: true,
      });
      console.log(`Found ${familyVariantList.count} family variants in the clothing family`);
      console.log('First page items:', familyVariantList.items.map(item => item.code));

      // Create a new family variant
      console.log('\nCreating a new family variant...');
      await familyVariantApi.create({
        familyCode: 'clothing',
        data: {
          code: 'clothing_by_color_and_size',
          labels: {
            en_US: 'Clothing by color and size',
            fr_FR: 'Vêtements par couleur et taille',
          },
          variant_attribute_sets: [
            {
              level: 1,
              axes: ['color'],
              attributes: ['color', 'material', 'brand'],
            },
            {
              level: 2,
              axes: ['size'],
              attributes: ['size', 'ean', 'weight'],
            },
          ],
        },
      });
      console.log('Family variant created successfully');

      // Get the created family variant
      console.log('\nGetting the created family variant...');
      const familyVariant = await familyVariantApi.get({
        familyCode: 'clothing',
        code: 'clothing_by_color_and_size',
      });
      console.log('Family variant details:', {
        code: familyVariant.code,
        labels: familyVariant.labels,
        variantAttributeSets: familyVariant.variantAttributeSets,
      });

      // Update the family variant
      console.log('\nUpdating the family variant...');
      await familyVariantApi.patch({
        familyCode: 'clothing',
        code: 'clothing_by_color_and_size',
        data: {
          labels: {
            en_US: 'Clothing by color and size (updated)',
            fr_FR: 'Vêtements par couleur et taille (mis à jour)',
            de_DE: 'Kleidung nach Farbe und Größe',
          },
          variant_attribute_sets: [
            {
              level: 1,
              axes: ['color'],
              attributes: ['color', 'material', 'brand', 'description'], // Added description
            },
            {
              level: 2,
              axes: ['size'],
              attributes: ['size', 'ean', 'weight', 'price'], // Added price
            },
          ],
        },
      });
      console.log('Family variant updated successfully');

      // Get the updated family variant to verify changes
      console.log('\nGetting the updated family variant to verify changes...');
      const updatedFamilyVariant = await familyVariantApi.get({
        familyCode: 'clothing',
        code: 'clothing_by_color_and_size',
      });
      console.log('Updated family variant details:', {
        code: updatedFamilyVariant.code,
        labels: updatedFamilyVariant.labels,
        variantAttributeSets: updatedFamilyVariant.variantAttributeSets,
      });

    } catch (error) {
      console.error('An error occurred:', error);
      if ('response' in (error as any)) {
        console.error('API Response:', (error as any).response?.data);
      }
    }
}
