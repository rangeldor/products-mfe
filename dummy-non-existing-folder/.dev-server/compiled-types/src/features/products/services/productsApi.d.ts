import type { Product, ProductsResponse, ProductFilters } from '../types/products.types';
export declare const productsApi: {
    getProducts: (filters?: ProductFilters) => Promise<ProductsResponse>;
    getProductById: (id: string) => Promise<Product>;
    getCategories: () => Promise<string[]>;
};
