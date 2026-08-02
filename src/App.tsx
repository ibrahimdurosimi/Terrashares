/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import ScrollToTop from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/dashboard/Profile';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProperties from './pages/admin/AdminProperties';
import AdminLeads from './pages/admin/AdminLeads';
import AdminInvestments from './pages/admin/AdminInvestments';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminFAQs from './pages/admin/AdminFAQs';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
      <div className="min-h-screen flex flex-col font-sans text-[#171717] dark:text-white bg-white dark:bg-[#171717] transition-colors">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:slug" element={<PropertyDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/properties" replace />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="investments" element={<AdminInvestments />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="faqs" element={<AdminFAQs />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </ThemeProvider>
  );
}
