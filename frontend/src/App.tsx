// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./Layout";

//setup url mapping
import Home from "./page/Home";
import Login from "./page/Login";
import Signup from "./page/SignUp";
import Donation from "./page/donation/Donation";

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
        </Route>
      </Routes>
    </Router >
  )
}

export default App
