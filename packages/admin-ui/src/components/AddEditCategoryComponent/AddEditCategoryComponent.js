import { Modal, Button, Form, Input, Select, notification, Switch } from "antd";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

const AddEditCategoryComponent = ({
  visible,
  toggle,
  category = {},
  categories = [],
  refetch,
  addCategory,
  updateCategory,
}) => {
  const [form] = Form.useForm();
  const isEdit = Boolean(category?.key);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (isEdit) {
        if (!updateCategory) throw new Error("updateCategory not provided");
        return await updateCategory(payload);
      }
      if (!addCategory) throw new Error("addCategory not provided");
      return await addCategory(payload);
    },
    onSuccess: () => {
      notification.success({
        message: "Success!",
        placement: "bottomRight",
      });
      toggle(false);
      form.resetFields();
      if (typeof refetch === "function") {
        refetch();
      }
    },
    onError: () => {
      notification.error({
        message: "Something went wrong!",
        placement: "bottomRight",
      });
    },
  });

  useEffect(() => {
    form.setFieldsValue({
      ...category,
      parentId: category.parentId === "--" ? null : category.parentId,
      active: category.status === "Active",
    });
  }, [category, form]);

  const handleAddEditCategory = () => {
    form
      .validateFields()
      .then(({ key: id, parentId, active, ...values }) => {
        const payload = {
          ...values,
          parentId: parentId || null,
        };
        if (isEdit) {
          mutation.mutate({ id, active, ...payload });
        } else {
          mutation.mutate(payload);
        }
      })
      .catch(() => {});
  };

  return (
    <Modal
      open={visible}
      title={isEdit ? "Edit category" : "Add new category"}
      onCancel={() => toggle(false)}
      footer={[
        <Button key="back" onClick={() => toggle(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          loading={mutation.isPending}
          onClick={handleAddEditCategory}
        >
          Submit
        </Button>,
      ]}
      destroyOnClose
    >
      <Form
        form={form}
        name="add-edit-category"
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{
          ...category,
          parentId: category.parentId === "--" ? null : category.parentId,
          active: category.status === "Active",
        }}
        autoComplete="off"
      >
        <Form.Item label="key" name="key" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input category name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Parent" name="parentId">
          <Select
            allowClear
            showSearch
            placeholder="Select parent category"
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toString()
                .toLowerCase()
                .startsWith(input.toLowerCase())
            }
          >
            {categories.reduce((options, c) => {
              if (c.key !== category.key) {
                options.push(
                  <Select.Option key={c.key} value={c.key}>
                    {c.name}
                  </Select.Option>
                );
              }
              return options;
            }, [])}
          </Select>
        </Form.Item>
        {isEdit && (
          <Form.Item
            label="Active"
            name="active"
            valuePropName="checked"
            initialValue={category.status === "Active"}
          >
            <Switch />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default AddEditCategoryComponent;


