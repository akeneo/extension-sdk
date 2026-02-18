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

                // ---------------------------------------------------------------
                // EXAMPLE 1: Read configuration from custom_variables
                // ---------------------------------------------------------------
                // Use PIM.custom_variables to read extension-level configuration
                // set by the PIM administrator. This is useful for storing API
                // URLs, thresholds, feature flags, attribute codes, etc.
                //
                // const erpApiUrl = globalThis.PIM.custom_variables.erp_api_url as string;
                // const stockThreshold = globalThis.PIM.custom_variables.stock_threshold as number;
                //
                // You can then use these values to configure your external API
                // calls or customize the extension behavior.
                // ---------------------------------------------------------------

                // ---------------------------------------------------------------
                // EXAMPLE 2: Fetch data from an external API
                // ---------------------------------------------------------------
                // Use PIM.api.external.call() to call your own external service
                // (ERP, pricing engine, compliance tool, etc.).
                // The credentials_code must match a credential defined in
                // extension_configuration.json.
                //
                // const externalResponse = await globalThis.PIM.api.external.call({
                //     method: 'GET',
                //     url: `${erpApiUrl}/products/${identifier}/stock`,
                //     credentials_code: 'your_erp_api_token',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                // });
                // const externalData = await externalResponse.json();
                //
                // You can then use externalData to display real information
                // (stock levels, pricing, compliance status, etc.) instead of
                // the simulated data used in this example.
                // ---------------------------------------------------------------

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
