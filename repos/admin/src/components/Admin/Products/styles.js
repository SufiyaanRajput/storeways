import styled from 'styled-components';
import { PageHeader as BasePageHeader } from 'antd';

export const PageHeader = styled(BasePageHeader)`
  background-color: #ffffff;
`;

export const ActionText = styled.span`
  color: ${({type}) => type == 'delete' ? '#bb0000' : '#1890ff'};
  cursor: pointer;
  &:hover{
    color: ${({type}) => type == 'delete' ? '#ed0202' : '#40a9ff'};
  }
`;

export const TopActionWrapper = styled.div`
  text-align: right;
  margin-bottom: 24px;
  button{
    min-width: 150px;
  }
`;