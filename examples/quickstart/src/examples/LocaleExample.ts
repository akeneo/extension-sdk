// Example of using the Locale API capabilities
export async function localeExample(): Promise<void> {
    const localeApi = globalThis.PIM.api.locale_v1;

    try {
        // List all locales
        console.log('Listing all locales...');
        const localeList = await localeApi.list({
            limit: 20,
            page: 1,
            withCount: true
        });
        console.log(`Found ${localeList.count} locales`);
        console.log('First page items:', localeList.items.map(item => item.code));

        console.log(`\nGetting details for locale: en_US`);
        const locale = await localeApi.get({
            code: 'EN_us'
        });
        console.log('Locale details:', {
            code: locale.code,
            enabled: locale.enabled
        });

        // Display enabled vs. disabled locales
        const enabledLocales = localeList.items.filter(locale => locale.enabled);
        const disabledLocales = localeList.items.filter(locale => !locale.enabled);

        console.log('\nEnabled locales:', enabledLocales.map(locale => locale.code));
        console.log('Disabled locales:', disabledLocales.map(locale => locale.code));

    } catch (error) {
      console.error('An error occurred:', error);
      if ('response' in (error as any)) {
        console.error('API Response:', (error as any).response?.data);
      }
    }
}
