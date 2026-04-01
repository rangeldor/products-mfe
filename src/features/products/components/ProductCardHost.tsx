import type { Product } from '../types/products.types'
import { Button } from '@rangeldor/cindle-design-system'

interface ProductCardHostProps {
  product: Product
  basePath?: string
}

export function ProductCardHost({ product, basePath = '/produtos' }: ProductCardHostProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold">R$ {product.price.toFixed(2)}</span>
          <a href={`${basePath}/${product.id}`}>
            <Button size="sm">
              Ver detalhes
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
