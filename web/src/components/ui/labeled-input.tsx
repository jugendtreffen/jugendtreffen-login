import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Controller } from '@redwoodjs/forms'

interface LabeldInputProps {
  name: string
  label: string
  formControl: any
  placeholder?: string
}

const LabeledInput = ({
  name,
  label,
  formControl,
  placeholder,
}: LabeldInputProps) => {
  return (
    <Controller
      name={name}
      control={formControl}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.error}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            id={name}
            placeholder={placeholder ?? label}
            aria-invalid={fieldState.invalid}
            {...field}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export { LabeledInput }
