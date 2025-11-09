import { Table, Tag } from 'antd';

const ProductVariations = ({ record }) => {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Variations',
      key: 'variations',
      render: (text, record) => (
        record.values.map((variant, i) => (
          <Tag key={i}>{variant}</Tag>
        ))
      ),
    }
  ];
  
  return <Table showHeader={false} columns={columns} dataSource={record.variations} pagination={false} />;
};

export default ProductVariations;