import styled from 'styled-components';
import { Card, Table as BaseTable } from 'antd';

export const Table = styled(BaseTable)`
  border: 1px solid #f0f0f0;
`;

export const ShippingAddress = styled.div`
  padding-top: 16px;
`;

export const AddressCard = styled(Card)`
  .ant-card-body{
    padding: 16px;
  }
`;