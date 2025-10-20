import { useState, useEffect } from 'react';

interface EnrichmentStatus {
    complete: number;
    inProgress: number;
    missing: number;
    totalCount: number;
}

function getAllProducts(searchCriteria: any): Promise<number> {
    const productApi = globalThis.PIM.api.product_uuid_v1;
    return productApi.list({
        search: searchCriteria,
        withCount: true,
    })
    .then(response => typeof response.count === 'number' ? response.count : 0)
    .catch(() => 0);
}

export const useGetEnrichmentStatus = () => {
    const [status, setStatus] = useState<EnrichmentStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = () => {
            setLoading(true);

            // Get complete products (>95% complete)
            getAllProducts({
                "completeness": [{ "operator": ">", "value": 95, "scope": "ecommerce" }]
            })
            .then(completeCount => {
                // Get in-progress products (between 50% and 95%)
                return getAllProducts({
                    "completeness": [
                        { "operator": ">=", "value": 50, "scope": "ecommerce" },
                        { "operator": "<=", "value": 95, "scope": "ecommerce" }
                    ]
                })
                .then(inProgressCount => {
                    return { completeCount, inProgressCount };
                });
            })
            .then(({ completeCount, inProgressCount }) => {
                // Get products missing core info (<50%)
                return getAllProducts({
                    "completeness": [{ "operator": "<", "value": 50, "scope": "ecommerce" }]
                })
                .then(missingCount => {
                    return { completeCount, inProgressCount, missingCount };
                });
            })
            .then(({ completeCount, inProgressCount, missingCount }) => {
                const totalCount = completeCount + inProgressCount + missingCount;

                setStatus({
                    complete: completeCount,
                    inProgress: inProgressCount,
                    missing: missingCount,
                    totalCount
                });
            })
            .catch(err => {
                setError(err instanceof Error ? err.message : 'Failed to fetch enrichment status');
            })
            .finally(() => {
                setLoading(false);
            });
        };

        fetchData();
    }, []);

    return { status, loading, error };
};
