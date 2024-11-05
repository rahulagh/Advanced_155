// src/components/admin/ManageRecruiters/RecruiterList.js

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api"
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Arial", sans-serif;
  background-color:#ffffff;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
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

const Thead = styled.thead`
  background-color: #3498db;
  color: white;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e9ecef;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
`;

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
  margin: 0 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s ease;
  width: max-content;

  &:hover {
    opacity: 0.8;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  background-color: ${(props) => (props.active ? "#3498db" : "white")};
  color: ${(props) => (props.active ? "white" : "#3498db")};
  border: 1px solid #3498db;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: max-content;

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
`;

const ModalTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
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
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${(props) => 
    props.status === 'approved' ? '#2ecc71' :
    props.status === 'rejected' ? '#e74c3c' :
    props.verified ? '#2ecc71' :
    '#f39c12'};
  color: white;
`;

const RecruiterList = () => {
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
      console.log("Fetching recruiters with params : ", {page, status, search})
      const data = await api.getRecruiters({
        page,
        status,
        search,
      });
      console.log("Received data: ", data)
      setRecruiters(data.recruiters);
      setTotal(data.total);
      console.log(data.recruiters)
    } catch (error) {
      console.error("Error details : ", error)
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

  const handleVerify = async (id) => {
    try {
      await api.verifyRecruiter(id);
      toast.success("Recruiter verified successfully");
      fetchRecruiters();
    } catch (error) {
      toast.error("Failed to verify recruiter");
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
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

  return (
    <Container>
       <h2>Recruiter List</h2> 
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
        <Thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Verified</Th>
            <Th>Actions</Th>
          </tr>
        </Thead>
        <tbody>
          {recruiters.map((recruiter) => (
            <Tr key={recruiter._id}>
              <Td>{recruiter.name}</Td>
              <Td>{recruiter.email}</Td>
              <Td>{recruiter.status}</Td>
              <Td>{recruiter.verified ? "Yes" : "No"}</Td>
              <Td>
                {recruiter.status !== "approved" && (
                  <Button
                    type="approve"
                    onClick={() => handleModalOpen(recruiter, "approve")}
                  >
                    Approve
                  </Button>
                )}

                {recruiter.status !== "rejected" && (
                  <Button
                    type="reject"
                    onClick={() => handleModalOpen(recruiter, "reject")}
                  >
                    Reject
                  </Button>
                )}

                {!recruiter.verified && (
                  <Button
                    type="verify"
                    onClick={() => handleVerify(recruiter._id)}
                  >
                    Verify
                  </Button>
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
            {action === "approve" ? "Approve" : "Reject"} Recruiter
          </ModalTitle>
          <p>
            Are you sure you want to {action} {selectedRecruiter.name}?
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
                : handleReject(selectedRecruiter._id, reason)
            }
          >
            {action === "approve" ? "Approve" : "Reject"}
          </Button>
          <Button onClick={handleModalClose}>Cancel</Button>
        </Modal>
      )}
      {modalOpen && <Overlay onClick={handleModalClose} />}
    </Container>
  );
};

export default RecruiterList;