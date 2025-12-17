import { Form, Input, Button, Space, Divider, notification } from "antd";
import { SubmitWrapper } from "../../../../../styles";
import { useEffect } from "react";
import { useForm } from "antd/lib/form/Form";
import { useMutation } from "@tanstack/react-query";
import { SketchPicker } from "react-color";

const FeaturesForm = ({ type, setSectionToEdit, refetchLayout, updateLayoutSection }) => {
  const [form] = useForm();

  useEffect(() => {
    form.setFields([
      { name: "sectionBgColor", value: type.sectionBgColor, errors: [] },
      { name: "features", value: type.items, errors: [] },
    ]);
  }, [form, type.items, type.sectionBgColor]);

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

  const onColorChange = (e) => {
    form.setFields([{ name: "sectionBgColor", value: e.rgb, errors: [] }]);
  };

  const onSubmit = (features) => {
    updateSectionMutation.mutate({ page: "home", sectionId: type.id, ...features });
  };

  return (
    <Form
      name="features-form"
      layout="vertical"
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={onSubmit}
      autoComplete="off"
    >
      <Form.Item
        valuePropName="color"
        label="Section Background color"
        name={"sectionBgColor"}
        rules={[{ required: true, message: "Missing section background color" }]}
      >
        <SketchPicker onChangeComplete={onColorChange} />
      </Form.Item>
      <Form.List name="features">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, i) => (
              <Space key={key} style={{ display: "block", marginBottom: 25 }} align="baseline">
                <Divider>Feature {i + 1}</Divider>
                <Form.Item
                  {...restField}
                  label="Title"
                  name={[name, "title"]}
                  rules={[{ required: true, message: "Missing title" }]}
                >
                  <Input style={{ width: "100%" }} placeholder="Title" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="description"
                  name={[name, "description"]}
                  rules={[{ required: true, message: "Missing description" }]}
                >
                  <Input.TextArea rows={8} placeholder="Description" />
                </Form.Item>
                <div style={{ textAlign: "center" }}>
                  <Button onClick={() => remove(name)} danger type="primary">
                    Remove
                  </Button>
                </div>
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block>
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <SubmitWrapper wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" loading={updateSectionMutation.isPending} size="large" htmlType="submit">
          Submit
        </Button>
      </SubmitWrapper>
    </Form>
  );
};

export default FeaturesForm;


