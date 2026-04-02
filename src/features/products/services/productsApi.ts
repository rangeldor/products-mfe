import axios from 'axios'
import type { Product, ProductFilters } from '../types/products.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTS_API_URL,
})

export const productsApi = {
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const response = await api.get('/products', { params: filters })
    const data = response?.data

    // Support two response shapes:
    // 1) { products: Product[] }
    // 2) Product[]
    if (Array.isArray(data)) return data
    if (data && Array.isArray((data as any).products)) return (data as any).products

    // If response shape is unexpected, return empty array to avoid breaking UI
    return []
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
