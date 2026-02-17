import {useEffect, useState} from "react";

interface ProductInfo {
    label: string;
    identifier: string;
}

const LABEL_ATTRIBUTE_CODES = ['name', 'label', 'nom'];

const useProductInfo = () => {
    const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductInfo = async () => {
            try {
                const context = globalThis.PIM.context;

                if (!('product' in context) || !context.product) {
                    setError('This extension must be displayed on a product page.');
                    setLoading(false);
                    return;
                }

                const uuid = context.product.uuid;
                const catalogLocale = context.user.catalog_locale;

                const product = await globalThis.PIM.api.product_uuid_v1.get({uuid});

                const identifier = extractIdentifier(product);
                const label = extractLabel(product.values, catalogLocale);

                setProductInfo({label, identifier});
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchProductInfo();
    }, []);

    return {productInfo, loading, error};
};

function extractIdentifier(product: any): string {
    if (product.identifier && product.identifier.trim().length > 0) {
        return product.identifier;
    }

    if (product.values) {
        for (const [, attributeValue] of Object.entries(product.values)) {
            if (Array.isArray(attributeValue) && attributeValue.length > 0) {
                const firstValue = attributeValue[0];
                if (
                    firstValue &&
                    typeof firstValue === 'object' &&
                    'attribute_type' in firstValue &&
                    firstValue.attribute_type === 'pim_catalog_identifier' &&
                    'data' in firstValue
                ) {
                    const data = firstValue.data;
                    if (typeof data === 'string' && data.trim().length > 0) {
                        return data.trim();
                    }
                }
            }
        }
    }

    return 'N/A';
}

function extractLabel(
    values: Record<string, Array<{ locale?: string; scope?: string; data: any }>> | undefined,
    catalogLocale: string
): string {
    if (!values) {
        return 'N/A';
    }

    for (const code of LABEL_ATTRIBUTE_CODES) {
        const attributeValues = values[code];
        if (!attributeValues || attributeValues.length === 0) {
            continue;
        }

        // Try with the user's catalog locale
        const localizedValue = attributeValues.find(
            (v) => v.locale === catalogLocale && v.data
        );
        if (localizedValue) {
            return String(localizedValue.data);
        }

        // Try with any available locale
        const anyLocalizedValue = attributeValues.find(
            (v) => v.locale && v.data
        );
        if (anyLocalizedValue) {
            return String(anyLocalizedValue.data);
        }

        // Try non-localizable values
        const nonLocalizableValue = attributeValues.find(
            (v) => !v.locale && v.data
        );
        if (nonLocalizableValue) {
            return String(nonLocalizableValue.data);
        }
    }

    return 'N/A';
}

export {useProductInfo};
