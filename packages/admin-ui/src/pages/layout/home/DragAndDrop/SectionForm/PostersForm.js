import { Upload, Button, notification, Form, Space, Divider, Input } from "antd";
import { SubmitWrapper } from "../../../../../styles";
import ImgCrop from "antd-img-crop";
import { useState, useEffect } from "react";
import { useForm } from "antd/lib/form/Form";
import { useMutation } from "@tanstack/react-query";

const PostersForm = ({ type, refetchLayout, setSectionToEdit, updateLayoutSection, uploadPosterImage }) => {
  const [images, setImages] = useState([]);
  const [filesToDelete, setFilesToDelete] = useState([]);
  const [isUploading, setIsUploading] = useState([]);
  const [form] = useForm();

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

  useEffect(() => {
    if (type.items) {
      setImages(type.items.map((item) => ({ ...item.poster })));
      form.setFields([{ name: "posters", value: type.items.map((item) => ({ ...item })), errors: [] }]);
    }
  }, [form, type.items]);

  const handleDeleteImage = (e, index) => {
    try {
      const fields = form.getFieldsValue();

      if (e.fileId) {
        setFilesToDelete((imgs) => [...imgs, e]);
      }

      const updated = fields.posters.map((field, i) => {
        if (index === i) field.poster = undefined;
        return { ...field };
      });

      setImages((imgs) =>
        imgs.map((image, i) => {
          if (i === index) return undefined;
          return { ...image };
        })
      );

      form.setFields([{ name: "posters", value: updated, errors: [] }]);
    } catch (err) {
      // noop
    }
  };

  const uploadImage = ({ file }, index) => {
    if (!uploadPosterImage) {
      notification.error({
        message: "uploadPosterImage not provided",
        placement: "bottomRight",
      });
      return;
    }
    const fields = form.getFieldsValue();
    const formData = new FormData();
    formData.append("fileName", new Date().getTime());
    formData.append("poster", file);

    setIsUploading((state) => [...state, index]);

    uploadPosterImage(formData)
      .then((response) => {
        const updated = fields.posters.map((field, i) => {
          if (index === i) field.poster = response.data.poster;
          return { ...field };
        });

        setIsUploading((state) => state.filter((s) => s !== index));

        setImages((imgs) =>
          imgs.map((image, i) => {
            if (i === index) image = { ...response.data.poster };
            return { ...image };
          })
        );
        form.setFields([{ name: "posters", value: updated, errors: [] }]);

        notification.success({
          message: "Upload poster successful!",
          placement: "bottomRight",
        });
      })
      .catch(() => {
        notification.error({
          message: "Upload poster unsuccessful!",
          placement: "bottomRight",
        });
        setIsUploading((state) => state.filter((s) => s !== index));
      });
  };

  const onSubmit = (values) => {
    updateSectionMutation.mutate({ page: "home", sectionId: type.id, ...values, filesToDelete });
  };

  return (
    <Form
      name="posters-form"
      layout="vertical"
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      onFinish={onSubmit}
      autoComplete="off"
    >
      <Form.List name="posters">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, i) => (
              <Space key={key} style={{ display: "block", marginBottom: 25 }} align="baseline">
                <Divider>Feature {i + 1}</Divider>
                <Form.Item
                  {...restField}
                  label="Poster"
                  name={[name, "poster"]}
                  rules={[{ required: true, message: "Please upload poster image!" }]}
                >
                  <ImgCrop aspect={1 / 1}>
                    <Upload
                      onRemove={(e) => handleDeleteImage(e, name)}
                      customRequest={(e) => uploadImage(e, name)}
                      listType="picture"
                      fileList={images[name] ? [images[name]] : []}
                    >
                      {!images[name] && (
                        <Button disabled={isUploading.some((a) => a === name)} loading={isUploading.some((a) => a === name)}>
                          Upload
                        </Button>
                      )}
                    </Upload>
                  </ImgCrop>
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Link"
                  name={[name, "targetLink"]}
                  rules={[{ required: true, message: "Missing link" }]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item {...restField} label="Alt description" name={[name, "alt"]}>
                  <Input />
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

export default PostersForm;


