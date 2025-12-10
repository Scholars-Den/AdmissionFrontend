import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlreadyExistingStudent } from "../../../redux/alreadyExistStudentSlice";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../../utils/StatusBadge";
import StudentDetailsModal from "../StudentInfo/StudentDetailsModal";
import {
  Plus,
  User,
  BookOpen,
  FileText,
  Loader,
  ChevronRight,
  Edit,
} from "lucide-react";

const AlreadyExistStudent = () => {
  const { existingStudent } = useSelector((state) => state.alreadyExistStudent);
  const { userData } = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [admissionStatusMap, setAdmissionStatusMap] = useState({});
  const [signatures, setSignatures] = useState({
    student: "",
    parent: "",
  });
  const [admisionStatus, setAdmissionStatus] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from token on mount if userData is empty
  useEffect(() => {
    const fetchUserDataFromToken = async () => {
      try {
        if (!userData || !userData.fatherContactNumber) {
          console.log("userData is empty, fetching from token...");
          const response = await axios.get("/user/me");
          
          if (response.data && response.data.fatherContactNumber) {
            console.log("Fetched userData from token:", response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching user data from token:", error);
      }
    };

    fetchUserDataFromToken();
  }, []);

  // Fetch existing students when userData is available
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      const number = userData?.fatherContactNumber || userData?.studentContactNumber;
      
      console.log("useEffect from alreadyExistStudent number ", number);
      console.log("useEffect from alreadyExistStudent userData", userData);

      if (number) {
        try {
          await dispatch(fetchAlreadyExistingStudent(number)).unwrap();
        } catch (error) {
          console.error("Error fetching existing students:", error);
        }
      } else {
        console.warn("No contact number available to fetch students");
      }
      
      setIsLoading(false);
    };

    if (userData && (userData.fatherContactNumber || userData.studentContactNumber)) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, userData?.fatherContactNumber, userData?.studentContactNumber]);

  useEffect(() => {
    console.log("existing student", existingStudent);
  }, [existingStudent]);

  const fetchAdmissionMessage = async (ackNumber) => {
    if (!ackNumber) {
      console.warn("No acknowledgement number provided");
      return;
    }

    try {
      console.log("AckNumber", ackNumber);
      const response = await axios.post(
        "/approval/getAdmissionApprovalByAcknowledgementNumber",
        { acknowledgementNumber: ackNumber }
      );

      console.log("RESPONSE FETCHaDMISSIONmEWSSAGE", response);
      setAdmissionStatus(response.data);
    } catch (error) {
      console.error("Error fetching admission status:", error);
      setAdmissionStatus({});
      setAdmissionStatusMap((prev) => ({
        ...prev,
        [ackNumber]: "Error fetching status",
      }));
    }
  };

  useEffect(() => {
    console.log("admissionStatus", admisionStatus);
  }, [admisionStatus]);

  useEffect(() => {
    console.log("admissionStatusMap ", admissionStatusMap);
  }, [admissionStatusMap]);

  const handleCardClick = (student) => {
    setSelectedStudent(student);
    console.log("Student from handleCardClick", student);
    
    if (student?.acknowledgementNumber) {
      fetchAdmissionMessage(student.acknowledgementNumber);
    }
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  const handleEditClick = async () => {
    if (!selectedStudent?.acknowledgementNumber) {
      console.error("No acknowledgement number available");
      return;
    }

    try {
      console.log("selected student from handleEditClick", selectedStudent);

      const data = {
        acknowledgementNumber: selectedStudent.acknowledgementNumber,
      };
      const response = await axios.post("/admissions/editAdmissionDetails", data);

      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      document.cookie = `token=${response.data.token}; path=/`;
      
      navigate("/basicDetails");
      console.log("response from handleEditClick", response);
    } catch (error) {
      console.error("Error editing admission details:", error);
    }
  };

  const handleSignatureEnd = (key) => {
    setSignatures((prev) => ({
      ...prev,
      [key]: signatureRefs[key]?.current?.toDataURL(),
    }));
  };

  const signatureRefs = {
    student: useRef(null),
    parent: useRef(null),
  };

  const createNewUser = async () => {
    try {
      console.log("userData in createNewUser", userData);

      const createNewAdmission = await axios.post(
        "/admissions/createNewAdmission"
      );

      console.log("CreateNewAdmission from createNewUser", createNewAdmission);
      
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      document.cookie = `token=${createNewAdmission.data.token}; path=/`;

      navigate("/basicDetails");
    } catch (error) {
      console.error("Error creating new admission:", error);
    }
  };

  const handleLogoutClick = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    navigate("/");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdf5f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader size={48} className="text-[#c61d23] animate-spin" />
          <p className="text-gray-600 font-medium">Loading students...</p>
        </div>
      </div>
    );
  }

  // Show error if no contact number
  if (!userData?.fatherContactNumber && !userData?.studentContactNumber) {
    return (
      <div className="min-h-screen bg-[#fdf5f6] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-[#c61d23]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Contact Information
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any contact information associated with your account.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/30"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf5f6] p-1 sm:p-10 overflow-auto min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-gray-100 -mx-1 sm:-mx-10 px-1 sm:px-10 py-6 mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#c61d23]">
              Student Applications
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              View and manage your admission applications
            </p>
          </div>
          <button
            onClick={createNewUser}
            className="group relative px-6 py-3 bg-gradient-to-r from-[#c61d23] to-[#a01818] text-white font-semibold rounded-lg shadow-lg hover:shadow-red-500/30 hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Application</span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#c61d23] to-[#a01818] opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 -z-10"></div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {Array.isArray(existingStudent) && existingStudent.length > 0 ? (
            existingStudent.map((student) => (
              <div
                key={student._id}
                className="group relative bg-white rounded-2xl border border-gray-100 hover:border-[#ffdd00]/40 shadow-md hover:shadow-xl hover:shadow-[#c61d23]/10 transition-all duration-300 overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#c61d23]/0 via-[#ffdd00]/0 to-[#c61d23]/0 group-hover:from-[#c61d23]/3 group-hover:via-[#ffdd00]/5 group-hover:to-[#c61d23]/3 transition-all duration-300"></div>

                <div className="relative p-6 sm:p-8">
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                    <StatusBadge
                      status={student.approvalDetails?.status}
                      message={student.approvalDetails?.message}
                    />
                  </div>

                  {/* Student Info Container */}
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Photo */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-2xl overflow-hidden border-4 border-gray-100 shadow-lg">
                      <img
                        src={student.studentPhoto}
                        alt={student.studentName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      {/* Student Name */}
                      <div className="mb-4">
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                          {student.studentName}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Student Application Details
                        </p>
                      </div>

                      {/* Key Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-br from-[#fdf5f6] to-[#f5eff0] rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <BookOpen
                            size={16}
                            className="text-[#c61d23] flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 uppercase">
                              Class
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {student.studentClass}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <FileText
                            size={16}
                            className="text-[#c61d23] flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 uppercase">
                              Acknowledgement No.
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {student.acknowledgementNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 flex-col sm:flex-row mt-6">
                    <button
                      onClick={() => handleCardClick(student)}
                      className="flex-1 bg-gradient-to-r from-[#c61d23] to-[#a01818] hover:from-[#b01820] hover:to-[#8f1515] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg hover:shadow-red-500/30"
                    >
                      <span>View Details</span>
                      <ChevronRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(student);
                        handleEditClick();
                      }}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 flex items-center justify-center gap-2"
                    >
                      <Edit size={18} />
                      <span>Edit Application</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Applications Found
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't created any student applications yet
              </p>
              <button
                onClick={createNewUser}
                className="bg-gradient-to-r from-[#c61d23] to-[#a01818] text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Create New Application
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for full details */}
      <StudentDetailsModal
        selectedStudent={selectedStudent}
        admisionStatus={admisionStatus}
        onClose={closeModal}
        onEdit={handleEditClick}
      />
    </div>
  );
};

export default AlreadyExistStudent;