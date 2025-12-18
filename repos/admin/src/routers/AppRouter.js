import {Routes, BrowserRouter as Router, Route} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Register from '../components/RegisterLogin/Register';
import Login from '../components/RegisterLogin/Login';
import ForgotPassword from '../components/RegisterLogin/ForgotPassword';
import { Admin } from '@storeways/admin-ui';

const AppRouter = () => {
  return(
    <Router>
      <Routes>
        <Route path="/register" element={<PublicRoute component={<Register />} />}/>
        <Route path="/login" element={<PublicRoute component={<Login />} />}/>
        <Route path="/password-reset" element={<PublicRoute component={<ForgotPassword />} />}/>
        <Route path="/*" element={<PrivateRoute component={<Admin />} />}/>
      </Routes>
    </Router>
  );
}

export default AppRouter;