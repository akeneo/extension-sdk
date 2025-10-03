// Example of using the Reference Entity Record v1 API capabilities
export async function referenceEntityRecordExample(): Promise<void> {
  const referenceEntityRecordApi = globalThis.PIM.api.reference_entity_record_v1;

  try {
    // Define a reference entity code to work with
    const referenceEntityCode = 'materials';

    // List all records for a reference entity
    console.log(`Listing all records for the "${referenceEntityCode}" reference entity...`);
    const recordsList = await referenceEntityRecordApi.list({
      referenceEntityCode,
      channel: 'ecommerce',
      locales: 'en_US,fr_FR'
    });
    console.log('Records list:', recordsList);

    // Create a new record
    console.log('\nCreating a new record...');
    const newRecord = {
      code: 'cotton',
      values: {
        description: [
          {
            locale: 'en_US',
            channel: null,
            data: 'Natural fiber from the cotton plant, soft and breathable.'
          },
          {
            locale: 'fr_FR',
            channel: null,
            data: 'Fibre naturelle provenant du cotonnier, douce et respirante.'
          }
        ],
        weight: [
          {
            locale: null,
            channel: null,
            data: '0.25'
          }
        ]
      }
    };

    await referenceEntityRecordApi.upsert({
      referenceEntityCode,
      data: [newRecord]
    });
    console.log('Record created successfully');

    // Get the created record
    console.log('\nGetting the created record...');
    const record = await referenceEntityRecordApi.get({
      referenceEntityCode,
      recordCode: 'cotton'
    });
    console.log('Record details:', {
      code: record.code,
      values: record.values
    });

    // Create another record to demonstrate bulk upsert
    console.log('\nCreating another record...');
    const anotherRecord = {
      code: 'polyester',
      values: {
        description: [
          {
            locale: 'en_US',
            channel: null,
            data: 'Synthetic polymer fiber, durable and wrinkle-resistant.'
          },
          {
            locale: 'fr_FR',
            channel: null,
            data: 'Fibre polymère synthétique, durable et résistante aux plis.'
          }
        ],
        weight: [
          {
            locale: null,
            channel: null,
            data: '0.18'
          }
        ]
      }
    };

    // Update existing record at the same time (demonstrating bulk upsert)
    const updateData = {
      code: 'cotton',
      values: {
        weight: [
          {
            locale: null,
            channel: null,
            data: '0.22'  // Updated weight value
          }
        ],
        thumbnail: [
          {
            locale: null,
            channel: null,
            data: 'cotton-image-123'  // Assuming this is a valid media file code
          }
        ]
      }
    };

    // Bulk upsert multiple records
    console.log('\nBulk upserting records...');
    const bulkResult = await referenceEntityRecordApi.upsert({
      referenceEntityCode,
      data: [anotherRecord, updateData]
    });
    console.log('Bulk upsert results:', bulkResult);

    // Search for records with pagination
    console.log('\nSearching for records with pagination...');
    const searchResults = await referenceEntityRecordApi.list({
      referenceEntityCode,
      search: '{"code":[{"operator":"IN","value":["cotton"]}]}',
      channel: 'ecommerce',
      locales: 'en_US',
      searchAfter: 'cotton'
    });
    console.log('Search results:', {
      count: searchResults.items.length,
      hasNextPage: !!searchResults.links?.next
    });

    // List all records to verify our operations
    console.log('\nListing all records after operations...');
    const finalList = await referenceEntityRecordApi.list({
      referenceEntityCode
    });
    console.log(`Found ${finalList.items.length} records for reference entity "${referenceEntityCode}"`);

    // Display record codes
    finalList.items.forEach((record, index) => {
      console.log(`${index + 1}. ${record.code}`);
    });

  } catch (error) {
    console.error('An error occurred:', error);
    if ('response' in (error as any)) {
      console.error('API Response:', (error as any).response?.data);
    }
  }
}
