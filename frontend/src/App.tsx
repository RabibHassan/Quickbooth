import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginRegPage from "./components/LoginRegPage"; // Import the new combined AuthPage
import MainUI from "./components/MainUI";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegPage />} />
        <Route path="/login" element={<LoginRegPage />} />

        <Route path="/main" element={<MainUI />} />
      </Routes>
    </Router>
  );
}

export default App;
