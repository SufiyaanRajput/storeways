import { useEffect, useState } from "react";
import { PageHeader, LayoutContent, SubmitWrapper, FormSectionHeader, FullPageSpinner } from "../styles";
import { Button, Form, Input, Select, notification, Row, Col, Alert, Space, Switch } from 'antd';
import { getStoreSettings, updateStoreSettings, uploadLogo, updateStore } from "./api";
import ImgCrop from 'antd-img-crop';
import { useForm } from "antd/lib/form/Form";
import useAsyncFetch from "../../../utils/hooks";
import ReactQuill from 'react-quill';
import { Upload } from "./styles";

const Store = () => {
  const [form] = useForm();
  const [termsForm] = useForm();
  const [logo, setLogo] = useState(null);
  const [filesToDelete, setFilesToDelete] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    isLoading: isUpdatingStoreSettings,
    refetch: reupdateStoreSettings,
    success: updateStoreSettingsSuccess,
    error: updateStoreSettingsError,
  } = useAsyncFetch(false, updateStoreSettings);

  const {
    isLoading: isFetchingStoreSettings,
    response: fetchStoreSettingsResponse,
    success: fetchStoreSettingsSuccess,
    error: fetchStoreSettingsError,
  } = useAsyncFetch(true, getStoreSettings);

  const {
    isLoading: isUpdatingStore,
    refetch: reupdateStore,
    success: updateStoreSuccess,
    error: updateStoreError,
  } = useAsyncFetch(false, updateStore);

  useEffect(() => {
    if (fetchStoreSettingsError) {
      notification.error({
        message: `Couldn't fetch store settings!`,
        placement: 'bottomRight'
      });
    }
  }, [fetchStoreSettingsError]);

  useEffect(() => {
    if (updateStoreSettingsError) {
      notification.error({
        message: `Couldn't update store settings!`,
        placement: 'bottomRight'
      });
    }
  }, [updateStoreSettingsError]);

  useEffect(() => {
    if (updateStoreError) {
      notification.error({
        message: `Couldn't update store!`,
        placement: 'bottomRight'
      });
    }
  }, [updateStoreError]);

  useEffect(() => {
    if (updateStoreSettingsSuccess || updateStoreSuccess) {
      setFilesToDelete([]);
      notification.success({
        message: `Settings updated!`,
        placement: 'bottomRight'
      });
    }
  }, [updateStoreSettingsSuccess, updateStoreSuccess]);

  useEffect(() => {
    if (fetchStoreSettingsSuccess) {
      const { theme: { 
       ...restTheme 
      } = {}, 
      otherCharges: {value: otherCharges, type: otherChargesType} = {},
      tax: {value: tax, type: taxType} = {},
      logo,
      logoText,
      termsOfService,
      privacyPolicy,
      isOnlinePaymentEnabled,
     } = fetchStoreSettingsResponse.data.store;

      if (logo) setLogo(logo);
      form.setFieldsValue({...restTheme, logo, otherCharges, logoText, otherChargesType, tax, taxType, isOnlinePaymentEnabled});
      termsForm.setFieldsValue({termsOfService, privacyPolicy});
    }
  }, [fetchStoreSettingsResponse, fetchStoreSettingsSuccess, form, termsForm]);

  const uploadImage = ({file}) => {

    const formData = new FormData();
    formData.append('fileName', new Date().getTime());
    formData.append('logo', file);
    setIsUploading(true);

    uploadLogo(formData).then((response) => {
      setIsUploading(false);
      setLogo(response.data.logo);
      form.setFields([{ name: 'logo', value: response.data.logo, errors: [] }]);
    }).catch((error) => {
      console.log(error)
      notification.error({
        message: `Couldn't upload logo!`,
        placement: 'bottomRight'
      });
      setIsUploading(false);
      setLogo([]);
    });
  }

  const onSubmit = (values) => {
    const {otherCharges, otherChargesType, tax, taxType, logo = null, ...rest} = values;

    const payload = {
      filesToDelete,
      logo,
      ...rest
    }

    if (otherCharges) {
      payload.otherCharges = {
        value: otherCharges,
        type: otherChargesType
      }
    }

    if (tax) {
      payload.tax = {
        value: tax,
        type: taxType
      }
    }

    reupdateStoreSettings(payload);
  };

  const suffixSelectorPrice = (name) => (
    <Form.Item name={name} noStyle initialValue="VALUE">
      <Select style={{ width: 70 }}>
        <Select.Option value="PERCENTAGE">%</Select.Option>
        <Select.Option value="VALUE">₹</Select.Option>
      </Select>
    </Form.Item>
  );

  const onRemoveLogo = async (e) => {
    try{
      if (e.fileId) {
        setFilesToDelete(images => [...images, e]);
      }

      setLogo(null);
      form.setFields([{ name: 'logo', value: undefined, errors: [] }]);
    }catch(e) {
      console.log(e);
    }
  }

  const onSubmitTerms = (values) => {
    reupdateStore(values);
  }

  return (
    <>
      <PageHeader
        title="Store settings"
        // breadcrumb={{ routes }} 
      />
      <LayoutContent>
        {
          isFetchingStoreSettings ?
          <FullPageSpinner /> :
          <>
            <Space direction='vertical'>
              <Alert message={<p>Your store is live at: <a href={process.env.REACT_APP_CLIENT_URL} target="_blank" rel="noreferrer">{process.env.REACT_APP_CLIENT_URL}</a></p>}/>
              <FormSectionHeader>Theme</FormSectionHeader>
            </Space>  
            <Form
              form={form}
              layout="vertical"
              name="basic"
              onFinish={onSubmit}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              initialValues={{}}
              autoComplete="off">
                 <Form.Item
                    label="Logo"
                    name="logo"
                  >
                    <ImgCrop aspect={15/6}>
                      <Upload onRemove={onRemoveLogo}
                        fileList={logo ? [logo] : []}
                        listType="picture"
                        customRequest={uploadImage}>
                        <Button loading={isUploading}>Upload</Button>
                      </Upload>
                    </ImgCrop>
                  </Form.Item>
                <Row gutter={16}>
                  <Col sm={12} md={8}>
                    <Form.Item
                      label="Domain"
                      name="domain">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={12} md={8}>
                    <Form.Item
                      rules={[{ required: true, message: 'Please input logo text!' }]}
                      label="Logo text"
                      name="logoText">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col sm={12} md={8}>
                    <Form.Item
                      rules={[{ required: true, message: 'Please input brand color!' }]}
                      label="Brand color"
                      name="brandColor"
                    >
                      <Input type="color"/>
                    </Form.Item>
                  </Col>
                  <Col sm={12} md={8}>
                    <Form.Item
                      rules={[{ required: true, message: 'Please input nav background color!' }]}
                      label="Nav background color"
                      name="navBackgroundColor"
                    >
                      <Input type="color"/>
                    </Form.Item>
                  </Col>
                  <Col sm={12} md={8}>
                    <Form.Item
                      rules={[{ required: true, message: 'Please input nav text color!' }]}
                      label="Nav text color"
                      name="navTextColor"
                    >
                      <Input type="color"/>
                    </Form.Item>
                  </Col>
                </Row>
                <FormSectionHeader>Cart</FormSectionHeader>
                <Row gutter={16}>
                  <Col sm={12} md={8}>
                    <Form.Item
                      label="Tax"
                      name="tax"
                      rules={[{
                        validator(_, value) {
                          if (value?.trim() && isNaN(value)) {
                            return Promise.reject(`Doesn't seem like a number!`);
                          }
      
                          return Promise.resolve();
                        },
                      }]}
                    >
                      <Input addonAfter={suffixSelectorPrice('taxType')}/>
                    </Form.Item>
                  </Col>
                  <Col sm={12} md={8}>
                    <Form.Item
                      label="Other charges"
                      name="otherCharges"
                      rules={[{
                        validator(_, value) {
                          if (value?.trim() && isNaN(value)) {
                            return Promise.reject(`Doesn't seem like a number!`);
                          }
      
                          return Promise.resolve();
                        },
                      }]}
                    >
                      <Input addonAfter={suffixSelectorPrice('otherChargesType')}/>
                    </Form.Item>
                  </Col>
                  <Col sm={12} md={8}>
                    <Form.Item
                      label="Enable online payment"
                      name="isOnlinePaymentEnabled"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
                <SubmitWrapper wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" loading={isUpdatingStoreSettings} size="large" htmlType="submit">
                    Submit
                  </Button>
                </SubmitWrapper>
            </Form>
            <FormSectionHeader>Terms & Policy</FormSectionHeader>
            <Form
              layout="vertical"
              form={termsForm}
              name="terms"
              onFinish={onSubmitTerms}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              initialValues={{}}
              autoComplete="off">
                <Form.Item
                  label="Terms of service"
                  name="termsOfService"
                  initialValue=""
                >
                  <ReactQuill/>
                </Form.Item>
                <Form.Item
                  label="Privacy policy"
                  name="privacyPolicy"
                  initialValue=""
                >
                  <ReactQuill/>
                </Form.Item>
                <SubmitWrapper wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" loading={isUpdatingStore} size="large" htmlType="submit">
                    Submit
                  </Button>
                </SubmitWrapper>
            </Form>
          </>
        }
      </LayoutContent>
    </>
  )
};

export default Store;