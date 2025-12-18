import { Table, Tag } from "antd";

const ProductVariations = ({ record }) => {
  const columns = [
    {
      title: "Variation Group",
      key: "variationGroup",
      render: (_, row) =>
        (row.variationGroup || []).map((variant, index) => (
          <Tag key={index}>
            {variant?.name}: {variant?.value}
          </Tag>
        )),
    },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "maxOrderQuantity", dataIndex: "maxOrderQuantity", key: "maxOrderQuantity" },
    { title: "Stock", dataIndex: "stock", key: "stock" },
  ];

  return <Table columns={columns} dataSource={record?.variations || []} pagination={false} />;
};

export default ProductVariations;

