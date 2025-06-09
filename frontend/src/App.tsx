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
import AdoptionRequestDetails from "./page/admin/adoption-request/AdoptionRequestDetails";
import AdminPetListing from "./page/admin/pet/PetListing";
import CreatePet from "./page/admin/pet/CreatePet";
import PetDetails from "./page/admin/pet/PetDetails";
import EditPet from "./page/admin/pet/EditPet";
import UserDonation from "./page/UserDonation";
import SuccessDonation from "./page/SuccessDonation";
import MakeAppointment from "./page/Appointment/MakeAppointment";
import AppointmentSuccess from "./page/Appointment/AppointmentSuccess";
import AppointmentRequestList from "./page/admin/appoint-request/AppointmentRequestList";
import DonationRequestList from "./page/admin/donation-request/DonationRequestList";

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
          <Route path="/admin/adoption-request-details/:requestId" element={<AdoptionRequestDetails />} />
          <Route path="/admin/pet-listing" element={<AdminPetListing />} />
          <Route path="/admin/create-pet" element={<CreatePet />} />
          <Route path="/admin/pet-details/:petId" element={<PetDetails />} />
          <Route path="/admin/edit-pet/:petId" element={<EditPet />} />
          <Route path="/userdonation" element={<UserDonation />} />
          <Route path="/SuccessDonation" element={<SuccessDonation />} />
          <Route path="/admin/appointment-request-list" element={<AppointmentRequestList />} />
          <Route path="/admin/donation-request-list" element={<DonationRequestList />} />
          <Route path="/appointment" element={<MakeAppointment />} />
          <Route path="/appointment/success" element={<AppointmentSuccess />} />
        </Route>
      </Routes>
    </Router >
  )
}

export default App