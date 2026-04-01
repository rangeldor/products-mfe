import { ProductListHost } from '../components/ProductListHost'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'

export function ProductsPageHost() {
  // Wrap host-facing page with NuqsAdapter so hooks like `useQueryState` work
  // when the host consumes this remote. The adapter is lightweight and uses
  // the host's react-router v6 internals.
  return (
    <NuqsAdapter>
      <ProductListHost />
    </NuqsAdapter>
  )
}
