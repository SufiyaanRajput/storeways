import { faSearch, faShoppingCart, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Drawer, Dropdown, Menu } from "antd";
import storeContext from '../../../../store/store';
import userContext from '../../../../store/users';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from "react";
import { imageKitLoader } from 'themes/utils';
import LoginModal from './LoginModal';
import Link from 'next/link';
import { 
  NavContainer, 
  LogoText, 
  PrimaryNavWrapper, 
  NavLinkWrapper, 
  LogoImage,
  NavLink,
  SearchIcon,
  Icon,
  ProfileIcon,
  MobileIcons,
  DesktopIconButtons,
  Container } from "./styles";
import { useRouter } from 'next/router';

const MainMenu = observer(() => {
  const [isMobileMenuVisible, setMobileMenuVisibility] = useState(false);
  const [showLoginModal, setLoginModalVisibility] = useState(false);
  const store = useContext(storeContext);
  const user = useContext(userContext);
  const router = useRouter();

  const { logoText } = store?.settings?.theme || {};
  const {logo} = store || {};

  const menu = (
    <Menu>
      <Menu.Item key="0">
        {
          user.id ?
          <Link href="/orders">
            <a>Orders</a>
          </Link> :
          <p href="" onClick={() => setLoginModalVisibility(true)}>
            <a>Login</a>
          </p> 
        }
      </Menu.Item>
    </Menu>
  );

  const NavLinkContainer = () => (
    <NavLinkWrapper>
      <NavLink onClick={() => setMobileMenuVisibility(false)}>
        <Link href="/">
          <a>Home</a>
        </Link>
      </NavLink>
      <NavLink onClick={() => setMobileMenuVisibility(false)}>
        <Link href="/shop">
          <a>Shop</a>
        </Link>
      </NavLink>
      {/* <NavLink>
        <Link href="/">
          <a>Blog</a>
        </Link></NavLink> */}
      <NavLink onClick={() => setMobileMenuVisibility(false)}>
        <Link href="/contact">
          <a>Contact</a>
        </Link>
      </NavLink>
    </NavLinkWrapper> 
  );

  return(
    <>
      <Drawer
        title="Menu"
        placement="left"
        closable={true}
        onClose={() => setMobileMenuVisibility(false)}
        visible={isMobileMenuVisible}
        key={"left"}
      >
        <NavLinkContainer />
      </Drawer>
      <LoginModal visible={showLoginModal} user={user} setVisibility={setLoginModalVisibility}/>
      <NavContainer>
        <Container $maxWidth="1300px">
          <PrimaryNavWrapper>
            {
              logo ?
              <LogoImage src={logo.url.replace(/https:\/\/ik.imagekit.io\/oceanlabs/g, '')} 
                loader={({src, width, quality}) => imageKitLoader({src, width, quality, height: '60'})} 
                alt="logo" 
                onClick={() => router.push('/')}
                width={150} 
                height={60}/> :
              <LogoText onClick={() => router.push('/')}>{logoText || `Classic`}</LogoText>
            }
            <NavLinkContainer />
          </PrimaryNavWrapper>
          <div>
            {/* <DesktopIconButtons type="link"><SearchIcon icon={faSearch} />Search</DesktopIconButtons> */}
            <DesktopIconButtons onClick={() => router.push('/cart')} type="link"><Icon icon={faShoppingCart} />Cart</DesktopIconButtons>
            <Dropdown overlay={menu}>
              <DesktopIconButtons type="link"><ProfileIcon icon={faUser} />Profile</DesktopIconButtons>
            </Dropdown>
            <MobileIcons><FontAwesomeIcon icon={faBars} onClick={() => setMobileMenuVisibility(true)}/></MobileIcons>
          </div>
        </Container>
    </NavContainer>
    </>
  );
});

export default MainMenu;