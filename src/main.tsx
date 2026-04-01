import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ProductsApp } from './ProductsApp'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen bg-background">
      <ProductsApp />
    </div>
  </StrictMode>,
)

// Expose a default export for host consumption when federated.
export default ProductsApp
