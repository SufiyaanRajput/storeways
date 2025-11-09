import { Modal, Alert, Form, Space } from "antd";
import { useEffect, useCallback, useState } from "react";
import { AddonBeforeInput } from '..';
import { loginCustomer, sendOTP } from 'themes/api';
import { useAsyncFetch } from 'themes/utils/hooks';
import Button from "@/base/Button/Button";
import { useForm } from 'antd/lib/form/Form';
import Input from "../Input/Input";

  const LoginModal = ({ visible, user, setVisibility }) => {
    const [loginState, setLoginState] = useState(0);
    const [mobileUsed, setMobile] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [form] = useForm();
    const {
      isLoading: isSendingOTP,
      error: sendOTPError,
      success: sendOTPSuccess,
      refetch: resendOTP,
    } = useAsyncFetch(false, sendOTP);
    const {
      isLoading,
      error,
      success,
      response,
      refetch,
    } = useAsyncFetch(false, loginCustomer);
    
    const resetStates = useCallback(() => {
      setMobile(null);
      setVisibility(false);
      setLoginState(0);
      setErrorMsg(null);
    }, [setVisibility]);

    useEffect(() => {
      if (success) {
        user.setUser(response.data.user);
       resetStates();
      }
    }, [resetStates, response, setVisibility, success, user]);

    useEffect(() => {
      if (sendOTPSuccess) {
        setLoginState(1);
        setErrorMsg(null);
      }
    }, [sendOTPSuccess]);

    useEffect(() => {
      const defaultMsg = 'Something went wrong!';

      if (error && loginState === 0) {
        setErrorMsg(error?.response?.data?.message || defaultMsg);
      } else if (sendOTPError) {
        setErrorMsg(sendOTPError?.response?.data?.message || defaultMsg);
      }
    }, [error, loginState, sendOTPError]);

    const onSubmit = ({mobile, otp}) => {
      if (loginState === 0) {
        resendOTP({mobile: `+91${mobile}`});
        setMobile(`+91${mobile}`);
        return;
      }

      refetch({otp, mobile: mobileUsed});
    }

    return(
      <Modal title="Login" 
        visible={visible}
        closable={true}
        onCancel={() => {
          form.resetFields();
          resetStates();
        }}
        footer={[
          <Button key="back" size='small' onClick={() => setVisibility(false)}>
            Cancel
          </Button>,
          <Button key="submit" size='small' type="primary" loading={isLoading || isSendingOTP} onClick={form.submit}>
            {loginState === 0 ? 'Get OTP' : 'Login'}
          </Button>
        ]}>
         <Form
            form={form}
            name="basic"
            layout="vertical"
            wrapperCol={{ span: 24 }}
            onFinish={onSubmit}
            validateTrigger="onBlur"
            autoComplete="off">
             {
               loginState === 0 ?
               <Form.Item
                  name="mobile"
                  label="Mobile"
                  rules={[{ required: true, message: 'Please input your mobile number!' }, {
                    pattern: '^(9|8|7)[0-9]{9}$',
                    message: `Doesn't seem like a mobile number`
                  }]}
                >
                  <AddonBeforeInput addonBefore="+91" style={{ width: '100%' }} />
              </Form.Item> :
               <Form.Item
                  name="otp"
                  label="OTP"
                  rules={[{ required: true, message: 'Please input OTP!' }, {
                    pattern: '^[0-9]{6}$',
                    message: `OPT must be a 6 digit number!`
                  }]}
                >
                  <Input />
              </Form.Item>
             }
          </Form>
          {
            errorMsg &&
            <Space direction='vertical'>
              <Alert message={errorMsg} type="error" />
            </Space>
          }
      </Modal>
    );
  }

  export default LoginModal;