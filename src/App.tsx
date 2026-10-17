import { useToast } from './hooks/useToast.ts'
import { Button } from './shared/components/Button.tsx'

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function App() {
  const toast = useToast()

  return (
    <main className="mx-auto flex min-h-svh max-w-lg flex-col justify-center gap-6 px-6 py-16">
      <div>
        <h1 className="text-3xl text-foreground">Toast test</h1>
        <p className="mt-2 text-muted-foreground">
          Use these buttons to check the notification styles, dismiss, and loading states.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => toast.success('Plant saved')}>Success</Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error('Could not update the cart', {
              description: 'Please try again in a moment.',
            })
          }
        >
          Error
        </Button>
        <Button variant="secondary" onClick={() => toast.warning('Low stock')}>
          Warning
        </Button>
        <Button
          variant="inverted"
          onClick={() =>
            toast.info('New arrival', {
              action: {
                label: 'View plants',
                onClick: () => toast.success('Opened the catalog'),
              },
            })
          }
        >
          Info
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.warning('This one stays until you dismiss it', { persistent: true })}
        >
          Persistent
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            void toast.promise(delay(1200), {
              loading: 'Saving plant',
              success: 'Plant saved',
              error: 'Could not save',
            })
          }}
        >
          Promise success
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            void toast
              .promise(
                delay(1200).then(() => {
                  throw new Error('network down')
                }),
                {
                  loading: 'Saving plant',
                  success: 'Plant saved',
                  error: 'Could not save the plant',
                },
              )
              .catch(() => {})
          }}
        >
          Promise error
        </Button>
      </div>
    </main>
  )
}

export default App
