import { Navigate, useLocation } from 'react-router'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const authUrl = import.meta.env.VITE_AUTH_URL || 'http://localhost:3005'

  const storedAuth = localStorage.getItem('auth-storage')
  let isAuthenticated = false
  
  if (storedAuth) {
    try {
      const authData = JSON.parse(storedAuth)
      isAuthenticated = authData.state?.isAuthenticated === true
    } catch {
      isAuthenticated = false
    }
  }

  if (!isAuthenticated) {
    const redirectUrl = `${authUrl}/login?redirect=${encodeURIComponent(location.pathname + location.search)}`
    return <Navigate to={redirectUrl} replace />
  }

  return <>{children}</>
}
