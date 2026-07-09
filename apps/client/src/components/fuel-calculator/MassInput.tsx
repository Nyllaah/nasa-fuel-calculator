import { ui } from '@/constants/ui'

type MassInputProps = {
  mass: string
  onMassChange: (mass: string) => void
}

function MassInput({ mass, onMassChange }: MassInputProps) {
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
          className="fc-mass-input"
        />
        <span className="fc-unit">{ui.KG}</span>
      </div>
      <p className="fc-hint">{ui.MASS_HINT}</p>
    </div>
  )
}

export { MassInput }
