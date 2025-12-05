import {useEffect, useState} from "react";

const useGetProduct = () => {
    const [products, setProducts] = useState<any>();
    useEffect(() => {
        globalThis.PIM.api.product_uuid_v1.list({limit: 10}).then((products: any) => {
            setProducts(products);
        });
    }, []);

    return products;
}

export {useGetProduct};
