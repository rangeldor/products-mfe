import axios from 'axios'
import type { Product, ProductFilters } from '../types/products.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTS_API_URL,
})

export const productsApi = {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const { data } = await api.get<Product[]>('/products', { params: filters })
    return data
  },

  async getProductById(id: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${id}`)
    return data
  },

  async getCategories(): Promise<string[]> {
    const { data } = await api.get<string[]>('/products/categories')
    return data
  },
}
