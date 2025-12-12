// import AdminSidebar from '../AdminView/AdminSidebar';
// import AdmissionHeadComponent from './AdmissionHeadComponent';

// const CashierDashboard = () => {
//   return (
//     <div className="">
//       <div className="grid grid-cols-6 flex-col">
//         <div className="col-span-1">
//           <AdminSidebar />
//         </div>
//         <div className="col-span-5 flex-grow w-full ">
//             <AdmissionHeadComponent/>
            

//         </div>
//       </div>
//     </div>
//   );
// }

// export default CashierDashboard




import React, { useState } from "react";
import AdminSidebar from '../AdminView/AdminSidebar';
// import AdminComponent from "./AdminComponent";
import AdmissionHeadComponent from './AdmissionHeadComponent';


const AdmissionHeadDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-[#fdf5f6] via-white to-[#f5eff0]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <AdmissionHeadComponent setSidebarOpen={setSidebarOpen} />
    </div>
  );
};

export default AdmissionHeadDashboard;