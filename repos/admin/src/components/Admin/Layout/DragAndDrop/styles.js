import styled from 'styled-components';
import { Card as BaseCard } from 'antd';

export const Card = styled(BaseCard)`
  width: 99%;
  margin-left: auto;
  margin-right: auto;
  min-height: 300px;
`;

export const ItemCard = styled(BaseCard)`
  background-color: #f1f1f1;
  cursor: grab;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
  .ant-card-body div{
    position: absolute;
    right: 0;
    top: 24px;
    margin-right: 25px;
    button{
      margin-left: 15px;
      border: 1px solid #bdbdbd;
      padding: 0px 5px 0px 8px;
      border-radius: 5px;
      background-color: #ffffff;
      cursor: pointer;
      color: #5f54ff;
      svg{
        box-sizing: content-box;
      }
      .fa-trash{
        color: #990000;
        padding-right: 3px;
      }
    }
  }
`;

export const AddSectionCard = styled(BaseCard)`
  .ant-select{
    width: 100%;
  }
`;