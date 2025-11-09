import styled from 'styled-components';
import { Col, Select as BaseSelect, Space as BaseSpace, Card, Row } from 'antd';
import { Button } from '@/base/index';

export const Select = styled(BaseSelect)`
  width: 100px;
  text-align: center;
`;

export const Category = styled.p`
  color: #6c6c6c;
`;

export const RemoveButton = styled(Button)`
  color: #6c6c6c;
  font-size: 13px
`;

export const PriceSpan = styled.span`
  font-size: 16px;
  margin-right: 5px;
  margin-top: 1px;
  display: inline-block;
`;

export const Space = styled(BaseSpace)`
  width: 100%;
`;

export const CheckoutButton = styled(Button)`
  width: 100%
`;

export const CostCol = styled(Col)`
  text-align: right
`;

export const ProductImageCol = styled(Col)`
  max-width: 100px;
  min-width: 100px;
`;

export const MainRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  @media only screen and (max-width: 937px){
    display: block;
  }
`;

export const ProductsCol = styled.div`
  flex: 1;
  margin-right: 15px;
  @media only screen and (max-width: 937px){
    margin-right: 0;
    margin-bottom: 15px;
  }
`;

export const SummaryCol = styled.div`
  width: 300px;
  @media only screen and (max-width: 937px){
    width: 100%
  }
`;

export const ItemActionsRow = styled(Row)`
  display: ${({mobile}) => mobile ? 'none' : 'flex'};
  @media only screen and (max-width: 577px){
    display: ${({mobile}) => !mobile ? 'none' : 'flex'};
    margin-top: ${({mobile}) => mobile ? '15px' : '0'};
    /* margin-left: ${({mobile}) => mobile ? '120px !important' : '0'}; */
  }
`;

export const CenterText = styled.p`
  text-align: center;
`;