import { useEffect, useState } from "react";

// The raw record structure from the PIM API for families
interface RawFamilyRecord {
    code: string;
    labels?: {
        [locale: string]: string;
    };
}

// The processed record structure our app will use
export interface FamilyRecord {
    code: string;
    label: string;
}

/**
 * Processes a raw family record to find the best display label.
 * @param record The raw record from the PIM.
 * @returns The best available label string.
 */
const getDisplayLabel = (record: RawFamilyRecord): string => {
    const labels = record.labels;

    if (!labels) {
        return record.code; // Fallback to code if no labels exist
    }

    // Try to find the 'fr_FR' locale
    if (labels['fr_FR']) {
        return labels['fr_FR'];
    }

    // If no 'fr_FR', return the first available label
    const firstLocale = Object.keys(labels)[0];
    if (firstLocale && labels[firstLocale]) {
        return labels[firstLocale];
    }

    // Final fallback to the code
    return record.code;
};

/**
 * Fetches and processes the list of families.
 */
const useFamilies = () => {
    const [families, setFamilies] = useState<FamilyRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAndProcessFamilies = async () => {
            if (globalThis.PIM?.api?.family_v1) {
                try {
                    const response = await globalThis.PIM.api.family_v1.list();
                    
                    if (response.items) {
                        const processedFamilies = response.items.map((record: RawFamilyRecord) => ({
                            code: record.code,
                            label: getDisplayLabel(record),
                        }));
                        setFamilies(processedFamilies);
                    }
                } catch (error) {
                    console.error("Failed to fetch families:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAndProcessFamilies();
    }, []);

    return { families, loading };
};

export { useFamilies };
