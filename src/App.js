import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

/* IMPORT COMPONENTS */
import Home from "./pages/Home.tsx";
import Loading from "./pages/Loading.tsx"
import HomeTailwind from "./pages/HomeTailwind.tsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/loading" element={<Loading />} />
        <Route exact path="/home-tailwind" element={<HomeTailwind />} />
      </Routes>
    </Router>
  );
}

export default App;
