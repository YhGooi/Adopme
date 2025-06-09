// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./Layout";

// Setup url mapping
import Home from "./page/Home";
import Login from "./page/Login";
import Signup from "./page/SignUp";
import PetListing from "./page/PetListing";
import Messaging from './page/Messaging';
import Profile from './page/profile/Profile';
// Admin
import AdoptionRequestList from "./page/admin/adoptionRequest/AdoptionRequestList";
import AdoptionRequestDetails from "./page/admin/adoptionRequest/AdoptionRequestDetails";
import AdminPetListing from "./page/admin/pet/PetListing";
import CreatePet from "./page/admin/pet/CreatePet";
import PetDetails from "./page/admin/pet/PetDetails";
import EditPet from "./page/admin/pet/EditPet";
import AppointmentRequestList from "./page/admin/appointmentRequest/AppointmentRequestList";
// Donation
import Donation from "./page/donation/Donation";
import SuccessDonation from "./page/donation/SuccessDonation";
// Appointment
import Appointment from "./page/appointment/Appointment";
import SuccessAppointment from "./page/appointment/SuccessAppointment";

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
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/adoption-request-list" element={<AdoptionRequestList />} />
          <Route path="/admin/adoption-request-details/:requestId" element={<AdoptionRequestDetails />} />
          <Route path="/admin/pet-listing" element={<AdminPetListing />} />
          <Route path="/admin/create-pet" element={<CreatePet />} />
          <Route path="/admin/pet-details/:petId" element={<PetDetails />} />
          <Route path="/admin/edit-pet/:petId" element={<EditPet />} />
          <Route path="/admin/appointment-request-list" element={<AppointmentRequestList />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/donation/success" element={<SuccessDonation />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/appointment/success" element={<SuccessAppointment />} />
        </Route>
      </Routes>
    </Router >
  )
}

export default App