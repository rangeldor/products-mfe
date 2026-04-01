import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../services/productsApi'

export function useProductDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => {
      if (!id) throw new Error('Product ID is required')
      return productsApi.getProductById(id)
    },
    enabled: !!id,
  })
}
