import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Register from "./Register";
import Main from "./Main";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
