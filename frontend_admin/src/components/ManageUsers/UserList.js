import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
// import {
//   getUsers,
//   updateUser,
//   approveCertification,
//   rejectCertification,
//   verifyUser,
// } from "../../services/userService";
import api from  "../../services/api";
import styled from "styled-components";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Inter", sans-serif;
  background-color:#ffffff;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  font-size: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #fff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Thead = styled.thead`
  background-color: #4299e1;
  color: white;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f7fafc;
  }
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #edf2f7;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const Button = styled.button`
  background-color: ${(props) =>
    props.type === "approve"
      ? "#48bb78"
      : props.type === "reject"
      ? "#f56565"
      : props.type === "verify"
      ? "#4299e1"
      : "#718096"};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: max-content;
  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  background-color: ${(props) => (props.active ? "#4299e1" : "white")};
  color: ${(props) => (props.active ? "white" : "#4299e1")};
  border: 1px solid #4299e1;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: max-content;

  &:hover {
    background-color: #4299e1;
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
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 400px;
  width: 100%;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
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

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [action, setAction] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      const { users, total } = await api.getUsers({ page, search });
      setUsers(users);
      setTotal(total);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      await api.updateUser(id, userData);
      toast.success("User updated successfully");
      fetchUsers();
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleApproveCertification = async (id) => {
    try {
      await api.approveCertification(id);
      toast.success("Certification approved successfully");
      fetchUsers();
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to approve certification");
    }
  };

  const handleRejectCertification = async (id, reason) => {
    try {
      await api.rejectCertification(id, reason);
      toast.success("Certification rejected successfully");
      fetchUsers();
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to reject certification");
    }
  };

  const handleVerifyUser = async (id) => {
    try {
      await api.verifyUser(id);
      toast.success("User verified successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to verify user");
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleModalOpen = (user, actionType) => {
    setSelectedUser(user);
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
      <h2>User Management</h2> 
      <SearchContainer>
        <SearchIcon size={20} />
        <SearchInput
          type="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name or email"
        />
      </SearchContainer>
      <Table>
        <Thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Certification Status</Th>
            <Th>Verified</Th>
            <Th>Actions</Th>
          </tr>
        </Thead>
        <tbody>
          {users.map((user) => (
            <Tr key={user._id}>
              <Td>{user.firstName}</Td>
              <Td>{user.email}</Td>
              <Td>{user.certification?.status || "N/A"}</Td>
              <Td>{user.verified ? "Yes" : "No"}</Td>
              <Td>
                <Button onClick={() => handleModalOpen(user, "update")}>
                  Update
                </Button>

                {user.certification?.status !== "approved" && (
                  <Button
                    type="approve"
                    onClick={() =>
                      handleModalOpen(user, "approveCertification")
                    }
                  >
                    Approve Cert
                  </Button>
                )}

                {user.certification?.status !== "rejected" && (
                  <Button
                    type="reject"
                    onClick={() => handleModalOpen(user, "rejectCertification")}
                  >
                    Reject Cert
                  </Button>
                )}

                {!user.verified && (
                  <Button
                    type="verify"
                    onClick={() => handleVerifyUser(user._id)}
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
        <PageButton
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft size={16} />
        </PageButton>
        {[...Array(Math.ceil(total / limit))].map((_, index) => (
          <PageButton
            key={index}
            active={index + 1 === page}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </PageButton>
        ))}
        <PageButton
          onClick={() => handlePageChange(page + 1)}
          disabled={page === Math.ceil(total / limit)}
        >
          <ChevronRight size={16} />
        </PageButton>
      </Pagination>
      {modalOpen && (
        <Modal>
          <ModalTitle>
            {action === "update"
              ? "Update User"
              : action === "approveCertification"
              ? "Approve Certification"
              : "Reject Certification"}
          </ModalTitle>
          {action === "update" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(selectedUser._id, {
                  name: e.target.firstName.value,
                  email: e.target.email.value,
                });
              }}
            >
              <ModalInput
                type="text"
                name="name"
                defaultValue={selectedUser.firstName}
                required
              />
              <ModalInput
                type="email"
                name="email"
                defaultValue={selectedUser.email}
                required
              />
              <Button type="submit">Update</Button>
            </form>
          ) : (
            <>
              <p>
                Are you sure you want to{" "}
                {action === "approveCertification" ? "approve" : "reject"}{" "}
                {selectedUser.firstName}'s certification?
              </p>
              {action === "rejectCertification" && (
                <ModalInput
                  type="text"
                  placeholder="Reason (required for rejection)"
                  value={reason}
                  onChange={handleReasonChange}
                  required
                />
              )}
              <Button
                type={action === "approveCertification" ? "approve" : "reject"}
                onClick={() =>
                  action === "approveCertification"
                    ? handleApproveCertification(selectedUser._id)
                    : handleRejectCertification(selectedUser._id, reason)
                }
              >
                {action === "approveCertification" ? "Approve" : "Reject"}
              </Button>
            </>
          )}
          <Button onClick={handleModalClose}>Cancel</Button>
        </Modal>
      )}
      {modalOpen && <Overlay onClick={handleModalClose} />}
    </Container>
  );
};

export default UserList;
