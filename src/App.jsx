
import { Login } from './adminpages/Login'
import { Signup } from './adminpages/Signup'
import {Routes, Route} from "react-router-dom"
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
import { ChangePassword} from './adminpages/ChangePassword'
import { ForgotPasswordOTP } from './adminpages/ForgotPasswordOTP'
import { ForgotPasswordReset } from './adminpages/ForgotPasswordReset'
import { PlanDetails } from './adminpages/PlanDetails'



function App() {
  

  return (
    <>
    <Routes>
     <Route path='/' element={<Login/>}></Route>  
      <Route path='/signup' element={<Signup/>}></Route>
    
     {/* All admin pages AdminLayout ke andar */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/plans" element={<Plan />} />
          <Route path="/lenders" element={<Lenders />} />
          <Route path='/lenders/:id/details' element={<LenderDetails/>}/>
          <Route path="/plans/:planId" element={<PlanDetails />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/support" element={<HelpSupport />} />
          <Route path="/security" element={<PrivacySecurity />} />
          <Route path="/password" element={<ChangePassword />} />
          {/*admin pages add here */}
        </Route>
      <Route path='/forgotpassword' element={<ForgotPassword/>}></Route>
       <Route path='/forgotpassword/otp' element={<ForgotPasswordOTP/>}></Route>
        <Route path='/forgotpassword/reset' element={<ForgotPasswordReset/>}></Route>
      </Routes>
    </>
  )
}

export default App
