import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8fb 0%, #f1f4f9 100%);
  padding: 1rem;
`;

const Card = styled.div`
  padding: 2.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 420px;
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
  margin-bottom: 2rem;
  color: #1a1f36;
  font-size: 1.75rem;
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f8fafc;
  
  &::placeholder {
    color: #a0aec0;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }
`;

const RegisterContainer = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
`;

const RegisterText = styled.p`
  color: #4a5568;
  font-size: 0.875rem;
`;

const RegisterLink = styled(Link)`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.5rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

function Login() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/login', formData);
            localStorage.setItem('adminToken', res.data.token);
            toast.success('Admin Login successful');
            navigate('/dashboard');
            window.location.reload();
        } catch (err) {
            setError('Invalid email or password. Please try again.');
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };
    
    return (
        <LoginContainer>
            <Card>
                <Title>Welcome Back</Title>
                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <Button type="submit">Sign In</Button>
                </form>
                <RegisterContainer>
                    <RegisterText>
                        New to our platform?
                        <RegisterLink to="/register">Create an account</RegisterLink>
                    </RegisterText>
                </RegisterContainer>
            </Card>
        </LoginContainer>
    );
}

export default Login;