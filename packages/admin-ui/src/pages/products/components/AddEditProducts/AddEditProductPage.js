import {
  Button,
  Form,
  Input,
  Select,
  Card,
  Layout,
  notification,
  Row,
  Col,
  InputNumber,
  Upload,
  Alert,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import { get, set, cloneDeep } from "lodash";
import QueryBoundary from "../../../../internals/QueryBoundary";
import { PageHeader, FormSectionHeader, SubmitWrapper } from "../../../../styles";
import { VariationGroupCard } from "./styles";
import { useAtom, useSetAtom } from "jotai";
import { clearProductAtom, defaultProduct, productAtom } from "../../store/productAtom";
import { fetchCategories as fetchCategoriesApi } from "../../../categories/api";
import {
  addProduct as addProductApi,
  updateProduct as updateProductApi,
  addProductImage as addProductImageApi,
  deleteProductImage as deleteProductImageApi,
} from "../../api";

const { Content } = Layout;

const AddEditProduct = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const navigate = useNavigate();
  const [product] = useAtom(productAtom);
  const clearProduct = useSetAtom(clearProductAtom);

  const [variationOptionsByIndex, setVariationOptionsByIndex] = useState({});
  const [variations, setVariations] = useState([]);
  const [images, setImages] = useState([]);
  const [deleteFile, setDeleteFile] = useState(null);

  const isEdit = Boolean(params.id);

  const {
    data: categories = [],
    isFetching: fetchingCategories,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["adminCategoriesForProducts"],
    queryFn: async () => {
      if (!fetchCategoriesApi) return { data: { categories: [] } };
      return await fetchCategoriesApi();
    },
    select: (response) =>
      response?.data?.categories ||
      response?.categories ||
      (Array.isArray(response) ? response : []),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (categoriesError) {
      notification.error({
        message: "Couldn't fetch categories!",
        placement: "bottomRight",
      });
    }
  }, [categoriesError]);

  useEffect(() => {
    if (isEdit && !(product?.key || product?.id)) {
      navigate("/products");
    }
  }, [isEdit, navigate, product]);

  useEffect(() => {
    setImages(product?.images || []);
    form.setFieldsValue({ maxOrderQuantity: -1, ...product });
  }, [form, product]);

  useEffect(() => {
    return () => {
      clearProduct();
    };
  }, [clearProduct]);

  const categoryMap = useMemo(() => {
    if (!Array.isArray(categories)) return {};
    return categories.reduce((acc, c) => {
      acc[c.id] = c;
      return acc;
    }, {});
  }, [categories]);

  useEffect(() => {
    if (isEdit && Array.isArray(product?.categoryIds) && categories.length) {
      const selected = product.categoryIds
        .map((id) => categoryMap[id])
        .filter(Boolean);
      const nextVariations = selected.reduce((acc, cat) => {
        acc.push(...(cat?.variations || []));
        return acc;
      }, []);
      setVariations(nextVariations);

      if (nextVariations.length && Array.isArray(product?.variations)) {
        let variationOptions = {};
        product.variations.forEach((selectedVariation, gi) => {
          variationOptions = {
            ...variationOptions,
            [gi]: {
              ...(selectedVariation.variationGroup || []).reduce(
                (indexOptions, group, i) => {
                  const variation = selected.reduce((v, c) => {
                    if (!Object.keys(v).length) {
                      v =
                        (c.variations || []).find(
                          (variationItem) => variationItem.name === group.name
                        ) || {};
                    }
                    return v;
                  }, {});
                  indexOptions[i] = variation.options || [];
                  return indexOptions;
                },
                {}
              ),
            },
          };
        });
        setVariationOptionsByIndex(variationOptions);
      }
    }
  }, [categoryMap, categories.length, isEdit, product]);

  const onCategoryChange = (categoryIds) => {
    const selected = categoryIds
      .map((id) => categoryMap[id])
      .filter(Boolean);
    setVariations(
      selected.reduce((acc, c) => {
        acc.push(...(c.variations || []));
        return acc;
      }, [])
    );
  };

  const onVariationChange = (value, groupIndex, index) => {
    const selectedVariation = (variations || []).find(({ name }) => value === name);
    setVariationOptionsByIndex((state) => ({
      ...state,
      [groupIndex]: {
        ...(state[groupIndex] || {}),
        [index]: selectedVariation?.options || [],
      },
    }));
  };

  const addProductMutation = useMutation({
    mutationFn: async (payload) => {
      return await addProductApi(payload);
    },
    onSuccess: () => {
      notification.success({
        message: "Product added successfully!",
        placement: "bottomRight",
      });
      form.resetFields();
      setImages([]);
      clearProduct();
    },
    onError: () => {
      notification.error({
        message: "Couldn't add product!",
        placement: "bottomRight",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (payload) => {
      return await updateProductApi(payload);
    },
    onSuccess: () => {
      notification.success({
        message: "Product updated successfully!",
        placement: "bottomRight",
      });
      clearProduct();
      navigate("/products");
    },
    onError: () => {
      notification.error({
        message: "Couldn't update product!",
        placement: "bottomRight",
      });
    },
  });

  const addProductImageMutation = useMutation({
    mutationFn: async (formData) => {
      return await addProductImageApi(formData);
    },
    onSuccess: (response) => {
      setImages((imgs) => {
        const cloned = [...imgs];
        cloned.pop();
        const image = response?.data?.image || response?.image;
        if (image) cloned.push(image);
        return cloned;
      });
    },
    onError: () => {
      notification.error({
        message: "Couldn't add image!",
        placement: "bottomRight",
      });
      setImages((imgs) => {
        const cloned = [...imgs];
        cloned.pop();
        return cloned;
      });
    },
  });

  const deleteProductImageMutation = useMutation({
    mutationFn: async (payload) => {
      return await deleteProductImageApi(payload);
    },
    onSuccess: () => {
      notification.success({
        message: "Image deleted successfully!",
        placement: "bottomRight",
      });
      setDeleteFile(null);
    },
    onError: () => {
      notification.error({
        message: "Couldn't remove image!",
        placement: "bottomRight",
      });
      setImages((imgs) => [...imgs, deleteFile].filter(Boolean));
      setDeleteFile(null);
    },
  });

  const onSubmit = (productPayload) => {
    const validImages = (images || []).filter((image) => image.fileId || image.uid);
    if (!validImages.length) {
      notification.error({
        message: "Please upload at least one image",
        placement: "bottomRight",
      });
      return;
    }

    if (isEdit) {
      return updateProductMutation.mutate({
        id: params.id,
        ...productPayload,
        images: validImages,
      });
    }

    addProductMutation.mutate({ images: validImages, ...productPayload });
  };

  const uploadImage = async (options, type = "product", meta = {}) => {
    const { file, onSuccess, onError } = options || {};
    const { variationIndex } = meta || {};
    const formData = new FormData();
    formData.append("fileName", new Date().getTime());
    formData.append("ext", file.name.split(".").pop());
    formData.append("productImage", file);

    if (type === "variant") {
      try {
        const response = await addProductImageMutation.mutateAsync(formData);
        const image = response?.data?.image || response?.image;
        if (!image) {
          throw new Error("Invalid image response");
        }

        if (typeof variationIndex === "number") {
          const variationsValue = cloneDeep(
            form.getFieldValue(["variations"]) || []
          );
          const imagesPath = [variationIndex, "images"];
          const currentImages = get(variationsValue, imagesPath, []);
          const nextImages = Array.isArray(currentImages)
            ? currentImages
            : [currentImages].filter(Boolean);

          image.status = "done";

          set(variationsValue, imagesPath, [...nextImages, image]);
          form.setFieldsValue({ variations: variationsValue });
        }

        onSuccess?.({ image }, file);
      } catch (error) {
        notification.error({
          message: "Couldn't add image!",
          placement: "bottomRight",
        });
        onError?.(error);
      }
      return;
    }

    setImages((imgs) => [...imgs, { status: "uploading", percent: 50 }]);
    addProductImageMutation.mutate(formData);
  };

  const handleDeleteImage = ({ file, fileList }) => {
    if (fileList.length < images.length) {
      setDeleteFile(file);
      setImages(fileList);
      deleteProductImageMutation.mutate({
        imageId: file.fileId,
      });
    }
  };

  const removeVariantImage = async (file) => {
    const imageId =
      file?.fileId || file?.response?.image?.fileId || file?.uid || file?.id;
    if (!imageId) return true;
    try {
      await deleteProductImageApi({ imageId });
      return true;
    } catch (error) {
      notification.error({
        message: "Couldn't remove image!",
        placement: "bottomRight",
      });
      return false;
    }
  };

  return (
    <>
      <PageHeader className="site-page-header" title="Add product" />
      <Content
        className="site-layout-background"
        style={{
          overflow: "scroll",
          margin: "24px 16px",
          padding: 24,
          minHeight: 280,
          background: "#fff",
        }}
      >
        <Form
          layout="vertical"
          name="add-edit-product"
          form={form}
          onFinish={onSubmit}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{
            maxOrderQuantity: -1,
            ...defaultProduct,
            ...product,
          }}
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
                    rules={[
                      { required: true, message: "Please input product name!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label="Category"
                    name="categoryIds"
                    rules={[
                      { required: true, message: "Please select categories!" },
                    ]}
                  >
                    <Select
                      loading={fetchingCategories}
                      disabled={fetchingCategories}
                      mode="multiple"
                      allowClear
                      onChange={(value) => onCategoryChange(value)}
                    >
                      {(categories || []).map((category) => (
                        <Select.Option key={category.id} value={category.id}>
                          {category.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item label="SKU" name="sku">
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label="Stock"
                    name="stock"
                    rules={[{ required: true, message: "Please input stock!" }]}
                  >
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                      { required: true, message: "Please input price!" },
                      {
                        pattern: "^[0-9]{1,}(\\.[0-9]{2})?$",
                        message: "Doesn't seem like a number",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label="Max order quantity"
                    name="maxOrderQuantity"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (!value || value === -1 || value > 0) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            "Only -1 or a number greater than 0 is allowed!"
                          );
                        },
                      },
                    ]}
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
                    <ReactQuill />
                  </Form.Item>
                </Col>
                <Col md={24}>
                  <Form.Item
                    label="Return Policy"
                    name="returnPolicy"
                    initialValue=""
                  >
                    <ReactQuill />
                  </Form.Item>
                </Col>
              </Row>
              <FormSectionHeader>Variations</FormSectionHeader>
              <Form.List name="variations">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, groupIndex) => (
                      <Form.Item required key={key}>
                        <VariationGroupCard>
                          <Form.Item
                            label="Variant Images"
                            {...restField}
                            name={[name, "images"]}
                            valuePropName="fileList"
                            getValueProps={(value) => ({ fileList: value })}
                          >
                            <ImgCrop aspect={3 / 4}>
                              <Upload
                                fileList={
                                  form.getFieldValue([
                                    "variations",
                                    name,
                                    "images",
                                  ]) || []
                                }
                                customRequest={(options) =>
                                  uploadImage(options, "variant", {
                                    variationIndex: name,
                                  })
                                }
                                onRemove={removeVariantImage}
                                listType="picture-card"
                                onPreview={() => {}}
                              >
                                <div>
                                  <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                              </Upload>
                            </ImgCrop>
                          </Form.Item>
                          <Row gutter={16}>
                            <Col md={24} style={{ marginBottom: "12px" }}>
                              <Card>
                                <Form.List name={[name, "variationGroup"]}>
                                  {(
                                    variationFields,
                                    { add: addVar, remove: removeVar },
                                    { errors: varErrors }
                                  ) => (
                                    <>
                                      {variationFields.map(
                                        (
                                          {
                                            key: vKey,
                                            name: vName,
                                            ...vRestField
                                          },
                                          index
                                        ) => (
                                          <Form.Item required key={vKey}>
                                            <Card>
                                              <Row gutter={16}>
                                                <Col md={12}>
                                                  <Form.Item
                                                    label="Name"
                                                    {...vRestField}
                                                    validateTrigger={[
                                                      "onChange",
                                                      "onBlur",
                                                    ]}
                                                    name={[vName, "name"]}
                                                    rules={[
                                                      {
                                                        required: true,
                                                        message:
                                                          "Please fill a variant or delete this field.",
                                                      },
                                                    ]}
                                                  >
                                                    <Select
                                                      onChange={(val) =>
                                                        onVariationChange(
                                                          val,
                                                          groupIndex,
                                                          index
                                                        )
                                                      }
                                                    >
                                                      {(variations || []).map(
                                                        (variation) => (
                                                          <Select.Option
                                                            key={variation.name}
                                                            value={
                                                              variation.name
                                                            }
                                                          >
                                                            {variation.name}
                                                          </Select.Option>
                                                        )
                                                      )}
                                                    </Select>
                                                  </Form.Item>
                                                </Col>
                                                <Col md={12}>
                                                  <Form.Item
                                                    label="Option"
                                                    {...vRestField}
                                                    name={[vName, "value"]}
                                                    validateTrigger={[
                                                      "onChange",
                                                      "onBlur",
                                                    ]}
                                                    rules={[
                                                      {
                                                        required: true,
                                                        message:
                                                          "Please fill a variant or delete this field.",
                                                      },
                                                    ]}
                                                  >
                                                    <Select>
                                                      {variationOptionsByIndex[
                                                        groupIndex
                                                      ] &&
                                                      variationOptionsByIndex[
                                                        groupIndex
                                                      ][index]
                                                        ? variationOptionsByIndex[
                                                            groupIndex
                                                          ][index].map(
                                                            (option) => (
                                                              <Select.Option
                                                                key={option}
                                                                value={option}
                                                              >
                                                                {option}
                                                              </Select.Option>
                                                            )
                                                          )
                                                        : []}
                                                    </Select>
                                                  </Form.Item>
                                                </Col>
                                              </Row>
                                              <Button
                                                type="link"
                                                onClick={() => removeVar(vName)}
                                                icon={
                                                  <FontAwesomeIcon
                                                    icon={faMinusCircle}
                                                  />
                                                }
                                              >
                                                Remove
                                              </Button>
                                            </Card>
                                          </Form.Item>
                                        )
                                      )}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => addVar()}
                                          icon={
                                            <FontAwesomeIcon icon={faPlus} />
                                          }
                                        >
                                          Add field
                                        </Button>
                                        <Form.ErrorList errors={varErrors} />
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
                                name={[name, "price"]}
                                validateTrigger={["onChange", "onBlur"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input price!",
                                  },
                                  {
                                    pattern: "^[0-9]{1,}(\\.[0-9]{2})?$",
                                    message: "Doesn't seem like a number",
                                  },
                                ]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col md={8}>
                              <Form.Item
                                label="Max order quantity"
                                {...restField}
                                name={[name, "maxOrderQuantity"]}
                                rules={[
                                  {
                                    validator: (_, value) => {
                                      if (!value || value === -1 || value > 0) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(
                                        "Only -1 or a number greater than 0 is allowed!"
                                      );
                                    },
                                  },
                                ]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col md={8}>
                              <Form.Item
                                label="Stock"
                                {...restField}
                                name={[name, "stock"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input stock!",
                                  },
                                ]}
                              >
                                <InputNumber style={{ width: "100%" }} />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Button
                            type="link"
                            onClick={() => remove(name)}
                            icon={<FontAwesomeIcon icon={faMinusCircle} />}
                          >
                            Remove
                          </Button>
                        </VariationGroupCard>
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<FontAwesomeIcon icon={faPlus} />}
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
              {images.length < 1 && (
                <Alert
                  message="Please upload at least one image"
                  type="error"
                  showIcon
                  style={{ marginBottom: "15px" }}
                />
              )}
              <ImgCrop aspect={3 / 4}>
                <Upload
                  onChange={handleDeleteImage}
                  customRequest={(options) => uploadImage(options, "product")}
                  listType="picture-card"
                  fileList={images}
                  disabled={addProductImageMutation.isPending}
                  onPreview={() => {}}
                >
                  <div>
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </ImgCrop>
            </Col>
          </Row>
          <SubmitWrapper wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              disabled={
                addProductMutation.isPending || updateProductMutation.isPending
              }
              size="large"
              onClick={() => navigate("/products")}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              loading={
                addProductMutation.isPending || updateProductMutation.isPending
              }
              size="large"
              htmlType="submit"
            >
              Submit
            </Button>
          </SubmitWrapper>
        </Form>
      </Content>
    </>
  );
};

const AddEditProductPage = (props) => (
  <QueryBoundary>
    <AddEditProduct {...props} />
  </QueryBoundary>
);

export default AddEditProductPage;

