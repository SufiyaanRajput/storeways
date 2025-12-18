import { Button, Layout, Table, notification, Modal } from "antd";
import { useEffect, useState } from "react";
import { PageHeader, ActionText } from "../../styles/common";
import QueryBoundary from "../../internals/QueryBoundary";
import { TopActionWrapper } from "./styles";
import { useQuery, useMutation } from "@tanstack/react-query";
import AddEditCategory from "./AddEditCategoryComponent/AddEditCategoryComponent";
import {
  fetchCategories,
  deleteCategory,
  addCategory,
  updateCategory,
} from "./api";
const { Content } = Layout;

const Categories = () => {
  const [showAddModal, toggleAddModal] = useState(false);
  const [showEditModal, toggleEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const { data: categories = [], isFetching, refetch } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: async () => {
      if (!fetchCategories) return { data: { categories: [] } };
      return await fetchCategories();
    },
    select: (response) => {
      const list =
        response?.data?.categories ||
        response?.categories ||
        (Array.isArray(response) ? response : []);
      return (list || []).map((category) => ({
        key: category.id,
        id: category.id,
        name: category.name,
        parentName: category.parentName ? category.parentName : "--",
        parentId: category.parentId,
        status: category.active ? "Active" : "Inactive",
      }));
    },
    keepPreviousData: true,
  });

  const handleEdit = (record) => {
    setCategoryToEdit(record);
    toggleEditModal(true);
  };

  const deleteCategoryMutation = useMutation({
    mutationFn: async (payload) => {
      if (!deleteCategory) throw new Error("deleteCategory not provided");
      return await deleteCategory(payload);
    },
    onSuccess: async () => {
      notification.success({
        message: "Category deleted!",
        placement: "bottomRight",
      });
      await refetch();
      setIsDeletingId(null);
    },
    onError: () => {
      notification.error({
        message: "Couldn't delete category!",
        placement: "bottomRight",
      });
      setIsDeletingId(null);
    },
  });

  const onDelete = (record) => {
    if (!deleteCategory) return;
    Modal.confirm({
      title: "Are you sure?",
      content:
        "Deleting this category will delete all the variations and products related to it as well.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      okButtonProps: { loading: isDeletingId === record.key || deleteCategoryMutation.isPending },
      onOk() {
        setIsDeletingId(record.key);
        deleteCategoryMutation.mutate({ id: record.key });
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
      title: "Parent",
      dataIndex: "parentName",
      key: "parentName",
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
      render: (text, record) => <>
        <ActionText onClick={() => handleEdit(record)}>Edit</ActionText> | <ActionText type="delete" onClick={() => onDelete(record)}>Delete</ActionText>
      </>,
    },
  ];

  return (
    <>
      {showAddModal && (
        <AddEditCategory
          visible={showAddModal}
          toggle={toggleAddModal}
          categories={categories}
          refetch={refetch}
          addCategory={addCategory}
          updateCategory={updateCategory}
        />
      )}
      {showEditModal && (
        <AddEditCategory
          visible={showEditModal}
          toggle={toggleEditModal}
          category={categoryToEdit}
          categories={categories}
          refetch={refetch}
          addCategory={addCategory}
          updateCategory={updateCategory}
        />
      )}
      <PageHeader className="site-page-header" title="Categories" />
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
          >
            Add new
          </Button>
        </TopActionWrapper>
        <Table dataSource={categories} columns={columns} loading={isFetching} />
      </Content>
    </>
  );
};

const CategoriesListPage = (props) => (
  <QueryBoundary>
    <Categories {...props} />
  </QueryBoundary>
);

export default CategoriesListPage;


