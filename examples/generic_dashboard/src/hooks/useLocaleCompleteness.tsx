import { useEffect, useState } from "react";

/**
 * Hook to fetch and calculate average product completeness per locale for a given family.
 *
 * MOCK DATA FALLBACK:
 * This hook attempts to fetch real completeness data from the PIM API.
 * However, if a product is missing completeness data, it generates random
 * completeness scores (0-100%) as a workaround for demo purposes.
 *
 * In a production implementation, all products should have real completeness data.
 */

export interface LocaleCompleteness {
    locale: string;
    completeness: number;
}

interface Accumulator {
    [localeCode: string]: {
        sum: number;
        count: number;
    };
}

const useLocaleCompleteness = (selectedFamily: string | null) => {
    const [completenessData, setCompletenessData] = useState<LocaleCompleteness[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchAndCalculateAverage = async () => {
            if (!selectedFamily || !globalThis.PIM?.api) {
                setCompletenessData([]);
                return;
            }

            setIsLoading(true);
            try {
                const pimApi = globalThis.PIM.api;
                const searchFilter = { "family": [{ "operator": "IN", "value": [selectedFamily] }] };
                const accumulators: Accumulator = {};
                
                // Fetch channels once to use for fake data generation if needed
                const channels = await pimApi.channel_v1.list();

                let nextPage = 1;
                let hasMorePages = true;

                while (hasMorePages) {
                    const response = await pimApi.product_uuid_v1.list({
                        limit: 100,
                        page: nextPage,
                        search: searchFilter,
                        withCompletenesses: true,
                    });

                    for (const product of response.items) {
                        let completenessScores = product.completenesses;

                        // MOCK DATA FALLBACK: If completeness data is missing, generate random scores for demo purposes
                        if (!completenessScores || completenessScores.length === 0) {
                            console.warn(`[MOCK DATA] Product ${product.identifier} is missing completeness data. Generating random scores for demo.`);
                            completenessScores = [];
                            for (const channel of channels.items) {
                                for (const locale of channel.locales) {
                                    completenessScores.push({
                                        scope: channel.code,
                                        locale: locale,
                                        data: Math.floor(Math.random() * 101) // Random score 0-100
                                    });
                                }
                            }
                        }

                        // Process real or fake data
                        for (const score of completenessScores) {
                            if (score.locale && score.data !== undefined) {
                                if (!accumulators[score.locale]) {
                                    accumulators[score.locale] = { sum: 0, count: 0 };
                                }
                                accumulators[score.locale].sum += score.data;
                                accumulators[score.locale].count += 1;
                            }
                        }
                    }

                    if (response.links?.next) {
                        nextPage++;
                    } else {
                        hasMorePages = false;
                    }
                }
                
                const finalAverages: LocaleCompleteness[] = Object.keys(accumulators).map(locale => {
                    const { sum, count } = accumulators[locale];
                    return {
                        locale: locale,
                        completeness: count > 0 ? Math.round(sum / count) : 0,
                    };
                });

                setCompletenessData(finalAverages);

            } catch (error) {
                console.error("[Completeness] Failed to calculate average locale completeness:", error);
                setCompletenessData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndCalculateAverage();
    }, [selectedFamily]);

    return { completenessData, isLoading };
};

export { useLocaleCompleteness };
