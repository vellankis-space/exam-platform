// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

// Create a new context
const AuthContext = createContext();

// Create a new provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for a user when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/users/me')
        .then(response => {
          setUser(response.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Login a user
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    const userResponse = await api.get('/users/me');
    setUser(userResponse.data);
  };

  // Register a new user
  const register = async (email, password, fullName, studentId) => {
    await api.post('/auth/register', { email, password, full_name: fullName, student_id: studentId });
  };

  // Logout a user
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
