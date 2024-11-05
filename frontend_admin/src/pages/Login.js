import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/styles/Login.css';  // Custom styles including background image

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        login(credentials);
        navigate('/dashboard');
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center vh-100">
            <div className="card p-4 shadow-lg">
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block w-100">Login</button>
                </form>
                <div className="text-center mt-3">
                    <p>
                        Not registered yet? <Link to="/register" className="register-link">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
