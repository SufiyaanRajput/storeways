import Container from "./Container";
import { useAsyncFetch } from '../../utils/hooks';
import { register } from "./api";
import { notification } from 'antd';
import { Header, Main } from "./styles";
import {observer} from 'mobx-react-lite'
import { useEffect, useContext } from "react";
import { userContext } from "../../store";
import logo from '../../assets/logo.png';
const Register = observer(() => {
  const userStore = useContext(userContext);
  const { response, success, error, isLoading, refetch: registerUser } = useAsyncFetch(false, register);

  const fields = [{
    label: 'Full name',
    name: 'name',
  }, {
    label: 'Email',
    name: 'email',
  }, {
    label: 'Mobile',
    name: 'mobile',
  }, {
    label: 'Store name',
    name: 'storeName',
  }, {
    label: 'Invite code',
    name: 'inviteCode',
  }, {
    label: 'Password',
    name: 'password',
  }, {
    label: 'Confirm password',
    name: 'confirmPassword',
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
    const { mobile, ...payload } = values;
    registerUser({
      ...payload,
      mobile: '+91' + mobile
    });
  }

  return(
    <>
      <Header>
        <img src={logo} alt="soreways logo"/>
      </Header>
      <Main>
        <Container fields={fields} 
          title="Register" 
          onSubmitCb={handleSubmit} 
          isLoading={isLoading}/>
      </Main>
    </>
  );
});

export default Register;