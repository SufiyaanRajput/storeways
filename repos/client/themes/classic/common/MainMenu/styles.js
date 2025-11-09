import styled from 'styled-components';
import BaseContainer from '@/base/Container/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@/base/index';
import Image from 'next/image';

export const NavContainer = styled.nav`
  height: 90px;
  color: ${({theme}) => theme.navTextColor};
  a {
    color: ${({theme}) => theme.navTextColor};
  }
  background-color: ${({theme}) => theme.navBackgroundColor};
  button{
    min-width: auto;
    color: ${({theme}) => theme.navTextColor};
  }
`;

export const LogoImage = styled(Image)`
  cursor: pointer;
`;

NavContainer.defaultProps = {
  theme: {
    navTextColor: 'rgba(0, 0, 0, 0.85)',
    navBackgroundColor: '#ffffff',
  }
}

export const LogoText = styled.h1`
  font-weight: bold;
  font-size: 28.83px;
  cursor: pointer;
`;

export const NavLinkWrapper = styled.ul`
  display: flex;
  list-style: none;
  justify-content: flex-start;
  a {
    color: ${({theme}) => theme.navTextColor};
  }
  @media only screen and (max-width: 865px){
    display: block;
  }
`;

export const PrimaryNavWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 66%;
  @media only screen and (max-width: 865px){
    width: auto;
    ${NavLinkWrapper}{
      display: none;
    }
  }
`;

export const NavLink = styled.li`
  min-width: 91px;
  text-align: center;
  padding: 5px 13px;
  @media only screen and (max-width: 865px){
    font-size: 16px;
    padding: 13px;
  }
`;

export const Container = styled(BaseContainer)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  margin: auto;
`;

export const Icon = styled(FontAwesomeIcon)`
  width: 15px;
  margin-right: 3px;
`;

export const SearchIcon = styled(Icon)`
  margin-bottom: -2px;
`;

export const ProfileIcon = styled(Icon)`
  width: 13px;
`;

export const MobileIcons = styled.div`
  display: none;
  padding-left: 15px;
  svg{
    width: 19px;
  }
  @media only screen and (max-width: 865px){
    display: inline-block;
  }
`;

export const DesktopIconButtons = styled(Button)`
  @media only screen and (max-width: 865px){
    span{
      display: none;
    }
  }
`;

export const DropdownWrapper = styled.div`
  display: inline-block;
  position: relative;
`;

export const Dropdown = styled.ul`
  position: absolute;
  list-style: none;
  padding: 5px;
  width: 100%;
  text-align: center;
  border: 1px solid #d7d7d7;
  li{
    cursor: pointer;
  }
`;