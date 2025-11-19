import { useEffect, useState } from "react";

// Define a more specific type for Product to help with type safety
interface Product {
    uuid: string;
    identifier: string;
    updated: string;
    family: string;
    enabled: boolean;
    values: {
        [key: string]: any;
    };
    imageUrl?: string; // Add imageUrl to the product type
}

/**
 * A hook to fetch a list of products from the Akeneo PIM API, including their main image.
 */
const useProducts = (familyCode: string | null) => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProductsAndImages = async () => {

            if (globalThis.PIM?.api?.product_uuid_v1 && globalThis.PIM?.api?.asset_v1 && familyCode) {
                try {
                    const search = {
                        "family": [{
                            "operator": "IN",
                            "value": [familyCode]
                        }]
                    };
        
                    const response = await globalThis.PIM.api.product_uuid_v1.list({
                        limit: 10,
                        search: search,
                        withCompletenesses: true,
                    });

                    if (response.items) {
                        const productsWithImages = await Promise.all(
                            response.items.map(async (product: any) => {
                                const imageAssetCollection = product.values?.main_image?.[0];
                                if (imageAssetCollection && imageAssetCollection.data?.length > 0) {
                                    const assetFamily = imageAssetCollection.reference_data_name;
                                    const assetCode = imageAssetCollection.data[0];

                                    try {
                                        const asset = await globalThis.PIM.api.asset_v1.get({
                                            assetFamilyCode: assetFamily,
                                            code: assetCode
                                        });
                                        const firstAttributeValues = Object.values(asset)[0] as any[];
                                        
                                        if (firstAttributeValues && firstAttributeValues.length > 0) {
                                            const imageUrl = firstAttributeValues[0]?._links?.share_link?.href;
                                            if (imageUrl) {
                                                return { ...product, imageUrl };
                                            }
                                        }
                                    } catch (error) {
                                        // Removed: console.error(`Failed to fetch asset for product ${product.identifier}:`, error);
                                    }
                                }
                                return product; // Return product without image URL if something fails
                            })
                        );
                        
                        setProducts(productsWithImages);
                    }
                } catch (error) {
                    console.error("useProducts hook: Failed to fetch products:", error);
                }
            } else {
                console.warn("useProducts hook: PIM API not found on globalThis or no family selected.");
                if (!familyCode) {
                    setProducts([]);
                }
            }
        };

        fetchProductsAndImages();
    }, [familyCode]);

    return products;
}

export { useProducts };
