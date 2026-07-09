import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useFuelCalculator } from '@/hooks/useFuelCalculator'

function App() {
  const { status, result, error } = useFuelCalculator()

  const totalFuel =
    result && 'totalFuel' in result ? result.totalFuel.toLocaleString() : null

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>NASA Fuel Calculator</CardTitle>
          <CardDescription>Interplanetary travel fuel estimator</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm">
            Connection: <span className="text-foreground">{status}</span>
          </p>
          {error && <p className="text-destructive text-sm">{error}</p>}
          {totalFuel && (
            <p className="text-sm">
              Total fuel: <strong>{totalFuel} kg</strong>
            </p>
          )}
          <Button size="sm" disabled>
            UI coming in Phase 2
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

export default App
