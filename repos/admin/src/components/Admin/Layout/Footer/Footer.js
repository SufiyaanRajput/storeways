import { PageHeader, LayoutContent, FullPageSpinner } from "../../styles";
import { Form, Input, Button, Space, Row, Col, Card, Collapse, notification, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { SubmitWrapper } from "../../styles";
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useState } from "react";
import { SketchPicker } from 'react-color';
import { Panel } from "./styles";
import {useAsyncFetch} from "../../../../utils/hooks";
import { updateFooter, getFooterSettings, uploadFooterLogoImage } from "../api";

const Footer = () => {
  const [form] = useForm();
  const [logo, setLogo] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [filesToDelete, setFilesToDelete] = useState([]);

  const {
    isLoading: isFetchingFooter,
    refetch: refetchFooter,
    response: footerSettingsResponse,
    success: fetchingFooterSuccess,
    error: fetchingFooterError,
  } = useAsyncFetch(true, getFooterSettings);

  const {
    isLoading: isUpdatingFooter,
    refetch: reupdateFooter,
    success: updateFooterSuccess,
    error: updateFooterError,
  } = useAsyncFetch(false, updateFooter);

  useEffect(() => {
    if (updateFooterSuccess) {
      notification.success({
        message: `Footer updated!`,
        placement: 'bottomRight'
      });
      refetchFooter();
      setFilesToDelete([]);
    }
  }, [updateFooterSuccess, refetchFooter]);

  useEffect(() => {
    if (fetchingFooterSuccess) {
      const {logo, ...rest} = footerSettingsResponse.data.footer;
      setLogo(logo ? [logo] : []);
      form.setFieldsValue({logo, ...rest});
    }
  }, [fetchingFooterSuccess, footerSettingsResponse.data, form]);

  useEffect(() => {
    if (fetchingFooterError) {
      notification.error({
        message: `Could not get footer settings!`,
        placement: 'bottomRight'
      });
    }
  }, [fetchingFooterError]);

  useEffect(() => {
    if (updateFooterError) {
      notification.error({
        message: `Footer not updated!`,
        placement: 'bottomRight'
      });
    }
  }, [updateFooterError]);

  const onColorChange = (e) => {
    form.setFields([{ name: 'bgColor', value: e.rgb, errors: [] }]);
  }

  const onSubmit = (values) => {
    reupdateFooter({...values, filesToDelete});
  }

  const onRemoveLogo = (e) => {
    try{
      if (e.fileId) {
        setFilesToDelete(files => [...files, e]);
      }

      setLogo([]);
      form.setFields([{ name: 'logo', value: null, errors: [] }]);
    }catch(e) {
      console.log(e);
    }
  }

  const uploadImage = ({file}) => {
    const formData = new FormData();
    formData.append('fileName', new Date().getTime());
    formData.append('logo', file);
    setIsUploading(true);

    uploadFooterLogoImage(formData).then((response) => {
      setIsUploading(false);
      setLogo([response.data.logo]);
      form.setFields([{ name: 'logo', value: response.data.logo, errors: [] }]);
    }).catch((error) => {
      console.log(error);
    });
  }

  return(
    <>
      <PageHeader
        title="Customise footer"
        // breadcrumb={{ routes }} 
      />
      <LayoutContent>
        {
          isFetchingFooter ?
          <FullPageSpinner /> :
          <Form name="footer-form" 
          layout="vertical" 
          form={form}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }} 
          onFinish={onSubmit} 
          autoComplete="off">
          <Row gutter={16}>
            <Col sm={12}>
            <Form.Item
              label="Footer logo"
              name="logo"
            >
              <ImgCrop aspect={25/6}>
                <Upload
                  onRemove={onRemoveLogo}
                  fileList={logo}
                  listType="picture"
                  customRequest={uploadImage}
                >
                  {
                    !logo.length && (
                      <Button disabled={isUploading} loading={isUploading}>Upload</Button> 
                      )
                  }
                </Upload>
              </ImgCrop>
            </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                valuePropName="color"
                label="Background color"
                name={'bgColor'}
                rules={[{ required: true, message: 'Missing background color' }]}
              >
                <SketchPicker onChangeComplete={onColorChange}/>
              </Form.Item>
            </Col>
            <Col sm={24}>
              <Form.Item
                label="Summary"
                name="summary"
              >
                <Input.TextArea rows={5} />
              </Form.Item>
            </Col>
            <Col sm={24}>
              <Form.Item
                label="Office Address"
                name="officeAddress"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                label="Phone"
                name="phone"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                label="Email"
                name="email"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col sm={24}>
              <Form.Item
                label="Copyright text"
                name="copyrightText"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col sm={24} md={6}>
              <Form.Item
                label="Facebook"
                name="facebook"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col sm={24} md={6}>
              <Form.Item
                label="Twitter"
                name="twitter"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col sm={24} md={6}>
              <Form.Item
                label="Instagram"
                name="instagram"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.List name="sections" >
            {(fields, { add, remove }) => (
              <>
               <Collapse collapsible="header" defaultActiveKey={['0']}>
                  {fields.map(({ key, name, ...restField }, i) => (
                    <Panel header={`Section ${i+1}`} key={key} extra={<p style={{color: 'red', cursor: 'pointer'}} onClick={(e) => {
                      e.stopPropagation();
                      remove(name);
                    }}>Delete</p>}>
                      <Card>
                        <Space style={{ display: 'block', marginBottom: 25 }} align="baseline">
                          <Form.Item
                            {...restField}
                            label="Title"
                            name={[name, 'title']}
                            rules={[{ required: true, message: 'Missing title' }]}
                          >
                            <Input style={{width: '100%'}} placeholder="Title" />
                          </Form.Item>
                          <Form.List name={[name, "links"]} >
                            {(fields, { add, remove }) => (
                              <>
                              <Collapse collapsible="header" defaultActiveKey={['0']}>
                                {fields.map(({ key, name, ...restField }, i) => (
                                  <Panel header={`Link ${i+1}`} key={key} extra={<p style={{color: 'red', cursor: 'pointer'}} onClick={(e) => {
                                    e.stopPropagation();
                                    remove(name);
                                  }}>Delete</p>}>
                                    <Space style={{ display: 'block', marginBottom: 15 }} align="baseline">
                                      <Form.Item
                                        {...restField}
                                        label="Title"
                                        name={[name, 'title']}
                                        rules={[{ required: true, message: 'Missing title' }]}
                                      >
                                        <Input />
                                      </Form.Item>
                                      <Form.Item
                                        {...restField}
                                        label="Link"
                                        name={[name, 'link']}
                                        rules={[{ required: true, message: 'Missing link' }]}
                                      >
                                        <Input />
                                      </Form.Item>
                                      <div style={{textAlign: 'center'}}>
                                        <Button onClick={() => remove(name)} danger type='primary'>Remove</Button>
                                      </div>
                                    </Space>
                                  </Panel>
                                ))}
                                </Collapse>
                                <Form.Item>
                                  <div style={{textAlign: 'center', marginTop: 15}}>
                                    <Button type="dashed" onClick={() => add()}>
                                      Add link
                                    </Button>
                                  </div>
                                </Form.Item>
                              </>
                            )}
                          </Form.List>
                        </Space>
                      </Card>
                    </Panel>
                  ))}
                </Collapse>
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block style={{marginTop: 25}}>
                    Add Section
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <SubmitWrapper wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" loading={isUpdatingFooter} size="large" htmlType="submit">
              Submit
            </Button>
          </SubmitWrapper>
        </Form>
        }
      </LayoutContent>
    </>
  );
}

export default Footer;