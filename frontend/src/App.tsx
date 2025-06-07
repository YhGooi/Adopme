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
        </Route>
      </Routes>
    </Router >
  )
}

export default App
