
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Board from "./component/Board";

function Dashboard() {
  return (
    <div className="container py-5">
      <h2>Dashboard</h2>
      <p className="text-secondary">Your project dashboard.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/board" element={<Board />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
