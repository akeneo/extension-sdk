// Example of using the Reference Entity v1 API capabilities
export async function referenceEntityExample(): Promise<void> {
  const referenceEntityApi = globalThis.PIM.api.reference_entity_v1;

  try {
    // List all reference entities
    console.log('Listing all reference entities...');
    const referenceEntitiesList = await referenceEntityApi.list();
    console.log('Reference entities list:', referenceEntitiesList);

    // Create a new reference entity by directly using patch with a new code
    console.log('\nCreating a new reference entity...');
    const newReferenceEntity = {
      code: 'materials',
      labels: {
        'en_US': 'Materials',
        'fr_FR': 'Matériaux'
      },
      image: null
    };

    // Use patch to create a new reference entity (since create method doesn't exist in the interface)
    await referenceEntityApi.patch({
      code: 'materials',
      data: newReferenceEntity
    });
    console.log('Reference entity created successfully');

    // Get the created reference entity
    console.log('\nGetting the created reference entity...');
    const referenceEntity = await referenceEntityApi.get({
      code: 'materials'
    });
    console.log('Reference entity details:', {
      code: referenceEntity.code,
      labels: referenceEntity.labels,
      image: referenceEntity.image
    });

    // Update the existing reference entity with additional labels
    console.log('\nUpdating the reference entity...');
    const updateData = {
      labels: {
        'en_US': 'Product Materials',
        'fr_FR': 'Matériaux de Produit',
        'de_DE': 'Produktmaterialien'
      }
    };

    await referenceEntityApi.patch({
      code: 'materials',
      data: updateData
    });
    console.log('Reference entity updated successfully');

    // Get the updated reference entity
    console.log('\nGetting the updated reference entity...');
    const updatedReferenceEntity = await referenceEntityApi.get({
      code: 'materials'
    });
    console.log('Updated reference entity details:', {
      code: updatedReferenceEntity.code,
      labels: updatedReferenceEntity.labels,
      image: updatedReferenceEntity.image
    });

    // List reference entities with pagination
    console.log('\nListing reference entities with pagination...');
    const paginatedList = await referenceEntityApi.list({
      searchAfter: 'country'
    });
    console.log('Paginated list info:', {
      count: paginatedList.items.length,
      hasNextPage: !!paginatedList.links?.next
    });

  } catch (error) {
    console.error('An error occurred:', error);
    if ('response' in (error as any)) {
      console.error('API Response:', (error as any).response?.data);
    }
  }
}
