import { useLocale } from '@/context/LocaleContext'
import { isValidMass } from '@/lib/mass'
import { cn } from '@/lib/utils'

type MassInputProps = {
  mass: string
  onMassChange: (mass: string) => void
}

function MassInput({ mass, onMassChange }: MassInputProps) {
  const { ui, errors } = useLocale()
  const invalid = !isValidMass(mass)

  return (
    <div className="fc-panel-sm">
      <label htmlFor="spacecraft-mass" className="fc-field-label">
        {ui.SPACECRAFT_MASS}
      </label>
      <div className="flex items-baseline gap-2.5">
        <input
          id="spacecraft-mass"
          type="number"
          value={mass}
          onChange={(event) => onMassChange(event.target.value)}
          min={1}
          aria-invalid={invalid}
          className={cn('fc-mass-input', invalid && 'fc-mass-input-invalid')}
        />
        <span className="fc-unit">{ui.KG}</span>
      </div>
      {invalid ? (
        <p className="fc-field-error" role="alert">
          {errors.INVALID_MASS}
        </p>
      ) : (
        <p className="fc-hint">{ui.MASS_HINT}</p>
      )}
    </div>
  )
}

export { MassInput }
