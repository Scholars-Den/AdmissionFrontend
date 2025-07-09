// components/StatusBadge.jsx
import React from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  SparklesIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid"; // Use `outline` if preferred

const getStatusConfig = (status) => {
  switch (status) {
    case "approved":
      return {
        colorClass: "bg-green-100 text-green-700",
        icon: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
        label: "Approved",
      };
    case "not approved":
      return {
        colorClass: "bg-red-100 text-red-700",
        icon: <XCircleIcon className="w-5 h-5 text-red-600" />,
        label: "Not Approved",
      };
    case "pending":
      return {
        colorClass: "bg-yellow-100 text-yellow-700",
        icon: <ClockIcon className="w-5 h-5 text-yellow-500" />,
        label: "Pending",
      };
    // case "amountPaid":
    //   return {
    //     colorClass: "bg-blue-100 text-blue-700",
    //     icon: <CurrencyRupeeIcon className="w-5 h-5 text-blue-600" />,
    //     label: "Amount Paid",
    //   };
    case "successful":
      return {
        colorClass: "bg-indigo-100 text-indigo-700",
        icon: <SparklesIcon className="w-5 h-5 text-indigo-600" />,
        label: "Successfully Enrolled",
      };
    default:
      return {
        colorClass: "bg-gray-100 text-gray-600",
        icon: <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400" />,
        label: "Unknown",
      };
  }
};

const StatusBadge = ({ status, message }) => {
  const { colorClass, icon, label } = getStatusConfig(status);

  console.log("STATUS, MESSAGE", status, message);

  return (
    <div className="flex flex-col items-end text-right">
      <div
        className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${colorClass}`}
      >
        {icon}
        <span>{label}</span>
      </div>
      {message && <span className="text-xs text-gray-600 mt-1">{message}</span>}
    </div>
  );
};

export default StatusBadge;
