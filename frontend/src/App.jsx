import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Exam from './pages/Exam';
import Results from './pages/Results';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exam" element={<ProtectedRoute><Exam /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
