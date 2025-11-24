import {useState, useCallback} from "react";

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

    const fetchOrders = useCallback(async (channelId: string) => {
        const pimConnectionId = '694fe2268d91816f1012a1f97bef3988f86a6808fbfc0c06b93a58aae1d52cf8';
        const accessToken = '0841ec7a87d04ab4b21d26f52718a14572ee4b8f6db221751db7cb0bc44a40d953661afc1541ecf43d7222ede4952a7690cd4510ff75037d5d99cebb292eadb0';

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
                headers: {
                    'pim_connection_id': pimConnectionId,
                    'access_token': accessToken,
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
                const orders: Order[] = apiResponse.body.results.map((order: any) => ({
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

                console.log('Mapped orders:', orders);

                setChannels(prevChannels =>
                    prevChannels.map(ch =>
                        ch.id === channelId ? { ...ch, orders, ordersLoading: false } : ch
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

    const fetchChannels = useCallback(async () => {
        try {
            setLoading(true);
            const pimConnectionId = '694fe2268d91816f1012a1f97bef3988f86a6808fbfc0c06b93a58aae1d52cf8';
            const accessToken = '0841ec7a87d04ab4b21d26f52718a14572ee4b8f6db221751db7cb0bc44a40d953661afc1541ecf43d7222ede4952a7690cd4510ff75037d5d99cebb292eadb0';

            const response = await globalThis.PIM.api.external.call({
                method: 'GET',
                url: 'https://api.retail.app.akeneo.cloud/v1/channel-connections',
                headers: {
                    'pim_connection_id': pimConnectionId,
                    'access_token': accessToken,
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

                // Fetch orders for each channel
                apiResponse.body.forEach(channel => {
                    fetchOrders(channel.id);
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
    }, [fetchOrders]);

    return { channels, loading, error, fetchChannels, fetchOrders };
}

export { useGetChannels };
export type { Channel };
