import { Layout, Menu, notification } from 'antd';
import {Routes, Route, Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faSitemap, faBarcode, faStore, faSwatchbook, faTh, faPlug, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import Categories from './Categories/Categories';
import Products from './Products/Products';
import Variations from './Variations/Variations';
import Store from './Store/Store';
import AddEditProducts from './Products/AddEditProducts/AddEditProducts';
import { Home as HomeLayout, Footer as FooterLayout } from './Layout';
import Orders from './Orders/Orders';
import Dashboard from './Dashboard/Dashboard';
import {useAsyncFetch} from '../../utils/hooks';
import { LogoutButton, Sider } from './styles';
import { logout } from './api';
import {userContext} from '../../store';
import { useContext, useEffect, useState } from 'react';

const { Header } = Layout;

const Admin = () => {
  const [siderColllapsed, collapseSider] = useState(false);
  const location = useLocation();
  const user = useContext(userContext);

  const {isLoading: isLoggingOut, success: logoutSuccess, error: logoutError, refetch: relogout} = useAsyncFetch(false, logout);

  useEffect(() => {
    if (logoutError) {
      notification.error({
        message: `Couldn't logout!`,
        placement: 'bottomRight'
      });
    }
  }, [logoutError]);

  useEffect(() => {
    if (logoutSuccess) {
      user.clearStore();
    }
  }, [logoutSuccess, user]);

  const getSelectedKey = () => {
    const keys = ['dashboard', 'products', 'categories', 'variations', 'store', 'home', 'footer', 'orders'];

    for (let key of keys) {
      if (location.pathname.includes(key)) return [key];
    }

    return 'orders';
  }

  return(
    <Layout style={{height: '100%'}}>
      <Sider collapsible collapsed={siderColllapsed} onCollapse={() => collapseSider(s => !s)} width="250">
        <div className="logo" style={{

          textAlign: 'center',
          margin: '16px',
          background: 'rgba(255, 255, 255, 0.3)'
        }}>
          <h3 style={{color: 'white'}}>Storeways</h3>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={getSelectedKey()}>
          {/* <Menu.Item key="dashboard">
            <Link to="/dashboard">Dashboard</Link>          
          </Menu.Item> */}
          <Menu.Item key="orders" icon={<FontAwesomeIcon icon={faShoppingBag}/>}>
            <Link to="/orders">Orders</Link>          
          </Menu.Item>
          <Menu.Item key="categories" icon={<FontAwesomeIcon icon={faSitemap}/>}>
            <Link to="/categories">Categories</Link>
          </Menu.Item>
          <Menu.Item key="products" icon={<FontAwesomeIcon icon={faBarcode}/>}>
            <Link to="/products">Products</Link>
          </Menu.Item>
          <Menu.Item key="variations" icon={<FontAwesomeIcon icon={faSwatchbook}/>}>
            <Link to="/variations">Variations</Link>          
          </Menu.Item>
          <Menu.Item key="store" icon={<FontAwesomeIcon icon={faStore}/>}>
            <Link to="/store">Store</Link>          
          </Menu.Item>
          <Menu.SubMenu key="layout" title="Layout" icon={<FontAwesomeIcon icon={faTh}/>}>
            <Menu.Item key="home">
              <Link to="/layout/home">Home</Link>  
            </Menu.Item>
            <Menu.Item key="footer">
              <Link to="/layout/footer">Footer</Link>  
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
        <LogoutButton loading={isLoggingOut} 
          onClick={relogout} size="large" 
          type="primary">
            {!siderColllapsed ? 'Logout' : <FontAwesomeIcon icon={faSignOutAlt}/>}
        </LogoutButton>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: '0 32px' }}>
          <div></div>
        </Header>
        <Routes>
          {/* <Route path="/dashboard" element={<Dashboard />}/> */}
          <Route path="/orders" element={<Orders />}/>
          <Route path="/layout/home" element={<HomeLayout />}/>
          <Route path="/layout/footer" element={<FooterLayout />}/>
          <Route path="/categories" element={<Categories />}/>
          <Route path="/products/create" element={<AddEditProducts />}/>
          <Route path="/products/:id" element={<AddEditProducts />}/>
          <Route path="/products" element={<Products />}/>
          <Route path="/variations" element={<Variations />}/>
          <Route path="/store" element={<Store />}/>
          <Route path="/" element={<Orders />}/>
        </Routes>
      </Layout>
    </Layout>
  );
};

export default Admin;