import AdminSidebar from '../AdminView/AdminSidebar';
import SuperAdminConponent from './SuperAdminConponent';

const ManagerDashboard = () => {
  return (
    <div className="">
      <div className="grid grid-cols-6 flex-col">
        <div className="col-span-1">
          <AdminSidebar />
        </div>
        <div className="col-span-5 flex-grow w-full ">
            <SuperAdminConponent/>
            

        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard

