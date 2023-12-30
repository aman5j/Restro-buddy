import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import LoginPage from './screens/superadmin/LoginPage'
import Dashboard from "./screens/superadmin/Dashboard";
import AdminLogin from "./screens/admin/AdminLogin";
import AdminDashboard from "./screens/admin/AdminDashboard";
import FoodBooking from "./screens/FoodBooking/FoodBooking";
import Plusminus from "./components/Plusminus/Plusminus";

function App() {
  return(<div>
    <Router>
      <Routes>
        <Route element={<LoginPage/>} path="/loginpage" />
        <Route element={<Dashboard/>} path="/dashboard/*" />
        <Route element={<AdminLogin/>} path="/adminlogin" />
        <Route element={<AdminDashboard/>} path="/admindashboard/*" />
        <Route element={<FoodBooking/>} path="/foodbooking" />
        <Route element={<Plusminus/>} path="/plusminus" />
      </Routes>
    </Router>
  </div>)
}

export default App;
