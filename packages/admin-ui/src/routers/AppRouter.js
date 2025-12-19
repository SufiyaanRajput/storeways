import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Admin from "../AdminLayout";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<PublicRoute component={<RegisterPage />} />} />
        <Route path="/login" element={<PublicRoute component={<LoginPage />} />} />
        <Route
          path="/password-reset"
          element={<PublicRoute component={<ForgotPasswordPage />} />}
        />
        <Route path="/*" element={<PrivateRoute component={<Admin />} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

