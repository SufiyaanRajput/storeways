import { useEffect, useState } from "react";
import { Layout, Menu, notification } from "antd";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@tanstack/react-query";
import { LogoutButton, Sider } from "./styles/common";
import QueryBoundary from "./internals/QueryBoundary";
import { logout as logoutApi } from "./internals/auth/api";
import { useSetAtom } from "jotai";
import { clearUserAtom } from "./store/userAtom";
import { getLayoutExtensions } from "./extensions/layout";

const { Header } = Layout;

const Admin = () => {
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const location = useLocation();
  const clearUser = useSetAtom(clearUserAtom);
  const layoutExtensions = getLayoutExtensions();

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
            {layoutExtensions.map((extension) => (
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
              <Menu.Item
                key={extension.id}
                icon={<FontAwesomeIcon icon={extension.icon} />}
              >
                <Link to={extension.path}>{extension.title}</Link>
              </Menu.Item>
              )
            ))}
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
            {layoutExtensions.reduce((routes, extension) => {
              if (extension.children) {
                extension.children.forEach((child) => (
                  routes.push(<Route key={child.id} path={child.path} element={<child.component />} />)
                ));

                return routes;
              }

              if (extension.routes) {
                routes.push(<Route key={extension.path} path={extension.path} element={<extension.component />} />);

                extension.routes.forEach((route) => (
                  routes.push(<Route key={route.path} path={route.path} element={<route.component />} />)
                ));

                return routes;
              }

              routes.push(<Route key={extension.id} path={extension.path} element={<extension.component />} />);

              return routes;
            }, [])}
            <Route path="/" element={<defaultExtension.component />} />
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
