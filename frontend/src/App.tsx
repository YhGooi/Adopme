// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./Layout";

//setup url mapping
import Home from "./page/Home";
import Login from "./page/Login";
import Signup from "./page/SignUp";
import Donation from "./page/donation/Donation";
import Messaging from './page/Messaging';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/donation/Donation" element={<Donation />} />
          <Route path="/messaging" element={<Messaging />} />
        </Route>
      </Routes>
    </Router >
  )
}

export default App
