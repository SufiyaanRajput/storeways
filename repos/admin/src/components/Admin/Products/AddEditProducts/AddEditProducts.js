import { Button, Form, Input, Select, Card, Layout, notification, Row, Col, InputNumber, Upload, Alert, Space } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useForm } from 'antd/lib/form/Form';
import { useContext, useEffect, useState } from 'react';
import { PageHeader } from '../../styles';
import { useAsyncFetch } from '../../../../utils/hooks';
import { fetchCategories } from '../../Categories/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faMinusCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import ReactQuill from 'react-quill';
import { addProduct, updateProduct, addProductImage, deleteProductImage } from '../api';
import productContext from '../store/product';
import { useNavigate, useParams } from "react-router-dom";
import {FormSectionHeader, SubmitWrapper} from '../../styles';
import { VariationGroupCard } from './styles';

const AddEditProducts = observer(() => {
  const [form] = useForm();
  const params = useParams();
  const productStore = useContext(productContext);
  const navigate = useNavigate();
  const [variationOptionsByIndex, setVariationOptionsByIndex] = useState({});
  const [variations, setVariations] = useState([]);
  const [deleteFile, setDeleteFile] = useState(null);
  const [images, setImages] = useState([]);

  const {
    isLoading: fetchingCategories,
    response: categoriesResponse, 
    error: fetchCategoriesError, 
    success: fetchCategoriesSuccess,
  } = useAsyncFetch(true, fetchCategories);

  const {
    isLoading: creatingProduct,
    error: createProductError, 
    success: createProductSuccess,
    refetch: createProduct
  } = useAsyncFetch(false, addProduct);

  const {
    isLoading: updatingProductImage,
    error: updateProductImageError, 
    success: updateProductImageSuccess,
    response: updateProductImageResponse,
    refetch: readdProductImage
  } = useAsyncFetch(false, addProductImage);

  const {
    isLoading: deletingProductImage,
    error: deleteProductImageError, 
    success: deleteProductImageSuccess,
    refetch: redeleteProductImage
  } = useAsyncFetch(false, deleteProductImage);

  const {
    isLoading: updatingProduct,
    error: updateProductError, 
    success: updateProductSuccess,
    refetch: reupdateProduct
  } = useAsyncFetch(false, updateProduct);

  useEffect(() => {
    if (params.id && !toJS(productStore).key) {
      navigate('/products');
    }
  }, [navigate, params.id, productStore]);

  useEffect(() => {
    if (fetchCategoriesError) {
      notification.error({
        message: `Couldn't fetch categories!`,
        placement: 'bottomRight'
      });
    }
  }, [fetchCategoriesError]);

  useEffect(() => {
    if (createProductSuccess) {
      notification.success({
        message: 'Product added successfully!',
        placement: 'bottomRight'
      });
      form.resetFields();
      setImages([]);
    }
  }, [createProductSuccess, form]);

  useEffect(() => {
    if (createProductError) {
      notification.error({
        message: `Couldn't add product!`,
        placement: 'bottomRight'
      });
    }
  }, [createProductError]);

  useEffect(() => {
    if (updateProductSuccess) {
      notification.success({
        message: 'Product updated successfully!',
        placement: 'bottomRight'
      });

      navigate('/products');
    }
  }, [updateProductSuccess, form, navigate]);

  useEffect(() => {
    if (updateProductError) {
      notification.error({
        message: `Couldn't update product!`,
        placement: 'bottomRight'
      });
    }
  }, [updateProductError]);

  useEffect(() => {
    if (updateProductImageError) {
      notification.error({
        message: `Couldn't add image!`,
        placement: 'bottomRight'
      });

      setImages(images => {
        const clonedImages = [...images];
        clonedImages.pop();
        return clonedImages;
      });
    }
  }, [updateProductImageError]);

  useEffect(() => {
    if (deleteProductImageError) {
      notification.error({
        message: `Couldn't remove image!`,
        placement: 'bottomRight'
      });
      setImages(images => [...images, deleteFile]);
      setDeleteFile(null);
    }
  }, [deleteFile, deleteProductImageError]);

  useEffect(() => {
    if (deleteProductImageSuccess) {
      notification.success({
        message: `Image deleted succesfully!`,
        placement: 'bottomRight'
      });
      setDeleteFile(null);
    }
  }, [deleteProductImageSuccess]);

  useEffect(() => {
    if (updateProductImageSuccess) {
      setImages((images) => {
        const cloned = [...images];
        cloned.pop();
        cloned.push(updateProductImageResponse.data.image);

        return cloned;
      });
    }
  }, [updateProductImageSuccess, updateProductImageResponse]);

  useEffect(() => {
    if (params.id) {
      setImages(toJS(productStore.images) || []);
    }
  }, [params.id, productStore.images]);

  useEffect(() => {
    return () => {
      productStore.clearStore();
    }
  }, [productStore]);

  useEffect(() => {
    if (params.id && fetchCategoriesSuccess) {
      const categories = categoriesResponse.data.categories.filter(category => productStore.categoryIds.includes(category.id));
      categories.length && setVariations(categories.reduce((a, c) => {
        a.push(...c.variations);
        return a;
      }, []));;

      if (categories.length && productStore.variations.length) {
        let variationOptions = {};

        toJS(productStore.variations).forEach((selectedVariation, gi) => {
          variationOptions = {
            ...variationOptions,
            [gi]: {
              ...selectedVariation.variationGroup.reduce((indexOptions, group, i) => {
                const variation = categories.reduce((v, c) => {
                  if (!Object.keys(v).length) {
                    v = c.variations.find((variation) => variation.name === group.name) || {};
                  }
                  return v;
                }, {});
                indexOptions[i] = variation.options;

                return indexOptions;
              }, {}),
            }
          }
        });

        setVariationOptionsByIndex(variationOptions);
      }
    }
  }, [categoriesResponse, params.id, productStore, fetchCategoriesSuccess]);

  const onCategoryChange = (v) => {
    const categories = categoriesResponse.data.categories.filter(category =>  v.includes(category.id));
    setVariations(categories.reduce((a, c) => {
      a.push(...c.variations);
      return a;
    }, []));
  };

  const onVariationChange = (v, gi, i) => {
    console.log({v, gi, i})
    const selectedVariation = variations.find(({name}) => v === name);

    // TODO handle option clearance on variation clear
    setVariationOptionsByIndex(state => ({
      ...state, 
      [gi]: {
        ...state[gi],
        [i]: selectedVariation.options
      }
    }));

    // const currentVariation = form.getFieldValue('variations');
    // currentVariation[i].values = [];
    // form.setFields([{ name: 'variations', value: currentVariation, errors: [] }]);
  }

  const onSubmit = (product) => {
    const validImages = images.filter(image => image.fileId);

    if (!validImages.length) return;

    if (params.id) {
      return reupdateProduct({
        id: params.id,
        ...product,
        images: validImages,
      });
    }

    createProduct({images: validImages, ...product});
  }

  const uploadImage = ({file}) => {
    const form = new FormData();
    form.append('fileName', new Date().getTime());
    form.append('ext', file.name.split(".").pop());
    form.append('productImage', file);
    setImages(images => [...images, {status: 'uploading', percent: 50}]);
    readdProductImage(form);
  }

  const handleDeleteImage = ({file, fileList}) => {
    if (fileList.length < images.length) {
      setDeleteFile(file);
      setImages(fileList);
      redeleteProductImage({
        imageId: file.fileId,
      });
    }
  }

  return(
    <>
      <PageHeader
        className="site-page-header"
        title="Add product"
        // breadcrumb={{ routes }}
        />
        <Layout.Content
          className="site-layout-background"
          style={{
            overflow: 'scroll',
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff'
          }}>
        <Form
          layout="vertical"
          name="basic"
          form={form}
          onFinish={onSubmit}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{maxOrderQuantity: -1, ...toJS(productStore)}}
          autoComplete="off"
        >
          <Row gutter={51}>
            <Col md={14}>
              <FormSectionHeader>Basic Info</FormSectionHeader>
              <Row gutter={16}>
                <Col md={8}>
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input product name!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label="Category"
                    name="categoryIds"
                    rules={[{ required: true, message: 'Please select categories!' }]}
                  >
                    <Select loading={fetchingCategories} 
                      disabled={fetchingCategories} 
                      mode="multiple"
                      allowClear 
                      onChange={v => onCategoryChange(v)}>
                      {
                        fetchCategoriesSuccess ? categoriesResponse.data.categories.map((category) => (
                          <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>
                        )) : []
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label="SKU"
                    name="sku"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label="Stock"
                    name="stock"
                    rules={[{ required: true, message: 'Please input stock!' }]}
                  >
                    <InputNumber style={{width: '100%'}}/>
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please input price!' }, {
                      pattern: '^[0-9]{1,}(\.[0-9]{2})?$',
                      message: `Doesn't seem like a number`
                    }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label="Max order quantity"
                    name="maxOrderQuantity"
                    rules={[{
                      validator: (_, value) => {
                        if (!value || value == -1 || value > 0) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject('Only -1 or a number greater than 0 is allowed!');
                        }
                      }
                    }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={24}>
                  <Form.Item
                    label="Description"
                    name="description"
                    initialValue=""
                  >
                    <ReactQuill/>
                  </Form.Item>
                </Col>
                <Col md={24}>
                  <Form.Item
                    label="Return Policy"
                    name="returnPolicy"
                    initialValue=""
                  >
                    <ReactQuill/>
                  </Form.Item>
                </Col>
              </Row>
              <FormSectionHeader>Variations</FormSectionHeader>
              <Form.List
                name="variations">
                  {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ key, name, ...restField }, groupIndex) => (
                    <Form.Item
                      required={true}
                      key={key}
                    >
                      <VariationGroupCard>
                        <Row gutter={16}>
                            <Col md={24} style={{marginBottom: '12px'}}>
                              <Card>
                                <Form.List
                                  name={[name, "variationGroup"]}>
                                      {(fields, { add, remove }, { errors }) => (
                                    <>
                                      {fields.map(({ key, name, ...restField }, index) => (
                                        <Form.Item
                                          required={true}
                                          key={key}
                                        >
                                          <Card>
                                            <Row gutter={16}>
                                                <Col md={12}>
                                                  <Form.Item
                                                    label="Name"
                                                    {...restField}
                                                      validateTrigger={['onChange', 'onBlur']}
                                                      name={[name, 'name']}
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message: "Please fill a variant or delete this field.",
                                                        },
                                                      ]}
                                                  >
                                                    <Select onChange={v => onVariationChange(v, groupIndex, index)}>
                                                      {
                                                        variations.map((variation) => (
                                                          <Select.Option key={variation.name} value={variation.name}>{variation.name}</Select.Option>
                                                        ))
                                                      }
                                                    </Select>
                                                  </Form.Item>
                                                </Col>
                                                <Col md={12}>
                                                  <Form.Item
                                                    label="Option"
                                                    {...restField}
                                                    name={[name, 'value']}
                                                      validateTrigger={['onChange', 'onBlur']}
                                                      rules={[
                                                        {
                                                          required: true,
                                                          message: "Please fill a variant or delete this field.",
                                                        },
                                                      ]}
                                                    >
                                                    <Select>
                                                      {
                                                        variationOptionsByIndex[groupIndex] && variationOptionsByIndex[groupIndex][index] ? 
                                                          variationOptionsByIndex[groupIndex][index].map((option) => (
                                                            <Select.Option key={option} value={option}>{option}</Select.Option>
                                                          )) : []
                                                      }
                                                    </Select>
                                                  </Form.Item>
                                                </Col>
                                            </Row>
                                            <Button type="link" onClick={() => remove(name)} icon={<FontAwesomeIcon icon={faMinusCircle}/>}>
                                              Remove
                                            </Button>
                                          </Card>
                                        </Form.Item>
                                      ))}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => add()}
                                          icon={<FontAwesomeIcon icon={faPlus}/>}
                                        >
                                          Add field
                                        </Button>
                                        <Form.ErrorList errors={errors} />
                                      </Form.Item>
                                    </>
                                  )}
                                  </Form.List>
                                </Card>
                            </Col>
                            <Col md={8}>
                              <Form.Item
                                label="Price"
                                {...restField}
                                name={[name, 'price']}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[{ required: true, message: 'Please input price!' }, {
                                  pattern: '^[0-9]{1,}(\.[0-9]{2})?$',
                                  message: `Doesn't seem like a number`
                                }]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col md={8}>
                              <Form.Item
                                label="Max order quantity"
                                {...restField}
                                name={[name, 'maxOrderQuantity']}
                                rules={[{
                                  validator: (_, value) => {
                                    if (!value || value == -1 || value > 0) {
                                      return Promise.resolve();
                                    } else {
                                      return Promise.reject('Only -1 or a number greater than 0 is allowed!');
                                    }
                                  }
                                }]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col md={8}>
                              <Form.Item
                                label="Stock"
                                {...restField}
                                name={[name, 'stock']}
                                rules={[{ required: true, message: 'Please input stock!' }]}
                              >
                                <InputNumber style={{width: '100%'}}/>
                              </Form.Item>
                            </Col>
                        </Row>
                        <Button type="link" onClick={() => remove(name)} icon={<FontAwesomeIcon icon={faMinusCircle}/>}>
                          Remove
                        </Button>
                      </VariationGroupCard>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<FontAwesomeIcon icon={faPlus}/>}
                    >
                      Add field
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
              </Form.List>
            </Col>
            <Col md={10}>
              <FormSectionHeader>Product Images</FormSectionHeader>
              {/* <Alert message="Please upgrade to upload more than 3 images" type="info" showIcon style={{marginBottom: '15px'}} /> */}
              {
                images.length < 1 &&
                <Alert message="Please uplaod atleast one image" type="error" showIcon style={{marginBottom: '15px'}} />
              }
                <ImgCrop aspect={3/4}>
                  <Upload
                    onChange={handleDeleteImage}
                    customRequest={uploadImage}
                    listType="picture-card"
                    fileList={images}
                    disabled={updatingProductImage}
                    onPreview={() => {}}
                  >
                    {images.length >= 9 ? null : (
                      <div>
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </ImgCrop>
            </Col>
          </Row>
          <SubmitWrapper wrapperCol={{ offset: 8, span: 16 }}>
            <Button disabled={creatingProduct || updatingProduct} size="large" onClick={() => navigate('/products')}>
              Cancel
            </Button>
            <Button type="primary" loading={creatingProduct || updatingProduct} size="large" htmlType="submit">
              Submit
            </Button>
          </SubmitWrapper>
        </Form>
      </Layout.Content>
    </>
  )});

export default AddEditProducts;