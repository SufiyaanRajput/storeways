import { OrdersListPage } from '@storeways/admin-ui/pages';
import { fetchOrders } from './api';

const Orders = () => {
  return <OrdersListPage fetchOrders={fetchOrders} />;
}

export default Orders;