import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastProvider } from './contexts/ToastContext.tsx'
import { ErrorBoundary } from './shared/components/ErrorBoundary.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>,
)
