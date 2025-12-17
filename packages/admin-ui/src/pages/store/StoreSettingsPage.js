import { useEffect, useMemo, useState } from "react";
import {
  PageHeader,
  LayoutContent,
  SubmitWrapper,
  FormSectionHeader,
  FullPageSpinner,
} from "../../styles";
import {
  Button,
  Form,
  Input,
  Select,
  notification,
  Row,
  Col,
  Alert,
  Space,
  Switch,
} from "antd";
import ImgCrop from "antd-img-crop";
import ReactQuill from "react-quill";
import QueryBoundary from "../../internals/QueryBoundary";
import { Upload } from "./styles";
import { useQuery, useMutation } from "@tanstack/react-query";

const StoreSettings = ({
  getStoreSettings,
  updateStoreSettings,
  uploadLogo,
  updateStore,
  storeUrl,
}) => {
  const [form] = Form.useForm();
  const [termsForm] = Form.useForm();
  const [logo, setLogo] = useState(null);
  const [filesToDelete, setFilesToDelete] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    data: storeSettings = {},
    isFetching: isFetchingStoreSettings,
    refetch: refetchStoreSettings,
  } = useQuery({
    queryKey: ["adminStoreSettings"],
    queryFn: async () => {
      if (!getStoreSettings) return { data: { store: {} } };
      return await getStoreSettings();
    },
    select: (response) =>
      response?.data?.store || response?.store || {},
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!getStoreSettings) {
      notification.warning({
        message: "getStoreSettings not provided",
        placement: "bottomRight",
      });
    }
  }, [getStoreSettings]);

  const updateStoreSettingsMutation = useMutation({
    mutationFn: async (payload) => {
      if (!updateStoreSettings) throw new Error("updateStoreSettings not provided");
      return await updateStoreSettings(payload);
    },
    onSuccess: async () => {
      setFilesToDelete([]);
      notification.success({
        message: "Settings updated!",
        placement: "bottomRight",
      });
      await refetchStoreSettings();
    },
    onError: () => {
      notification.error({
        message: "Couldn't update store settings!",
        placement: "bottomRight",
      });
    },
  });

  const updateStoreMutation = useMutation({
    mutationFn: async (payload) => {
      if (!updateStore) throw new Error("updateStore not provided");
      return await updateStore(payload);
    },
    onSuccess: () => {
      notification.success({
        message: "Store updated!",
        placement: "bottomRight",
      });
    },
    onError: () => {
      notification.error({
        message: "Couldn't update store!",
        placement: "bottomRight",
      });
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: async (formData) => {
      if (!uploadLogo) throw new Error("uploadLogo not provided");
      return await uploadLogo(formData);
    },
    onSuccess: (response) => {
      setLogo(response?.data?.logo || null);
      form.setFields([
        { name: "logo", value: response?.data?.logo, errors: [] },
      ]);
      setIsUploading(false);
    },
    onError: () => {
      notification.error({
        message: "Couldn't upload logo!",
        placement: "bottomRight",
      });
      setIsUploading(false);
      setLogo(null);
    },
  });

  const storeLink = useMemo(
    () => process?.env?.REACT_APP_CLIENT_URL || "",
    [storeUrl]
  );

  useEffect(() => {
    const {
      theme: { ...restTheme } = {},
      otherCharges: { value: otherCharges, type: otherChargesType } = {},
      tax: { value: tax, type: taxType } = {},
      logo: storeLogo,
      logoText,
      termsOfService,
      privacyPolicy,
      isOnlinePaymentEnabled,
      domain,
    } = storeSettings || {};

    if (storeLogo) setLogo(storeLogo);
    form.setFieldsValue({
      ...restTheme,
      logo: storeLogo,
      logoText,
      otherCharges,
      otherChargesType,
      tax,
      taxType,
      isOnlinePaymentEnabled,
      domain,
    });
    termsForm.setFieldsValue({ termsOfService, privacyPolicy });
  }, [storeSettings, form, termsForm]);

  const uploadImage = ({ file }) => {
    if (!uploadLogo) {
      notification.error({
        message: "uploadLogo not provided",
        placement: "bottomRight",
      });
      return;
    }
    const formData = new FormData();
    formData.append("fileName", new Date().getTime());
    formData.append("logo", file);
    setIsUploading(true);
    uploadLogoMutation.mutate(formData);
  };

  const onRemoveLogo = (file) => {
    try {
      if (file?.fileId) {
        setFilesToDelete((images) => [...images, file]);
      }
      setLogo(null);
      form.setFields([{ name: "logo", value: undefined, errors: [] }]);
    } catch (e) {
      // noop
    }
  };

  const suffixSelectorPrice = (name) => (
    <Form.Item name={name} noStyle initialValue="VALUE">
      <Select style={{ width: 70 }}>
        <Select.Option value="PERCENTAGE">%</Select.Option>
        <Select.Option value="VALUE">₹</Select.Option>
      </Select>
    </Form.Item>
  );

  const onSubmit = (values) => {
    const { otherCharges, otherChargesType, tax, taxType, logo: formLogo = null, ...rest } =
      values;

    const payload = {
      filesToDelete,
      logo: formLogo,
      ...rest,
    };

    if (otherCharges) {
      payload.otherCharges = {
        value: otherCharges,
        type: otherChargesType,
      };
    }

    if (tax) {
      payload.tax = {
        value: tax,
        type: taxType,
      };
    }

    updateStoreSettingsMutation.mutate(payload);
  };

  const onSubmitTerms = (values) => {
    updateStoreMutation.mutate(values);
  };

  return (
    <>
      <PageHeader title="Store settings" />
      <LayoutContent>
        {isFetchingStoreSettings ? (
          <FullPageSpinner />
        ) : (
          <>
            <Space direction="vertical">
              {storeLink ? (
                <Alert
                  message={
                    <p>
                      Your store is live at:{" "}
                      <a href={storeLink} target="_blank" rel="noreferrer">
                        {storeLink}
                      </a>
                    </p>
                  }
                />
              ) : null}
              <FormSectionHeader>Theme</FormSectionHeader>
            </Space>
            <Form
              form={form}
              layout="vertical"
              name="store-settings"
              onFinish={onSubmit}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              initialValues={{}}
              autoComplete="off"
            >
              <Form.Item label="Logo" name="logo">
                <ImgCrop aspect={15 / 6}>
                  <Upload
                    onRemove={onRemoveLogo}
                    fileList={logo ? [logo] : []}
                    listType="picture"
                    customRequest={uploadImage}
                  >
                    <Button loading={isUploading || uploadLogoMutation.isPending}>
                      Upload
                    </Button>
                  </Upload>
                </ImgCrop>
              </Form.Item>
              <Row gutter={16}>
                <Col sm={12} md={8}>
                  <Form.Item label="Domain" name="domain">
                    <Input />
                  </Form.Item>
                </Col>
                <Col sm={12} md={8}>
                  <Form.Item
                    rules={[{ required: true, message: "Please input logo text!" }]}
                    label="Logo text"
                    name="logoText"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col sm={12} md={8}>
                  <Form.Item
                    rules={[{ required: true, message: "Please input brand color!" }]}
                    label="Brand color"
                    name="brandColor"
                  >
                    <Input type="color" />
                  </Form.Item>
                </Col>
                <Col sm={12} md={8}>
                  <Form.Item
                    rules={[
                      { required: true, message: "Please input nav background color!" },
                    ]}
                    label="Nav background color"
                    name="navBackgroundColor"
                  >
                    <Input type="color" />
                  </Form.Item>
                </Col>
                <Col sm={12} md={8}>
                  <Form.Item
                    rules={[{ required: true, message: "Please input nav text color!" }]}
                    label="Nav text color"
                    name="navTextColor"
                  >
                    <Input type="color" />
                  </Form.Item>
                </Col>
              </Row>
              <FormSectionHeader>Cart</FormSectionHeader>
              <Row gutter={16}>
                <Col sm={12} md={8}>
                  <Form.Item
                    label="Tax"
                    name="tax"
                    rules={[
                      {
                        validator(_, value) {
                          if (value?.toString().trim() && isNaN(value)) {
                            return Promise.reject("Doesn't seem like a number!");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input addonAfter={suffixSelectorPrice("taxType")} />
                  </Form.Item>
                </Col>
                <Col sm={12} md={8}>
                  <Form.Item
                    label="Other charges"
                    name="otherCharges"
                    rules={[
                      {
                        validator(_, value) {
                          if (value?.toString().trim() && isNaN(value)) {
                            return Promise.reject("Doesn't seem like a number!");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input addonAfter={suffixSelectorPrice("otherChargesType")} />
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
                <Button
                  type="primary"
                  loading={updateStoreSettingsMutation.isPending}
                  size="large"
                  htmlType="submit"
                >
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
              autoComplete="off"
            >
              <Form.Item label="Terms of service" name="termsOfService" initialValue="">
                <ReactQuill />
              </Form.Item>
              <Form.Item label="Privacy policy" name="privacyPolicy" initialValue="">
                <ReactQuill />
              </Form.Item>
              <SubmitWrapper wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  type="primary"
                  loading={updateStoreMutation.isPending}
                  size="large"
                  htmlType="submit"
                >
                  Submit
                </Button>
              </SubmitWrapper>
            </Form>
          </>
        )}
      </LayoutContent>
    </>
  );
};

const StoreSettingsPage = (props) => (
  <QueryBoundary>
    <StoreSettings {...props} />
  </QueryBoundary>
);

export default StoreSettingsPage;


