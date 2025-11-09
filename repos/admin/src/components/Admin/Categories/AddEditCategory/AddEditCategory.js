import { Modal, Button, Form, Input, Select, notification, Switch } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useAsyncFetch } from '../../../../utils/hooks';
import { addCategory, updateCategory } from '../api';

const AddEditCategory = ({ visible, toggle, category={}, categories, reftechCategories }) => {
  const [form] = useForm();
  const { isLoading, success, error, refetch: addUpdateCategory } = useAsyncFetch(false, category.key ? updateCategory : addCategory);

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
        message: 'Success!',
        placement: 'bottomRight'
      });
      toggle(false);
      reftechCategories();
    }
  }, [success, toggle, reftechCategories])

  const handleAddEditCategory = () => {
    form
    .validateFields()
    .then(({key: id, parent, ...values}) => {
      if (id) {
        return addUpdateCategory({id, ...values});
      }

      addUpdateCategory({...values});
    })
    .catch(info => {
      console.log('Validate Failed:', info);
    });
  }

  return(
    <Modal
      visible={visible}
      title="Add new category"
      onCancel={() => toggle(false)}
      footer={[
        <Button key="back" onClick={() => toggle(false)}>
          Cancel
        </Button>,
        <Button key="submit" htmlType="submit" type="primary" loading={isLoading} onClick={handleAddEditCategory}>
          Submit
        </Button>
      ]}>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ ...category, parentId: category.parentId == '--' ? null : category.parentId }}
        onFinish={() => {}}
        onFinishFailed={() => {}}
        autoComplete="off">
        <Form.Item label="key" name="key" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input category name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Parent"
          name="parentId">
          <Select showSearch 
            filterOption={(input, option) =>
              option.children.toLowerCase().startsWith(input.toLowerCase())
            }>
            {
              categories.reduce((options, c) => {
                if (c.key !== category.key) {
                  options.push((
                    <Select.Option key={c.key} value={c.key}>{c.name}</Select.Option>
                  ));
                }

                return options;
              }, [])
            }
          </Select>
        </Form.Item>
        {
          category.key &&
          <Form.Item label="Active" name="active">
            <Switch defaultChecked={category.status == 'Active'} />
          </Form.Item>
        }
      </Form>
    </Modal>
  );
}

export default AddEditCategory;