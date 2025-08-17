import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginRegPage from "./components/LoginRegPage"; // Import the new combined AuthPage
import MainUI from "./components/MainUI";
import ProfilePage from "./components/ProfilePage"
import BecomeVendorPage from "./components/BecomeVendorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegPage />} />
        <Route path="/login" element={<LoginRegPage />} />

        <Route path="/main" element={<MainUI />} />

        <Route path="/profile" element={< ProfilePage />} />
        <Route path="/becomeVendor" element={< BecomeVendorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
