export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    createdAt: string;
}
export interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
}
export interface ProductFilters {
    search?: string;
    category?: string[];
    minPrice?: number;
    maxPrice?: number;
    page?: number;
}
