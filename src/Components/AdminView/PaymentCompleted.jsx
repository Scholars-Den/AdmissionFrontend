

import React from "react";

import AdminSidebar from "./AdminSidebar";

import PaymentDashboard from "./PaymentDashboard";

const PaymentCompleted = () => {
  return (
    <div className="">
      <div className="grid grid-cols-6 flex-col">
        <div className="col-span-1">
          <AdminSidebar />
        </div>
        <div className="col-span-5 flex-grow w-full justify-center items-center">
            <PaymentDashboard/>

        </div>
      </div>
    </div>
  );
};

export default PaymentCompleted;
