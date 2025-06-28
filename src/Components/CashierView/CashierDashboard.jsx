import AdminSidebar from '../AdminView/AdminSidebar';
import CashierComponent from './CashierComponent';

const CashierDashboard = () => {
  return (
    <div className="">
      <div className="grid grid-cols-6 flex-col">
        <div className="col-span-1">
          <AdminSidebar />
        </div>
        <div className="col-span-5 flex-grow w-full ">
            <CashierComponent/>
            {/* <ApprovalCompleteComponent/> */}
            

        </div>
      </div>
    </div>
  );
}

export default CashierDashboard

