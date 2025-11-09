import styled from 'styled-components';
import { Card as BaseCard, Form } from 'antd';

export const Header = styled.header`
  padding: 17px 25px;
  height: 72px;
  position: fixed;
  z-index: 2;
  top: 0;
  background-color: #ffffff;
  width: 100%;
  -webkit-box-shadow: 0px 2px 24px -13px rgba(0,0,0,0.07);
  -moz-box-shadow: 0px 2px 24px -13px rgba(0,0,0,0.07);
  box-shadow: 0px 2px 24px -13px rgba(0,0,0,0.07);
  img{
    width: 149px;
  }
`;

export const FormTitle = styled.h3`
  margin-bottom: 15px;
  text-align: center;
`;

export const Main = styled.main`
  min-height: calc(100% - 72px);
  position: relative;
  top: 72px;
  background-color: #f7f7f7;
  padding: 3%;
`;

export const Card = styled(BaseCard)`
  max-width: 500px;
  margin: auto;
  padding: 25px;
`;

export const ButtonWrapper = styled(Form.Item)`
  text-align: center;
`;