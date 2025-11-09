import styled from 'styled-components'
import { Button as BaseButton } from 'antd';
import { lighten } from 'polished';

const makeBgColor = (type, theme) => {
  if (type === 'primary') return theme.brandColor;
  return 'transparent';
}

const makeColor = (type, theme) => {
  if (type === 'primary') return 'white';
  return theme.brandColor;
}

const makeBorderColor = (type, theme) => {
  if (type === 'text' || type === 'link') return 'none';
  return theme.brandColor;
}

const makeBorderWidth = (type) => {
  if (type === 'text' || type === 'link' || type === 'primary') return 'inherit';
  return '2px';
}

const Button = styled(BaseButton)`
  font-size: ${({size}) => size === 'small' ? '13px' : '16px'};
  height:  ${({size}) => size === 'small' ? '32px' : 'inherit'};
  height:  ${({size}) => size === 'small' ? '4px 15px' : 'inherit'};
  min-width: 75px;
  line-height: ${({size}) => size === 'small' ? 1 : 'inherit'};
  background-color: ${({ type, theme }) => makeBgColor(type, theme)};
  color: ${({ type, theme }) => makeColor(type, theme)};
  border-color: ${({type, theme}) => makeBorderColor(type, theme)};
  border-width: ${({ type }) => makeBorderWidth(type)};
  &:hover, &:active, &:focus{
    color: ${({ type, theme }) =>(type == 'link' || type == 'text') ? theme.brandColor : 'white'};
    border-color: ${({ type, theme }) => makeBorderColor(type, theme)};
    background-color: ${({ type, theme }) => (type == 'link' || type == 'text') ? 'inherit' : lighten(0.2, theme.brandColor)};
  }
  &[ant-click-animating-without-extra-node='true']::after{
    display: none
  }
`;

Button.defaultProps = {
  theme: {
    brandColor: 'black'
  },
  size: 'large'
}

export const ButtonWrapper = styled.div`
  text-align: ${({align}) => align || 'left'};
`;

export default Button;
