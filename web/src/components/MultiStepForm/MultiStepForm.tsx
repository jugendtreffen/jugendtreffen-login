import { Children, ReactElement, useState } from "react"
import { Form, Submit } from "@redwoodjs/forms"

interface MultiStepFormProps {
  children: ReactElement[] | string[]
  finishText: string
  className: string
  onSubmit: (values: any) => void
}

const MultiStepForm = ({ children, ...props }: MultiStepFormProps) => {
  const childrenArray = Children.toArray(children)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const currentChild = childrenArray.at(currentStep)

  function handleNextStep() {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, childrenArray.length))
  }

  function handlePrevStep() {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0))
  }

  function isLastStep() {
    return currentStep == childrenArray.length - 1
  }

  return (
    <>
      <Form onSubmit={props.onSubmit} className={props.className}>
        {currentChild}
        <div className="flex justify-between gap-4 w-full">
          {currentStep > 0 && (
            <button className="secondary justify-self-start" onClick={handlePrevStep}>Zurück</button>)}
          {!isLastStep() && (<button className="primary justify-self-end" onClick={handleNextStep}>Weiter</button>)}
          {isLastStep() && (<Submit className="primary justify-self-end">{props.finishText}</Submit>)}
        </div>
      </Form>
    </>
  )
}

export default MultiStepForm
