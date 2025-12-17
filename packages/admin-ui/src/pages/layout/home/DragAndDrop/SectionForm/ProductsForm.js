import { Form, Button, Select, InputNumber, notification } from "antd";
import { SubmitWrapper } from "../../../../../styles";
import { useEffect } from "react";
import { useForm } from "antd/lib/form/Form";
import { useMutation } from "@tanstack/react-query";

const ProductsForm = ({ setSectionToEdit, refetchLayout, type, updateLayoutSection }) => {
  const [form] = useForm();

  useEffect(() => {
    if (type.selection) {
      form.setFieldsValue({ ...type.selection });
    }
  }, [form, type.selection]);

  const updateSectionMutation = useMutation({
    mutationFn: async (payload) => {
      if (!updateLayoutSection) throw new Error("updateLayoutSection not provided");
      return await updateLayoutSection(payload);
    },
    onSuccess: () => {
      notification.success({
        message: "Updated section successfully!",
        placement: "bottomRight",
      });
      setSectionToEdit(null);
      if (refetchLayout) refetchLayout({ page: "home" });
    },
    onError: () => {
      notification.error({
        message: "Update section unsuccessful!",
        placement: "bottomRight",
      });
    },
  });

  const onSubmit = (products) => {
    updateSectionMutation.mutate({ page: "home", sectionId: type.id, products });
  };

  return (
    <Form
      layout="vertical"
      name="products-showcase"
      form={form}
      onFinish={onSubmit}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      autoComplete="off"
    >
      <Form.Item
        label="Type"
        name="type"
        rules={[{ required: true, message: "Please select a type!" }]}
      >
        <Select>
          {[{ label: "Latest", id: "LATEST" }, { label: "Most rated", id: "MOST_RATED" }, { label: "Best selling", id: "BEST_SELLING" }].map((option) => (
            <Select.Option key={option.id} value={option.id}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Limit"
        name="limit"
        rules={[
          { required: true, message: "Please enter a limit!" },
          {
            validator: async (_, value) => {
              if (value !== null && value < 1) throw new Error("At least 1 is required!");
              if (value > 10) throw new Error("Maximum of 10 is allowed!");
            },
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <SubmitWrapper wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" loading={updateSectionMutation.isPending} size="large" htmlType="submit">
          Submit
        </Button>
      </SubmitWrapper>
    </Form>
  );
};

export default ProductsForm;


