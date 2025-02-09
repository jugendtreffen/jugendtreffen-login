import { ReactNode } from "react";
import { CloseIcon, InfoIcon } from "src/components/Icons/Icons";
import { useAlert } from "src/components/Alert/AlertContext";

export interface AlertProps {
  id: string
  type?: "info" | "error" | "success",
  message: ReactNode
  dismissible?: boolean
}

export const generateAlertId = () => {
  return Math.random().toString(36).substring(2, 15);
}

const Alert = (props: AlertProps) => {
  const { removeAlert } = useAlert();
  let textColor = "text-gray-300";
  switch (props.type) {
    case "info":
      textColor = "text-blue-400";
      break;
    case "error":
      textColor = "text-red-600";
      break;
    case "success":
      textColor = "text-green-600";
      break;
  }

  return (
    <div
      className={`flex items-center p-4 mb-2 border rounded-lg bg-gray-800 border-gray-700 ${textColor}`}
      role="alert"
      id={props.id}
    >
      <InfoIcon />
      <span className="sr-only">{props.type}</span>
      <div className="ms-3 text-sm font-medium">
        {props.message}
      </div>
      {props.dismissible || props.dismissible == null && (
        <button
          type="button"
          className={`ms-2 -mx-1.5 -my-1.5 ${textColor} rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5  inline-flex items-center justify-center h-8 w-8 bg-gray-800  hover:bg-gray-700`}
          onClick={() => removeAlert(props.id)}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

export default Alert;
