import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaUserTag } from 'react-icons/fa';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1rem;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 2rem auto;
  padding: 2.5rem 2rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;

  @media (min-width: 768px) {
    padding: 3rem;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #1a1f36;
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #3b82f6;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (min-width: 768px) {
    padding: 1rem;
  }
`;

const IconWrapper = styled.span`
  color: #64748b;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  margin-right: 0.75rem;
`;

const InputLabel = styled.label`
  position: absolute;
  top: -0.75rem;
  left: 0.75rem;
  padding: 0 0.5rem;
  background-color: white;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
`;

const StyledInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #1a1f36;
  
  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #1a1f36;
  cursor: pointer;
  
  &:focus {
    outline: none;
  }

  option {
    background-color: white;
    color: #1a1f36;
  }
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    margin-right: 0.75rem;
    font-size: 1.1rem;
  }
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 0.875rem;
`;

const StyledLink = styled(Link)`
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  position: absolute;
  bottom: -1.25rem;
  left: 0.75rem;
`;


function Register() {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
  
    const validateForm = () => {
      const newErrors = {};
      
      // Password validation
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
  
      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear errors when user types
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
  
      // Special handling for confirm password
      if (name === 'password' || name === 'confirmPassword') {
        if (name === 'password' && value !== formData.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        } else if (name === 'confirmPassword' && value !== formData.password) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        } else {
          setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
  
      try {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...submitData } = formData;
        
        const res = await axios.post('http://localhost:5000/api/register', submitData);
        localStorage.setItem('token', res.data.token);
        toast.success('Registration successful', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
        });
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.', {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
        });
      }
    };
  
    return (
      <PageContainer>
        <FormContainer>
          <Title>Create Your Account</Title>
          <StyledForm onSubmit={handleSubmit}>
            <InputWrapper>
              <IconWrapper><FaUser /></IconWrapper>
              <InputLabel>Full Name</InputLabel>
              <StyledInput
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </InputWrapper>
  
            <InputWrapper>
              <IconWrapper><FaEnvelope /></IconWrapper>
              <InputLabel>Email Address</InputLabel>
              <StyledInput
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputWrapper>
  
            <InputWrapper style={{ marginBottom: errors.password ? '1.5rem' : '0' }}>
              <IconWrapper><FaLock /></IconWrapper>
              <InputLabel>Password</InputLabel>
              <StyledInput
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
              {errors.password && <ErrorText>{errors.password}</ErrorText>}
            </InputWrapper>
  
            <InputWrapper style={{ marginBottom: errors.confirmPassword ? '1.5rem' : '0' }}>
              <IconWrapper><FaLock /></IconWrapper>
              <InputLabel>Confirm Password</InputLabel>
              <StyledInput
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
            </InputWrapper>
  
            <StyledButton type="submit">
              <FaUserPlus />
              Create Account
            </StyledButton>
          </StyledForm>
  
          <FooterText>
            Already have an account? <StyledLink to="/login">Sign in here</StyledLink>
          </FooterText>
        </FormContainer>
      </PageContainer>
    );
  }
  
  export default Register;
  