import { useEffect, useState } from "react";
import { Button, Divider, Form, Input, Layout, Menu, Modal, Select, Space, notification } from "antd";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FullPageSpinner, LogoutButton, Sider } from "./styles/common";
import QueryBoundary from "./internals/QueryBoundary";
import { logout as logoutApi } from "./internals/auth/api";
import { useAtomValue, useSetAtom } from "jotai";
import { clearUserAtom, setUserAtom, userAtom } from "./store/userAtom";
import { getLayoutExtensions } from "./extensions/layout";
import { createStore as createStoreApi, getStores as getStoresApi, switchStore as switchStoreApi } from "./pages/store/api";

const { Header } = Layout;

const Admin = () => {
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(() => localStorage.getItem("selected-store-id"));
  const [isCreateStoreModalVisible, setIsCreateStoreModalVisible] = useState(false);
  const [createStoreForm] = Form.useForm();
  const queryClient = useQueryClient();
  const location = useLocation();
  const clearUser = useSetAtom(clearUserAtom);
  const setUser = useSetAtom(setUserAtom);
  const user = useAtomValue(userAtom);
  const layoutExtensions = getLayoutExtensions();
  const fullPageLoaderStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(255, 255, 255, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  };

  const {
    data: stores = [],
    isFetching: isFetchingStores,
  } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const response = await getStoresApi();
      return response?.data?.stores;
    },
    staleTime: 5 * 60 * 1000,
    onSuccess: (fetchedStores = []) => {
      if (!fetchedStores.length) return;
      const exists = fetchedStores.some((store) => String(store.id) === selectedStoreId);

      if (!exists) {
        const firstStoreId = String(fetchedStores[0].id);
        setSelectedStoreId(firstStoreId);
        localStorage.setItem("selected-store-id", firstStoreId);
      }
    },
  });

  const switchStoreMutation = useMutation({
    mutationFn: switchStoreApi,
    onSuccess: (response, values) => {
      notification.success({
        message: "Store switched!",
        placement: "bottomRight",
      });
      const newToken = response?.data?.token;

      if (newToken) {
        localStorage.setItem("auth-token", newToken);
        if (user) {
          setUser({ ...user, authToken: newToken, storeId: values?.storeId });
        }
      }
      localStorage.setItem("selected-store-id", values?.storeId);
      setSelectedStoreId(values?.storeId);

      window.location.reload();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onError: () => {
      notification.error({
        message: "Couldn't logout!",
        placement: "bottomRight",
      });
    },
  });

  const createStoreMutation = useMutation({
    mutationFn: createStoreApi,
    onSuccess: (response, _values) => {
      notification.success({
        message: "Store created!",
        placement: "bottomRight",
      });
      const newStore = response?.data?.store

      queryClient.setQueryData(["stores"], (current = []) => {
        return [...current, newStore];
      });
      createStoreForm.resetFields();
      setIsCreateStoreModalVisible(false);
    },
    onError: (_error, _values, context) => {
      notification.error({
        message: "Couldn't create store!",
        placement: "bottomRight",
      });
      if (context?.previousStores) {
        queryClient.setQueryData(["stores"], context.previousStores);
      }
    },
  });

  useEffect(() => {
    // no-op; kept for parity with previous behaviour
  }, [logoutMutation.isError]);

  const defaultExtension = layoutExtensions.find((extension) => extension.default);

  const getSelectedKey = () => {
    for (const extension of layoutExtensions) {
      if (extension.children) {
        for (const child of extension.children) {
          if (location.pathname.includes(child.path)) {
            return [child.id];
          }
        }
      }

      if (location.pathname.includes(extension.path)) {
        return [extension.id];
      }
    }

    return [defaultExtension.id];
  };

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        clearUser();
      },
      onSettled: () => {
        clearUser();
      },
    });
  };

  const handleCreateStore = () => {
    createStoreForm
      .validateFields()
      .then((values) => {
        createStoreMutation.mutate(values);
      })
      .catch(() => {});
  };

  return (
    <>
      {switchStoreMutation.isPending && (
        <div style={fullPageLoaderStyle}>
          <FullPageSpinner size="large" />
        </div>
      )}
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
          <Menu theme="dark" mode="inline" defaultSelectedKeys={getSelectedKey()}>
            {layoutExtensions.map((extension) =>
              extension.children ? (
                <Menu.SubMenu
                  key={extension.id}
                  title={extension.title}
                  icon={<FontAwesomeIcon icon={extension.icon} />}
                >
                  {extension.children.map((child) => (
                    <Menu.Item key={child.id}>
                      <Link to={child.path}>{child.title}</Link>
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ) : (
                <Menu.Item key={extension.id} icon={<FontAwesomeIcon icon={extension.icon} />}>
                  <Link to={extension.path}>{extension.title}</Link>
                </Menu.Item>
              )
            )}
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
          <Header className="site-layout-background" style={{ padding: "0 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Space>
                <Select
                  showSearch
                  placeholder="Select store"
                  value={selectedStoreId}
                  loading={isFetchingStores}
                  onChange={(value) => {
                    switchStoreMutation.mutate({ storeId: value });
                  }}
                  style={{ minWidth: 260 }}
                  optionFilterProp="children"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <Button type="link" block onClick={() => setIsCreateStoreModalVisible(true)}>
                        + Create store
                      </Button>
                    </>
                  )}
                >
                  {stores.map((store) => (
                    <Select.Option key={store.id} value={String(store.id)}>
                      {store.name}
                    </Select.Option>
                  ))}
                </Select>
              </Space>
              <Modal
                title="Create store"
                visible={isCreateStoreModalVisible}
                onCancel={() => {
                  setIsCreateStoreModalVisible(false);
                  createStoreForm.resetFields();
                }}
                onOk={handleCreateStore}
                okText="Create"
                confirmLoading={createStoreMutation.isPending}
                destroyOnClose
              >
                <Form form={createStoreForm} layout="vertical" name="create-store-form">
                  <Form.Item
                    label="Store name"
                    name="name"
                    rules={[{ required: true, message: "Please enter a store name" }]}
                  >
                    <Input placeholder="Eg. My Super Store" />
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </Header>
          <Routes>
            {layoutExtensions.reduce((routes, extension) => {
              if (extension.children) {
                extension.children.forEach((child) =>
                  routes.push(<Route key={child.id} path={child.path} element={<child.component />} />)
                );

                return routes;
              }

              if (extension.routes) {
                routes.push(<Route key={extension.path} path={extension.path} element={<extension.component />} />);

                extension.routes.forEach((route) =>
                  routes.push(<Route key={route.path} path={route.path} element={<route.component />} />)
                );

                return routes;
              }

              routes.push(<Route key={extension.id} path={extension.path} element={<extension.component />} />);

              return routes;
            }, [])}
            <Route path="/" element={<defaultExtension.component />} />
          </Routes>
        </Layout>
      </Layout>
    </>
  );
};

const AdminContainer = () => (
  <QueryBoundary>
    <Admin />
  </QueryBoundary>
);

export default AdminContainer;
