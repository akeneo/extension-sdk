// Example of using the Reference Entity Attribute v1 API capabilities
export async function referenceEntityAttributesExample(): Promise<void> {
  const referenceEntityAttributeApi = globalThis.PIM.api.reference_entity_attribute_v1;

  try {
    // Define a reference entity code to work with
    const referenceEntityCode = 'materials';

    // List all attributes for a reference entity
    console.log(`Listing all attributes for the "${referenceEntityCode}" reference entity...`);
    const attributesList = await referenceEntityAttributeApi.list({
      referenceEntityCode
    });
    console.log('Attributes list:', attributesList);

    // Create a new text attribute
    console.log('\nCreating a new text attribute...');
    const newTextAttribute = {
      code: 'description',
      // Using string literal for text type
      type: 'text',
      value_per_locale: true,
      value_per_channel: false,
      labels: {
        'en_US': 'Description',
        'fr_FR': 'Description'
      },
      is_required_for_completeness: true,
      is_textarea: true,
      max_characters: 500
    };

    await referenceEntityAttributeApi.upsert({
      referenceEntityCode,
      attributeCode: 'description',
      data: newTextAttribute as any // Using type assertion to bypass type checking
    });
    console.log('Text attribute created successfully');

    // Get the created attribute
    console.log('\nGetting the created attribute...');
    const textAttribute = await referenceEntityAttributeApi.get({
      referenceEntityCode,
      attributeCode: 'description'
    });
    console.log('Text attribute details:', textAttribute);

    // Create a new image attribute
    console.log('\nCreating a new image attribute...');
    const newImageAttribute = {
      code: 'thumbnail',
      // Using string literal for image type
      type: 'image',
      value_per_locale: false,
      value_per_channel: false,
      labels: {
        'en_US': 'Thumbnail',
        'fr_FR': 'Vignette'
      },
      is_required_for_completeness: false,
      allowed_extensions: ['jpg', 'png', 'gif'],
      max_file_size: '10' // 10MB as string
    };

    await referenceEntityAttributeApi.upsert({
      referenceEntityCode,
      attributeCode: 'thumbnail',
      data: newImageAttribute as any // Using type assertion to bypass type checking
    });
    console.log('Image attribute created successfully');

    // Get the created image attribute
    console.log('\nGetting the image attribute...');
    const imageAttribute = await referenceEntityAttributeApi.get({
      referenceEntityCode,
      attributeCode: 'thumbnail'
    });
    console.log('Image attribute details:', imageAttribute);

    // Create a new number attribute
    console.log('\nCreating a new number attribute...');
    const newNumberAttribute = {
      code: 'weight',
      // Using string literal for number type
      type: 'number',
      value_per_locale: false,
      value_per_channel: false,
      labels: {
        'en_US': 'Weight',
        'fr_FR': 'Poids'
      },
      is_required_for_completeness: false,
      decimals_allowed: true,
      min_value: '0',
      max_value: '1000'
    };

    await referenceEntityAttributeApi.upsert({
      referenceEntityCode,
      attributeCode: 'weight',
      data: newNumberAttribute as any // Using type assertion to bypass type checking
    });
    console.log('Number attribute created successfully');

    // Update an existing attribute
    console.log('\nUpdating the description attribute...');
    const updateData = {
      labels: {
        'en_US': 'Material Description',
        'fr_FR': 'Description du Matériau',
        'de_DE': 'Materialbeschreibung'
      },
      is_rich_text_editor: true,
      max_characters: 1000
    };

    await referenceEntityAttributeApi.upsert({
      referenceEntityCode,
      attributeCode: 'description',
      data: updateData
    });
    console.log('Attribute updated successfully');

    // Get the updated attribute
    console.log('\nGetting the updated attribute...');
    const updatedAttribute = await referenceEntityAttributeApi.get({
      referenceEntityCode,
      attributeCode: 'description'
    });
    console.log('Updated attribute details:', updatedAttribute);

    // List all attributes again to see the updated list
    console.log('\nListing all attributes again...');
    const updatedAttributesList = await referenceEntityAttributeApi.list({
      referenceEntityCode
    });
    console.log(`Found ${updatedAttributesList.items.length} attributes for reference entity "${referenceEntityCode}"`);

    // Display attribute codes and types
    updatedAttributesList.items.forEach((attribute, index) => {
      console.log(`${index + 1}. ${attribute.code} (${attribute.type})`);
    });

  } catch (error) {
    console.error('An error occurred:', error);
    if ('response' in (error as any)) {
      console.error('API Response:', (error as any).response?.data);
    }
  }
}
