export async function systemExample(): Promise<void> {
    const systemApi = globalThis.PIM.api.system_v1;

    try {
      // Get PIM system information
      console.log('\nRetrieving PIM system information...');
      const systemInfo = await systemApi.get();
      console.log('System information retrieved successfully:');
      console.log('----------------------------------------');
      console.log(`PIM Version: ${systemInfo.version}`);
      console.log(`PIM Edition: ${systemInfo.edition}`);
      console.log('----------------------------------------');

    } catch (error) {
      console.error('\nError while retrieving system information:');
      if (error instanceof Error) {
        console.error(`Error message: ${error.message}`);
      } else {
        console.error('An unknown error occurred:', error);
      }
      throw error;
    }
}
