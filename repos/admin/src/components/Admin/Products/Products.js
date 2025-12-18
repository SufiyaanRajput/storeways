// import { Button, Layout, Table, Modal, notification, Tag } from "antd";
// import ProductVariations from "./ProductVariations/ProductVariations";
// import { useEffect, useContext } from "react";
// import productContext from './store/product';
// import { useAsyncFetch } from '../../../utils/hooks';
// import { fetchProducts, deleteProduct } from "./api";
// import { PageHeader, ActionText, TopActionWrapper } from "./styles";
// import { useNavigate } from "react-router-dom";
// const { Content } = Layout;

// const Products = () => {
//   const navigate = useNavigate();
//   const productStore = useContext(productContext);

//   const {
//     isLoading: fetchingProducts,
//     response: productsResponse, 
//     error: fetchProductsError, 
//     success: fetchProductsSuccess,
//     refetch: refetchProducts,
//   } = useAsyncFetch(true, fetchProducts);

//   const {
//     error: deleteProductsError, 
//     success: deleteProductsSuccess,
//     refetch: redeleteProduct,
//   } = useAsyncFetch(false, deleteProduct);

//   useEffect(() => {
//     if (fetchProductsError) {
//       notification.error({
//         message: `Couldn't list products!`,
//         placement: 'bottomRight'
//       });
//     }
//   }, [fetchProductsError]);

//   useEffect(() => {
//     if (deleteProductsError) {
//       notification.error({
//         message: `Couldn't delete product!`,
//         placement: 'bottomRight'
//       });
//     }
//   }, [deleteProductsError]);

//   useEffect(() => {
//     if (deleteProductsSuccess) {
//       notification.success({
//         message: 'Product deleted successfully!',
//         placement: 'bottomRight'
//       });
//       refetchProducts();
//     }
//   }, [deleteProductsSuccess, refetchProducts]);

//   const makeProducts = () => {
//     if (fetchProductsSuccess) {
//       return productsResponse.data.products.map(({id, active, ...rest}) => ({
//         key: id,
//         status: active ? 'Active' : 'Inactive',
//         ...rest
//       }));
//     }

//     return [];
//   }

//   const handleEditClick = ({categories, ...record}) => {
//     productStore.setProduct({categoryIds: categories.map(({id}) => id), ...record});
//     navigate(`/products/${record.key}`);
//   }

//   const onDelete = (record) => {
//     Modal.confirm({
//       title: 'Are you sure delete this product?',
//       okText: 'Yes',
//       okType: 'danger',
//       cancelText: 'No',
//       onOk() {
//         redeleteProduct({id: record.key});
//       },
//       onCancel() {},
//     });
//   }

//   const columns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: 'Categories',
//       dataIndex: 'categories',
//       key: 'categories',
//       render: (text, record) => {
//         return(text.map(item => <Tag color="blue">{item.name}</Tag>));
//       },
//     },
//     {
//       title: 'Stock',
//       dataIndex: 'stock',
//       key: 'stock,',
//     },
//     {
//       title: 'SKU',
//       dataIndex: 'sku',
//       key: 'sku',
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//     },
//     {
//       title: 'Action',
//       dataIndex: '',
//       key: 'x',
//       render: (text, record) => {
//         return(<><ActionText onClick={() => handleEditClick(record)}>Edit</ActionText> | <ActionText onClick={() => onDelete(record)} type="delete">Delete</ActionText></>);
//       },
//     },
//   ];

//   return(
//     <>
//       <PageHeader
//         className="site-page-header"
//         title="Products"
//         // breadcrumb={{ routes }}
//       />
//       <Content
//         className="site-layout-background"
//         style={{
//           margin: '24px 16px',
//           padding: 24,
//           minHeight: 280,
//           background: '#fff'
//         }}>
//         <TopActionWrapper>
//           <Button size="large" type="primary" onClick={() => navigate('/products/create')}>Add new</Button>
//         </TopActionWrapper>
//         <Table dataSource={makeProducts()} columns={columns} loading={fetchingProducts} expandable={{
//           expandedRowRender: (record) => <ProductVariations record={record}/>
//         }} />
//     </Content>
//     </>
//   );
// }

// export default Products;





import { ProductsListPage } from '@storeways/admin-ui/pages';
import { fetchProducts, deleteProduct, addProduct, updateProduct } from './api';

const Products = () => {
  return <ProductsListPage 
    fetchProducts={fetchProducts} 
    deleteProduct={deleteProduct} 
    addProduct={addProduct} 
    updateProduct={updateProduct} />;
}

export default Products;