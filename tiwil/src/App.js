import { Route, Routes } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./pages/Home";
import "./styles/global.css";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import PrivateRoute from "./privateRoute/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes (Require Authentication) */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
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
    </Routes>
  );
}

export default App;
