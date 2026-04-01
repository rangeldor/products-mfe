# Products MFE

Micro-frontend de produtos standalone.

## Scripts

```bash
npm run dev          # Inicia em http://localhost:3006
npm run build        # Build para produção
npm run lint         # Verifica código
npm run test         # Executa testes
```

## Variáveis de Ambiente

```env
VITE_PRODUCTS_API_URL=http://localhost:3002
VITE_PRODUCTS_URL=http://localhost:3006
VITE_AUTH_URL=http://localhost:3005
```

## Exposições Module Federation

| Expose | Descrição |
|--------|-----------|
| `./ProductList` | Lista de produtos |
| `./ProductCard` | Card de produto |
| `./ProductDetail` | Detalhes do produto |
| `./ProductsPage` | Página de produtos |
| `./ProductDetailPage` | Página de detalhes |

## Estrutura

```
src/
├── features/products/  # Lógica de produtos
├── shared/            # Componentes compartilhados
└── main.tsx           # Entry point
```
