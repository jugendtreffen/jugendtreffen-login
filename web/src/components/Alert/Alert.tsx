import { ReactNode } from "react";
import { CloseIcon, InfoIcon } from "src/components/Icons/Icons";
import { useAlert } from "src/components/Alert/AlertContext";

export interface AlertProps {
  id: string
  type?: "info" | "error" | "success",
  message: ReactNode
}

const Alert = (props: AlertProps) => {
  const { removeAlert } = useAlert();
  let textColor = "text-gray-300";
  let borderColor = "border-gray-600";
  switch (props.type) {
    case undefined:
    case "info":
      textColor = "text-blue-400";
      borderColor = "border-blue-400";
      break;
    case "error":
      textColor = "text-red-600";
      borderColor = "border-red-600";
      break;
    case "success":
      textColor = "text-green-600";
      borderColor = "border-green-600";
      break;
  }

  return (
    <div
      className={`flex items-center p-4 mb-4 border rounded-lg bg-gray-800 ${borderColor} ${textColor}`}
      role="alert"
    >
      <InfoIcon />
      <span className="sr-only">{props.type}</span>
      <div className="ms-3 text-sm font-medium">
        {props.message}
      </div>
      <button
        type="button"
        className={"ms-2 -mx-1.5 -my-1.5 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"}
        onClick={() => removeAlert(props.id)}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <CloseIcon />
      </button>
    </div>
  );
};

export default Alert;
