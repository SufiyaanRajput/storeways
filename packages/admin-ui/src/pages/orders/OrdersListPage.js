import { Button, Layout, Table as AntdTable, Modal, Tag, notification, Select, Input, DatePicker, InputNumber } from "antd";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
// import { MenuOutlined } from "@ant-design/icons";
// import { useEffect, useState } from "react";
// import { useAsyncFetch } from '../../../utils/hooks';
import { PageHeader } from "../../styles";
import { Table, ShippingAddress, AddressCard } from "./styles";
// import { fetchOrders, cancelOrders, updateOrder } from "./api";
const { Content } = Layout;

// dnd-kit for sortable column ordering
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery, useMutation } from "@tanstack/react-query";
import QueryBoundary from "../../internals/QueryBoundary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const STORAGE_KEY = 'ordersListSelectedColumnKeys';
const FILTERS_STORAGE_KEY = 'ordersListFilters';

const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      {typeof children === 'function' ? children(attributes, listeners) : children}
    </div>
  );
};

const ProductTable = ({ record, refetchOrders, deliveryStatuses, cancelOrders, updateOrder }) => {
  const [cancellingId, setCancellingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const cancelOrdersMutation = useMutation({
    mutationFn: async (payload) => {
      if (!cancelOrders) throw new Error('cancelOrders not provided');
      return await cancelOrders(payload);
    },
    onSuccess: () => {
      setCancellingId(null);
      if (typeof refetchOrders === 'function') refetchOrders();
    },
    onError: () => {
      notification.error({
        message: `Couldn't cancel order!`,
        placement: 'bottomRight'
      });
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: async (payload) => {
      if (!updateOrder) throw new Error('updateOrder not provided');
      return await updateOrder(payload);
    },
    onSuccess: () => {
      setUpdatingId(null);
      notification.success({
        message: `Order updated successfully!`,
        placement: 'bottomRight'
      });
    },
    onError: () => {
      notification.error({
        message: `Couldn't update order!`,
        placement: 'bottomRight'
      });
    }
  });

  const onCancelOrder = (record) => {
    Modal.confirm({
      title: 'Are you sure?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      okButtonProps: {loading: cancelOrdersMutation.isPending},
      onOk() {
        setCancellingId(record.id);
        cancelOrdersMutation.mutate({
          referenceIds: [record.referenceId],
          customerId: record.customerId,
          products: [{ quantity: record.quantity, id: record.productId }]
        });
      },
      onCancel() {},
    });
  }

  const updateDeliveryStatus = (referenceId, customerId) => (value) => {
    setUpdatingId(referenceId);
    updateOrderMutation.mutate({
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
            disabled={(updatingId === record.referenceId && updateOrderMutation.isPending )}
            loading={updatingId === record.referenceId && updateOrderMutation.isPending}
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
        return(<Button loading={cancellingId === record.id && cancelOrdersMutation.isPending} onClick={() => onCancelOrder(record)} danger>Cancel</Button>);
      },
    },
  ];
  
  return <Table columns={columns} dataSource={record} pagination={false} />;
};

const Orders = ({
  fetchOrders,
  cancelOrders,
  updateOrder,
}) => {
  const DEFAULT_COLUMNS_CONFIG = useMemo(() => ([
    { id: 'cartReferenceId', field: 'cartReferenceId', title: 'Cart reference ID', enabled: true, width: 170 },
    { id: 'paymentStatus', field: 'paymentStatus', title: 'Payment status', enabled: true, width: 150 },
    { id: 'isSuspicious', field: 'isSuspicious', title: 'Is suspicious', enabled: true, width: 150 },
    { id: 'name', field: 'name', title: 'Name', enabled: true, width: 150 },
    { id: 'mobile', field: 'mobile', title: 'Mobile', enabled: true, width: 150 },
    { id: 'amountPaid', field: 'amountPaid', title: 'Amount paid', enabled: true, width: 150 },
    { id: 'amount', field: 'amount', title: 'Amount', enabled: true, width: 150 },
    { id: 'totalItems', field: 'totalItems', title: 'Total items', enabled: true, width: 150 },
    { id: 'createdAt', field: 'createdAt', title: 'Order date', enabled: true, width: 150 },
  ]), []);
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
  const [draftColumnsConfig, setDraftColumnsConfig] = useState(null);
  const getInitialColumnsConfig = () => {
    if (typeof window === 'undefined') return DEFAULT_COLUMNS_CONFIG;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_COLUMNS_CONFIG;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : DEFAULT_COLUMNS_CONFIG;
    } catch (e) {
      return DEFAULT_COLUMNS_CONFIG;
    }
  };
  const [columnsConfig, setColumnsConfig] = useState(getInitialColumnsConfig);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  );

  const [textSearchType, setTextSearchType] = useState('mobile');
  const [search, setSearch] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const getInitialFiltersConfig = () => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(FILTERS_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };
  const [filtersConfig, setFiltersConfig] = useState(getInitialFiltersConfig);
  const [draftFiltersConfig, setDraftFiltersConfig] = useState(null);

  const { data: ordersResponse, isFetching, refetch } = useQuery({
    queryKey: ['adminOrders', { deliveryStatus, search, page, textSearchType }],
    queryFn: async () => {
      if (!fetchOrders) return { data: { orders: [] } };
      const res = await fetchOrders({ deliveryStatus, search, page, textSearchType });
      return res;
    },
    keepPreviousData: true,
  });

  const getRenderForField = (field) => {
    if (field === 'isSuspicious') {
      return (text) => <Tag color={text ? 'red' : 'green'}>{text ? 'Yes' : 'No'}</Tag>;
    }
    if (field === 'amountPaid' || field === 'amount') {
      return (text) => (<p>₹{text}</p>);
    }
    if (field === 'totalItems') {
      return (text, record) => (<p>{Array.isArray(record.items) ? record.items.length : ''}</p>);
    }
    if (field === 'createdAt') {
      return (text, record) => (record.createdAt ? new Date(record.createdAt).toLocaleDateString() : '');
    }
    return undefined;
  };

  const columns = columnsConfig
    .map(c => ({
      title: c.title,
      dataIndex: c.field,
      key: c.id,
      width: c.width || 150,
      render: getRenderForField(c.field)
    }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setDraftColumnsConfig((items) => {
      const oldIndex = items.findIndex(c => c.id === active.id);
      const newIndex = items.findIndex(c => c.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return items;
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const orders =
    ordersResponse?.data?.orders ||
    ordersResponse?.orders ||
    (Array.isArray(ordersResponse) ? ordersResponse : []);

  const inferFieldType = (field) => {
    const sample = orders && orders.length ? orders[0] : null;
    const value = sample ? sample[field] : undefined;
    if (value == null) {
      if (field.toLowerCase().includes('date') || field.toLowerCase().includes('at')) return 'date';
      return 'text';
    }
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return 'date';
      return 'text';
    }
    return 'text';
  };

  const numericOperators = [
    { label: '<', value: '<' },
    { label: '<=', value: '<=' },
    { label: '>', value: '>' },
    { label: '>=', value: '>=' },
    { label: '=', value: '=' }
  ];
  const textOperators = [
    { label: 'equals', value: 'eq' },
    { label: 'contains', value: 'contains' }
  ];
  const dateOperators = [
    { label: 'range', value: 'range' }
  ];

  const applyFilters = (list) => {
    if (!filtersConfig || filtersConfig.length === 0) return list;
    return list.filter(item => {
      return filtersConfig.every(f => {
        const type = f.type || inferFieldType(f.field);
        const raw = item[f.field];
        if (type === 'number') {
          const val = Number(raw);
          const cmp = Number(f.value);
          if (isNaN(val) || isNaN(cmp)) return false;
          switch (f.operator) {
            case '<': return val < cmp;
            case '<=': return val <= cmp;
            case '>': return val > cmp;
            case '>=': return val >= cmp;
            case '=': return val === cmp;
            default: return true;
          }
        }
        if (type === 'date') {
          if (!raw || !f.range || !f.range.start || !f.range.end) return true;
          const v = new Date(raw).getTime();
          const start = new Date(f.range.start).getTime();
          const end = new Date(f.range.end).getTime();
          if (isNaN(v) || isNaN(start) || isNaN(end)) return false;
          return v >= start && v <= end;
        }
        const text = (raw ?? '').toString().toLowerCase();
        const needle = (f.value ?? '').toString().toLowerCase();
        if (f.operator === 'eq') return text === needle;
        if (f.operator === 'contains') return text.includes(needle);
        return true;
      });
    });
  };

  const filteredOrders = applyFilters(orders);

  const makeOrders = (list = []) => {
    return list.map(o => ({...o, key: o.id}));
  }

  const onTextSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  }

  const onDeliveryStatusFilterChange = (deliveryStatus) => {
    setDeliveryStatus(deliveryStatus || null);
    setPage(1);
  }

  const availableFields = useMemo(() => {
    const sample = orders && orders.length ? orders[0] : null;
    const keys = sample ? Object.keys(sample) : [];
    // Fallback to default config fields if no data yet
    return keys.length ? keys : DEFAULT_COLUMNS_CONFIG.map(c => c.field);
  }, [orders, DEFAULT_COLUMNS_CONFIG]);

  const canAddMoreColumns = useMemo(() => {
    const used = (draftColumnsConfig || []).length;
    return availableFields.length > used;
  }, [draftColumnsConfig, availableFields]);

  const addColumn = () => {
    const usedFields = new Set((draftColumnsConfig || []).map(c => c.field));
    const nextField = availableFields.find(f => !usedFields.has(f)) || availableFields[0];
    const newId = `${nextField}-${Date.now()}`;
    setDraftColumnsConfig(prev => ([...(prev || []), { id: newId, field: nextField, title: nextField, enabled: true, width: 150 }]));
  };

  const removeColumn = (id) => {
    setDraftColumnsConfig(prev => (prev || []).filter(c => c.id !== id));
  };

  const updateColumn = (id, changes) => {
    setDraftColumnsConfig(prev => (prev || []).map(c => (c.id === id ? { ...c, ...changes } : c)));
  };

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
        <div>
          <Button style={{ marginLeft: '16px', marginBottom: '15px' }} onClick={() => { setDraftColumnsConfig(columnsConfig); setIsColumnsModalOpen(true); }}>
            Customize Columns
          </Button>
          <Button style={{ marginLeft: '8px', marginBottom: '15px' }} onClick={() => { setDraftFiltersConfig(filtersConfig); setIsFiltersModalOpen(true); }}>
            Filters
          </Button>
        </div>
        <Modal
          title="Customize Columns"
          open={isColumnsModalOpen}
          onOk={() => {
            const next = draftColumnsConfig || DEFAULT_COLUMNS_CONFIG;
            setColumnsConfig(next);
            try {
              if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
              }
            } catch (e) {}
            setIsColumnsModalOpen(false);
            setDraftColumnsConfig(null);
          }}
          okText="Done"
          onCancel={() => { setIsColumnsModalOpen(false); setDraftColumnsConfig(null); }}
          destroyOnClose
          bodyStyle={{ maxHeight: 420, overflowY: 'auto' }}
        >
          {canAddMoreColumns && (
            <div style={{ marginBottom: 12 }}>
              <Button size="small" onClick={addColumn}>Add Column</Button>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', marginBottom: 8, fontWeight: 600, color: '#555' }}>
            <span style={{ width: 20, textAlign: 'center' }}></span>
            <span style={{ width: 180 }}>Title</span>
            <span style={{ minWidth: 200 }}>Field</span>
            <span style={{ flex: 1 }}></span>
            <span style={{ width: 24, textAlign: 'center' }}></span>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={(draftColumnsConfig || []).map(c => c.id)} strategy={verticalListSortingStrategy}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(draftColumnsConfig || []).map(cfg => (
                  <SortableItem key={cfg.id} id={cfg.id}>
                    {(attributes, listeners) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                        <span style={{ cursor: 'grab', color: '#999', userSelect: 'none', width: 20, textAlign: 'center' }} {...attributes} {...listeners}>⋮⋮</span>
                        <Input style={{ width: 180 }} value={cfg.title} onChange={(e) => updateColumn(cfg.id, { title: e.target.value })} placeholder="Column title" />
                        <Select
                          style={{ minWidth: 200 }}
                          value={cfg.field}
                          onChange={(val) => updateColumn(cfg.id, { field: val })}
                          options={availableFields.map(f => ({ label: f, value: f }))}
                        />
                        <span
                          onClick={() => removeColumn(cfg.id)}
                          style={{ cursor: 'pointer', color: '#cf1322', padding: '4px 6px', width: 24, textAlign: 'center' }}
                          title="Remove column"
                          role="button"
                          aria-label="Remove column"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </span>
                      </div>
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <div style={{ marginTop: 16 }}>
            <Button size="small" onClick={() => {
              setDraftColumnsConfig(DEFAULT_COLUMNS_CONFIG);
            }}>
              Reset to defaults
            </Button>
          </div>
        </Modal>
        <Modal
          title="Customize Filters"
          open={isFiltersModalOpen}
          onOk={() => {
            const next = draftFiltersConfig || [];
            setFiltersConfig(next);
            try {
              if (typeof window !== 'undefined') {
                localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(next));
              }
            } catch (e) {}
            setIsFiltersModalOpen(false);
            setDraftFiltersConfig(null);
          }}
          okText="Done"
          onCancel={() => { setIsFiltersModalOpen(false); setDraftFiltersConfig(null); }}
          destroyOnClose
          width={700}
          bodyStyle={{ maxHeight: 420, overflowY: 'auto' }}
        >
          <div style={{ marginBottom: 12 }}>
            <Button size="small" onClick={() => {
              const field = availableFields[0];
              const type = inferFieldType(field);
              setDraftFiltersConfig(prev => ([
                ...(prev || []),
                {
                  id: `f-${Date.now()}`,
                  field,
                  type,
                  operator: type === 'number' ? '<=' : (type === 'date' ? 'range' : 'eq'),
                  value: type === 'number' ? 0 : '',
                  range: type === 'date' ? { start: null, end: null } : undefined,
                }
              ]));
            }}>Add Filter</Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', marginBottom: 8, fontWeight: 600, color: '#555' }}>
            <span style={{ width: 200 }}>Field</span>
            <span style={{ width: 150 }}>Operator</span>
            <span style={{ minWidth: 240 }}>Value</span>
            <span style={{ flex: 1 }}></span>
            <span style={{ width: 24, textAlign: 'center' }}></span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(draftFiltersConfig || []).map(f => {
              const type = f.type || inferFieldType(f.field);
              const operatorOptions = type === 'number' ? numericOperators : (type === 'date' ? dateOperators : textOperators);
              return (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                  <Select
                    style={{ width: 200 }}
                    value={f.field}
                    onChange={(val) => {
                      const nextType = inferFieldType(val);
                      setDraftFiltersConfig(prev => (prev || []).map(x => x.id === f.id ? {
                        ...x,
                        field: val,
                        type: nextType,
                        operator: nextType === 'number' ? '<=' : (nextType === 'date' ? 'range' : 'eq'),
                        value: nextType === 'number' ? 0 : '',
                        range: nextType === 'date' ? { start: null, end: null } : undefined,
                      } : x));
                    }}
                    options={availableFields.map(ff => ({ label: ff, value: ff }))}
                  />
                  <Select
                    style={{ width: 150 }}
                    value={f.operator}
                    onChange={(val) => setDraftFiltersConfig(prev => (prev || []).map(x => x.id === f.id ? ({ ...x, operator: val }) : x))}
                    options={operatorOptions}
                    disabled={type === 'date'}
                  />
                  <div style={{ minWidth: 240 }}>
                    {type === 'number' && (
                      <InputNumber
                        style={{ width: 240 }}
                        value={typeof f.value === 'number' ? f.value : Number(f.value || 0)}
                        onChange={(val) => setDraftFiltersConfig(prev => (prev || []).map(x => x.id === f.id ? ({ ...x, value: Number(val || 0) }) : x))}
                      />
                    )}
                    {type === 'text' && (
                      <Input
                        style={{ width: 240 }}
                        value={f.value || ''}
                        onChange={(e) => setDraftFiltersConfig(prev => (prev || []).map(x => x.id === f.id ? ({ ...x, value: e.target.value }) : x))}
                      />
                    )}
                    {type === 'date' && (
                      <DatePicker.RangePicker
                        style={{ width: 300 }}
                        value={
                          f.range && f.range.start && f.range.end
                            ? [moment(f.range.start), moment(f.range.end)]
                            : null
                        }
                        onChange={(vals) => {
                          const [start, end] = vals || [];
                          const startISO = start ? start.toISOString() : null;
                          const endISO = end ? end.toISOString() : null;
                          setDraftFiltersConfig(prev => (prev || []).map(x => x.id === f.id ? ({
                            ...x,
                            range: {
                              start: startISO,
                              end: endISO,
                            }
                          }) : x));
                        }}
                      />
                    )}
                  </div>
                  <span
                    onClick={() => setDraftFiltersConfig(prev => (prev || []).filter(x => x.id !== f.id))}
                    style={{ cursor: 'pointer', color: '#cf1322', padding: '4px 6px', width: 24, textAlign: 'center' }}
                    title="Remove filter"
                    role="button"
                    aria-label="Remove filter"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16 }}>
            <Button size="small" onClick={() => setDraftFiltersConfig([])}>
              Clear all
            </Button>
          </div>
        </Modal>
        <AntdTable
          dataSource={makeOrders(filteredOrders)}
          rowKey="cartReferenceId"
          scroll={{ x: 1100 }}
          columns={columns}
          loading={isFetching}
          pagination={{ current: page, onChange: (p) => setPage(p) }}
          expandable={{
          expandedRowRender: (record) => (
            <div>
              <ProductTable
                deliveryStatuses={ordersResponse.data.deliveryStatuses || []}
                record={record.items}
                refetchOrders={refetch}
                cancelOrders={cancelOrders}
                updateOrder={updateOrder}
              />
              <ShippingAddress>
                <AddressCard>
                  <p><strong>Shipping Address:</strong></p>
                  <p>{record.shippingAddress}</p>
                </AddressCard>
              </ShippingAddress>
            </div>
          )
        }}
        />
    </Content>
    </>
  );
}

const OrdersListPage = (props) => (
  <QueryBoundary>
    <Orders {...props} />
  </QueryBoundary>
);

export default OrdersListPage;