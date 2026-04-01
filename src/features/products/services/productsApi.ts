import axios from 'axios'
import type { Product, ProductsResponse, ProductFilters } from '../types/products.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTS_API_URL,
})

export const productsApi = {
  getProducts: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const { data } = await api.get<ProductsResponse>('/products', { params: filters })
    return data
  },

  getProductById: async (id: string): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`)
    return data
  },

  getCategories: async (): Promise<string[]> => {
    const { data } = await api.get<string[]>('/products/categories')
    return data
  },
}
