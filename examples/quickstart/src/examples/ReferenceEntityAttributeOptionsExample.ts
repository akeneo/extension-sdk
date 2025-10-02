// Example of using the Reference Entity Attribute Option v1 API capabilities
export async function referenceEntityAttributeOptionsExample(): Promise<void> {
  const referenceEntityAttributeOptionApi = globalThis.PIM.api.reference_entity_attribute_option_v1;

  try {
    // Define reference entity and attribute codes to work with
    const referenceEntityCode = 'materials';
    const attributeCode = 'material_type'; // Assuming this is a single_option or multiple_options attribute

    // First, ensure we have a single_option or multiple_options attribute to work with
    console.log('\nCreating a single_option attribute for testing options...');
    const referenceEntityAttributeApi = globalThis.PIM.api.reference_entity_attribute_v1;

    // Create a single_option attribute if it doesn't exist yet
    const singleOptionAttribute = {
      code: attributeCode,
      type: 'single_option',
      value_per_locale: false,
      value_per_channel: false,
      labels: {
        'en_US': 'Material Type',
        'fr_FR': 'Type de Matériau'
      },
      is_required_for_completeness: false
    };

    await referenceEntityAttributeApi.upsert({
      referenceEntityCode,
      attributeCode,
      data: singleOptionAttribute as any // Using type assertion to bypass type checking
    });
    console.log('Single option attribute created successfully');

    // List all options for the attribute
    console.log(`\nListing all options for the "${attributeCode}" attribute...`);
    const optionsList = await referenceEntityAttributeOptionApi.list({
      referenceEntityCode,
      attributeCode
    });
    console.log('Options list:', optionsList);

    // Create new options for the attribute
    console.log('\nCreating new options for the attribute...');
    const optionsToCreate = [
      {
        code: 'natural',
        labels: {
          'en_US': 'Natural',
          'fr_FR': 'Naturel'
        }
      },
      {
        code: 'synthetic',
        labels: {
          'en_US': 'Synthetic',
          'fr_FR': 'Synthétique'
        }
      },
      {
        code: 'mixed',
        labels: {
          'en_US': 'Mixed',
          'fr_FR': 'Mixte'
        }
      }
    ];

    await referenceEntityAttributeOptionApi.upsert({
      referenceEntityCode,
      attributeCode,
      data: optionsToCreate
    });
    console.log('Options created successfully');

    // Get a specific option
    console.log('\nGetting the "natural" option...');
    const option = await referenceEntityAttributeOptionApi.get({
      referenceEntityCode,
      attributeCode,
      code: 'natural'
    });
    console.log('Option details:', option);

    // Update existing options
    console.log('\nUpdating the "mixed" option...');
    const optionsToUpdate = [
      {
        code: 'mixed',
        labels: {
          'en_US': 'Mixed Materials',
          'fr_FR': 'Matériaux Mixtes',
          'de_DE': 'Gemischte Materialien'
        }
      }
    ];

    const updateResult = await referenceEntityAttributeOptionApi.upsert({
      referenceEntityCode,
      attributeCode,
      data: optionsToUpdate
    });
    console.log('Update result:', updateResult);

    // Create and update options in a single call (bulk operation)
    console.log('\nPerforming bulk operation (create and update)...');
    const bulkOptions = [
      // Update existing option
      {
        code: 'natural',
        labels: {
          'en_US': 'Natural Material',
          'fr_FR': 'Matériau Naturel'
        }
      },
      // Create new option
      {
        code: 'recycled',
        labels: {
          'en_US': 'Recycled',
          'fr_FR': 'Recyclé'
        }
      }
    ];

    const bulkResult = await referenceEntityAttributeOptionApi.upsert({
      referenceEntityCode,
      attributeCode,
      data: bulkOptions
    });
    console.log('Bulk operation result:', bulkResult);

    // List all options again to verify our operations
    console.log('\nListing all options after operations...');
    const updatedOptionsList = await referenceEntityAttributeOptionApi.list({
      referenceEntityCode,
      attributeCode
    });

    // Display options
    console.log(`Found ${updatedOptionsList.length} options for attribute "${attributeCode}"`);
    updatedOptionsList.forEach((option, index) => {
      console.log(`${index + 1}. ${option.code}: ${JSON.stringify(option.labels)}`);
    });

  } catch (error) {
    console.error('An error occurred:', error);
    if ('response' in (error as any)) {
      console.error('API Response:', (error as any).response?.data);
    }
  }
}
