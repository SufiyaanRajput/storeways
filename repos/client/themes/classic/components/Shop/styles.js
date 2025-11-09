import styled from 'styled-components';
import { Form, Checkbox as BaseCheckbox, Col } from 'antd';
import Button from '@/base/Button/Button';
import { Input } from "themes/classic/common";
import { Section as BaseSection } from '@/base/index';

export const FormItem = styled(Form.Item)`
  max-height: 150px;
  overflow-x: scroll;
`;

export const FilterTitle = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  svg{
    margin-left: 15px;
  }
  h6{
    font-size: 14px;
  }
  .divider{
    min-width: auto;
  }
`;

export const FilterButton = styled(Button)`
  margin-top: 15px;
  margin-left: 25px;
  margin-bottom: 15px;
  display: ${props => props.type === 'mobile' ? 'none' : 'block'};
  @media only screen and (max-width: 577px){
    display: inline-block;
  }
`;

export const Checkbox = styled(BaseCheckbox)`
  font-weight: 300;
  font-size: 12px !important;
`;

export const SearchFilter = styled(Input)`
  font-size: 13px;
  padding: 5px 9px;
  margin-bottom: 7px;
`;

export const FiltersCol = styled(Col)`
  @media only screen and (max-width: 577px){
    display: none;
  }
`;

export const ProductsCol = styled(Col)`
  @media only screen and (max-width: 577px){
    min-width: 100%;
  }
`;

export const NotFound = styled.h5`
  text-align: center;
  margin-top: 75px;
`;

export const Section = styled(BaseSection)`
  @media only screen and (max-width: 577px){
    padding-top: 0;
  }
`;