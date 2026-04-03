import { Card, CardHeader, CardTitle, CardContent } from '@rangeldor/cindle-design-system'
import { ProductListHost } from '../components/ProductListHost'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'

export function ProductsPageHost() {
  return (
    <NuqsAdapter>
      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductListHost />
        </CardContent>
      </Card>
    </NuqsAdapter>
  )
}
