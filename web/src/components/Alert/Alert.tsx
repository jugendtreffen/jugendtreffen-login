import { ReactNode, useState } from "react";
import { CloseIcon, InfoIcon } from "src/components/Icons/Icons";

interface AlertProps {
  type: 'info' | 'error' | 'success',
  dismiss?: boolean
  message: ReactNode
  show?: boolean
}

const Alert = (props: AlertProps) => {
  // let id = "alert-"
  const [visible, setVisible] = useState(props.show || false)
  let textColor = 'text-gray-300'
  let borderColor = 'border-gray-600'
  switch (props.type) {
    case 'info': textColor = 'text-blue-400'; borderColor = 'text-blue-400'; break
    case 'error': textColor = 'text-red-600'; borderColor = 'text-red-600'; break
    case 'success': textColor = 'text-green-600'; borderColor = 'text-green-600'; break
  }

  return (
    <div
      className={`flex items-center p-4 mb-4 border rounded-lg bg-gray-800 ${borderColor} ${textColor}`}
      role="alert"
      // id={id}
    >
      <InfoIcon/>
      <span className="sr-only">{props.type}</span>
      <div className="ms-3 text-sm font-medium">
        {props.message}
      </div>
      <button
        type="button"
        className={"ms-auto -mx-1.5 -my-1.5 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"}
        // data-dismiss-target={`#${id}`}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <CloseIcon/>
      </button>
    </div>
  )
}

export default Alert
