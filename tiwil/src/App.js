import { Route, Routes } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./pages/Home";
import "./styles/global.css";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import PrivateRoute from "./privateRoute/PrivateRoute";
import AddInformation from "./pages/AddInfomation";
import Dashboard from "./pages/Dashboard";
import EventDetail from "./pages/EventDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes (Require Authentication) */}
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route
  path="/add-information"
  element={
    <PrivateRoute>
      <AddInformation />
    </PrivateRoute>
  }
/>

      <Route
        path="/account-setting"
        element={
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/event-Detail"
        element={
          <PrivateRoute>
            <EventDetail />
          </PrivateRoute>
        }
      />

    </Routes>
  );
}

export default App;
