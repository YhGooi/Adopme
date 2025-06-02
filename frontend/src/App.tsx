// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import NavBar from "./component/NavBar";

//setup url mapping
import Home from "./page/Home";
import Login from "./page/Login";
import Donation from "./page/donation/Donation";
import UserDonation from "./page/UserDonation";
import SuccessDonation from "./page/SuccessDonation";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donation/Donation" element={<Donation />} />
          <Route path="/userdonation" element={<UserDonation />} />
          <Route path="/SuccessDonation" element={<SuccessDonation />} />
        </Route>
      </Routes>
    </Router >
  )
}

export default App
