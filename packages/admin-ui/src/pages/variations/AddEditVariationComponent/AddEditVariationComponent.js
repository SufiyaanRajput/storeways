import { Modal, Button, Form, Input, Select, notification, Switch } from "antd";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

const AddEditVariationComponent = ({
  visible,
  toggle,
  variation = {},
  categories = [],
  refetch,
  addVariation,
  updateVariation,
}) => {
  const [form] = Form.useForm();
  const isEdit = Boolean(variation?.key);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (isEdit) {
        if (!updateVariation) throw new Error("updateVariation not provided");
        return await updateVariation(payload);
      }
      if (!addVariation) throw new Error("addVariation not provided");
      return await addVariation(payload);
    },
    onSuccess: () => {
      notification.success({
        message: "Variation saved!",
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
      ...variation,
      category: variation.category ?? variation.categoryId,
      active: variation.status === "Active",
    });
  }, [variation, form]);

  const handleAddEditVariation = () => {
    form
      .validateFields()
      .then(({ key: id, category, active, ...values }) => {
        const payload = {
          ...values,
          categoryId: category,
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
      title={isEdit ? "Edit variation" : "Add new variation"}
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
          onClick={handleAddEditVariation}
        >
          Submit
        </Button>,
      ]}
      destroyOnClose
    >
      <Form
        form={form}
        name="add-edit-variation"
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{
          ...variation,
          category: variation.category ?? variation.categoryId,
          active: variation.status === "Active",
        }}
        autoComplete="off"
      >
        <Form.Item label="key" name="key" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select category!" }]}
        >
          <Select
            showSearch
            placeholder="Select category"
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {(categories || []).map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Options"
          name="options"
          rules={[{ required: true, message: "Please add variations!" }]}
        >
          <Select mode="tags" open={false} />
        </Form.Item>
        {isEdit && (
          <Form.Item
            label="Active"
            name="active"
            valuePropName="checked"
            initialValue={variation.status === "Active"}
          >
            <Switch />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default AddEditVariationComponent;


