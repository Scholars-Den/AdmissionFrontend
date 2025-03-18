import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserDetails } from '../../redux/formDataSlice';

const TermsAndConditionPage = () => {
  const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.userDetails);

  


   const handleChange = (name, value) => {
       dispatch(updateUserDetails({ [name]: value }));
      navigate("/");
  
      
    };

    useEffect(()=>{
        console.log("userData", userData);
    },[userData])
  
        return (
          <div className="max-w-4xl mx-auto p-6 bg-[#c61d23] text-white shadow-lg rounded-lg relative">
            
            <h1 className="text-2xl font-bold mb-4 text-center">Terms & Conditions</h1>

            <button className='absolute top-2 hover:bg-[#ffdd00] hover:text-black right-6 text-3xl border-2 px-3 py-2 rounded-full text-white' onClick={()=> navigate("/") }>X</button>
 
            <ol className="list-decimal pl-5 space-y-3">
              <li>In case of non-payment of fees by the due date, the student will not be allowed to attend classes from the same date. Scholars Den reserves the right to file a lawsuit to recover the remaining amount.</li>
              <li>If the payment of fees is made after the due date, a late payment fee will be charged as per the following rules:</li>
              <ul className="list-disc pl-10">
                <li>For the first 7 days: ₹100 per day</li>
                <li>From 8th to 15th day: ₹500 per day</li>
                <li>After 15 days: ₹10,000 penalty + ₹1,000 per day late fee</li>
              </ul>
              <li>Scholarships are valid only till the announced date of validity. No requests for applying scholarships to fees will be entertained after the last date of 
              validity of scholarship.</li>
              <li>Refund of caution money will be considered after application submission with NOC from the academic counselor and administration head.</li>
              <li>Refund applications will be processed within 45 days from the date of application (if eligible).</li>
              <li>Scholars Den is not liable to pay any interest on the caution money.</li>
              <li>Caution Money is refundable, only if paid, at the end of the session for which student is enrolled. Any damage done to the equipments, classrooms, late 
              fee against late payment of fee and any damage would be deducted from Caution Money.</li>
              <li>No Caution Money would be refunded to fee defaulters or the ones who leaves the institute in the mid of the session.</li>
              <li>Caution money refund will be made after completion of course and as per schedule below.</li>
              <ul className="list-disc pl-10">
                <li>Classes 6th to 10th: Refund from 1st September of the financial year in which the session completes.</li>
                <li>Classes 11th and above: Refund from 1st September of the financial year in which the session completes.</li>
              </ul>
              <li>In case the cheque is dishonoured, there will be penalty of Rs. 2000 and the amount will have to be deposited by Cash within 3 working days of the date 
              of the dishonoured cheque, failing which the student will not be allowed to attend classes.</li>
              <li>Refund requests must be made in the prescribed format along with required documents. Verbal, phone, or email requests will not be entertained.</li>
              <li>All legal matters are subject to Moradabad (UP) jurisdiction only.</li>
              <li>In case of expulsion due to disciplinary reasons, no refund will be provided.</li>
              <li>Tuition Fee Refund Slabs:</li>
              <ul className="list-disc pl-10">
                <li>No refund after 30 days of batch commencement.</li>
                <li>Processing charges for refund:</li>
                <ul className="list-square pl-10">
                  <li>No class attended: ₹5,000</li>
                  <li>1 to 15 days: ₹10,000 (Foundation) / ₹15,000 (XI & above)</li>
                  <li>16 to 30 days: ₹20,000 (Foundation) / ₹30,000 (XI & above)</li>
                </ul>
              </ul>
            </ol>
            {/* <div className="mt-6 border-t pt-4">
              <h2 className="text-xl font-semibold">Bank Account Details for Caution Money Refund</h2>
              <p>(To be refunded only to student or parent, if paid)</p>
              <ul className="list-none pl-0">
                <li>1. Cancelled Cheque</li>
                <li>2. Photocopy of Passbook</li>
                <li>3. Photocopy of Student’s Aadhar</li>
                <li>4. Photocopy of Parent’s Aadhar</li>
                <li>5. Two Passport Size Photographs</li>
              </ul>
            </div> */}
            <p className="mt-6 font-bold text-xl text-center">I/We certify that we have read and agree to abide by the above terms and conditions.</p>
            <p className=" font-bold text-xl text-center"> मै/हम माणत करता/करती/करते है कि हमने उक्त नयम व शत को भली भांत पढ़ लया है व उनका पालन करेंगे ।</p>
            <div className='flex justify-center mt-4'>

            <button className='border-2 bg-[#ffdd00] text-black py-2 px-4 rounded-lg' onClick={()=>handleChange("termsAndCondition", true)}>Agree</button>
            </div>
          </div>

        );
      }
      

export default TermsAndConditionPage