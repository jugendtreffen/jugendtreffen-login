import { Field, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Controller } from '@redwoodjs/forms'

const JtLabeledInput = ({ name, label, formControl }) => {
  return (
    <Controller
      name={name}
      control={formControl}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.error}>
          {/*<FieldLabel htmlFor={name}>{label}</FieldLabel>*/}
          <Input
            id={name}
            placeholder={label}
            aria-invalid={fieldState.invalid}
            {...field}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export { JtLabeledInput }
