import React, { Component, ReactNode } from 'react'
import { Text } from 'react-native'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details here, e.g., to an external logging service
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI if provided; otherwise, show default fallback
      return this.props.fallback || <Text>Something went wrong.</Text>
    }

    return this.props.children
  }
}

export default ErrorBoundary
