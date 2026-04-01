import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { productsApi } from '../services/productsApi'
import { parsers } from '../utils/parsers'

export function useProducts() {
  const [page] = useQueryState('page', parsers.page)
  const [search] = useQueryState('search', parsers.search)

  return useQuery({
    queryKey: ['products', { page, search }],
    queryFn: () =>
      productsApi.getProducts({
        page: page ?? 1,
        search: search ?? undefined,
      }),
  })
}
