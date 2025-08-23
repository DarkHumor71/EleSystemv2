/**
 * @file Alert.js
 * @description A reusable alert component that displays notifications from Redux state.
 */

import React from "react";
import { useSelector } from "react-redux";

type AlertType = {
  id: string;
  msg: string;
  alertType: string;
};

type AlertProps = {
  alerts?: AlertType[];
};

const Alert: React.FC<AlertProps> = ({ alerts }) => {
  // Use Redux state if alerts prop is not provided
  const reduxAlerts = useSelector((state: any) => state.alert);
  const displayAlerts = alerts || reduxAlerts;
  if (!displayAlerts || displayAlerts.length === 0) return null;
  return (
    <>
      {displayAlerts.map((alert: AlertType) => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.msg}
        </div>
      ))}
    </>
  );
};

export default Alert;
