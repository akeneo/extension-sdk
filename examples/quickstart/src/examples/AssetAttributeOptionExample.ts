// Example of using the Asset Attribute Option v1 API capabilities
export async function assetAttributeOptionExample(): Promise<void> {
    const assetAttributeOptionApi = globalThis.PIM.api.asset_attribute_option_v1;

    try {
      // List options for a specific attribute in an asset family
      console.log('Listing options for the "tags" attribute in "packshot" family...');
      const listParams = {
        assetFamilyCode: 'packshot',
        attributeCode: 'tags',
      };

      const optionList = await assetAttributeOptionApi.list(listParams);
      console.log(`Found ${optionList.length} options`);
      console.log('Options:', optionList.map(option => ({
        code: option.code,
        assetFamilyCode: option.assetFamilyCode,
        attributeCode: option.attributeCode,
        labels: option.labels,
      })));

      // Create/Update options for the quality attribute using upsert
      console.log('\nCreating quality option...');
      await assetAttributeOptionApi.upsert({
        assetFamilyCode: 'packshot',
        attributeCode: 'tags',
        code: 'web_quality',
        data: {
          code: 'web_quality',
          labels: {
            en_US: 'Web Quality',
            fr_FR: 'Qualité Web',
          },
        },
      });
      console.log('Option created successfully');

      // Create another option
      await assetAttributeOptionApi.upsert({
        assetFamilyCode: 'packshot',
        attributeCode: 'tags',
        code: 'print_quality',
        data: {
            code: 'print_quality',
          labels: {
            en_US: 'Print Quality',
            fr_FR: 'Qualité Impression',
          },
        },
      });

      // Create a third option
      await assetAttributeOptionApi.upsert({
        assetFamilyCode: 'packshot',
        attributeCode: 'tags',
        code: 'hd_quality',
        data: {
          code: 'hd_quality',
          labels: {
            en_US: 'HD Quality',
            fr_FR: 'Qualité HD',
          },
        },
      });

      // Get a specific option
      console.log('\nGetting the HD quality option...');
      const option = await assetAttributeOptionApi.get({
        assetFamilyCode: 'packshot',
        attributeCode: 'tags',
        code: 'hd_quality',
      });
      console.log('Option details:', {
        code: option.code,
        assetFamilyCode: option.assetFamilyCode,
        attributeCode: option.attributeCode,
        labels: option.labels,
      });

      // Update an option
      console.log('\nUpdating the HD quality option...');
      await assetAttributeOptionApi.upsert({
        assetFamilyCode: 'packshot',
        attributeCode: 'tags',
        code: 'hd_quality',
        data: {
          code: 'hd_quality',
          labels: {
            en_US: 'High Definition Quality',    // Update English label
            fr_FR: 'Qualité Haute Définition',   // Update French label
            de_DE: 'Hochauflösende Qualität',    // Add German label
          },
        },
      });
      console.log('Option updated successfully');

      // Get the updated option to verify changes
      console.log('\nGetting the updated option to verify changes...');
      const updatedOption = await assetAttributeOptionApi.get({
        assetFamilyCode: 'packshot',
        attributeCode: 'tags',
        code: 'hd_quality',
      });
      console.log('Updated option details:', {
        code: updatedOption.code,
        assetFamilyCode: updatedOption.assetFamilyCode,
        attributeCode: updatedOption.attributeCode,
        labels: updatedOption.labels,
      });

    } catch (error) {
      console.error('An error occurred:', error);
      if ('response' in (error as any)) {
        console.error('API Response:', (error as any).response?.data);
      }
    }
}
