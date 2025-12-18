import { useEffect, useState } from "react";
import { Layout, Menu, notification } from "antd";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faSitemap,
  faBarcode,
  faStore,
  faSwatchbook,
  faTh,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@tanstack/react-query";
import {
  OrdersListPage,
  CategoriesListPage,
  VariationsListPage,
  ProductsListPage,
  AddEditProductPage,
  StoreSettingsPage,
  HomeLayoutPage,
  FooterLayoutPage,
} from "./pages";
import { LogoutButton, Sider } from "./styles";
import QueryBoundary from "./internals/QueryBoundary";
import { logout as logoutApi } from "./internals/auth/api";

const { Header } = Layout;

const Admin = () => {
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const location = useLocation();

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onError: () => {
      notification.error({
        message: "Couldn't logout!",
        placement: "bottomRight",
      });
    },
  });

  useEffect(() => {
    // no-op; kept for parity with previous behaviour
  }, [logoutMutation.isError]);

  const getSelectedKey = () => {
    const keys = [
      "dashboard",
      "products",
      "categories",
      "variations",
      "store",
      "home",
      "footer",
      "orders",
    ];
    for (const key of keys) {
      if (location.pathname.includes(key)) return [key];
    }
    return ["orders"];
  };

  const handleLogout = async () => {
    logoutMutation.mutate();
  };

  return (
      <Layout style={{ height: "100%" }}>
        <Sider
          collapsible
          collapsed={siderCollapsed}
          onCollapse={() => setSiderCollapsed((s) => !s)}
          width="250"
        >
          <div
            className="logo"
            style={{
              textAlign: "center",
              margin: "16px",
              background: "rgba(255, 255, 255, 0.3)",
            }}
          >
            <h3 style={{ color: "white" }}>Storeways</h3>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={getSelectedKey()}
          >
            <Menu.Item
              key="orders"
              icon={<FontAwesomeIcon icon={faShoppingBag} />}
            >
              <Link to="/orders">Orders</Link>
            </Menu.Item>
            <Menu.Item
              key="categories"
              icon={<FontAwesomeIcon icon={faSitemap} />}
            >
              <Link to="/categories">Categories</Link>
            </Menu.Item>
            <Menu.Item
              key="products"
              icon={<FontAwesomeIcon icon={faBarcode} />}
            >
              <Link to="/products">Products</Link>
            </Menu.Item>
            <Menu.Item
              key="variations"
              icon={<FontAwesomeIcon icon={faSwatchbook} />}
            >
              <Link to="/variations">Variations</Link>
            </Menu.Item>
            <Menu.Item key="store" icon={<FontAwesomeIcon icon={faStore} />}>
              <Link to="/store">Store</Link>
            </Menu.Item>
            <Menu.SubMenu
              key="layout"
              title="Layout"
              icon={<FontAwesomeIcon icon={faTh} />}
            >
              <Menu.Item key="home">
                <Link to="/layout/home">Home</Link>
              </Menu.Item>
              <Menu.Item key="footer">
                <Link to="/layout/footer">Footer</Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
          <LogoutButton
            loading={logoutMutation.isPending}
            onClick={handleLogout}
            size="large"
            type="primary"
          >
            {!siderCollapsed ? "Logout" : <FontAwesomeIcon icon={faSignOutAlt} />}
          </LogoutButton>
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{ padding: "0 32px" }}
          >
            <div></div>
          </Header>
          <Routes>
            <Route path="/orders" element={<OrdersListPage />} />
            <Route path="/layout/home" element={<HomeLayoutPage />} />
            <Route path="/layout/footer" element={<FooterLayoutPage />} />
            <Route path="/categories" element={<CategoriesListPage />} />
            <Route path="/products/create" element={<AddEditProductPage />} />
            <Route path="/products/:id" element={<AddEditProductPage />} />
            <Route path="/products" element={<ProductsListPage />} />
            <Route path="/variations" element={<VariationsListPage />} />
            <Route path="/store" element={<StoreSettingsPage />} />
            <Route path="/" element={<OrdersListPage />} />
          </Routes>
        </Layout>
      </Layout>
  );
};

const AdminContainer = () => (
  <QueryBoundary>
    <Admin />
  </QueryBoundary>
);

export default AdminContainer;
