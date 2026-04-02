import { useProducts } from './features/products/hooks/useProducts'
import { ProductCardHost } from './features/products/components/ProductCardHost'
import { Skeleton } from '@rangeldor/cindle-design-system'
import { Product } from './features/products/types/products.types'

function ProductsApp() {
  const { products, isLoading, error } = useProducts()

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
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

  if (!products?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum produto encontrado.
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Produtos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <ProductCardHost key={product.id} product={product} basePath="/produtos" />
        ))}
      </div>
    </div>
  )
}

export { ProductsApp }
