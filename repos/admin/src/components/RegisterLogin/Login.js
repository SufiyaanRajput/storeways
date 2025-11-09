import Container from "./Container";
import { useAsyncFetch } from '../../utils/hooks';
import { login } from "./api";
import { notification } from 'antd';
import { Header, Main } from "./styles";
import {observer} from 'mobx-react-lite'
import { useEffect, useContext } from "react";
import { userContext } from "../../store";
import logo from '../../assets/logo.png';

const Login = observer(() => {
  const userStore = useContext(userContext);
  const { response, success, error, isLoading, refetch: loginUser } = useAsyncFetch(false, login);

  const fields = [{
    label: 'Email',
    name: 'email',
  }, {
    label: 'Password',
    name: 'password',
  }];

  useEffect(() => {
    if (success) {
      userStore.setUser(response.data.user);
    }
  }, [success, response, userStore]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: error.response.data.message || 'Something went wrong',
        placement: 'bottomRight'
      });
    }
  }, [error]);

  const handleSubmit = (values) => {
    loginUser(values);
  }

  return(
    <>
      <Header>
        <img src={logo} alt="soreways logo"/>
      </Header>
      <Main>
        <Container fields={fields} 
          title="Login" 
          onSubmitCb={handleSubmit} 
          isLoading={isLoading}/>
      </Main>
    </>
  );
});

export default Login;