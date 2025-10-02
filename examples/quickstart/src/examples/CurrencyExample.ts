// Example of using the Currency API capabilities
export async function currencyExample(): Promise<void> {
  const currencyApi = globalThis.PIM.api.currency_v1;

  try {
    // List all currencies with pagination
    console.log('\nListing all currencies...');
    const currencyList = await currencyApi.list({
      page: 1,
      limit: 10,
    });
    console.log('First page of currencies:');
    console.log('-------------------------');
    currencyList.items.forEach(currency => {
      console.log(`${currency.code}: ${currency.label} (${currency.enabled ? 'enabled' : 'disabled'})`);
    });
    console.log('-------------------------');
    console.log(`Total items: ${currencyList.count}`);

    // Get a specific currency by code
    console.log('\nGetting details for EUR currency...');
    const euro = await currencyApi.get({ code: 'EUR' });
    console.log('EUR currency details:');
    console.log('--------------------');
    console.log(`Code: ${euro.code}`);
    console.log(`Label: ${euro.label}`);
    console.log(`Status: ${euro.enabled ? 'enabled' : 'disabled'}`);
    console.log('--------------------');

  } catch (error) {
    console.error('\nError while accessing currency information:');
    if (error instanceof Error) {
      console.error(`Error message: ${error.message}`);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
}
