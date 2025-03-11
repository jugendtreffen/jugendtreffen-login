import { Children, ReactElement, useState } from "react"
import { Form, Submit, useForm, useFormContext } from "@redwoodjs/forms";
import type { UseFormProps } from "react-hook-form";

interface MultiStepFormProps<TFieldValues> {
  children: ReactElement[] | string[]
  finishText: string
  className: string
  onSubmit: (values: any) => void
  config?: UseFormProps<TFieldValues>
}

const MultiStepForm = ({ children, ...props }: MultiStepFormProps<any>) => {
  const childrenArray = Children.toArray(children)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const {reset, formState: {isValid}} = useForm({mode: 'onTouched'})
  const currentChild = childrenArray.at(currentStep)

  async function handleNextStep() {
    if (isValid) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, childrenArray.length))
      reset()
    }
  }

  function handlePrevStep() {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0))
  }

  function isLastStep() {
    return currentStep == childrenArray.length - 1
  }

  return (
    <>
      <Form onSubmit={props.onSubmit} className={props.className} config={props.config}>
        {currentChild}
        <div className={`flex gap-4 w-full ${currentStep === 0 ? "justify-end" : "justify-between"}`}>
          {currentStep > 0 && (
            <button className="secondary" onClick={handlePrevStep}>Zurück</button>)}
          {!isLastStep() && (<button className="primary" onClick={handleNextStep}>Weiter</button>)}
          {isLastStep() && (<Submit className="primary">{props.finishText}</Submit>)}
        </div>
      </Form>
    </>
  )
}

export default MultiStepForm
