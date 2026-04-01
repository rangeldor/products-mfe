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
              <h2 className="text-xl font-semibold text-destructive mb-2">
                Algo deu errado
              </h2>
              <p className="text-muted-foreground mb-4">
                {this.state.error.message}
              </p>
              <Button onClick={this.resetError}>Tentar novamente</Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
