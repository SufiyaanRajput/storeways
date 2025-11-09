import styled from 'styled-components';
import { Input as BaseInput } from "antd";

const Input = styled(BaseInput)`
  font-size: 21px;
  border-radius: 7px;
  padding-top: 9px;
  padding-bottom: 9px;
  &:hover, &:active, &:focus{
    border-color: grey;
  }
`;

export const PasswordInput = styled(BaseInput.Password)`
  font-size: 21px;
  border-radius: 7px;
  padding-top: 9px;
  padding-bottom: 9px;
  &:hover, &:active, &:focus{
    border-color: grey;
  }
`;

export const AddonBeforeInput = styled(BaseInput)`
  input, .ant-input-group-addon{
    font-size: 21px;
    padding-top: 9px;
    padding-bottom: 9px;
    &:hover, &:active, &:focus{
      border-color: grey;
    }
  }
  input{
    border-radius: 0 7px 7px 0;
  }
  .ant-input-group-addon{
    border-radius: 7px 0px 0px 7px;
  }
`;

export default Input;