import { FuelCalculator } from '@/components/fuel-calculator/FuelCalculator'
import { LocaleProvider } from '@/context/LocaleContext'

function App() {
  return (
    <LocaleProvider>
      <FuelCalculator />
    </LocaleProvider>
  )
}

export default App
