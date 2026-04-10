import { Login } from './adminpages/Login'
import { Signup } from './adminpages/Signup'
import { Routes, Route } from "react-router-dom"
import './App.css'
import Dashboard from './adminpages/Dashboard'
import { Plan } from './adminpages/Plan'
import ForgotPassword from './adminpages/ForgotPassword'
import AdminLayout from './layouts/AdminLayout'
import { Lenders } from './adminpages/Lenders'
import { LenderDetails } from './adminpages/LenderDetails'
import { Revenue } from './adminpages/Revenue'
import { HelpSupport } from './adminpages/HelpSupport'
import { PrivacySecurity } from './adminpages/PrivacySecurity'
import { ChangePassword } from './adminpages/ChangePassword'
import { ForgotPasswordOTP } from './adminpages/ForgotPasswordOTP'
import { ForgotPasswordReset } from './adminpages/ForgotPasswordReset'
import { PlanDetails } from './adminpages/PlanDetails'
import PrivateRoute from './components/PrivateRoute'
import ScrollToTop from './layouts/ScrollToTop'
import { ActivityDetails } from './adminpages/ActivityDetails'
import { Home } from './pages/Home'          // ← new
import PublicLayout from './layouts/PublicLayout'  // ← new
import { LenderBorrowers } from './adminpages/LenderBorrowers'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>

        {/* ── Public Routes with Navbar ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/support" element={<HelpSupport />} />
          <Route path="/security" element={<PrivacySecurity />} />
          {/* <Route path="/settings" element={<ChangePassword />} /> */}
        </Route>

        {/* ── Auth Routes ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/forgotpassword/otp" element={<ForgotPasswordOTP />} />
        <Route path="/forgotpassword/reset" element={<ForgotPasswordReset />} />

        {/* ── Admin Protected Routes ── */}
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plans" element={<Plan />} />
            <Route path="/lenders" element={<Lenders />} />
            <Route path="/lenders/:id/details" element={<LenderDetails />} />
            <Route path="/plans/:planId" element={<PlanDetails />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/admin/support" element={<HelpSupport />} />
            <Route path="/admin/security" element={<PrivacySecurity />} />
            <Route path="/password" element={<ChangePassword />} />
            <Route path="/activityDetails" element={<ActivityDetails />} />
            <Route path='/lenders/:id/borrowers' element={<LenderBorrowers />}/>
          </Route>
        </Route>

      </Routes>
    </>
  )
}

export default App