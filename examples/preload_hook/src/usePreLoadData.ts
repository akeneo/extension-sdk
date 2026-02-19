import {useEffect, useState} from "react";

interface PreLoadData {
    label: string;
}

const LABEL_ATTRIBUTE_CODES = ['name', 'label', 'nom'];

const usePreLoadData = () => {
    const [preLoadData, setPreLoadData] = useState<PreLoadData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPreLoadData = async () => {
            try {
                const context = globalThis.PIM.context;

                // ---------------------------------------------------------------
                // EXAMPLE 1: Fetch data from an external API
                // ---------------------------------------------------------------
                // Use PIM.api.external.call() to call your own external service
                // (ERP, pricing engine, compliance tool, etc.).
                // The credentials_code must match a credential defined in
                // extension_configuration.json.
                // You can then use externalData to display real information
                // (stock levels, pricing, compliance status, etc.) instead of
                // the simulated data used in this example.
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
                // ---------------------------------------------------------------

                // ---------------------------------------------------------------
                // EXAMPLE 2: Read configuration from custom_variables
                // ---------------------------------------------------------------
                // Use PIM.custom_variables to read extension-level configuration
                // set by the PIM administrator. This is useful for storing API
                // URLs, thresholds, feature flags, attribute codes, etc.
                // You can then use these values to configure your external API
                // calls or customize the extension behavior.
                //
                // const erpApiUrl = globalThis.PIM.custom_variables.erp_api_url as string;
                // const stockThreshold = globalThis.PIM.custom_variables.stock_threshold as number;
                // ---------------------------------------------------------------

                const ctx = context as any;
                const uuid = ctx.product?.uuid;

                let label: string;

                if (uuid && uuid !== 'null') {
                    // Product: fetch by UUID and extract label from values
                    const catalogLocale = context.user.catalog_locale;
                    const product = await globalThis.PIM.api.product_uuid_v1.get({uuid});
                    label = extractLabel(product.values, catalogLocale);
                } else if (ctx.product?.identifier && ctx.product.identifier !== 'null') {
                    // Product model / sub product model: the context provides the label directly
                    label = ctx.product.identifier;
                } else {
                    setError('This extension must be displayed on a product or product model page.');
                    setLoading(false);
                    return;
                }

                setPreLoadData({label});
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPreLoadData();
    }, []);

    return {preLoadData, loading, error};
};

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

export {usePreLoadData};
