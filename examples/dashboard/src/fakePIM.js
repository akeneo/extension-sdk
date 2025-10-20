globalThis.PIM = {
    user: {
        username: 'admin',
        first_name: 'John',
        last_name: 'Doe',
    },
    context: {
        product: {
            uuid: '77aac2d4-cbec-4394-8ac7-ee1ccbfb079b',
            identifier: 'my_product'
        }
    },
    api: {
        product_uuid: {
            get: () => new Promise((e) => e({
                uuid: '77aac2d4-cbec-4394-8ac7-ee1ccbfb079b',
                enabled: true,
                family: 'loudspeakers',
                categories: ['loudspeakers'],
                groups: [],
                values: {
                    sku: [
                        {
                            locale: null,
                            scope: null,
                            data: 'my_product',
                            attribute_type: 'pim_catalog_identifier'
                        }
                    ],
                    name: [{
                        locale: null,
                        scope: null,
                        data: 'My awesome product',
                        attribute_type: 'pim_catalog_text'
                    }],
                },
                associations: {},
                quantifiedAssociations: {},
                created: '2024-11-28T13:00:18+00:00',
                updated: '2024-11-28T13:00:18+00:00',
                metadata: {}
            })),
        }
    }
}
