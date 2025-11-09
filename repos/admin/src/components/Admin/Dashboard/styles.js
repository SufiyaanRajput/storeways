import { Card as BaseCard } from "antd";
import styled from 'styled-components';

export const AppWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: flex-start;
`;

export const Card = styled(BaseCard)`
  width: 300px;
  margin-right: 20px;
  margin-top: 20px;
  .ant-card-cover{
    padding: 35px;
  }
  .ant-card-body{
    display: none;
  }
`;