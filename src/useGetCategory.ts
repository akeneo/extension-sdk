import {useEffect, useState} from "react";

const useGetCategory = (categoryCode: string | undefined) => {
    const [category, setCategory] = useState<any>();
    useEffect(() => {
        if (categoryCode) {
            globalThis.PIM.api.category.get({code: categoryCode}).then((category: any) => {
                setCategory(category);
            });
        }
    }, []);

    return category;
}

export {useGetCategory};
