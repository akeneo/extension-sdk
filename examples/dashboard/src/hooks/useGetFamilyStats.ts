import { useState, useEffect } from 'react';

interface FamilyStats {
    totalFamilies: number;
    topFamilies: Array<{
        code: string;
        productCount: number;
    }>;
}

interface Family {
    code: string;
    variant_attribute_sets?: Array<any>;
}

export const useGetFamilyStats = () => {
    const [stats, setStats] = useState<FamilyStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getProductCountForFamily = async (familyCode: string): Promise<number> => {
        try {
            const response = await globalThis.PIM.api.product_uuid_v1.list({
                search: {
                    family: [{ operator: "IN", value: [familyCode] }]
                },
                withCount: true,
            });
            return typeof response.count === 'number' ? response.count : 0;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch product count');
            return 0;
        }
    };

    useEffect(() => {
        const fetchData = () => {
            const familyApi = globalThis.PIM.api.family_v1;

            // Get the first page of families
            familyApi.list({
                limit: 10,
                page: 1,
            })
            .then(response => {
                const families: Family[] = response.items;

                // Map each family to a promise that resolves with family code and product count
                const familyPromises = families.map(family => {
                    return getProductCountForFamily(family.code)
                        .then(productCount => ({
                            code: family.code,
                            productCount
                        }));
                });

                // Process all family counts in parallel
                return Promise.all(familyPromises);
            })
            .then(familyCounts => {
                // Sort families by product count and get top 5
                const topFamilies = familyCounts
                    .sort((a, b) => b.productCount - a.productCount)
                    .slice(0, 5);

                setStats({
                    totalFamilies: familyCounts.length,
                    topFamilies
                });
            })
            .catch(err => {
                setError(err instanceof Error ? err.message : 'Failed to fetch family statistics');
            })
            .finally(() => {
                setLoading(false);
            });
        };

        fetchData();
    }, []);

    return { stats, loading, error };
};
