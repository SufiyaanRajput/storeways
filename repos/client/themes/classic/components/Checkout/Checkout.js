import { Section, Container, Button } from "@/base/index";
import { SectionTitle } from "@/base/Section/Section";
import { Input, PasswordInput, AddonBeforeInput } from 'themes/classic/common';
import {Form, Row, Col, Modal, Space, Alert, Radio} from 'antd';
import { useForm } from "antd/lib/form/Form";
import cartStore from '../Cart/store';
import checkoutStore from './store';
import userContext from '../../../../store/users';
import storeContext from '../../../../store/store';
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import {useAsyncFetch} from 'themes/utils/hooks';
import {createOrder, confirmPayment} from './api';
import { cancelOrders } from "../Orders/api";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { sendOTP } from "themes/api";
import startPayment from "./payments";

const Checkout = () => {
  const [form] = useForm();
  const [otpForm] = useForm();
  const cart = useContext(cartStore);
  const store = useContext(storeContext);
  const user = useContext(userContext);
  const checkout = useContext(checkoutStore);
  const router = useRouter();
  const [isOTPModelVisible, setOTPModelVisible] = useState(false);
  const hasPaymentGateway = !!store.settings?.store?.isOnlinePaymentEnabled;

  const {
    isLoading: creatingOrder,
    response: createOrderResponse, 
    error: createOrderError, 
    success: createOrderSuccess,
    refetch: recreateOrder,
  } = useAsyncFetch(false, createOrder);

  const {
    isLoading: confirmingPayment,
    error: confirmingPaymentError, 
    success: confirmingPaymentSuccess,
    refetch: reconfirmPayment,
  } = useAsyncFetch(false, confirmPayment);


  const {
    refetch: recancelOrders
  } = useAsyncFetch(false, cancelOrders);

  const {
    isLoading: isSendingOTP,
    error: sendOTPError,
    success: sendOTPSuccess,
    refetch: resendOTP,
    response,
  } = useAsyncFetch(false, sendOTP);

  useEffect(() => {
    if (toJS(user)) {
      const {address, mobile, ...rest} = toJS(user); 
      form.setFieldsValue({...rest, mobile: mobile ? mobile.substring(3,) : '', shippingAddress: address});
    }
    form.setFieldsValue({paymentMode: hasPaymentGateway ? 'online' : 'cod'});
  }, [form, user, hasPaymentGateway]);

  useEffect(() => {
    if (confirmingPaymentSuccess) {
      cart.clearStore();
      router.push('/orders');
    }
  }, [cart, confirmingPaymentSuccess, router]);

  useEffect(() => {
    if (confirmingPaymentError) {
      const onClose = () => {
        modal.destroy();
      }

      const modal = Modal.error({
        title: '',
        wrapClassName: 'modalInstance',
        content: (
          <div>
            <Space direction="vertical">
              <p>Couldn't verify payment!</p>
              <Button type="primary" onClick={onClose}>Close</Button>
            </Space>
          </div>
        ),
        maskClosable: true,
        okButtonProps: {style: {display: 'none'}}
      });
    }
  }, [confirmingPaymentError]);

  useEffect(() => {
    if (createOrderSuccess && cart.items.length) {
      setOTPModelVisible(false);
      const {paymentOrder, orderIds, amount, user: customer, outStock, stockChanged, itemRemoved, paymentMode} = createOrderResponse.data;

      if (outStock || stockChanged || itemRemoved) {
        const onGoToCart = () => {
          modal.destroy();
          router.push('/cart');
        }
    
        const modal = Modal.error({
          title: '',
          wrapClassName: 'modalInstance',
          content: (
            <div>
              <Space direction="vertical">
                <p>Some items or their availability has changed since you last added them to the cart. Please update check your cart.</p>
                <Button type="primary" onClick={onGoToCart}>Go to cart</Button>
              </Space>
            </div>
          ),
          maskClosable: true,
          okButtonProps: {style: {display: 'none'}}
        });
      } else {
        checkout.setOrder(paymentOrder);
        user.setUser(customer);

        otpForm.resetFields();

        if (paymentMode === 'cod') {
          cart.clearStore();
          router.push('/orders');
        } else {
          startPayment({
            paymentGateway: createOrderResponse.data?.paymentGateway,
            paymentOrder,
            amount,
            orderIds,
            cart,
            customer,
            store,
            reconfirmPayment,
            Modal,
            Space
          }).catch((error) => {
            console.log('error', error);
            Modal.error({
              title: '',
              wrapClassName: 'modalInstance',
              content: (
                <div>
                  <Space direction="vertical">
                    <p>Unable to start checkout. Please try again later.</p>
                  </Space>
                </div>
              ),
              maskClosable: true,
              okButtonProps: {style: {display: 'none'}}
            });
          });
        }
      }
    }
  }, [checkout, user, createOrderResponse.data, createOrderSuccess, form, store.name, store, otpForm, reconfirmPayment, router, cart]);

  useEffect(() => {
    if (sendOTPSuccess || sendOTPError) {
      setOTPModelVisible(true);
    }
  }, [sendOTPSuccess, sendOTPError]);

  if (!confirmingPaymentSuccess && !createOrderSuccess && !cart.items.length) {
    router.push('/cart');
    return null;
  };

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
    label: 'Shipping adress',
    name: 'shippingAddress',
  }, {
    label: 'Landmark',
    name: 'landmark',
  }, {
    label: 'Pincode',
    name: 'pincode',
  }, {
    label: 'Mode of payment',
    name: 'paymentMode',
  }];

  const verifyOTP = () => {
    const otp = otpForm.getFieldValue('otp');

    if (!otp) return otpForm.validateFields();

    const {mobile, shippingAddress, ...values} = form.getFieldsValue();

    recreateOrder({
      ...values, 
      otp,
      amount: cart.totalAmount, 
      address: shippingAddress, 
      mobile: `+91${mobile}`,
      products: cart.items,
    });
  }

  const openOTPMOdal = () => {
    resendOTP({mobile: `+91${form.getFieldValue('mobile')}`});
  }
  
  return (
   <>
    <main>
      <Modal
        visible={isOTPModelVisible}
        closable={true}
        onCancel={() => {
          setOTPModelVisible(false);
          otpForm.resetFields();
        }}
        title="Please enter 6 digits OTP sent to your mobile"
        footer={[
          <Button key="submit" type="primary" size="large" loading={creatingOrder || confirmingPayment} onClick={verifyOTP}>
            Verify
          </Button>
        ]}
      >
        <Space direction="vertical">
          {
            createOrderError &&
            <Alert
              description={createOrderError?.response?.data?.message || 'Something went wrong! Please try again later.'}
              type="error"
              showIcon
            />
          }
        {
          sendOTPError &&
          <Alert
            description={sendOTPError?.response?.data?.message || 'Something went wrong!'}
            type="error"
            showIcon
          />
        }
        {
          response?.data?.response?.msgText &&
          <Alert
            description={response?.data?.response?.msgText}
            showIcon
          />
        }
          <Form
            form={otpForm}
            name="login"
            layout="vertical"
            wrapperCol={{ span: 24 }}
            // onFinish={onSubmit}
            validateTrigger="onBlur"
            // onValuesChange={onValuesChange}
            autoComplete="off">
            <Form.Item
              label="OTP"
              name="otp"
              rules={[{required: true, message: 'Please enter OTP!'}, {
                pattern: '^[0-9]{6}$',
                message: `Doesn't seem like an OTP!`
              }]}
            >
              <Input />
            </Form.Item>
          </Form> 
        </Space>
      </Modal>
      <Section>
        <Container $maxWidth="1300px">
          <SectionTitle orientation="left"><h4>Checkout</h4></SectionTitle>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            wrapperCol={{ span: 24 }}
            onFinish={openOTPMOdal}
            validateTrigger="onBlur"
            // onValuesChange={onValuesChange}
            autoComplete="off"
          >
            <Row gutter={16}>
            {
              fields.map((field, i) => {
                if(field.name === 'mobile'){
                  return(
                    <>
                      <Col sm={12} key={i}>
                        <Form.Item
                          name={field.name}
                          label={field.label}
                          rules={[{ required: true, message: 'Please input your mobile number!' }, {
                            pattern: '^(9|8|7)[0-9]{9}$',
                            message: `Doesn't seem like a mobile number`
                          }]}
                        >
                          <AddonBeforeInput addonBefore="+91" style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col sm={12}></Col>
                    </>
                  );
                }

                if (field.name === 'confirmPassword' || field.name === 'password') {
                  return(
                    <Col sm={12} key={i}>
                      <Form.Item
                        label={field.label}
                        name={field.name}
                        rules={[{ required: true, message: 'Please input your Password!' }, {
                          validator(_, value) {
                            if (!value && value == form.getFieldValue('password')) {
                              return Promise.resolve();
                            }

                            return Promise.reject(`Password don't match!`);
                          },
                        }]}
                      >
                        <PasswordInput />
                      </Form.Item>
                    </Col>
                  );
                }

                if(field.name === 'shippingAddress'){
                  return(
                    <Col sm={24} key={i}>
                    <Form.Item
                      key={i}
                      label={field.label}
                      name={field.name}
                      rules={[{ required: true, message: `Please input your ${field.label}!` }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  );
                }

                if(field.name === 'paymentMode'){
                  return(
                    <Col sm={24} key={i}>
                    <Form.Item
                      key={i}
                      label={field.label}x
                      name={field.name}
                      rules={[{ required: true, message: `Please select payment mode!` }]}
                    >
                      <Radio.Group>
                        {
                          hasPaymentGateway &&
                          <Radio value="online">Online</Radio>
                        }
                        <Radio value="cod">Cash on delivery</Radio>
                      </Radio.Group>  
                    </Form.Item>
                  </Col>
                  );
                }

                return(
                  <Col sm={12} key={i}>
                    <Form.Item
                      key={i}
                      label={field.label}
                      name={field.name}
                      rules={[{ required: true, message: `Please input your ${field.label}!` }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                );
              })
            }
            </Row>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Row gutter={16} justify="end">
                <Col>
                  <Button type="primary" size="large" htmlType="submit" loading={isSendingOTP}>
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Container>
      </Section>
    </main>
   </>
  );
}

export default observer(Checkout);