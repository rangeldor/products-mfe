# Arquitetura MFE Polyrepo - Especificação de Design

**Data:** 2026-03-31  
**Status:** Aprovado

---

## 1. Visão Geral

4 projetos separados em polyrepo, todos standalone e independentes:

| Projeto | Porta | Responsabilidade |
|---------|-------|------------------|
| **host** | 3000 | Portal shell que consome todos os MFEs |
| **auth-mfe** | 3005 | Autenticação completa |
| **products-mfe** | 3006 | Catálogo de produtos |
| **orders-mfe** | 3007 | Gestão de pedidos |

---

## 2. Stack Tecnológica

| Tecnologia | Versão |
|------------|--------|
| React | 19 |
| TypeScript | ^5 |
| Vite | ^6 |
| @module-federation/vite | latest |
| TailwindCSS | v4 |
| @rangeldor/cindle-design-system | latest |
| Zustand | ^5 |
| TanStack Query | v5 |
| Axios | ^1 |
| React Router | v7 |
| nuqs | latest |
| Zod | ^3 |
| Vitest | latest |
| @testing-library/react | latest |
| ESLint | v9 |
| Prettier | ^3 |

---

## 3. Estrutura de Diretórios (cada MFE)

```
mfe-name/
├── public/
├── src/
│   ├── features/                    # Feature-based (isolado por domínio)
│   │   └── [domain]/              # auth | products | orders
│   │       ├── components/         # Componentes + testes na mesma pasta
│   │       │   ├── ComponentName.tsx
│   │       │   └── ComponentName.test.tsx
│   │       ├── hooks/              # Hooks + testes
│   │       ├── services/           # Chamadas à API
│   │       ├── schemas/           # Zod schemas
│   │       ├── pages/             # Páginas de rota
│   │       ├── stores/            # Zustand stores
│   │       └── types/             # Tipos do domínio
│   │
│   ├── shared/                     # Código genérico do MFE
│   │   ├── components/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ErrorBoundary.test.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ProtectedRoute.test.tsx
│   │   ├── hooks/
│   │   └── utils/
│   │
│   └── app/                        # Configuração da aplicação
│       ├── providers/
│       │   ├── index.tsx
│       │   ├── QueryProvider.tsx
│       │   └── QueryProvider.test.tsx
│       ├── routes.tsx
│       ├── App.tsx
│       └── main.tsx
│
├── .npmrc                          # Token GitHub Package
├── package.json
├── vite.config.ts                  # Module Federation
├── tsconfig.json
├── tailwind.config.ts
├── eslint.config.js
├── prettier.config.js
└── vitest.config.ts
```

---

## 4. Module Federation

### 4.1 Configuração de cada MFE

| MFE | Expõe (exposes) | Consome (remotes) |
|-----|-----------------|-------------------|
| **host** | - | auth, products, orders |
| **auth** | AuthProvider, LoginPage, SignupPage, useAuth, UserMenu, ProtectedRoute | - |
| **products** | ProductList, ProductCard, ProductDetail | auth |
| **orders** | OrderList, OrderDetail, CheckoutForm | auth |

### 4.2 vite.config.ts do Host

```typescript
import { defineConfig } from 'vite'
import { withModuleFederation } from '@module-federation/vite'

export default withModuleFederation({
  name: 'host',
  remotes: {
    auth: 'auth@http://localhost:3005/remoteEntry.js',
    products: 'products@http://localhost:3006/remoteEntry.js',
    orders: 'orders@http://localhost:3007/remoteEntry.js',
  },
})
```

### 4.3 vite.config.ts do Auth MFE

```typescript
import { defineConfig } from 'vite'
import { withModuleFederation } from '@module-federation/vite'

export default withModuleFederation({
  name: 'auth',
  filename: 'remoteEntry.js',
  exposes: {
    './AuthProvider': './src/app/providers/AuthProvider.tsx',
    './LoginPage': './src/features/auth/pages/LoginPage.tsx',
    './SignupPage': './src/features/auth/pages/SignupPage.tsx',
    './useAuth': './src/features/auth/hooks/useAuth.ts',
    './UserMenu': './src/features/auth/components/UserMenu.tsx',
    './ProtectedRoute': './src/shared/components/ProtectedRoute.tsx',
  },
})
```

### 4.4 vite.config.ts do Products MFE

```typescript
import { defineConfig } from 'vite'
import { withModuleFederation } from '@module-federation/vite'

export default withModuleFederation({
  name: 'products',
  filename: 'remoteEntry.js',
  exposes: {
    './ProductList': './src/features/products/components/ProductList.tsx',
    './ProductCard': './src/features/products/components/ProductCard.tsx',
    './ProductDetail': './src/features/products/components/ProductDetail.tsx',
  },
  remotes: {
    auth: 'auth@http://localhost:3005/remoteEntry.js',
  },
})
```

### 4.5 vite.config.ts do Orders MFE

```typescript
import { defineConfig } from 'vite'
import { withModuleFederation } from '@module-federation/vite'

export default withModuleFederation({
  name: 'orders',
  filename: 'remoteEntry.js',
  exposes: {
    './OrderList': './src/features/orders/components/OrderList.tsx',
    './OrderDetail': './src/features/orders/components/OrderDetail.tsx',
    './CheckoutForm': './src/features/orders/components/CheckoutForm.tsx',
  },
  remotes: {
    auth: 'auth@http://localhost:3005/remoteEntry.js',
  },
})
```

### 4.6 Loading Remotes no Host

```typescript
import { lazy, Suspense } from 'react'

const AuthProvider = lazy(() => import('auth/AuthProvider'))
const LoginPage = lazy(() => import('auth/LoginPage'))
const SignupPage = lazy(() => import('auth/SignupPage'))
const ProtectedRoute = lazy(() => import('auth/ProtectedRoute'))
const ProductList = lazy(() => import('products/ProductList'))
const OrderList = lazy(() => import('orders/OrderList'))

// Skeleton do design system
const SkeletonFallback = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-muted rounded w-1/3" />
    <div className="h-4 bg-muted rounded w-1/2" />
  </div>
)

// Error fallback
const ErrorFallback = ({ error, resetError }) => (
  <div className="p-6 text-center">
    <p className="text-destructive mb-4">Algo deu errado ao carregar</p>
    <button onClick={resetError}>Tentar novamente</button>
  </div>
)

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<SkeletonFallback />}>
        <AuthProvider>
          {/* rotas */}
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  )
}
```

---

## 5. Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────────────────┐
│ Products MFE (standalone - localhost:3006)                       │
│                                                                  │
│  useAuth()                                                       │
│  → isAuthenticated() = false                                     │
│  → Redireciona para:                                            │
│    http://localhost:3005/login?redirect=                        │
│    http://localhost:3006/products                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Auth MFE (localhost:3005)                                        │
│                                                                  │
│  LoginPage processa login                                        │
│  → Salva token em cookie HTTP-Only                              │
│  → Redireciona para: http://localhost:3006/products             │
└─────────────────────────────────────────────────────────────────┘
```

### 5.1 Redirect via URL

- Parâmetro `?redirect=` na URL
- Cada MFE verifica se está autenticado e redireciona se necessário
- Funciona standalone em qualquer porta

---

## 6. Ambientes (.env)

```env
# API URLs
VITE_AUTH_API_URL=http://localhost:3001
VITE_PRODUCTS_API_URL=http://localhost:3002
VITE_ORDERS_API_URL=http://localhost:3003

# MFE URLs
VITE_HOST_URL=http://localhost:3000
VITE_AUTH_URL=http://localhost:3005
VITE_PRODUCTS_URL=http://localhost:3006
VITE_ORDERS_URL=http://localhost:3007
```

---

## 7. APIs de Backend (mock)

| API | URL Base |
|-----|----------|
| Auth | http://localhost:3001 |
| Products | http://localhost:3002 |
| Orders | http://localhost:3003 |

---

## 8. Loading/Error States

- **Suspense fallback:** Skeleton do `@rangeldor/cindle-design-system`
- **Error fallback:** ErrorBoundary com fallback customizado
- **Imports:** Todos os remotes usam `lazy()` do React

---

## 9. Nuqs (Query Params)

```typescript
import { createSerializer, parseAsString, parseAsInteger, parseAsArrayOfStrings } from 'nuqs'

export const parsers = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.optional(),
  category: parseAsArrayOfStrings.optional(),
}

export const serializeSearchParams = createSerializer(parsers)
```

---

## 10. Pacote Compartilhado (@rangeldor/shared)

Criado posteriormente para tipos/constants compartilhados entre MFEs:

```
@rangeldor/shared/
├── types/
│   └── auth.ts      # User, AuthResponse
└── types/common.ts  # ApiResponse, PaginatedResponse
```

---

## 11. Regras Importantes

1. **Cada MFE é 100% standalone** - Funciona independentemente dos outros
2. **Named exports** - Todos os componentes usam export nomeado
3. **Composition pattern** - Componentes compostos de partes menores
4. **Design System** - Usar componentes do `@rangeldor/cindle-design-system`
5. **Testes** - Arquivos `.test.tsx` na mesma pasta do componente
6. **Feature-based** - Estrutura organizada por domínio de negócio
