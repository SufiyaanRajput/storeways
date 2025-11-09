import { Form, Input, Button, Space } from "antd";
import { Link } from "react-router-dom";
import { Card, ButtonWrapper, FormTitle } from "./styles";

const Container = ({ fields, onSubmitCb, title, isLoading }) => {
  const [form] = Form.useForm();

  const onValuesChange = (value) => {
    const field = Object.keys(value)[0];
    form.setFields([{ name: field, value: value[field], errors: [] }]);
  }
  
  const onSubmit = (values) => {
    onSubmitCb(values);
  }

  return(
    <Card>
    <FormTitle>{title}</FormTitle>
    <Form
      form={form}
      name="basic"
      layout="vertical"
      wrapperCol={{ span: 24 }}
      initialValues={{ remember: true }}
      onFinish={onSubmit}
      validateTrigger="onBlur"
      onValuesChange={onValuesChange}
      autoComplete="off"
    >
      {
        fields.map((field, i) => {
          if(field.name === 'mobile'){
            return(
              <Form.Item
                key={i}
                name={field.name}
                label={field.label}
                rules={[{ required: true, message: 'Please input your mobile number!' }, {
                  pattern: '^(9|8|7)[0-9]{9}$',
                  message: `Doesn't seem like a mobile number`
                }]}
              >
                <Input addonBefore="+91" style={{ width: '100%' }} />
              </Form.Item>
            );
          }

          if (field.name === 'confirmPassword' || field.name === 'password') {
            return(
              <Form.Item
                key={i}
                label={field.label}
                name={field.name}
                rules={[{ required: true, message: 'Please input your Password!' }, {
                  validator(_, value) {
                    if (value == form.getFieldValue('password')) {
                      return Promise.resolve();
                    }

                    return Promise.reject(`Password don't match!`);
                  },
                }]}
              >
                <Input.Password />
              </Form.Item>
            );
          }

          return(
            <Form.Item
              key={i}
              label={field.label}
              name={field.name}
              rules={[{ required: true, message: `Please input your ${field.label}!` }]}
            >
              <Input />
            </Form.Item>
          );
        })
      }
      <Space direction="vertical" align="center" style={{width: '100%'}}>
        <ButtonWrapper wrapperCol={{ span: 24 }}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </ButtonWrapper>
        {title === 'Register' ? <p>Already have an account? <Link to="/login">Sign in</Link></p> : <p>Need an account? <Link to="/register">Register</Link></p>}
      </Space>
    </Form>
    <Space direction="vertical" align="center" style={{width: '100%'}}>
      {title === 'Register' && 
        <p>By registering you agree to the <a href="https://www.storeways.io/terms-of-service" target="_blank" rel="noreferrer">terms</a> and <a href="https://www.storeways.io/privacy-policy" target="_blank" rel="noreferrer">privacy policy</a></p>}
    </Space>
    <Space direction="vertical" align="center" style={{width: '100%'}}>
      {title === 'Login' && 
        <p><Link to="/password-reset">Forgot password?</Link></p>}
    </Space>
  </Card>
  );
}

export default Container;