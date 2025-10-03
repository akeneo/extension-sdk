import {useEffect, useState} from "react";

interface Response {
    status: string;
    statusCode: number;
    body: any;
}

const useGetCustomHeaders = () => {
    const [customHeaders, setCustomHeaders] = useState<any>();
    const currentUser = globalThis.PIM.user;
    useEffect(() => {
        globalThis.PIM.api.external.call({
            method: 'POST',
            url: 'https://httpbin.org/post',
            credentials_code: 'test_custom',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: { user: currentUser }
        }).then((response) => {
            response.json().then((data: Response) => {
                console.log(data.body);
                setCustomHeaders(data.body);
            });
        });
    }, []);

    return customHeaders;
}

export {useGetCustomHeaders};
