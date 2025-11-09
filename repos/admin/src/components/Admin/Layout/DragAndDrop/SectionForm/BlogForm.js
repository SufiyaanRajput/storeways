import { Form, Button, Select, InputNumber } from "antd";
import { SubmitWrapper } from "../../../styles";

const BlogForm = () => {
  const onSubmit = () => {};

  return(
    <Form
      layout="vertical"
      name="basic"
      onFinish={onSubmit}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      initialValues={{}}
      autoComplete="off"
    >
      <Form.Item
        label="Type"
        name="type"
        rules={[{ required: true, message: 'Please select a type!' }]}>
          <Select>
          {
            [{label: 'Latest', id: 'LATEST'}, {label: 'Most viewed', id: 'MOST_VIEWD'}].map(option => (
              <Select.Option key={option.id} value={option.id}>{option.label}</Select.Option>
            ))
          }
        </Select>
      </Form.Item>
      <Form.Item
        label="Limit"
        name="limit"
        rules={[{ required: true, message: 'Please select a limit!' }]}>
         <InputNumber/>
      </Form.Item>
      <SubmitWrapper wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" loading={false} size="large" htmlType="submit">
          Submit
        </Button>
      </SubmitWrapper>
    </Form>
  );
}

export default BlogForm;