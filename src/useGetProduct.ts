import {useEffect, useState} from "react";

const useGetProduct = (productUuid: string | undefined) => {
    const [product, setProduct] = useState<any>();
    useEffect(() => {
        if (productUuid) {
            globalThis.PIM.api.product_uuid.get({uuid: productUuid}).then((product: any) => {
                setProduct(product);
            });
        }
    }, []);

    return product;
}

export {useGetProduct};
