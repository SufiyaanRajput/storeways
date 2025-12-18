import { useAtomValue } from "jotai";
import { Navigate } from "react-router-dom";
import { userAtom } from "../store/userAtom";

const PrivateRoute = ({ component }) => {
  const user = useAtomValue(userAtom);
  const isAuthenticated = Boolean(user?.authToken);

  return !isAuthenticated ? <Navigate replace to="/login" /> : component;
};

export default PrivateRoute;

