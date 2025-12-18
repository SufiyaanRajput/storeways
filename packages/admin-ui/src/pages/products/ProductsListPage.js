import { Button, Layout, Modal, Table, Tag, notification } from "antd";
import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import QueryBoundary from "../../internals/QueryBoundary";
import { ActionText, PageHeader } from "../../styles/common";
import { TopActionWrapper } from "./styles";
import ProductVariations from "./components/ProductVariations";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { setProductAtom } from "./store/productAtom";
import { fetchProducts, deleteProduct } from "./api";
const { Content } = Layout;

const normalizeCategories = (categories = []) =>
  (Array.isArray(categories) ? categories : []).map((category, index) => ({
    id: category?.id ?? category?.key ?? index,
    name: category?.name ?? category?.label ?? category?.title ?? "Unnamed",
  }));

const Products = () => {
  const navigate = useNavigate();
  const setProduct = useSetAtom(setProductAtom);
  useEffect(() => {
    if (!fetchProducts) {
      notification.warning({
        message: "fetchProducts not provided",
        placement: "bottomRight",
      });
    }
  }, [fetchProducts]);

  const {
    data: products = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      if (!fetchProducts) return { data: { products: [] } };
      return await fetchProducts();
    },
    select: (response) => {
      const list =
        response?.data?.products ||
        response?.products ||
        (Array.isArray(response) ? response : []);

      return (list || [])
        .map((product) => ({
          ...product,
          key: product?.id ?? product?.key,
          status: product?.active ? "Active" : "Inactive",
          categories: normalizeCategories(product?.categories),
        }))
        .filter((product) => product.key !== undefined && product.key !== null);
    },
    keepPreviousData: true,
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (payload) => {
      if (!deleteProduct) throw new Error("deleteProduct not provided");
      return await deleteProduct(payload);
    },
    onSuccess: async () => {
      notification.success({
        message: "Product deleted successfully!",
        placement: "bottomRight",
      });
      await refetch();
    },
    onError: () => {
      notification.error({
        message: "Couldn't delete product!",
        placement: "bottomRight",
      });
    },
  });

  const handleDelete = (record) => {
    if (!deleteProduct) return;
    Modal.confirm({
      title: "Are you sure delete this product?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      okButtonProps: {
        loading: deleteProductMutation.isPending,
      },
      onOk() {
        deleteProductMutation.mutate({ id: record.key });
      },
      onCancel() {},
    });
  };

  const handleEditClick = ({ categories = [], ...record }) => {
    setProduct({
      categoryIds: categories.map(({ id }) => id),
      ...record,
    });
    navigate(`/products/${record.key}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories = []) =>
        (categories || []).map((category) => (
          <Tag key={category.id}>{category.name}</Tag>
        )),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
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
      render: (text, record) => {
        return (
          <>
            <ActionText onClick={() => handleEditClick(record)}>
              Edit
            </ActionText>{" "}
            |{" "}
            <ActionText onClick={() => handleDelete(record)} type="delete">
              Delete
            </ActionText>
          </>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader className="site-page-header" title="Products" />
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
            onClick={() => navigate('/products/create')}
          >
            Add new
          </Button>
        </TopActionWrapper>
        <Table
          dataSource={products}
          columns={columns}
          loading={isFetching}
          expandable={{
            expandedRowRender: (record) => <ProductVariations record={record} />,
          }}
        />
      </Content>
    </>
  );
};

const ProductsListPage = (props) => (
  <QueryBoundary>
    <Products {...props} />
  </QueryBoundary>
);

export default ProductsListPage;

