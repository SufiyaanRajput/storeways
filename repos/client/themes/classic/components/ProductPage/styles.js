import styled from 'styled-components';
import { Button, Section, SmallText } from '@/base/index';
import { Divider, Col as BaseCol } from 'antd';
import { Input } from 'themes/classic/common';
import { BaseReviewContainer } from './Reviews/BaseReviewContainer';
import { lighten } from 'polished';

export const ImageWrapper = styled.div`
  padding-top: 133%;
  position: relative;
`;

export const ThumbsWrapper = styled.div`
  display: flex;
  margin-top: 15px;
`;

export const Thumb = styled.div`
  height: 100px;
  position: relative;
  width: 100px;
  cursor: pointer;
  &.selected{
    border: 3px solid #4a4a4a;
  }
`;

export const Price = styled.h5`
  margin-top: 15px;
  margin-bottom: 15px;
`;

export const CTACartWrapper = styled.div` 
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const CTACartButton = styled(Button)`
  width: 200px;
  height: 54px;
  margin-left: 11px;
`;

export const QauntityWrapper = styled.div`
  max-width: 200px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border: 2px solid #e9e9e9;
`;

export const QuantityInput = styled(Input)`
  border-radius: 0;
  border: 0;
  text-align: center;
  &:disabled{
    background-color: #ffffff;
    color: #6c6c6c;
  }
`;

export const QuatityButtons = styled(Button)`
  border: none;
  height: 100%;
  &:hover, &:active, &:focus{
    background-color: transparent;
    color: black;
  }
`;

export const DropDownContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
`;

export const DropDownTitle = styled(Divider)`
  cursor: pointer;
  .icon{
    margin-right: 5px;
    font-weight: normal;
    font-size: 13px;
  }
`;

export const DropdownContent = styled.div`
  max-height: 0px;
  transition: max-height .3s;
  overflow: hidden;
  &.show{
    max-height: 1000px;
  }
`;

export const ReviewContainer = styled(BaseReviewContainer)`
  .ant-list-header{
    font-size: 12px;
  }
  & > .ant-comment-inner{
    padding-top: 0;
  }
  ${SmallText}{
    color: gray;
  }
`;

export const ProductSlideCol = styled(BaseCol)`
  @media only screen and (max-width: 767px){
    padding-left: 12px;
    padding-right: 12px;
    max-width: 300px;
    margin: 0px auto 25px;
  }
  @media only screen and (max-width: 340px){
    max-width: 100%;
  }
`;

export const ProductInfoSection = styled(Section)`
    @media only screen and (max-width: 767px){
    padding-bottom: 0;
  }
`;

export const ProductListSection = styled(Section)`
  @media only screen and (max-width: 767px){
    padding-top: 0;
  }
`;

export const VariationWrapper = styled.div`
  margin-bottom: 15px;
  .ant-tag-checkable{
    border: 1px solid ${props => props.theme.brandColor};
    padding: 9px;
    min-width: 100px;
    text-align: center;
    font-size: 14px;
    margin-top: 5px;
    &.ant-tag-checkable-checked{
      background-color: ${props => lighten(0.2, props.theme.brandColor)};
    }
    &:hover{
      border: 1px solid ${props => props.theme.brandColor};
      color: white;
      background-color: ${props => lighten(0.2, props.theme.brandColor)};
    }
  }
`;