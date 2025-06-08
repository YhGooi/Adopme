// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./Layout";

//setup url mapping
import Home from "./page/Home";
import Login from "./page/Login";
import Signup from "./page/SignUp";
import Donation from "./page/donation/Donation";
import PetListing from "./page/PetListing";
import Messaging from './page/Messaging';
import Profile from './page/Profile';
import AdoptionRequestList from "./page/admin/adoption-request/AdoptionRequestList";
import MakeAppointment from "./page/Appointment/MakeAppointment";
import AppointmentSuccess from "./page/Appointment/AppointmentSuccess";
import AppointmentRequestList from "./page/admin/appoint-request/AppointmentRequestList";


function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pet_listing" element={<PetListing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/donation/Donation" element={<Donation />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/adoption-request-list" element={<AdoptionRequestList />} />
          <Route path="/admin/appointment-request-list" element={<AppointmentRequestList />} />
          <Route path="/appointment" element={<MakeAppointment />} />
          <Route path="/appointment/success" element={<AppointmentSuccess />} />
        </Route>
      </Routes>
    </Router >
  )
}

export default App