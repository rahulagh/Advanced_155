import React, { useState, useEffect } from 'react';
import RecruiterList from '../components/RecruiterManagement/RecruiterList';
import ProfileList from '../components/RecruiterManagement/ProfileList'; // Import ProfileList
import UpdatePlans from '../components/RecruiterManagement/UpdatePlans';
import ChangeQuotas from '../components/RecruiterManagement/ChangeQuotas';
import DeactivateAccount from '../components/RecruiterManagement/DeactivateAccount';
import ReactivateAccount from '../components/RecruiterManagement/ReactivateAccount';
import ProfileDetails from '../components/RecruiterManagement/ProfileDetails'; // Import ProfileDetails
import '../assets/styles/RecruiterManagementPage.css'; // Include CSS for styling
import styled from "styled-components";
import { toast } from "react-toastify";
import api from '../services/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
`;

const Title = styled.h2`
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  min-width: 120px;
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: separate;
//   border-spacing: 0;
//   background-color: white;
//   border-radius: 8px;
//   overflow: hidden;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
// `;

const Thead = styled.thead`
  background-color: #3498db;
  color: white;
`;

// const Th = styled.th`
//   padding: 1rem;
//   text-align: left;
//   font-weight: 600;
// `;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e9ecef;
  }
`;

// const Td = styled.td`
//   padding: 1rem;
//   border-bottom: 1px solid #dee2e6;
// `;

const Button = styled.button`
  background-color: ${(props) =>
    props.type === "approve"
      ? "#2ecc71"
      : props.type === "reject"
      ? "#e74c3c"
      : "#f39c12"};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s ease;
  font-size: 0.875rem;

  &:hover {
    opacity: 0.8;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  background-color: ${(props) => (props.active ? "#3498db" : "white")};
  color: ${(props) => (props.active ? "white" : "#3498db")};
  border: 1px solid #3498db;
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3498db;
    color: white;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 90%;
  width: 400px;
`;

const ModalTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const StatusBadge = styled.span`
  padding: 0.35rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  background-color: ${(props) => 
    props.status === 'approved' ? '#e6f7ed' :
    props.status === 'rejected' ? '#fde8e8' :
    props.status === 'pending' ? '#fff7e6' :
    props.verified ? '#e6f7ed' : '#fff7e6'};
  color: ${(props) => 
    props.status === 'approved' ? '#2ecc71' :
    props.status === 'rejected' ? '#e74c3c' :
    props.status === 'pending' ? '#f39c12' :
    props.verified ? '#2ecc71' : '#f39c12'};
  border: 1px solid ${(props) =>
    props.status === 'approved' ? '#2ecc71' :
    props.status === 'rejected' ? '#e74c3c' :
    props.status === 'pending' ? '#f39c12' :
    props.verified ? '#2ecc71' : '#f39c12'};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  background-color: #f8f9fa;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
`;

const ActionButton = styled(Button)`
  padding: 0.35rem 0.6rem;
  font-size: 0.8rem;
  margin: 0.1rem;
`;


const RecruiterManagementPage = () => {
  const [activeSection, setActiveSection] = useState('RecruiterList'); // Manage the active section
  const [showCards, setShowCards] = useState(true); // State to manage visibility of cards
  const [selectedProfile, setSelectedProfile] = useState(null); // State to hold the selected profile
  const [recruiters, setRecruiters] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [reason, setReason] = useState("");
  const [action, setAction] = useState("");

  useEffect(() => {
    fetchRecruiters();
  }, [page, status, search]);

  const fetchRecruiters = async () => {
    try {
      const data = await api.getRecruiters({ page, status, search });
      setRecruiters(data.recruiters);
      setTotal(data.total);
    } catch (error) {
      toast.error("Failed to fetch recruiters");
    }
  };

  const handleApprove = async (id, reason) => {
    try {
      await api.approveRecruiter(id, reason);
      toast.success("Recruiter approved successfully");
      fetchRecruiters();
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to approve recruiter");
    }
  };

  const handleReject = async (id, reason) => {
    try {
      await api.rejectRecruiter(id, reason);
      toast.success("Recruiter rejected successfully");
      fetchRecruiters();
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to reject recruiter");
    }
  };

  const handleVerify = async (id, reason) => {
    try {
      await api.verifyRecruiter(id, reason);
      toast.success("Recruiter verified successfully");
      fetchRecruiters();
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to verify recruiter");
    }
  };


  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleModalOpen = (recruiter, actionType) => {
    setSelectedRecruiter(recruiter);
    setAction(actionType);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setReason("");
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  // Function to handle card clicks
  const handleCardClick = (section) => {
    setActiveSection(section);
    setShowCards(false); // Hide cards when a section is clicked
  };

  // Function to go back to cards
  const handleBackClick = () => {
    setShowCards(true); // Show cards again
    setSelectedProfile(null); // Clear selected profile when going back
  };

  // Render the component dynamically based on the activeSection
  const renderSection = () => {
    switch (activeSection) {
      case 'RecruiterList':
        return <RecruiterList />;
      case 'ProfileList':
        return <ProfileList setSelectedProfile={setSelectedProfile} />; // Pass function to ProfileList
      case 'UpdatePlans':
        return <UpdatePlans />;
      case 'ChangeQuotas':
        return <ChangeQuotas />;
      case 'DeactivateAccount':
        return <DeactivateAccount />;
      case 'ReactivateAccount':
        return <ReactivateAccount />;
      default:
        return <RecruiterList />;
    }
  };

  return (
    <>
      <div className="recruiter-management-page p-6">
        <h1 className="text-3xl font-bold mb-6">Recruiter Management</h1>

        {/* Show cards or dynamic section content based on showCards state */}
        {showCards ? (
          <div className="card-container grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="card" onClick={() => handleCardClick('RecruiterList')}>
              <h2 className="text-xl font-semibold">Recruiter List</h2>
              <p>View and manage all recruiters.</p>
            </div>

            <div className="card" onClick={() => handleCardClick('UpdatePlans')}>
              <h2 className="text-xl font-semibold">Update Plans</h2>
              <p>Update recruiter subscription plans.</p>
            </div>

            <div className="card" onClick={() => handleCardClick('ProfileList')}>
              <h2 className="text-xl font-semibold">Profile List</h2>
              <p>View and edit recruiter profiles.</p>
            </div>

            <div className="card" onClick={() => handleCardClick('ChangeQuotas')}>
              <h2 className="text-xl font-semibold">Change Quotas</h2>
              <p>Adjust recruiter quotas.</p>
            </div>

            <div className="card" onClick={() => handleCardClick('DeactivateAccount')}>
              <h2 className="text-xl font-semibold">Deactivate Account</h2>
              <p>Temporarily deactivate recruiter accounts.</p>
            </div>

            <div className="card" onClick={() => handleCardClick('ReactivateAccount')}>
              <h2 className="text-xl font-semibold">Reactivate Account</h2>
              <p>Reactivate deactivated recruiter accounts.</p>
            </div>
          </div>
        ) : (
          <div className="section-content bg-white p-6 shadow rounded fade-in">
            {renderSection()}
            {/* Render ProfileDetails when a profile is selected */}
            {selectedProfile && <ProfileDetails profile={selectedProfile} />}
            {/* Button to go back to cards */}
            <button 
              className="mt-4 p-2 bg-blue-500 text-white rounded transition hover:bg-blue-700"
              onClick={handleBackClick}
            >
              Back to Recruiter Management
            </button>
          </div>
        )}

        <div>
          <Container>
          <Title>Recruiter Management</Title>
          <SearchForm>
            <SearchInput
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name or email"
            />
            <Select value={status} onChange={handleStatusChange}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </SearchForm>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Status</Th>
                <Th>Verified</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {recruiters.map((recruiter) => (
                <Tr key={recruiter._id}>
                  <Td>{recruiter.fullName}</Td>
                  <Td>{recruiter.email}</Td>
                  <Td>
                  <StatusBadge status={recruiter.isApproved ? "approved" : "pending"}>
                      {recruiter.isApproved ? "Approved" : 'Pending'}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <StatusBadge verified={recruiter.isDocumentVerified}>
                      {recruiter.isDocumentVerified ? "Verified" : "Unverified"}
                    </StatusBadge>
                  </Td>
                  <Td>
                    {!recruiter.isApproved && (
                      <ActionButton
                        type="approve"
                        onClick={() => handleModalOpen(recruiter, "approve")}
                      >
                        Approve
                      </ActionButton>
                    )}
                    {recruiter.isApproved  && (
                      <ActionButton
                        type="reject"
                        onClick={() => handleModalOpen(recruiter, "reject")}
                      >
                        Reject
                      </ActionButton>
                    )}
                    {!recruiter.isDocumentVerified && (
                      <ActionButton
                        type="verify"
                        onClick={() => handleModalOpen(recruiter, "verify")}
                      >
                        Verify
                      </ActionButton>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {[...Array(Math.ceil(total / limit))].map((_, index) => (
              <PageButton
                key={index}
                active={index + 1 === page}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </PageButton>
            ))}
          </Pagination>
          {modalOpen && (
            <Modal>
              <ModalTitle>
                {action.charAt(0).toUpperCase() + action.slice(1)} Recruiter
              </ModalTitle>
              <p>
                Are you sure you want to {action} {selectedRecruiter.fullName}?
              </p>
              <ModalInput
                type="text"
                placeholder="Reason (optional)"
                value={reason}
                onChange={handleReasonChange}
              />
              <Button
                type={action}
                onClick={() =>
                  action === "approve"
                    ? handleApprove(selectedRecruiter._id, reason)
                    : action === "reject"
                    ? handleReject(selectedRecruiter._id, reason)
                    : handleVerify(selectedRecruiter._id, reason)
                }
              >
                {action.charAt(0).toUpperCase() + action.slice(1)}
              </Button>
              <Button onClick={handleModalClose}>Cancel</Button>
            </Modal>
          )}
          {modalOpen && <Overlay onClick={handleModalClose} />}
          </Container>
        </div>
      </div>
    </>
  );
};

export default RecruiterManagementPage;
