import { create } from 'zustand'
import type { Product } from '../types/products.types'

interface ProductsStore {
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
  clearSelectedProduct: () => void
}

export const useProductsStore = create<ProductsStore>((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  clearSelectedProduct: () => set({ selectedProduct: null }),
}))
