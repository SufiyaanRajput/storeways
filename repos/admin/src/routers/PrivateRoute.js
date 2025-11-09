import {observer} from 'mobx-react-lite'
import { useContext } from "react";
import { userContext } from "../store";
import {Navigate} from 'react-router-dom';

const PrivateRoute = observer((props) => {
  let isAuthenticated = false;
  const userStore = useContext(userContext);

  if (userStore.authToken) isAuthenticated = true;

  return !isAuthenticated ? <Navigate replace to={'/login'}/> : props.component;
});

export default PrivateRoute;
