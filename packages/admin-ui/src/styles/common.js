import styled from 'styled-components';
import { PageHeader as BasePageHeader, Layout as BaseLayout, Form, Button, Spin} from 'antd';

export const PageHeader = styled(BasePageHeader)`
  background-color: #ffffff;
`;

export const LayoutContent = styled(BaseLayout.Content)`
  margin: 24px 16px;
  padding: 24px;
  min-height: 280px;
  background: #fff;
  overflow: scroll;
`;

export const FormSectionHeader = styled.h5`
  margin-bottom: 24px;
`;

export const SubmitWrapper = styled(Form.Item)`
  text-align: right;
  button{
    min-width: 150px;
    &:first-of-type{
      margin-right: 15px;
    }
  }
`;

export const ActionText = styled.span`
  color: ${({type}) => type == 'delete' ? '#bb0000' : '#1890ff'};
  cursor: pointer;
  &:hover{
    color: ${({type}) => type == 'delete' ? '#ed0202' : '#40a9ff'};
  }
`;

export const LogoutButton = styled(Button)`
  position: absolute !important;
  bottom: 0;
  width: 100%;
  padding: 11px 0;
  height: auto;
`;

export const Sider = styled(BaseLayout.Sider)`
  .ant-layout-sider-children{
    position: relative;
  }
`;

export const FullPageSpinner = styled(Spin)`
  width: 100%;
  height: 81%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

