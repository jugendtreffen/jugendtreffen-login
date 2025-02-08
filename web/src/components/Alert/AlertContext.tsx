import { createContext, useContext, useState } from "react";
import { AlertProps } from "src/components/Alert/Alert";

type Alert = {
  id: string;
} & AlertProps;

type AlertContextType = {
  alerts: Alert[];
  addAlert: (message: string, type?: Alert["type"]) => string;
  removeAlert: (id: string) => void;
  removeAllAlerts: () => void;
};

const AlertContext = createContext<AlertContextType | null>(null);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (message: string, type?: Alert["type"]) => {
    console.log('addAlert',message, type)
    const id = Math.random().toString(36).substring(2,15)
    setAlerts( [...alerts, { id, message, type }]);
    return id;
  }

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter((alert: { id: string; }) => alert.id !== id));
  }

  const removeAllAlerts = () => {
    setAlerts([]);
  }

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, removeAllAlerts }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
