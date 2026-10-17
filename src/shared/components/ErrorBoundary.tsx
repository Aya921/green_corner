import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-svh max-w-lg flex-col justify-center gap-3 px-6 py-16 text-start">
          <h1 className="text-3xl text-foreground">Something went wrong</h1>
          <p className="text-base text-muted-foreground">
            This page could not be displayed. Refresh the page to continue.
          </p>
        </main>
      )
    }

    return this.props.children
  }
}
