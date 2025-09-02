import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.full_name}</h2>
          <p>You are ready to begin your examination.</p>
          <Link to="/exam">Start Exam</Link>
        </div>
      ) : (
        <div>
          <h2>Welcome to the Exam Platform</h2>
          <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to start an exam.</p>
        </div>
      )}
    </div>
  );
};

export default Home;