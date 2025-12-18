import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Admin from "../Admin";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

const AppRouter = ({
  Register = RegisterPage,
  Login = LoginPage,
  ForgotPassword = ForgotPasswordPage,
}) => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<PublicRoute component={<Register />} />} />
        <Route path="/login" element={<PublicRoute component={<Login />} />} />
        <Route
          path="/password-reset"
          element={<PublicRoute component={<ForgotPassword />} />}
        />
        <Route path="/*" element={<PrivateRoute component={<Admin />} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

