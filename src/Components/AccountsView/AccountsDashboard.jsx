import AdminSidebar from '../AdminView/AdminSidebar';
import PaymentDashboard from '../AdminView/PaymentDashboard';
import AccountsComponent from './AccountsComponent';


const AccountsDashboard = () => {
  return (
    <div className="">
      <div className="grid grid-cols-6 flex-col">
        <div className="col-span-1">
          <AdminSidebar />
        </div>
        <div className="col-span-5 flex-grow w-full ">
          {/* <AccountsComponent/> */}
          <PaymentDashboard/>
            

        </div>
      </div>
    </div>
  );
}

export default AccountsDashboard








