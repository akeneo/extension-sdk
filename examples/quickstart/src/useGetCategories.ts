import {useEffect, useState} from "react";

// Define proper types for the API response
interface Category {
  code: string;
  parent: string | null;
  labels: {
    [locale: string]: string;
  };
}

interface CategoriesResponse {
  _embedded: {
    items: Category[];
  };
  _links: {
    self: { href: string };
    first: { href: string };
    next?: { href: string };
  };
  current_page: number;
  items_count: number;
  total_items: number;
}

interface Response {
    status: string;
    statusCode: number;
    body: CategoriesResponse;
}

const useGetCategories = () => {
    const [categories, setCategories] = useState<any>();
    useEffect(() => {
        globalThis.PIM.api.external.call({
            method: 'GET',
            url: 'https://graphql-integration.demo.cloud.akeneo.com/api/rest/v1/categories',
            credentials_code: 'graphql_pim',
        }).then((response) => {
            response.json().then((data: Response) => {
                console.log(data.body);
                setCategories(data.body._embedded.items);
            });
        });
    }, []);

    return categories;
}

export {useGetCategories};
