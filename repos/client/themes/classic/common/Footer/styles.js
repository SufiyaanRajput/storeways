import styled from 'styled-components';
import { NoStyleList } from '@/base/index';
import { makeColor } from 'themes/classic/components/Home/styles';

export const FooterTag = styled.footer`
  background: ${(props) => makeColor(props.bgColor)};
  color: #8d8d8d;
  padding: 35px;
`;

FooterTag.defaultProps = {
  bgColor: '#121212'
}

export const CompanyMetaWrapper = styled.div`
  margin-bottom: 15px;
`;

export const LogoText = styled.h1`
  color: #ffffff;
  line-height: 56px;
`;

export const QuickLinksTitle = styled.h3`
  color: #ffffff;
`;

export const QuickLink = styled.li`
  margin-bottom: 5px;
  a{
    color: #ffffff;
  }
`;

export const CopyrightSocial = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media only screen and (max-width: 575px){
    display: block;
    text-align: center;
  }
`;

export const Social = styled(NoStyleList)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  a{
    color: #ffffff;
  }
  @media only screen and (max-width: 575px){
    justify-content: center;
    margin-top: 5px;
  }
`;

export const SocialLink = styled.li`
  margin-left: 11px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  svg{
    width: 17px;
  }
`;