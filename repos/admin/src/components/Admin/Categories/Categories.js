import { Button, Layout, Table, notification, Modal } from "antd";
import { PageHeader, ActionText, TopActionWrapper } from "./styles";
import AddEditCategory from "./AddEditCategory/AddEditCategory";
import { deleteCategory, fetchCategories } from "./api";
import { useAsyncFetch } from '../../../utils/hooks';
import { useState } from "react";
import { useEffect } from "react";
const { Content } = Layout;

const Categories = () => {
  const [showAddModal, toggleAddModal] = useState(false);
  const [showEditModal, toggleEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState({});
  const [categories, setCategories] = useState([]);
  const {isLoading, response, error, success, refetch: reftechCategories} = useAsyncFetch(true, fetchCategories);

  const {
    isLoading: deletingCategory, 
    error: deleteCategoryError, 
    success: deleteCategorySuccess, 
    refetch: redeleteCategory
  } = useAsyncFetch(false, deleteCategory);

  useEffect(() => {
    if (success) {
      setCategories(response.data.categories.map((category) => ({
        key: category.id,
        name: category.name,
        parentName: category.parentName ? category.parentName : '--',
        parentId: category.parentId,
        status: category.active ? 'Active' : 'Inactive'
      })));
    }
  }, [success, response]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: `Something went wrong!`,
        placement: 'bottomRight'
      })
    }
  }, [error]);

  useEffect(() => {
    if (deleteCategorySuccess) {
      notification.success({
        message: 'Category deleted!',
        placement: 'bottomRight'
      });
      reftechCategories();
    }
  }, [deleteCategorySuccess, reftechCategories]);

  useEffect(() => {
    if (deleteCategoryError) {
      notification.error({
        message: `Couldn't delete category!`,
        placement: 'bottomRight'
      })
    }
  }, [deleteCategoryError]);

  const handleEdit = (record) => {
    setCategoryToEdit(record);
    toggleEditModal(true);
  }

  const onDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'Deleting this category will delete all the variations and products related to it as well.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        redeleteCategory({id: record.key});
      },
      onCancel() {},
    });
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Parent',
      dataIndex: 'parentName',
      key: 'parentName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => <>
        <ActionText onClick={() => handleEdit(record)}>Edit</ActionText> | <ActionText type="delete" onClick={() => onDelete(record)}>Delete</ActionText>
      </>,
    },
  ];

  return(
    <>
      {
        showAddModal &&
        <AddEditCategory visible={showAddModal} 
          toggle={toggleAddModal} 
          categories={categories}
          reftechCategories={reftechCategories}/>
      }
      {
        showEditModal &&
        <AddEditCategory visible={showEditModal} t
          toggle={toggleEditModal} 
          category={categoryToEdit} 
          categories={categories}
          reftechCategories={reftechCategories}/>
      }
      <PageHeader
      className="site-page-header"
      title="Categories"
      // breadcrumb={{ routes }}
      />
      <Content
        className="site-layout-background"
        style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: '#fff'
        }}>
        <TopActionWrapper>
          <Button size="large" type="primary" onClick={() => toggleAddModal(true)}>Add new</Button>
        </TopActionWrapper>
      <Table dataSource={categories} columns={columns} loading={isLoading}/>
    </Content>
    </>
  );
}

export default Categories;