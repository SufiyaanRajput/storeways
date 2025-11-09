import { Modal, Button, Form, Input, Select, notification, Switch } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useAsyncFetch } from '../../../../utils/hooks';
import { addVaration, updateVariation } from '../api';

const AddEditVariations = ({ visible, toggle, variation={}, categories, reftechVariations }) => {
  const [form] = useForm();
  const { isLoading, success, error, refetch: addUpdateVariation } = useAsyncFetch(false, variation.key ? updateVariation : addVaration);

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Something went wrong!',
        placement: 'bottomRight'
      });
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      notification.success({
        message: 'Variation added successfully!',
        placement: 'bottomRight'
      });
      toggle(false);
      reftechVariations();
    }
  }, [success, toggle, reftechVariations])

  const handleAddEditVariation = () => {
    form
    .validateFields()
    .then(({key: id, category, ...values}) => {
      if (id) {
        return addUpdateVariation({id, categoryId: category, ...values});
      }

      addUpdateVariation({categoryId: category, ...values});
    })
    .catch(info => {
      // console.log('Validate Failed:', info);
    });
  }

  return(
    <Modal
      visible={visible}
      title="Add new variation"
      onCancel={() => toggle(false)}
      footer={[
        <Button key="back" onClick={() => toggle(false)}>
          Cancel
        </Button>,
        <Button key="submit" htmlType="submit" type="primary" loading={isLoading} onClick={handleAddEditVariation}>
          Submit
        </Button>
      ]}>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ ...variation }}
        onFinish={() => {}}
        onFinishFailed={() => {}}
        autoComplete="off">
        <Form.Item label="key" name="key" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please select category!' }]}>
          <Select>
            {
              categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          label="Options"
          name="options"
          rules={[{ required: true, message: 'Please add variations!' }]}>
          <Select mode="tags" open={false} />
        </Form.Item>
        {
          variation.key &&
          <Form.Item label="Active" name="active">
            <Switch defaultChecked={variation.status == 'Active'} />
          </Form.Item>
        }
      </Form>
    </Modal>
  );
}

export default AddEditVariations;