import { Button, Container } from '@/base/index';
import { Input } from 'themes/classic/common';
import {Form} from 'antd';
import {NewsletterSection, NewsletterTitle} from '../styles';
import { useAsyncFetch } from 'themes/utils/hooks';
import { addSubscriber } from './api';
import { useForm } from 'antd/lib/form/Form';

const Newsletter = () => {
  const [form] = useForm();
  const {
    isLoading,
    success,
    refetch: readdSubscriber
  } = useAsyncFetch(false, addSubscriber);

  return(
    <NewsletterSection>
      <Container $maxWidth="700px">
        {
          success ?
          <NewsletterTitle>Thanks for subscribing!</NewsletterTitle> :
          <>
          <NewsletterTitle>Classic Newsletter</NewsletterTitle>
            <p>Subscribe to our mailing list to receive updates on new arrivals, special offers and other discount information.</p>
            <Form
              validateTrigger="onSubmit"
              form={form}
              name="basic"
              layout="vertical"
              onFinish={readdSubscriber}
              autoComplete="off"
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button size="large" htmlType="submit" loading={isLoading}>Submit</Button>
              </Form.Item>
            </Form>
          </>
        }
      </Container>
    </NewsletterSection>
  );
}

export default Newsletter;