# MFE Polyrepo Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 4 standalone MFE projects (host, auth, products, orders) with Module Federation, React 19, Tailwind v4, and full feature-based structure.

**Architecture:** Each MFE is a completely independent project that can run standalone. The host consumes remotes from auth, products, and orders MFEs via Module Federation. Auth MFE handles authentication and exposes components/hooks to other MFEs.

**Tech Stack:** React 19, TypeScript, Vite, @module-federation/vite, TailwindCSS v4, @rangeldor/cindle-design-system, Zustand, TanStack Query v5, Axios, React Router v7, nuqs, Zod, Vitest, Testing Library, ESLint v9, Prettier

---

## Chunk 1: Auth MFE - Project Setup

**Files to create:**
- `auth-mfe/package.json`
- `auth-mfe/vite.config.ts`
- `auth-mfe/tsconfig.json`
- `auth-mfe/tsconfig.app.json`
- `auth-mfe/tsconfig.node.json`
- `auth-mfe/tailwind.config.ts`
- `auth-mfe/eslint.config.js`
- `auth-mfe/prettier.config.js`
- `auth-mfe/vitest.config.ts`
- `auth-mfe/.env`
- `auth-mfe/index.html`
- `auth-mfe/src/main.tsx`
- `auth-mfe/src/app/App.tsx`
- `auth-mfe/src/app/routes.tsx`
- `auth-mfe/src/app/providers/index.tsx`
- `auth-mfe/src/app/providers/AuthProvider.tsx`
- `auth-mfe/src/app/providers/QueryProvider.tsx`

### Task 1: Create Auth MFE package.json

**Files:**
- Create: `auth-mfe/package.json`

- [ ] **Step 1: Create package.json with all dependencies**

```json
{
  "name": "auth-mfe",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "^7.0.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.7.0",
    "zustand": "^5.0.0",
    "zod": "^3.23.0",
    "nuqs": "^2.0.0",
    "@rangeldor/cindle-design-system": "latest"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "@module-federation/vite": "latest",
    "vitest": "latest",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest",
    "jsdom": "latest",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "typescript-eslint": "^8.0.0"
  }
}
```

- [ ] **Step 2: Run npm install**

Run: `cd auth-mfe && npm install`

### Task 2: Create Auth MFE configuration files

**Files:**
- Create: `auth-mfe/vite.config.ts`
- Create: `auth-mfe/tsconfig.json`
- Create: `auth-mfe/tsconfig.app.json`
- Create: `auth-mfe/tsconfig.node.json`

- [ ] **Step 1: Create vite.config.ts with Module Federation**

```typescript
import { defineConfig } from 'vite'
import { withModuleFederation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
  shared: ['react', 'react-dom', 'react-router', '@tanstack/react-query'],
})

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    withModuleFederation({
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
    }),
  ],
})
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 3: Create tsconfig.app.json**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create tsconfig.node.json**

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

### Task 3: Create Tailwind, ESLint, Prettier configs

**Files:**
- Create: `auth-mfe/tailwind.config.ts`
- Create: `auth-mfe/eslint.config.js`
- Create: `auth-mfe/prettier.config.js`
- Create: `auth-mfe/vitest.config.ts`
- Create: `auth-mfe/.env`

- [ ] **Step 1: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 2: Create eslint.config.js**

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
)
```

- [ ] **Step 3: Create prettier.config.js**

```javascript
export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'lf',
}
```

- [ ] **Step 4: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { withModuleFederation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    withModuleFederation({
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
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
```

- [ ] **Step 5: Create .env file**

```env
VITE_AUTH_API_URL=http://localhost:3001
VITE_AUTH_URL=http://localhost:3005
VITE_HOST_URL=http://localhost:3000
```

### Task 4: Create Auth MFE entry files

**Files:**
- Create: `auth-mfe/index.html`
- Create: `auth-mfe/src/main.tsx`
- Create: `auth-mfe/src/app/App.tsx`
- Create: `auth-mfe/src/app/routes.tsx`
- Create: `auth-mfe/src/app/providers/index.tsx`
- Create: `auth-mfe/src/app/providers/QueryProvider.tsx`
- Create: `auth-mfe/src/test/setup.ts`

- [ ] **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Auth MFE</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Create src/main.tsx**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router/dom'
import { router } from './app/routes'
import { queryClient } from './app/providers/QueryProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
```

- [ ] **Step 3: Create src/index.css**

```css
@import 'tailwindcss'
```

- [ ] **Step 4: Create src/app/providers/QueryProvider.tsx**

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})
```

- [ ] **Step 5: Create src/app/providers/index.tsx (re-export)**

```typescript
export { QueryProvider } from './QueryProvider'
```

- [ ] **Step 6: Create src/app/routes.tsx**

```typescript
import { createRouter, createWebHistory } from 'react-router'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { SignupPage } from '@/features/auth/pages/SignupPage'

export const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_AUTH_URL || '/'),
  routes: [
    { path: '/login', component: LoginPage },
    { path: '/signup', component: SignupPage },
    { index: true, redirect: '/login' },
  ],
})
```

- [ ] **Step 7: Create src/app/App.tsx**

```typescript
import { Outlet } from 'react-router'

export function App() {
  return <Outlet />
}
```

- [ ] **Step 8: Create src/test/setup.ts**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 9: Update tsconfig.app.json to add path alias**

Run: Add to `tsconfig.app.json`:
```json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}
```

---

## Chunk 2: Auth MFE - Features Implementation

**Files to create:**
- `auth-mfe/src/features/auth/types/auth.types.ts`
- `auth-mfe/src/features/auth/schemas/auth.schemas.ts`
- `auth-mfe/src/features/auth/services/authApi.ts`
- `auth-mfe/src/features/auth/stores/authStore.ts`
- `auth-mfe/src/features/auth/hooks/useAuth.ts`
- `auth-mfe/src/features/auth/components/LoginForm.tsx`
- `auth-mfe/src/features/auth/components/LoginForm.test.tsx`
- `auth-mfe/src/features/auth/components/SignupForm.tsx`
- `auth-mfe/src/features/auth/components/SignupForm.test.tsx`
- `auth-mfe/src/features/auth/components/UserMenu.tsx`
- `auth-mfe/src/features/auth/pages/LoginPage.tsx`
- `auth-mfe/src/features/auth/pages/SignupPage.tsx`
- `auth-mfe/src/shared/components/ProtectedRoute.tsx`
- `auth-mfe/src/shared/components/ProtectedRoute.test.tsx`
- `auth-mfe/src/shared/components/ErrorBoundary.tsx`
- `auth-mfe/src/shared/utils/cn.ts`

### Task 5: Create Auth MFE types, schemas, services, store

**Files:**
- Create: `auth-mfe/src/features/auth/types/auth.types.ts`
- Create: `auth-mfe/src/features/auth/schemas/auth.schemas.ts`
- Create: `auth-mfe/src/features/auth/services/authApi.ts`
- Create: `auth-mfe/src/features/auth/stores/authStore.ts`

- [ ] **Step 1: Create auth.types.ts**

```typescript
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  name: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
```

- [ ] **Step 2: Create auth.schemas.ts**

```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
```

- [ ] **Step 3: Create authApi.ts**

```typescript
import axios from 'axios'
import type { AuthResponse, LoginCredentials, SignupCredentials } from '../types/auth.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  withCredentials: true,
})

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials)
    return data
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/signup', credentials)
    return data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    const { data } = await api.get<AuthResponse['user']>('/auth/me')
    return data
  },

  validateToken: async (): Promise<boolean> => {
    try {
      await api.get('/auth/validate')
      return true
    } catch {
      return false
    }
  },
}
```

- [ ] **Step 4: Create authStore.ts**

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types/auth.types'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  checkAuth: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      checkAuth: () => {
        const { token, user } = get()
        return !!token && !!user
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
```

### Task 6: Create Auth MFE hooks

**Files:**
- Create: `auth-mfe/src/features/auth/hooks/useAuth.ts`

- [ ] **Step 1: Create useAuth.ts**

```typescript
import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'
import { authApi } from '../services/authApi'
import type { LoginCredentials, SignupCredentials } from '../types/auth.types'
import { loginSchema, signupSchema } from '../schemas/auth.schemas'

export function useAuth() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, token, isAuthenticated, setAuth, logout: clearAuth } = useAuthStore()

  const redirectUrl = searchParams.get('redirect') || '/'

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const validated = loginSchema.parse(credentials)
      return authApi.login(validated)
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      window.location.href = redirectUrl
    },
  })

  const signupMutation = useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      const validated = signupSchema.parse(credentials)
      return authApi.signup(validated)
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      window.location.href = redirectUrl
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth()
      window.location.href = '/login'
    },
  })

  const logout = useCallback(() => {
    logoutMutation.mutate()
  }, [logoutMutation])

  const isAuthenticatedCheck = useCallback(() => {
    return isAuthenticated && !!user && !!token
  }, [isAuthenticated, user, token])

  return {
    user,
    isAuthenticated: isAuthenticatedCheck(),
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || signupMutation.isPending,
    error: loginMutation.error || signupMutation.error,
  }
}
```

### Task 7: Create Auth MFE components

**Files:**
- Create: `auth-mfe/src/features/auth/components/LoginForm.tsx`
- Create: `auth-mfe/src/features/auth/components/LoginForm.test.tsx`
- Create: `auth-mfe/src/features/auth/components/SignupForm.tsx`
- Create: `auth-mfe/src/features/auth/components/SignupForm.test.tsx`
- Create: `auth-mfe/src/features/auth/components/UserMenu.tsx`
- Create: `auth-mfe/src/features/auth/components/UserMenu.test.tsx`

- [ ] **Step 1: Create LoginForm.tsx**

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@rangeldor/cindle-design-system'
import { useAuth } from '../hooks/useAuth'
import type { LoginFormData } from '../schemas/auth.schemas'
import { loginSchema } from '../schemas/auth.schemas'

export function LoginForm() {
  const { login, isLoading, error } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form onSubmit={handleSubmit(login)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Senha"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      {error && <p className="text-destructive text-sm">{error.message}</p>}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 2: Create LoginForm.test.tsx**

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from './LoginForm'

const mockLogin = vi.fn()
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoading: false,
    error: null,
  }),
}))

describe('LoginForm', () => {
  it('renders form fields', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('calls login with form data on submit', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/senha/i), 'password123')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })
})
```

- [ ] **Step 3: Create SignupForm.tsx**

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@rangeldor/cindle-design-system'
import { useAuth } from '../hooks/useAuth'
import type { SignupFormData } from '../schemas/auth.schemas'
import { signupSchema } from '../schemas/auth.schemas'

export function SignupForm() {
  const { signup, isLoading, error } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  return (
    <form onSubmit={handleSubmit(signup)} className="space-y-4">
      <Input
        label="Nome"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Senha"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      {error && <p className="text-destructive text-sm">{error.message}</p>}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Criando conta...' : 'Criar conta'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 4: Create SignupForm.test.tsx**

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SignupForm } from './SignupForm'

const mockSignup = vi.fn()
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    signup: mockSignup,
    isLoading: false,
    error: null,
  }),
}))

describe('SignupForm', () => {
  it('renders form fields', () => {
    render(<SignupForm />)
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument()
  })

  it('calls signup with form data on submit', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByLabelText(/nome/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/senha/i), 'password123')
    await user.click(screen.getByRole('button', { name: /criar conta/i }))

    expect(mockSignup).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })
  })
})
```

- [ ] **Step 5: Create UserMenu.tsx**

```typescript
import { Button, DropdownMenu, Avatar } from '@rangeldor/cindle-design-system'
import { useAuth } from '../hooks/useAuth'

export function UserMenu() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" className="gap-2">
          <Avatar src={user.image} alt={user.name}>
            {user.name.charAt(0)}
          </Avatar>
          <span>{user.name}</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>{user.email}</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={logout}>Sair</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
```

- [ ] **Step 6: Create UserMenu.test.tsx**

```typescript
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { UserMenu } from './UserMenu'

const mockLogout = vi.fn()
const mockUser = { id: '1', name: 'John', email: 'john@example.com', role: 'user' as const }

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: mockLogout,
  }),
}))

describe('UserMenu', () => {
  it('renders user name', () => {
    render(<UserMenu />)
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('renders user initial in avatar', () => {
    render(<UserMenu />)
    expect(screen.getByText('J')).toBeInTheDocument()
  })
})
```

### Task 8: Create Auth MFE pages

**Files:**
- Create: `auth-mfe/src/features/auth/pages/LoginPage.tsx`
- Create: `auth-mfe/src/features/auth/pages/LoginPage.test.tsx`
- Create: `auth-mfe/src/features/auth/pages/SignupPage.tsx`
- Create: `auth-mfe/src/features/auth/pages/SignupPage.test.tsx`

- [ ] **Step 1: Create LoginPage.tsx**

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@rangeldor/cindle-design-system'
import { LoginForm } from '../components/LoginForm'
import { Link } from 'react-router'

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Não tem conta? <Link to="/signup" className="text-primary hover:underline">Cadastre-se</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Create LoginPage.test.tsx**

```typescript
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LoginPage } from './LoginPage'
import { MemoryRouter } from 'react-router'

vi.mock('../components/LoginForm', () => ({
  LoginForm: () => <div>LoginForm</div>,
}))

describe('LoginPage', () => {
  it('renders login page', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/entrar/i)).toBeInTheDocument()
    expect(screen.getByText(/não tem conta/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Create SignupPage.tsx**

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@rangeldor/cindle-design-system'
import { SignupForm } from '../components/SignupForm'
import { Link } from 'react-router'

export function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
        </CardHeader>
        <CardContent>
          <SignupForm />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Já tem conta? <Link to="/login" className="text-primary hover:underline">Entrar</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 4: Create SignupPage.test.tsx**

```typescript
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SignupPage } from './SignupPage'
import { MemoryRouter } from 'react-router'

vi.mock('../components/SignupForm', () => ({
  SignupForm: () => <div>SignupForm</div>,
}))

describe('SignupPage', () => {
  it('renders signup page', () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/criar conta/i)).toBeInTheDocument()
    expect(screen.getByText(/já tem conta/i)).toBeInTheDocument()
  })
})
```

### Task 9: Create Auth MFE shared components

**Files:**
- Create: `auth-mfe/src/shared/components/ProtectedRoute.tsx`
- Create: `auth-mfe/src/shared/components/ProtectedRoute.test.tsx`
- Create: `auth-mfe/src/shared/components/ErrorBoundary.tsx`
- Create: `auth-mfe/src/shared/components/ErrorBoundary.test.tsx`
- Create: `auth-mfe/src/shared/utils/cn.ts`

- [ ] **Step 1: Create ProtectedRoute.tsx**

```typescript
import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallbackUrl?: string
}

export function ProtectedRoute({ children, fallbackUrl = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const redirectUrl = `${fallbackUrl}?redirect=${encodeURIComponent(location.pathname + location.search)}`
    return <Navigate to={redirectUrl} replace />
  }

  return <>{children}</>
}
```

- [ ] **Step 2: Create ProtectedRoute.test.tsx**

```typescript
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProtectedRoute } from './ProtectedRoute'
import { MemoryRouter, Routes, Route } from 'react-router'

const mockIsAuthenticated = vi.fn()

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated(),
  }),
}))

describe('ProtectedRoute', () => {
  it('renders children when authenticated', () => {
    mockIsAuthenticated.mockReturnValue(true)
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects when not authenticated', () => {
    mockIsAuthenticated.mockReturnValue(false)
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute fallbackUrl="/login">
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Create ErrorBoundary.tsx**

```typescript
import { Component, type ReactNode } from 'react'
import { Button, Card, CardContent } from '@rangeldor/cindle-design-system'

interface Props {
  children: ReactNode
  fallback?: (props: { error: Error; resetError: () => void }) => ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.resetError,
        })
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-8">
              <h2 className="text-xl font-semibold text-destructive mb-2">Algo deu errado</h2>
              <p className="text-muted-foreground mb-4">{this.state.error.message}</p>
              <Button onClick={this.resetError}>Tentar novamente</Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
```

- [ ] **Step 4: Create ErrorBoundary.test.tsx**

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('ErrorBoundary', () => {
  afterEach(() => {
    consoleError.mockClear()
  })

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders fallback when error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText(/algo deu errado/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument()
  })

  it('calls resetError on button click', async () => {
    const user = userEvent.setup()
    const resetFn = vi.fn()

    render(
      <ErrorBoundary fallback={({ resetError }) => (
        <button onClick={resetError}>Reset</button>
      )}>
        <ThrowError />
      </ErrorBoundary>
    )

    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(resetFn).toHaveBeenCalled()
  })
})
```

- [ ] **Step 5: Create cn.ts utility**

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 6: Install clsx and tailwind-merge**

Run: `cd auth-mfe && npm install clsx tailwind-merge`

### Task 10: Create AuthProvider (for Module Federation export)

**Files:**
- Create: `auth-mfe/src/app/providers/AuthProvider.tsx`

- [ ] **Step 1: Create AuthProvider.tsx**

```typescript
import { useEffect } from 'react'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { authApi } from '@/features/auth/services/authApi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Skeleton } from '@rangeldor/cindle-design-system'

const queryClient = new QueryClient()

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, token, setAuth, logout } = useAuthStore()

  useEffect(() => {
    const validateAuth = async () => {
      if (token && !isAuthenticated) {
        try {
          const user = await authApi.getCurrentUser()
          setAuth(user, token)
        } catch {
          logout()
        }
      }
    }

    validateAuth()
  }, [token, isAuthenticated, setAuth, logout])

  if (!isAuthenticated && token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="w-64 h-8" />
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

---

## Chunk 3: Products MFE - Project Setup

**Files to create (similar structure to auth-mfe):**
- `products-mfe/package.json`
- `products-mfe/vite.config.ts`
- `products-mfe/tsconfig.json`
- `products-mfe/tsconfig.app.json`
- `products-mfe/tsconfig.node.json`
- `products-mfe/tailwind.config.ts`
- `products-mfe/eslint.config.js`
- `products-mfe/prettier.config.js`
- `products-mfe/vitest.config.ts`
- `products-mfe/.env`
- `products-mfe/index.html`
- `products-mfe/src/main.tsx`
- `products-mfe/src/index.css`
- `products-mfe/src/app/App.tsx`
- `products-mfe/src/app/routes.tsx`
- `products-mfe/src/app/providers/QueryProvider.tsx`
- `products-mfe/src/test/setup.ts`

### Task 11: Create Products MFE configuration

- [ ] **Step 1: Create products-mfe/package.json with same structure as auth-mfe but with name "products-mfe"**

```json
{
  "name": "products-mfe",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite --port 3006",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "^7.0.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.7.0",
    "zustand": "^5.0.0",
    "zod": "^3.23.0",
    "nuqs": "^2.0.0",
    "@rangeldor/cindle-design-system": "latest"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "@module-federation/vite": "latest",
    "vitest": "latest",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest",
    "jsdom": "latest",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "typescript-eslint": "^8.0.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0"
  }
}
```

- [ ] **Step 2: Create products-mfe/vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import { withModuleFederation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 3: Create remaining config files**

Create `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tailwind.config.ts`, `eslint.config.js`, `prettier.config.js`, `vitest.config.ts` following the same pattern as auth-mfe.

- [ ] **Step 4: Create products-mfe/.env**

```env
VITE_PRODUCTS_API_URL=http://localhost:3002
VITE_PRODUCTS_URL=http://localhost:3006
VITE_HOST_URL=http://localhost:3000
VITE_AUTH_URL=http://localhost:3005
```

- [ ] **Step 5: Create products-mfe/index.html and entry files**

Create index.html, src/main.tsx, src/index.css, src/app/App.tsx, src/app/routes.tsx, src/app/providers/QueryProvider.tsx, src/test/setup.ts following the same pattern as auth-mfe.

---

## Chunk 4: Products MFE - Features Implementation

**Files to create:**
- `products-mfe/src/features/products/types/products.types.ts`
- `products-mfe/src/features/products/schemas/products.schemas.ts`
- `products-mfe/src/features/products/services/productsApi.ts`
- `products-mfe/src/features/products/stores/productsStore.ts`
- `products-mfe/src/features/products/hooks/useProducts.ts`
- `products-mfe/src/features/products/hooks/useProductDetail.ts`
- `products-mfe/src/features/products/components/ProductCard.tsx`
- `products-mfe/src/features/products/components/ProductList.tsx`
- `products-mfe/src/features/products/components/ProductDetail.tsx`
- `products-mfe/src/features/products/pages/ProductsPage.tsx`
- `products-mfe/src/features/products/pages/ProductDetailPage.tsx`
- `products-mfe/src/shared/components/ErrorBoundary.tsx`
- `products-mfe/src/shared/utils/cn.ts`

### Task 12: Create Products MFE types, schemas, services, store

- [ ] **Step 1: Create products.types.ts**

```typescript
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  createdAt: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  pageSize: number
}

export interface ProductFilters {
  search?: string
  category?: string[]
  minPrice?: number
  maxPrice?: number
  page?: number
}
```

- [ ] **Step 2: Create products.schemas.ts**

```typescript
import { z } from 'zod'

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.array(z.string()).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  page: z.number().min(1).optional(),
})

export type ProductFiltersFormData = z.infer<typeof productFiltersSchema>
```

- [ ] **Step 3: Create productsApi.ts**

```typescript
import axios from 'axios'
import type { Product, ProductsResponse, ProductFilters } from '../types/products.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTS_API_URL,
})

export const productsApi = {
  getProducts: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const { data } = await api.get<ProductsResponse>('/products', { params: filters })
    return data
  },

  getProductById: async (id: string): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`)
    return data
  },

  getCategories: async (): Promise<string[]> => {
    const { data } = await api.get<string[]>('/products/categories')
    return data
  },
}
```

- [ ] **Step 4: Create productsStore.ts**

```typescript
import { create } from 'zustand'
import type { Product } from '../types/products.types'

interface ProductsStore {
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
  clearSelectedProduct: () => void
}

export const useProductsStore = create<ProductsStore>((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  clearSelectedProduct: () => set({ selectedProduct: null }),
}))
```

### Task 13: Create Products MFE hooks with nuqs

- [ ] **Step 1: Create parsers.ts**

```typescript
import { createSerializer, parseAsString, parseAsInteger, parseAsArrayOfStrings } from 'nuqs'

export const parsers = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.optional(),
  category: parseAsArrayOfStrings.optional(),
  minPrice: parseAsString.optional(),
  maxPrice: parseAsString.optional(),
}

export const serializeSearchParams = createSerializer(parsers)
```

- [ ] **Step 2: Create useProducts.ts**

```typescript
import { useQuery } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { productsApi } from '../services/productsApi'
import { parsers } from '../parsers'

export function useProducts() {
  const [page] = useQueryState('page', parsers.page)
  const [search] = useQueryState('search', parsers.search)
  const [category] = useQueryState('category', parsers.category)

  return useQuery({
    queryKey: ['products', { page, search, category }],
    queryFn: () =>
      productsApi.getProducts({
        page: page ?? 1,
        search: search ?? undefined,
        category: category ?? undefined,
      }),
  })
}
```

- [ ] **Step 3: Create useProductDetail.ts**

```typescript
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../services/productsApi'

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id,
  })
}
```

### Task 14: Create Products MFE components

- [ ] **Step 1: Create ProductCard.tsx**

```typescript
import { Card, CardContent, CardFooter, Button, Skeleton } from '@rangeldor/cindle-design-system'
import { Link } from 'react-router'
import type { Product } from '../types/products.types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 mt-auto">
        <span className="text-xl font-bold">R$ {product.price.toFixed(2)}</span>
        <Button asChild>
          <Link to={`/products/${product.id}`}>Ver detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
```

- [ ] **Step 2: Create ProductList.tsx**

```typescript
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from './ProductCard'
import { Skeleton } from '@rangeldor/cindle-design-system'

export function ProductList() {
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

  if (!data?.products.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum produto encontrado.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create ProductDetail.tsx**

```typescript
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
        src={product.image}
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
          <span className="badge">{product.category}</span>
          <span className="badge">{product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}</span>
        </div>
        <Button
          size="lg"
          disabled={product.stock === 0}
        >
          Adicionar ao carrinho
        </Button>
      </div>
    </div>
  )
}
```

### Task 15: Create Products MFE pages

- [ ] **Step 1: Create ProductsPage.tsx**

```typescript
import { ProductList } from '../components/ProductList'
import { PageLayout } from '@/shared/components/PageLayout'

export function ProductsPage() {
  return (
    <PageLayout title="Produtos">
      <ProductList />
    </PageLayout>
  )
}
```

- [ ] **Step 2: Create ProductDetailPage.tsx**

```typescript
import { useParams } from 'react-router'
import { ProductDetail } from '../components/ProductDetail'
import { PageLayout } from '@/shared/components/PageLayout'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <div>Produto não encontrado</div>
  }

  return (
    <PageLayout title="Detalhes do Produto">
      <ProductDetail productId={id} />
    </PageLayout>
  )
}
```

### Task 16: Create shared components and PageLayout

- [ ] **Step 1: Create PageLayout.tsx**

```typescript
import { Container } from '@rangeldor/cindle-design-system'

interface PageLayoutProps {
  children: React.ReactNode
  title: string
}

export function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <div className="py-8">
      <Container>
        <h1 className="text-3xl font-bold mb-8">{title}</h1>
        {children}
      </Container>
    </div>
  )
}
```

---

## Chunk 5: Orders MFE - Project Setup and Features

**Files to create (similar to products-mfe):**
- All configuration files
- Features: orders/types, orders/schemas, orders/services, orders/stores, orders/hooks, orders/components, orders/pages
- Shared components

### Task 17: Create Orders MFE (similar to products-mfe)

- [ ] **Step 1: Create orders-mfe with same structure as products-mfe**

Create all configuration files following the same pattern as products-mfe with:
- name: 'orders-mfe'
- port: 3007
- exposes: OrderList, OrderDetail, CheckoutForm
- consumes: auth remote

- [ ] **Step 2: Create orders types, schemas, services, store**

```typescript
// orders/types/orders.types.ts
export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

export interface CreateOrderRequest {
  items: { productId: string; quantity: number }[]
}
```

- [ ] **Step 3: Create orders components**

Create OrderList, OrderDetail, CheckoutForm components following the same pattern as products-mfe.

---

## Chunk 6: Host - Project Setup

**Files to create:**
- All configuration files
- App with lazy loading of remotes
- Shell components (navigation)

### Task 18: Create Host configuration and App

- [ ] **Step 1: Create host/package.json**

```json
{
  "name": "host",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite --port 3000",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "^7.0.0",
    "@rangeldor/cindle-design-system": "latest"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "@module-federation/vite": "latest",
    "vitest": "latest",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest",
    "jsdom": "latest",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0"
  }
}
```

- [ ] **Step 2: Create host/vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import { withModuleFederation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default withModuleFederation({
  name: 'host',
  remotes: {
    auth: 'auth@http://localhost:3005/remoteEntry.js',
    products: 'products@http://localhost:3006/remoteEntry.js',
    orders: 'orders@http://localhost:3007/remoteEntry.js',
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 3: Create Host App with lazy loading**

```typescript
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Skeleton } from '@rangeldor/cindle-design-system'

const AuthProvider = lazy(() => import('auth/AuthProvider'))
const LoginPage = lazy(() => import('auth/LoginPage'))
const SignupPage = lazy(() => import('auth/SignupPage'))
const ProductList = lazy(() => import('products/ProductList'))
const OrderList = lazy(() => import('orders/OrderList'))

const SkeletonFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Skeleton className="w-64 h-8" />
  </div>
)

const ErrorFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-2xl font-bold text-destructive mb-4">Algo deu errado</h1>
    <p className="text-muted-foreground mb-4">{error.message}</p>
    <button onClick={resetError} className="btn-primary">Tentar novamente</button>
  </div>
)

export function App() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense fallback={<SkeletonFallback />}>
        <AuthProvider>
          <BrowserRouter>
            <Shell>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/orders" element={<OrderList />} />
                <Route path="/" element={<HomePage />} />
              </Routes>
            </Shell>
          </BrowserRouter>
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  )
}
```

- [ ] **Step 4: Create Shell component**

```typescript
import { NavLink } from 'react-router'
import { useAuth } from 'auth/useAuth'

export function Shell({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="container flex items-center justify-between py-4">
          <div className="flex gap-4">
            <NavLink to="/" className="font-bold text-xl">MFE App</NavLink>
            <NavLink to="/products" className="nav-link">Produtos</NavLink>
            <NavLink to="/orders" className="nav-link">Pedidos</NavLink>
          </div>
          <div className="flex gap-4 items-center">
            {isAuthenticated ? (
              <>
                <span>{user?.name}</span>
                <button onClick={logout}>Sair</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-link">Entrar</NavLink>
                <NavLink to="/signup" className="nav-link">Cadastrar</NavLink>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-4 text-center text-muted-foreground">
        MFE Host © 2026
      </footer>
    </div>
  )
}
```

---

## Chunk 7: Final Verification

### Task 19: Verify all projects

- [ ] **Step 1: Verify auth-mfe builds**

Run: `cd auth-mfe && npm run build`

- [ ] **Step 2: Verify products-mfe builds**

Run: `cd products-mfe && npm run build`

- [ ] **Step 3: Verify orders-mfe builds**

Run: `cd orders-mfe && npm run build`

- [ ] **Step 4: Verify host builds**

Run: `cd host && npm run build`

- [ ] **Step 5: Create README.md for each MFE**

Create simple README with:
- Project name
- Available scripts
- Environment variables
- How to run

---

## Implementation Order

1. **Auth MFE** (Chunk 1, 2) - First because other MFEs depend on it
2. **Products MFE** (Chunk 3, 4) - Second standalone MFE
3. **Orders MFE** (Chunk 5) - Third standalone MFE
4. **Host** (Chunk 6) - Last, consumes all remotes
5. **Verification** (Chunk 7) - Final check

---

**Spec for reference:** `docs/architecture-design.md`
