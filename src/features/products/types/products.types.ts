export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  categoryId: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  search?: string
  category?: string[]
  minPrice?: number
  maxPrice?: number
}
