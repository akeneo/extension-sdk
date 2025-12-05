import {useState, useCallback, useEffect} from "react";

interface OrderItem {
    id: string;
    label: string;
    productSKU: string;
    quantityOrdered: number;
    quantityShipped: number;
    price: {
        amount: number;
        currency: string;
    };
    status: string;
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    statusCode: string;
    purchaseDate: string;
    price: {
        amount: number;
        currency: string;
        taxAmount?: number;
    };
    buyer: {
        name: string;
        email?: string;
        phone?: string;
    };
    fulfillmentCode: string;
    items: OrderItem[];
}

interface Channel {
    id: string;
    label: string;
    syndicationChannelCode: string;
    orders?: Order[];
    ordersLoading?: boolean;
    ordersError?: string | null;
}

const useGetChannels = () => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [productSku, setProductSku] = useState<string | null>(null);

    const fetchOrders = useCallback(async (channelId: string, currentProductSku: string | null) => {
        // Get pim_connection_id from custom variables
        const pimConnectionId = globalThis.PIM.custom_variables.pim_connection_id as string;

        // Update channel state to show loading
        setChannels(prevChannels =>
            prevChannels.map(ch =>
                ch.id === channelId ? { ...ch, ordersLoading: true, ordersError: null } : ch
            )
        );

        try {
            const response = await globalThis.PIM.api.external.call({
                method: 'GET',
                url: `https://api.retail.app.akeneo.cloud/v1/channel-connections/${channelId}/orders`,
                credentials_code: 'activation_access_token',
                headers: {
                    'pim_connection_id': pimConnectionId,
                    'Content-Type': 'application/json',
                },
            });

            const responseText = await response.text();
            const apiResponse: {
                statusCode: number;
                body: {
                    totalCount: number;
                    resultsPerPage: number;
                    nextSearchAfter: string | null;
                    results: any[];
                };
                error: any;
            } = JSON.parse(responseText);

            if (apiResponse.statusCode === 200 && apiResponse.body) {
                console.log('Raw order data:', apiResponse.body.results);
                // Map the results to detailed Order format
                const allOrders: Order[] = apiResponse.body.results.map((order: any) => ({
                    id: String(order.id || ''),
                    orderNumber: String(order.data?.originalId || order.id || ''),
                    status: String(order.data?.status?.code || 'UNKNOWN'),
                    statusCode: String(order.data?.status?.originalCode || ''),
                    purchaseDate: order.data?.purchaseDate
                        ? new Date(order.data.purchaseDate).toISOString()
                        : new Date().toISOString(),
                    price: {
                        amount: Number(order.data?.price?.amount || 0),
                        currency: String(order.data?.price?.currency || 'USD'),
                        taxAmount: order.data?.price?.taxAmount ? Number(order.data?.price?.taxAmount) : undefined,
                    },
                    buyer: {
                        name: String(order.data?.buyer?.name || 'Unknown'),
                        email: order.data?.buyer?.email ? String(order.data?.buyer?.email) : undefined,
                        phone: order.data?.buyer?.phone ? String(order.data?.buyer?.phone) : undefined,
                    },
                    fulfillmentCode: String(order.data?.fulfillmentCode || 'unknown'),
                    items: (order.items || []).map((item: any) => ({
                        id: String(item.id || ''),
                        label: String(item.label || 'Unknown Product'),
                        productSKU: String(item.productSKU || 'N/A'),
                        quantityOrdered: Number(item.quantityOrdered || 0),
                        quantityShipped: Number(item.quantityShipped || 0),
                        price: {
                            amount: Number(item.price?.amount || 0),
                            currency: String(item.price?.currency || 'USD'),
                        },
                        status: String(item.status?.code || item.status || 'unknown'),
                    })),
                }));

                // Filter orders to only include those with the current product SKU
                const filteredOrders = currentProductSku
                    ? allOrders.filter(order =>
                        order.items.some(item => item.productSKU === currentProductSku)
                    )
                    : allOrders;

                console.log('Filtered orders for SKU', currentProductSku, ':', filteredOrders);

                setChannels(prevChannels =>
                    prevChannels.map(ch =>
                        ch.id === channelId ? { ...ch, orders: filteredOrders, ordersLoading: false } : ch
                    )
                );
            } else {
                setChannels(prevChannels =>
                    prevChannels.map(ch =>
                        ch.id === channelId
                            ? { ...ch, ordersError: apiResponse.error || 'Failed to fetch orders', ordersLoading: false }
                            : ch
                    )
                );
            }
        } catch (err) {
            setChannels(prevChannels =>
                prevChannels.map(ch =>
                    ch.id === channelId
                        ? { ...ch, ordersError: err instanceof Error ? err.message : 'An error occurred', ordersLoading: false }
                        : ch
                )
            );
        }
    }, []);

    // Fetch the current product's SKU from PIM
    useEffect(() => {
        const fetchProductSku = async () => {
            try {
                const context = globalThis.PIM.context;

                if (!('product' in context)) {
                    setError('This extension must be displayed on a product page');
                    return;
                }

                const productUuid = context.product.uuid;

                // Fetch product data from Akeneo
                const product = await globalThis.PIM.api.product_uuid_v1.get({
                    uuid: productUuid,
                });

                // Get product SKU from values field
                let sku: string | null = null;

                // Try to get SKU from the sku attribute
                if (product.values?.sku) {
                    if (Array.isArray(product.values.sku) && product.values.sku.length > 0) {
                        sku = product.values.sku[0].data;
                    }
                }

                // If SKU not found, search through all identifier-type attributes
                if (!sku && product.values) {
                    for (const [attributeCode, attributeValue] of Object.entries(product.values)) {
                        if (Array.isArray(attributeValue) && attributeValue.length > 0) {
                            const firstValue = attributeValue[0];
                            if (firstValue && typeof firstValue.data === 'string' && firstValue.data.trim().length > 0) {
                                // Check if this looks like an identifier
                                const potentialIdentifiers = ['sku', 'identifier', 'id', 'code'];
                                if (potentialIdentifiers.some(id => attributeCode.toLowerCase().includes(id))) {
                                    sku = firstValue.data.trim();
                                    console.log(`Found SKU in attribute '${attributeCode}': ${sku}`);
                                    break;
                                }
                            }
                        }
                    }
                }

                // If still no SKU, use the product identifier
                if (!sku && product.identifier) {
                    sku = product.identifier;
                    console.log(`Using product identifier as SKU: ${sku}`);
                }

                if (sku) {
                    setProductSku(sku);
                    console.log('Product SKU set to:', sku);
                } else {
                    setError('Product does not have a SKU or identifier');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch product SKU');
            }
        };

        fetchProductSku();
    }, []);

    const fetchChannels = useCallback(async () => {
        try {
            setLoading(true);
            // Get pim_connection_id from custom variables
            const pimConnectionId = globalThis.PIM.custom_variables.pim_connection_id as string;

            const response = await globalThis.PIM.api.external.call({
                method: 'GET',
                url: 'https://api.retail.app.akeneo.cloud/v1/channel-connections',
                credentials_code: 'activation_access_token',
                headers: {
                    'pim_connection_id': pimConnectionId,
                    'Content-Type': 'application/json',
                },
            });

            const responseText = await response.text();
            const apiResponse: {
                statusCode: number;
                body: Channel[];
                error: any;
            } = JSON.parse(responseText);

            console.log(apiResponse);

            if (apiResponse.statusCode === 200 && apiResponse.body) {
                setChannels(apiResponse.body);
                setError(null);

                // Fetch orders for each channel with the current product SKU
                apiResponse.body.forEach(channel => {
                    fetchOrders(channel.id, productSku);
                });
            } else {
                setError(apiResponse.error || 'Failed to fetch channels');
                setChannels([]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setChannels([]);
        } finally {
            setLoading(false);
        }
    }, [fetchOrders, productSku]);

    return { channels, loading, error, fetchChannels, fetchOrders, productSku };
}

export { useGetChannels };
export type { Channel };
