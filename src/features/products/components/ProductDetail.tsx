import { useProductDetail } from '../hooks/useProductDetail'
import { Button, Skeleton } from '@rangeldor/cindle-design-system'

interface ProductDetailProps {
  productId: string
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const { data: product, isLoading, error } = useProductDetail(productId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-96" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-8 text-destructive">
        Erro ao carregar produto.
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full rounded-lg"
      />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold text-primary">
          R$ {product.price.toFixed(2)}
        </p>
        <p className="text-muted-foreground">{product.description}</p>
        <div className="flex gap-4">
          <span className="px-3 py-1 bg-muted rounded-full text-sm">
            {product.categoryId}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
          </span>
        </div>
        <Button
          size="lg"
          disabled={product.stock === 0}
          className="mt-4"
        >
          Adicionar ao carrinho
        </Button>
      </div>
    </div>
  )
}
