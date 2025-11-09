import { Table, Tag } from 'antd';

const ProductVariations = ({ record }) => {
  const columns = [
    {
      title: 'Variation Group',
      key: 'variationGroup',
      render: (text, record) => (
        record.variationGroup.map((variant, i) => (
          <Tag key={i}>{variant.name}: {variant.value}</Tag>
        ))
      ),
    },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'maxOrderQuantity', dataIndex: 'maxOrderQuantity', key: 'maxOrderQuantity' },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
  ];
  
  return <Table columns={columns} dataSource={record.variations} pagination={false} />;
};

export default ProductVariations;