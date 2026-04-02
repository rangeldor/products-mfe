import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { productsApi } from '../services/productsApi'
import { parsers } from '../utils/parsers'

export function useProducts() {
  const [search] = useQueryState('search', parsers.search)

  const query = useQuery({
    queryKey: ['products', { search }],
    queryFn: async () => {
      const products = await productsApi.getProducts({
        search: search ?? undefined,
      })

      // Return the raw products array as the API provides an array.
      return { products }
    },
  })

  return { products: query.data?.products, isLoading: query.isLoading, error: query.error }
}
