import { Form, Select, Card, Button, Input, Upload, Collapse, notification } from "antd";
import ImgCrop from 'antd-img-crop';
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { updateLayoutSection, uploadBannerImage } from "../../api";
import { SketchPicker } from 'react-color';
import {useAsyncFetch} from "../../../../../utils/hooks";
import { FormSectionHeader, SubmitWrapper } from "../../../styles";

const BaseForm = ({isUploading, uploadImage, onRemove, name, restField={}, images, onColorChange}) => {
  const alignmentMap = [{
    key: 'Center',
    value: 'center'
  }, {
    key: 'Left',
    value: 'flex-start'
  }, {
    key: 'Right',
    value: 'flex-end'
  }];

  const verticalAlignmentMap = [{
    key: 'Center',
    value: 'center'
  }, {
    key: 'Top',
    value: 'flex-start'
  }, {
    key: 'Bottom',
    value: 'flex-end'
  }];

  const isUploadingBanner = () => {
    if (name) {
      return isUploading[name] !== undefined;
    }

    return isUploading === true;
  }

  return(
    <>
      <Form.Item
        {...restField}
        label="Banner"
        name={name !== undefined ? [name, 'banner'] : 'banner'}
        rules={[{ required: true, message: 'Please upload banner image!' }]}
      >
        <ImgCrop aspect={8/4}>
          <Upload
            onRemove={(e) => onRemove(e, name)}
            fileList={images}
            listType="picture"
            customRequest={(e) => uploadImage(e, name)}
          >
            {
              images.length < 1 && (
                <Button disabled={isUploadingBanner()} loading={isUploadingBanner()}>Upload</Button> 
                )
            }
          </Upload>
        </ImgCrop>
      </Form.Item>
    <Card style={{marginTop: '25px', marginBottom: '25px'}}>
      <FormSectionHeader>Call to action</FormSectionHeader>
      <Form.Item
        {...restField}
        label="Text"
        name={name !== undefined ? [name, 'ctaText'] : 'ctaText'}
        rules={[{ required: true, message: 'Please input cta text!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        {...restField}
        label="Link"
        name={name !== undefined ? [name, 'targetLink'] : 'targetLink'}
        rules={[{ required: true, message: 'Please input link!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        {...restField}
        label="Type"
        name={name !== undefined ? [name, 'ctaType'] : 'ctaType'}
        rules={[{ required: true, message: 'Please select button type!' }]}
      >
        <Select>
        {
          ['Primary', 'Default'].map(option => (
            <Select.Option key={option} value={option.toLowerCase()}>{option}</Select.Option>
          ))
        }
      </Select>
      </Form.Item>
      <Form.Item
        {...restField}
        label="Alignment"
        name={name !== undefined ? [name, 'ctaAlign'] : 'ctaAlign'}
        rules={[{ required: true, message: 'Please select button alignment!' }]}
      >
        <Select>
        {
          alignmentMap.map(({key, value}) => (
            <Select.Option key={key} value={value.toLowerCase()}>{key}</Select.Option>
          ))
        }
      </Select>
      </Form.Item>
    </Card>
    <Card style={{marginTop: '25px', marginBottom: '25px'}}>
      <FormSectionHeader>Content</FormSectionHeader>
      <Form.Item
        {...restField}
        label="Title"
        name={name !== undefined ? [name, 'titleText'] : 'titleText'}
        rules={[{ required: true, message: 'Please input title!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        {...restField}
        valuePropName="color"
        label="Title color"
        name={name !== undefined ? [name, 'titleColor'] : 'titleColor'}
        rules={[{ required: true, message: 'Please title color!' }]}
      >
        <SketchPicker onChangeComplete={e => onColorChange(e, name, 'titleColor')}/>
      </Form.Item>
      <Form.Item
        {...restField}
        label="Background color"
        valuePropName="color"
        name={name !== undefined ? [name, 'titleBgColor'] : 'titleBgColor'}
        rules={[{ required: true, message: 'Please title background color!' }]}
      >
        <SketchPicker onChangeComplete={e => onColorChange(e, name, 'titleBgColor')}/>
      </Form.Item>
      <Form.Item
        {...restField}
        label="Vertical align"
        name={name !== undefined ? [name, 'alignVertical'] : 'alignVertical'}
        rules={[{ required: true, message: 'Please select button alignment!' }]}
        >
          <Select>
          {
          verticalAlignmentMap.map(({key, value}) => (
            <Select.Option key={key} value={value.toLowerCase()}>{key}</Select.Option>
          ))
        }
        </Select>
      </Form.Item>
      <Form.Item
        {...restField}
        label="Horizontal align"
        name={name !== undefined ? [name, 'alignHorizontal'] : 'alignHorizontal'}
        rules={[{ required: true, message: 'Please select button alignment!' }]}>
        <Select>
          {
            ['Left', 'Right', 'Center'].map(option => (
              <Select.Option key={option + 'ah'} value={option.toLowerCase()}>{option}</Select.Option>
            ))
          }
        </Select>
      </Form.Item>
    </Card>
    </>
)
};

const BannerCarouselForm = ({defaultValues=[], type, refetchLayout, setSectionToEdit}) => {
  const [images, setImages] = useState([]);
  const [filesToDelete, setFilesToDelete] = useState([]);
  const [isUploading, setIsUploading] = useState([]);
  const [form] = useForm();

  const {
    isLoading: updatingLayoutSection,
    success: updateLayoutSectionSuccess,
    error: updateLayoutSectionError,
    refetch: reupdateLayoutSection
  } = useAsyncFetch(false, updateLayoutSection);

  const { Panel } = Collapse;

  useEffect(() => {
    if (updateLayoutSectionSuccess) {
      refetchLayout({page: 'home'});
      setSectionToEdit(null);
      notification.success({
        message: 'Layout section updated successfully!',
        placement: 'bottomRight'
      });
    }
  }, [updateLayoutSectionSuccess, refetchLayout, setSectionToEdit]);

  useEffect(() => {
    if (updateLayoutSectionError) {
      notification.error({
        message: 'Layout section unsuccessfull!',
        placement: 'bottomRight'
      });
    }
  }, [updateLayoutSectionError]);

  useEffect(() => {
    if (type.id !== 'BANNER') {
      const initialValues = defaultValues.reduce((values, item) => {
        const { 
          align: {horizontal, vertical} = {}, 
          banner,
          cta: {align, text, type, targetLink: targetCTALink}, 
          title: {bgColor: titleBgColor, color: titleColor, text: titleText}
         } = item;
  
         setImages(images => [...images, banner]);
         values = [
          ...values,
          {
            banner,
            alignHorizontal: horizontal,
            titleColor,
            alignVertical: vertical,
            ctaAlign: align,
            targetLink: targetCTALink,
            ctaText: text,
            ctaType: type,
            titleBgColor,
            titleText,
          }
         ];
  
         return values;
      }, []);
  
      form.setFields([{ name: 'banners', value: initialValues, errors: [] }]);
    } else {
      const { 
        align: {horizontal, vertical} = {}, 
        banner,
        cta: {align, text, type, targetLink: targetCTALink}, 
        title: {bgColor: titleBgColor, color: titleColor, text: titleText}
       } = defaultValues;

       setImages([banner]);

       form.setFieldsValue({
        banner,
        alignHorizontal: horizontal,
        titleColor,
        alignVertical: vertical,
        ctaAlign: align,
        targetLink: targetCTALink,
        ctaText: text,
        ctaType: type,
        titleBgColor,
        titleText,
      });
    }
  }, [defaultValues, form, type.id]);

  const onColorChange = (e, index, name) => {
    if (type.id !== 'BANNER') {
      const fields = form.getFieldsValue();
      const updated = fields.banners.map((field, i) => {
        if (index === i) field[name] = e.rgb;

        return {...field};
      });
      form.setFields([{ name: 'banners', value: updated, errors: [] }]); 
    } else {
      form.setFields([{ name, value: e.rgb, errors: [] }]); 
    }
  }

  const uploadImage = ({file}, index) => {
    const fields = form.getFieldsValue();
    const formData = new FormData();
    formData.append('fileName', new Date().getTime());
    formData.append('banner', file);

    if (type.id !== 'BANNER') {
      setIsUploading(state => [...state, index]);
    } else {
      setIsUploading(true);
    }

    uploadBannerImage(formData).then((response) => {
      if (type.id !== 'BANNER') {
        const updated = fields.banners.map((field, i) => {
          if (index === i) field.banner = response.data.banner;
  
          return {...field};
        });
        
        setIsUploading(state => state.filter(s => s !== index));
  
        setImages((images) => {
          return images.map((image, i) => {
            if (i === index) image = {...response.data.banner};
            return {...image};
          })
        });
        form.setFields([{ name: 'banners', value: updated, errors: [] }]);
      } else {
        setIsUploading(false);
        setImages([response.data.banner]);
        form.setFields([{ name: 'banner', value: response.data.banner, errors: [] }]);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  const onRemove = async (e, index) => {
    try{
      const fields = form.getFieldsValue();

      if (e.fileId) {
        setFilesToDelete(images => [...images, e]);
      }

      if (type.id !== 'BANNER') {
        const updated = fields.banners.map((field, i) => {
          if (index === i) field.banner = undefined;
  
          return {...field};
        });
  
        setImages((images) => {
          return images.map((image, i) => {
            if (i === index) return undefined;
            return {...image};
          })
        });
        form.setFields([{ name: 'banners', value: updated, errors: [] }]);
      } else {
        setImages([]);
        form.setFields([{ name: 'banner', value: undefined, errors: [] }]);
      }
    }catch(e) {
      console.log(e);
    }
  }

  const onSubmit = (values) => {
  const key = type.id === 'CAROUSEL' ? 'banners' : 'banner';

  if (type.id !== 'BANNER') {
    const {banners} = values;
    var payload = {
      [key]: banners.map((banner) => ({ 
        align: {horizontal: banner.alignHorizontal, vertical: banner.alignVertical}, 
        banner: banner.banner, 
        cta: {align: banner.ctaAlign, text: banner.ctaText, type: banner.ctaType, targetLink: banner.targetLink}, 
        title: {bgColor: banner.titleBgColor, text: banner.titleText, color: banner.titleColor}
       })),
       filesToDelete,
    }
  } else {
    var payload = {
      [key]: { 
        align: {horizontal: values.alignHorizontal, vertical: values.alignVertical}, 
        banner: values.banner, 
        cta: {align: values.ctaAlign, text: values.ctaText, type: values.ctaType, targetLink: values.targetLink}, 
        title: {bgColor: values.titleBgColor, text: values.titleText, color: values.titleColor}
       },
       filesToDelete,
    }
  }

    reupdateLayoutSection({page: 'home', sectionId: type.id, ...payload});
  }

  return(
    <Form name="banner-form" 
      layout="vertical" 
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }} 
      onFinish={onSubmit} 
      autoComplete="off">
    {
      type.id === 'BANNER' ?
      <BaseForm uploadImage={uploadImage} 
        onRemove={onRemove}
        isUploading={isUploading}
        onColorChange={onColorChange}
        images={images}/> :
      
      <Form.List name="banners" >
        {(fields, { add, remove }) => (
          <>
          <Collapse collapsible="header" defaultActiveKey={['0']}>
            {fields.map(({ key, name, ...restField }, i) => (
                <Panel header={`Banner ${i+1}`} key={key} extra={<p style={{color: 'red', cursor: 'pointer'}} onClick={(e) => {
                  e.stopPropagation();
                  remove(name);
                }}>Delete</p>}>
                  <BaseForm uploadImage={uploadImage} 
                    onRemove={onRemove}
                    isUploading={isUploading}
                    name={name}
                    onColorChange={onColorChange}
                    images={images[i] ? [images[i]] : []}
                    restField={restField}/>
                </Panel>
            ))}
           </Collapse>
           <Form.Item>
           <Button type="dashed" style={{marginTop: 25}} onClick={() => add()} block>
             Add field
           </Button>
         </Form.Item>
         </>
        )}
      </Form.List>
    }
    <SubmitWrapper wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" loading={updatingLayoutSection} size="large" htmlType="submit">
        Submit
      </Button>
    </SubmitWrapper>
  </Form>
  )
};

export default BannerCarouselForm;