import styled from 'styled-components';
import { Col } from "antd";

export const ProductCard = styled(Col)`
  cursor: pointer;
  @media only screen and (max-width: 575px){
    min-width: 50%;
  }
`;

export const Wrapper = styled.div`
  &:hover{
    box-shadow: 0px 2px 19px -3px rgba(0,0,0,0.09);
  }
`; 

export const ProductImage = styled.div`
  position: relative;
  padding-top: 133%;
`;

export const ProductMeta = styled.div`
  margin: 15px 0;
  font-size: 14px;
  padding-left: 11px;
  padding-bottom: 11px;
`;

export const ProductName = styled.p`
  color: #5a5a5a;
`;