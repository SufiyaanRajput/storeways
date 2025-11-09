import { Form, Button, Select, InputNumber, notification } from "antd";
import { SubmitWrapper } from "../../../styles";
import { updateLayoutSection } from "../../api";
import {useAsyncFetch} from "../../../../../utils/hooks";
import { useEffect } from "react";
import { useForm } from "antd/lib/form/Form";

const ProductsForm = ({setSectionToEdit, refetchLayout, type}) => {
  const [form] = useForm();

  useEffect(() => {
    if (type.selection) {
      form.setFieldsValue({...type.selection});
    }
  }, [form, type.selection]);

  const {
    isLoading: isUpdatingSection,
    error: updateSectionError,
    success: updateSectionSuccess,
    refetch: reupdateSection
  } = useAsyncFetch(false, updateLayoutSection);

  useEffect(() => {
    if (updateSectionSuccess) {
      notification.success({
        message: 'Updated section successfully!',
        placement: 'bottomRight'
      });

      setSectionToEdit(null);
      refetchLayout({page: 'home'});
    }
  }, [refetchLayout, setSectionToEdit, updateSectionSuccess]);

  useEffect(() => {
    if (updateSectionError) {
      notification.error({
        message: 'Update section unsuccessfull!',
        placement: 'bottomRight'
      });
    }
  }, [updateSectionError]);

  const onSubmit = (products) => {
    reupdateSection({page: 'home', sectionId: type.id, products});
  };

  return(
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
        rules={[{ required: true, message: 'Please select a type!' }]}>
          <Select>
          {
            [{label: 'Latest', id: 'LATEST'}, {label: 'Most rated', id: 'MOST_RATED'}, {label: 'Best selling', id: 'BEST_SELLING'}].map(option => (
              <Select.Option key={option.id} value={option.id}>{option.label}</Select.Option>
            ))
          }
        </Select>
      </Form.Item>
      <Form.Item
        label="Limit"
        name="limit"
        rules={[{ required: true, message: 'Please enter a limit!' }, {
          validator: async (_, value) => {
            if (value !== null && value < 1) throw new Error('Atleast 1 is required!');
            if (value > 10) throw new Error('Maximum of 10 is allowed!');
          }
        }]}>
         <InputNumber/>
      </Form.Item>
      <SubmitWrapper wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" loading={isUpdatingSection} size="large" htmlType="submit">
          Submit
        </Button>
      </SubmitWrapper>
    </Form>
  );
}

export default ProductsForm;