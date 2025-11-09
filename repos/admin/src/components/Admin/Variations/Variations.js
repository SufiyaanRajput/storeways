import { Button, Layout, Table, notification, Tag, Modal } from "antd";
import { PageHeader, ActionText, TopActionWrapper } from "./styles";
import AddEditVariations from "./AddEditVariations/AddEditVariations";
import { deleteVariation, fetchVariations } from "./api";
import { fetchCategories } from "../Categories/api";
import { useAsyncFetch } from '../../../utils/hooks';
import { useState } from "react";
import { useEffect } from "react";
const { Content } = Layout;

const Variations = () => {
  const [showAddModal, toggleAddModal] = useState(false);
  const [showEditModal, toggleEditModal] = useState(false);
  const [variationToEdit, setVariationToEdit] = useState({});
  const [categories, setCategories] = useState([]);
  const [variations, setVariations] = useState([]);
  const {response, error, success} = useAsyncFetch(true, fetchCategories);

  const {
    isLoading: fetchingVarations, 
    error: fetchVarationsError, 
    success: fetchVariationsSuccess,
    response: variationsResponse,
    refetch: reftechVariations
  } = useAsyncFetch(true, fetchVariations);

  const {
    isLoading: deletingVaration, 
    error: deleteVarationError, 
    success: deleteVariationSuccess,
    refetch: redeleteVariation
  } = useAsyncFetch(false, deleteVariation);

  useEffect(() => {
    if (success) {
      setCategories(response.data.categories);
    }
  }, [success, response]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: `Couldn't fetch categories!`,
        placement: 'bottomRight'
      })
    }
  }, [error]);

  useEffect(() => {
    if (fetchVarationsError) {
      notification.error({
        message: 'Something went wrong!',
        placement: 'bottomRight'
      })
    }
  }, [fetchVarationsError]);

  useEffect(() => {
    if (deleteVariationSuccess) {
      notification.error({
        message: `Variation deleted!`,
        placement: 'bottomRight'
      })
    }
  }, [deleteVariationSuccess]);

  useEffect(() => {
    if (deleteVarationError) {
      notification.error({
        message: `Couldn't delete variation!`,
        placement: 'bottomRight'
      })
    }
  }, [deleteVarationError]);

  useEffect(() => {
    if (fetchVariationsSuccess) {
      setVariations(variationsResponse.data.variations.map((variation) => ({
        key: variation.id,
        name: variation.name,
        status: variation.active ? 'Active': 'Inactive',
        categoryName: variation.category.name,
        category: variation.category.id,
        options: variation.options
      })));
    }
  }, [fetchVariationsSuccess, variationsResponse]);

  const handleEdit = (record) => {
    setVariationToEdit(record);
    toggleEditModal(true);
  }

  const onDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure delete this variation?',
      content: 'Deleting this variation will also remove variations from the products containg it.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        redeleteVariation({id: record.key});
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
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
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
        <ActionText onClick={() => handleEdit(record)}>Edit</ActionText> | <ActionText onClick={() => onDelete(record)} type="delete">Delete</ActionText>
      </>,
    },
  ];

  const makeExpandContent = (record) => {
    return(
      <div>
        {
          record.options.map((option, i) => (
            <Tag key={i}>{option}</Tag>
          ))
        }
      </div>
    );
  }

  return(
    <>
      {
        showAddModal &&
        <AddEditVariations visible={showAddModal} 
          toggle={toggleAddModal} 
          reftechVariations={reftechVariations}
          categories={categories}/>
      }
      {
        showEditModal &&
        <AddEditVariations visible={showEditModal}
          toggle={toggleEditModal} 
          variation={variationToEdit} 
          reftechVariations={reftechVariations}
          categories={categories}/>
      }
      <PageHeader
      className="site-page-header"
      title="Variations"
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
        <Table
          loading={fetchingVarations}
          columns={columns}
          expandable={{
            expandedRowRender: record => makeExpandContent(record),
          }}
          dataSource={variations}/>
    </Content>
    </>
  );
}

export default Variations;