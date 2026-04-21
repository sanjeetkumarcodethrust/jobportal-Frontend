import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)] transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more routes like /post-job, /jobs, etc. here */}
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

export default App;
