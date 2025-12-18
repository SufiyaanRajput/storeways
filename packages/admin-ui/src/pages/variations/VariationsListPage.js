import { Button, Layout, Table, notification, Modal, Tag } from "antd";
import { useEffect, useState } from "react";
import { PageHeader, ActionText } from "../../styles/common";
import QueryBoundary from "../../internals/QueryBoundary";
import { TopActionWrapper } from "./styles";
import { useQuery, useMutation } from "@tanstack/react-query";
import AddEditVariation from "./AddEditVariationComponent/AddEditVariationComponent";
import {
  fetchVariations,
  deleteVariation,
  addVariation,
  updateVariation,
} from "./api";
import { fetchCategories as fetchCategoriesApi } from "../categories/api";

const { Content } = Layout;

const Variations = () => {
  const [showAddModal, toggleAddModal] = useState(false);
  const [showEditModal, toggleEditModal] = useState(false);
  const [variationToEdit, setVariationToEdit] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const {
    data: categories = [],
    isFetching: isFetchingCategories,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["adminCategoriesForVariations"],
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

  const {
    data: variations = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["adminVariations"],
    queryFn: async () => {
      if (!fetchVariations) return { data: { variations: [] } };
      return await fetchVariations();
    },
    select: (response) => {
      const list =
        response?.data?.variations ||
        response?.variations ||
        (Array.isArray(response) ? response : []);
      return (list || []).map((variation) => ({
        key: variation.id,
        name: variation.name,
        status: variation.active ? "Active" : "Inactive",
        categoryName: variation.category?.name,
        category: variation.category?.id,
        options: Array.isArray(variation.options) ? variation.options : [],
      }));
    },
    keepPreviousData: true,
  });

  const deleteVariationMutation = useMutation({
    mutationFn: async (payload) => {
      if (!deleteVariation) throw new Error("deleteVariation not provided");
      return await deleteVariation(payload);
    },
    onSuccess: async () => {
      notification.success({
        message: "Variation deleted!",
        placement: "bottomRight",
      });
      await refetch();
      setIsDeletingId(null);
    },
    onError: () => {
      notification.error({
        message: "Couldn't delete variation!",
        placement: "bottomRight",
      });
      setIsDeletingId(null);
    },
  });

  const handleEdit = (record) => {
    setVariationToEdit(record);
    toggleEditModal(true);
  };

  const onDelete = (record) => {
    if (!deleteVariation) return;
    Modal.confirm({
      title: "Are you sure delete this variation?",
      content:
        "Deleting this variation will also remove variations from the products containing it.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      okButtonProps: {
        loading:
          isDeletingId === record.key || deleteVariationMutation.isPending,
      },
      onOk() {
        setIsDeletingId(record.key);
        deleteVariationMutation.mutate({ id: record.key });
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <>
          <ActionText onClick={() => handleEdit(record)}>Edit</ActionText> |{" "}
          <ActionText type="delete" onClick={() => onDelete(record)}>
            Delete
          </ActionText>
        </>
      ),
    },
  ];

  const makeExpandContent = (record) => {
    return (
      <div>
        {(record.options || []).map((option, i) => (
          <Tag key={i}>{option}</Tag>
        ))}
      </div>
    );
  };

  return (
    <>
      {showAddModal && (
        <AddEditVariation
          visible={showAddModal}
          toggle={toggleAddModal}
          refetch={refetch}
          categories={categories}
          addVariation={addVariation}
          updateVariation={updateVariation}
        />
      )}
      {showEditModal && (
        <AddEditVariation
          visible={showEditModal}
          toggle={toggleEditModal}
          variation={variationToEdit}
          refetch={refetch}
          categories={categories}
          addVariation={addVariation}
          updateVariation={updateVariation}
        />
      )}
      <PageHeader className="site-page-header" title="Variations" />
      <Content
        className="site-layout-background"
        style={{
          margin: "24px 16px",
          padding: 24,
          minHeight: 280,
          background: "#fff",
        }}
      >
        <TopActionWrapper>
          <Button
            size="large"
            type="primary"
            onClick={() => toggleAddModal(true)}
            disabled={isFetchingCategories}
          >
            Add new
          </Button>
        </TopActionWrapper>
        <Table
          loading={isFetching}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => makeExpandContent(record),
          }}
          dataSource={variations}
        />
      </Content>
    </>
  );
};

const VariationsListPage = (props) => (
  <QueryBoundary>
    <Variations {...props} />
  </QueryBoundary>
);

export default VariationsListPage;


