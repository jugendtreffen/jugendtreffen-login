import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

type StepperProps = {
  steps: string[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center w-full mb-8">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep

        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-1 text-sm transition-all',
                  isCompleted &&
                    'bg-primary border-primary text-primary-foreground',
                  isActive && 'border-primary text-primary',
                  !isCompleted &&
                    !isActive &&
                    'border-muted-foreground text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  'mt-1 text-xs text-center w-20 truncate',
                  isActive
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 mb-4 transition-all',
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
