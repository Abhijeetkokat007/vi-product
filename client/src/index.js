import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './views/Home/Home';
import LoginPage from './views/Login/Login';
import ContactPage from './views/Contact/Contact';
import AboutPage from './views/About/About';
import ElectionPage from './views/Election/Election';
import AdminLogin from './views/Adminlogin/Adminlogin';
import AdminDashboard from './views/Dashboard/Dashboard';
import AddVoter from './views/Addvoter/Addvoter';
import Elections from './views/Adminelection/Adminelection';
import CandidateApplicationForm from './views/Applications/Applications';
import ElectionForm from './views/Dashboard/CreateEle';
import Application from './views/Application/Application';
import Result from './views/Result/Result';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/elections" element={<ElectionPage />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/addvoter" element={<AddVoter />} />
      <Route path="/adminelection" element={<Elections />} />
      <Route path="/applications" element={<CandidateApplicationForm />} />
      <Route path="/eleform" element={<ElectionForm />} />
      <Route path="/application" element={<Application />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  </BrowserRouter>
);
