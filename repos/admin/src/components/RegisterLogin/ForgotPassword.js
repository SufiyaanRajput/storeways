import Container from "./Container";
import { useAsyncFetch } from '../../utils/hooks';
import { sendPasswordResetEmail, resetPassword } from "./api";
import { notification } from 'antd';
import { Header, Main } from "./styles";
import { useEffect } from "react";
import logo from '../../assets/logo.png';
import queryString from 'query-string';
import { useLocation, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedQueryStrings = queryString.parse(location.search);
  const { response, success, error, isLoading, refetch: redoApi } = useAsyncFetch(false, parsedQueryStrings.token ? resetPassword : sendPasswordResetEmail);

  const fields = !parsedQueryStrings.token ? [{
    label: 'Email',
    name: 'email',
  }] : [{
    label: 'Password',
    name: 'password',
  }, {
    label: 'Confirm password',
    name: 'confirmPassword',
  }];

  useEffect(() => {
    if (success) {
      notification.success({
        message: parsedQueryStrings.token ? 'Password reset successful!' : 'Password reset link has been emailed!',
        placement: 'bottomRight'
      });

      if (parsedQueryStrings.token) {
        navigate('/login');
      }
    }
  }, [success, response, parsedQueryStrings.token, navigate]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: error.response.data.message || 'Something went wrong!',
        placement: 'bottomRight'
      });
    }
  }, [error]);

  const handleSubmit = (values) => {
    parsedQueryStrings.token ?
    redoApi(values) :
    redoApi({...values, token: parsedQueryStrings.token});
  }

  return(
    <>
      <Header>
        <img src={logo} alt="soreways logo"/>
      </Header>
      <Main>
        <Container fields={fields} 
          title="Password reset" 
          onSubmitCb={handleSubmit} 
          isLoading={isLoading}/>
      </Main>
    </>
  );
};

export default ForgotPassword;