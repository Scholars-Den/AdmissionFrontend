import AdminSidebar from '../AdminView/AdminSidebar';
import AmountPaidComponent from './AmountPaidComponent';
import CashierComponent from './CashierComponent';

const AmountPaidList = () => {
  return (
    <div className="">
      <div className="grid grid-cols-6 flex-col">
        <div className="col-span-1">
          <AdminSidebar />
        </div>
        <div className="col-span-5 flex-grow w-full ">
            <AmountPaidComponent/>
            {/* <ApprovalCompleteComponent/> */}
            

        </div>
      </div>
    </div>
  );
}

export default AmountPaidList








