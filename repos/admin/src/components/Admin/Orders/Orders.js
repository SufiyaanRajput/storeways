import { Button, Layout, Table as AntdTable, Modal, Tag, notification, Select, Input } from "antd";
import { useEffect, useState } from "react";
import { useAsyncFetch } from '../../../utils/hooks';
import { PageHeader } from "../styles";
import { Table, ShippingAddress, AddressCard } from "./styles";
import { fetchOrders, cancelOrders, updateOrder } from "./api";
const { Content } = Layout;

const ProductTable = ({ record, refetchOrders, deliveryStatuses }) => {
  const [cancellingId, setCancellingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const {
    isLoading: cancellingOrders,
    success: cancellingOrdersSuccess,
    error: cancelOrderError,
    refetch: recancelOrders
  } = useAsyncFetch(false, cancelOrders);

  const {
    isLoading: updatingOrder,
    success: updatingOrderSuccess,
    error: updateOrderError,
    refetch: reupdateOrder
  } = useAsyncFetch(false, updateOrder);

  useEffect(() => {
    if (cancellingOrdersSuccess) {
      setCancellingId(null);
      refetchOrders();
    }
  }, [cancellingOrdersSuccess, refetchOrders]);

  useEffect(() => {
    if (cancelOrderError) {
      notification.error({
        message: `Couldn't cancel order!`,
        placement: 'bottomRight'
      })
    }
  }, [cancelOrderError]);

  useEffect(() => {
    if (updatingOrderSuccess) {
      setUpdatingId(null);
      notification.success({
        message: `Order updated successfully!`,
        placement: 'bottomRight'
      })
    }
  }, [updatingOrderSuccess]);

  useEffect(() => {
    if (updateOrderError) {
      notification.error({
        message: `Couldn't update order!`,
        placement: 'bottomRight'
      })
    }
  }, [updateOrderError]);

  const onCancelOrder = (record) => {
    Modal.confirm({
      title: 'Are you sure?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      okButtonProps: {loading: cancellingOrders},
      onOk() {
        setCancellingId(record.id);
        recancelOrders({referenceIds: [record.referenceId], customerId: record.customerId, products: [{quantity: record.quantity, id: record.productId}]});
      },
      onCancel() {},
    });
  }

  const updateDeliveryStatus = (referenceId, customerId) => (value) => {
    setUpdatingId(referenceId);
    reupdateOrder({
      deliveryStatus: value,
      referenceId,
      customerId
    })
  }

  const columns = [
    { title: 'Reference ID', dataIndex: 'referenceId', key: 'referenceId', width: 300, },
    { title: 'Product', dataIndex: 'product', key: 'product', width: 500, },
    { title: 'Price', dataIndex: 'price', key: 'price', width: 200, },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', width: 100, },
    {
      title: 'Variations',
      key: 'variations',
      width: 300,
      render: (text, record) => (
        record.variations.map((variant, i) => (
          <Tag key={i}>{variant.variationName}: {variant.option}</Tag>
        ))
      ),
    },
    {
      title: 'Delivery status',
      dataIndex: 'deliveryStatus',
      width: 300,
      key: 'deliveryStatus',
      render: (text, record) => {
        if (record.status === 'Cancelled') return 'N.A.';

        return (
          <Select
            defaultValue={text}
            disabled={(updatingId === record.referenceId && updatingOrder )}
            loading={updatingId === record.referenceId && updatingOrder}
            onChange={updateDeliveryStatus(record.referenceId, record.customerId)}>
              {
                deliveryStatuses.map(({ label, value }) => (
                  <Select.Option key={value} value={value}>{label}</Select.Option>
                ))
              }
          </Select>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: '',
      fixed: 'right',
      width: 100,
      key: 'actions',
      render: (text, record) => {
        if (record.status === 'Cancelled') return <p className="danger">Cancelled</p>;
        return(<Button loading={cancellingId === record.id && cancellingOrders} onClick={() => onCancelOrder(record)} danger>Cancel</Button>);
      },
    },
  ];
  
  return <Table columns={columns} dataSource={record} pagination={false} />;
};

const Orders = () => {
  const [textSearchType, setTextSearchType] = useState('mobile');
  const [search, setSearch] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const {
    isLoading: fetchingOrders,
    success: fetchingOrdersSuccess,
    response: fetchOrdersResponse,
    error: fetchOrdersError,
    refetch: refetchOrders
  } = useAsyncFetch(false, fetchOrders);

  useEffect(() => {
    if (fetchOrdersError) {
      notification.error({
        message: `Something went wrong!`,
        placement: 'bottomRight'
      })
    }
  }, [fetchOrdersError]);

  useEffect(() => {
    refetchOrders({ deliveryStatus, search, textSearchType });
  }, [search, deliveryStatus, textSearchType, refetchOrders]);

  const columns = [
    {
      title: 'Cart reference ID',
      dataIndex: 'cartReferenceId',
      key: 'cartReferenceId',
      width: 170,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 150,
    },
    {
      title: 'Amount paid',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      width: 150,
      render: (text, record) => {
        return(<p>₹{text}</p>);
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (text, record) => {
        return(<p>₹{text}</p>);
      },
    },
    {
      title: 'Total items',
      dataIndex: 'totalItems',
      key: 'totalItems',
      width: 150,
      render: (text, record) => {
        return(<p>{record.items.length}</p>);
      },
    },
    {
      title: 'Order date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (text, record) => {
        return new Date(record.createdAt).toLocaleDateString();
      },
    },
  ];

  const makeOrders = () => {
    if (fetchingOrdersSuccess) {
      return fetchOrdersResponse.data.orders.map(o => ({...o, key: o.id}));
    }

    return [];
  }

  const onTextSearchChange = (e) => {
    setSearch(e.target.value);
  }

  const onDeliveryStatusFilterChange = (deliveryStatus) => {
    setDeliveryStatus(deliveryStatus);
  }

  return(
    <>
      <PageHeader
        className="site-page-header"
        title="Orders"
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
        {/* <TopActionWrapper>
          <Button size="large" type="primary" onClick={() => navigate('/products/create')}>Add new</Button>
        </TopActionWrapper> */}
        <div>
          <Input allowClear={true} style={{maxWidth: '500px', marginBottom: '15px', marginRight: '30px'}} onChange={onTextSearchChange} 
            addonBefore={<Select style={{width: '100px'}} onChange={setTextSearchType} value={textSearchType}>
            <Select.Option value="mobile">Mobile</Select.Option>
            <Select.Option value="name">Name</Select.Option>
          </Select>} />
          <Select style={{width: 'auto', marginBottom: '15px', minWidth: '300px'}} 
            placeholder="Filter by delivery status"
            allowClear={true}
            onChange={onDeliveryStatusFilterChange}>
            {
             (fetchOrdersResponse.data?.deliveryStatuses || []).map(({ label, value }) => (
                <Select.Option key={value} value={value}>{label}</Select.Option>
              ))
            }
          </Select>
        </div>
        <AntdTable dataSource={makeOrders()} rowKey="cartReferenceId" scroll={{ x: 1100 }} columns={columns} loading={fetchingOrders} expandable={{
          expandedRowRender: (record) => (
            <div>
              <ProductTable deliveryStatuses={fetchOrdersResponse.data.deliveryStatuses || []} record={record.items} refetchOrders={refetchOrders}/>
              <ShippingAddress>
                <AddressCard>
                  <p><strong>Shipping Address:</strong></p>
                  <p>{record.shippingAddress}</p>
                </AddressCard>
              </ShippingAddress>
            </div>
          )
        }}/>
    </Content>
    </>
  );
}

export default Orders;