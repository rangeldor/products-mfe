import { useProducts } from '../hooks/useProducts'
import { ProductCardHost } from './ProductCardHost'
import { Skeleton } from '@rangeldor/cindle-design-system'

export function ProductListHost() {
  const { data, isLoading, error } = useProducts()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-80" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Erro ao carregar produtos. Tente novamente.
      </div>
    )
  }

  if (!data?.products?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum produto encontrado.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.products.map((product) => (
        <ProductCardHost key={product.id} product={product} />
      ))}
    </div>
  )
}
