import { Children, ReactElement, useState } from "react";

import type { UseFormProps } from "react-hook-form";

import { Form, Submit } from "@redwoodjs/forms";

interface MultiStepFormProps<TFieldValues> {
  children: ReactElement[] | string[]
  finishText: string
  className: string
  onSubmit: (values: any) => void
  disableSubmit?: boolean
  config?: UseFormProps<TFieldValues>
  formMethods: any
}

const MultiStepForm = ({ children, ...props }: MultiStepFormProps<any>) => {
  const childrenArray = Children.toArray(children)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const currentChild = childrenArray.at(currentStep)

  async function handleNextStep() {
    await props.formMethods.trigger()

    if (props.formMethods.formState.isValid) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, childrenArray.length))
      props.formMethods.clearErrors()
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
      <Form
        onSubmit={props.onSubmit}
        className={props.className}
        config={props.config}
        formMethods={props.formMethods}
      >
        {currentChild}
        <div
          className={`flex gap-4 w-full ${currentStep === 0 ? 'justify-end' : 'justify-between'}`}
        >
          {currentStep > 0 && (
            <button
              className="secondary"
              type={'button'}
              onClick={handlePrevStep}
            >
              Zurück
            </button>
          )}
          {!isLastStep() && (
            <button
              type={'button'}
              className="primary"
              onClick={handleNextStep}
            >
              Weiter
            </button>
          )}
          {isLastStep() && (
            <Submit className="primary" disabled={props.disableSubmit === true}>
              {props.finishText}{' '}
            </Submit>
          )}
        </div>
      </Form>
    </>
  )
}

export default MultiStepForm
