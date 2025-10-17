// Example of using the Channel v1 API capabilities
export async function channelExample(): Promise<void> {
    const channelApi = globalThis.PIM.api.channel_v1;

    try {
      // List all channels
      console.log('Listing all channels...');
      const channelList = await channelApi.list({
        limit: 10,
        page: 1,
        with_count: true,
      });
      console.log(`Found ${channelList.count} channels`);

      // Create a new channel (check if it exists first)
      console.log('Creating a new channel...');
      try {
        await channelApi.get({ code: 'my_new_channel' });
        console.log('Channel already exists, skipping creation...');
      } catch (error) {
        // Channel doesn't exist, create it
        await channelApi.create({
          data: {
            code: 'my_new_channel',
            category_tree: 'master',
            currencies: ['USD', 'EUR'],
            locales: ['en_US', 'fr_FR'],
            labels: {
              en_US: 'My New Channel',
              fr_FR: 'Mon Nouveau Canal',
            },
          },
        });
      }

      // Get the created channel
      console.log('Getting the created channel...');
      const channel = await channelApi.get({
        code: 'my_new_channel',
      });
      console.log('Channel details:', channel);

      // Update the channel
      console.log('Updating the channel...');
      await channelApi.update({
        code: 'my_new_channel',
        data: {
          labels: {
            en_US: 'My Updated Channel',
            fr_FR: 'Mon Canal Mis à Jour',
          },
        },
      });

      // Get the updated channel to verify changes
      console.log('Getting the updated channel...');
      const updatedChannel = await channelApi.get({
        code: 'my_new_channel',
      });
      console.log('Updated channel details:', updatedChannel);

    } catch (error) {
      console.error('An error occurred:', error);
    }
}
