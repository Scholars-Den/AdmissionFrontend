import AdminSidebar from "../AdminView/AdminSidebar";
import ConsellorComponent from "./ConsellorComponent";

const ConsellorDashboard = () => {
  return (
    <div className="">
      <div className="grid grid-cols-6 flex-col">
        <div className="col-span-1">
          <AdminSidebar />
        </div>
        <div className="col-span-5 flex-grow w-full ">
          <ConsellorComponent />
          {/* <ApprovalCompleteComponent/> */}
        </div>
      </div>
    </div>
  );
};

export default ConsellorDashboard;
