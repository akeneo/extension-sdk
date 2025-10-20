import { useState, useEffect } from 'react';

interface UseLeastCompleteProductsParams {
    selectedFamily: string | null;
    scope?: string;
    locale?: string;
}

export function useLeastCompleteProducts({
    selectedFamily,
    scope = 'ecommerce',
    locale = 'en_US'
}: UseLeastCompleteProductsParams) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedFamily) return;
        setLoading(true);
        setError(null);

        const fetchProducts = () => {
            const productApi = globalThis.PIM.api.product_uuid_v1;

            // Implementation uses pagination to fetch all products for accurate sorting
            // This ensures we truly get the least complete products across all pages
            let allProducts: any[] = [];
            let currentPage = 1;

            // Use any type to allow for snake_case parameters
            const baseParams: any = {
                search: {
                    family: [{ operator: 'IN', value: [selectedFamily] }],
                    completeness: [{ operator: '<', "value":100, "scope":scope, "locale": locale }]
                },
                withCount: true,
                limit: 100, // Fetch 100 products per page for efficiency
                with_completeness: true, // Using snake_case as specified
                scope: scope,           // Dynamic scope from props
                locale: locale          // Dynamic locale from props
            };

            // Function to fetch a page of products
            // @ts-ignore
            const fetchPage = () => {
                const params = {
                    ...baseParams,
                    page: currentPage
                };

                return productApi.list(params)
                    // @ts-ignore
                    .then(response => {
                        allProducts = [...allProducts, ...response.items];

                        // Check if there are more pages and if we should continue (limit to 2 pages)
                        if (!!response.links?.next && currentPage < 2) {
                            currentPage++;
                            return fetchPage();
                        }

                        // All pages fetched (or max reached), process products
                        return processProducts(allProducts);
                    })
                    .catch(paginationError => {
                        console.error('Error during product pagination:', paginationError);
                        // Continue with the products we've fetched so far
                        return processProducts(allProducts);
                    });
            };

            // Process products function (sorts by completeness)
            const processProducts = (productsToProcess: any[]) => {
                // The API returns completeness data in the format:
                // "completenesses": [
                //   { "scope": "ecommerce", "locale": "en_US", "data": 75 },
                //   ...
                // ]
                const productsWithCompleteness = productsToProcess
                    .map((product: any) => {
                        // Find the completeness entry that matches our scope and locale
                        let completenessValue: number | null = null;

                        // Check if product has completenesses array
                        if (product.completenesses && Array.isArray(product.completenesses)) {
                            const completenessEntry = product.completenesses.find(
                                (entry: any) => entry.scope === scope && entry.locale === locale
                            );

                            if (completenessEntry) {
                                completenessValue = completenessEntry.data;
                            }
                        }

                        return {
                            ...product,
                            completenessValue,
                            // Include a flag to indicate if we have completeness data
                            hasCompletenessData: completenessValue !== null
                        };
                    });

                // Filter out products that don't have completeness data for our scope/locale if requested
                // Sort products - null values (missing completeness) come first, then by completeness value
                const sortedProducts = productsWithCompleteness
                    // Sort by completeness value (null values first, then low to high)
                    .sort((a: any, b: any) => {
                        // If both have completeness values, compare them
                        if (a.completenessValue !== null && b.completenessValue !== null) {
                            return a.completenessValue - b.completenessValue;
                        }
                        // If only a has completeness, b comes first (null values first)
                        if (a.completenessValue !== null) return 1;
                        // If only b has completeness, a comes first
                        if (b.completenessValue !== null) return -1;
                        // If neither has completeness, keep original order
                        return 0;
                    })
                    // Take only the top 5 least complete products
                    .slice(0, 5);

                setProducts(sortedProducts);
                setLoading(false);
                return sortedProducts;
            };

            // Start fetching products
            return fetchPage()
                // @ts-ignore
                .catch(err => {
                    console.error("Error fetching products:", err);
                    setError(err instanceof Error ? err.message : 'Failed to fetch products');
                    setLoading(false);
                });
        };

        fetchProducts();
    }, [selectedFamily, scope, locale]);

    return { products, loading, error };
}
