import { useAlert } from "src/components/Alert/AlertContext";
import Alert from "src/components/Alert/Alert";

const AlertCenter = () => {
  const { alerts } = useAlert();
  if(alerts === null) return null
  return (
    <>
      {alerts.map((alert, index) => (
        <Alert key={index} type={alert.type} message={alert.message} id={alert.id} />
      ))}
    </>
  );
};

export default AlertCenter;
