import React, { ReactNode } from "react";
import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { useAlert } from "src/components/Alert/AlertContext";

export interface AlertProps {
  id: string
  type?: "info" | "error" | "success" | "warning";
  message: ReactNode
  dismissible?: boolean
}

export const generateAlertId = () => {
  return Math.random().toString(36).substring(2, 15);
}

const Alert = (props: AlertProps) => {
  const { removeAlert } = useAlert();

  const getAlertConfig = () => {
    switch (props.type) {
      case "info":
        return {
          icon: Info,
          bgGradient: "from-blue-500/10 to-cyan-600/10",
          borderColor: "border-blue-500/30",
          textColor: "text-blue-400",
          iconBg: "bg-blue-500/20",
          closeBtnHover: "hover:bg-blue-500/20"
        };
      case "error":
        return {
          icon: XCircle,
          bgGradient: "from-red-500/10 to-rose-600/10",
          borderColor: "border-red-500/30",
          textColor: "text-red-400",
          iconBg: "bg-red-500/20",
          closeBtnHover: "hover:bg-red-500/20"
        };
      case "success":
        return {
          icon: CheckCircle,
          bgGradient: "from-green-500/10 to-emerald-600/10",
          borderColor: "border-green-500/30",
          textColor: "text-green-400",
          iconBg: "bg-green-500/20",
          closeBtnHover: "hover:bg-green-500/20"
        };
      case "warning":
        return {
          icon: AlertTriangle,
          bgGradient: "from-yellow-500/10 to-orange-600/10",
          borderColor: "border-yellow-500/30",
          textColor: "text-yellow-400",
          iconBg: "bg-yellow-500/20",
          closeBtnHover: "hover:bg-yellow-500/20"
        };
      default:
        return {
          icon: Info,
          bgGradient: "from-gray-500/10 to-gray-600/10",
          borderColor: "border-gray-500/30",
          textColor: "text-gray-400",
          iconBg: "bg-gray-500/20",
          closeBtnHover: "hover:bg-gray-500/20"
        };
    }
  };

  const config = getAlertConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={`
        relative flex items-start gap-3 p-3 mb-3
        bg-gradient-to-r ${config.bgGradient}
        backdrop-blur-sm border ${config.borderColor}
        rounded-xl shadow-lg
        transition-all duration-300 ease-out
        hover:shadow-xl hover:-translate-y-0.5
      `}
      role="alert"
      id={props.id}
    >
      {/* Subtle top border accent */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${config.bgGradient} opacity-50`}></div>

      {/* Icon */}
      <div className={`flex-shrink-0 ${config.iconBg} rounded-lg p-2 mt-0.5`}>
        <IconComponent className={`w-5 h-5 ${config.textColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span className="sr-only">{props.type}</span>
        <div className={`text-sm font-medium leading-relaxed text-white`}>
          {props.message}
        </div>
      </div>

      {/* Close Button */}
      {(props.dismissible !== false) && (
        <button
          type="button"
          className={`
            flex-shrink-0 p-1.5 rounded-lg
            ${config.textColor}
            ${config.closeBtnHover}
            transition-all duration-200
            hover:scale-110
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
            focus:ring-blue-400/50
          `}
          onClick={() => removeAlert(props.id)}
          aria-label="Alert schließen"
        >
          <span className="sr-only">Schließen</span>
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
