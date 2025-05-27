import Alert from "src/components/Alert/Alert";
import { useAlert } from "src/components/Alert/AlertContext";

const AlertCenter = (props: { className?: string }) => {
  const { alerts } = useAlert();
  if (alerts === null) return null;
  return (
    <div className={props.className}>
      {alerts.map((alert, index) => (
        <Alert
          key={index}
          type={alert.type}
          message={alert.message}
          id={alert.id}
        />
      ))}
    </div>
  )
}

export default AlertCenter;
