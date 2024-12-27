import { useState } from 'react'
import { Form, Submit } from "@redwoodjs/forms";

const MultiStepForm = ({ children, ...props }) => {
  const childrenArray = React.Children.toArray(children)
  const [step, setStep] = useState(0)
  const currentChild = childrenArray.at(step)

  function isLastStep() {
    return step == childrenArray.length
  }

  function onSubmit(values) {
    isLastStep() && console.log(values)
  }

  return <div>
    <Form onSubmit={onSubmit}>
      {currentChild}
      <Submit onClick={() => setStep(step+1)}>{isLastStep() ? 'Finish' : 'Next'}</Submit>
    </Form>

  </div>
}

export default MultiStepForm
