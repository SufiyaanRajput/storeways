import { Col, Divider, Form as BaseForm, Carousel as BaseCarousel } from 'antd';
import { SmallText, Section } from '@/base/index';
import styled from 'styled-components';

export const makeColor = (color, defaultColor) => {
  if (color && typeof(color) === 'object') return `rgba(${color.r},${color.g},${color.b},${color.a})`;
  if (color) return color;
    return defaultColor;
}

export const Carousel = styled(BaseCarousel)`
  -webkit-box-shadow: 0px 2px 12px -3px rgba(0,0,0,0.15);
  -moz-box-shadow: 0px 2px 12px -3px rgba(0,0,0,0.15);
  box-shadow: 0px 2px 12px -3px rgba(0,0,0,0.15);
`;

export const Slide = styled.div`
  height: 500px;
  background-image: ${(props) => 'url(' + props.config.bgImg +')'};
  background-position: center; 
  background-repeat: no-repeat;
  background-size: cover;
  padding: 25px;
  display: flex;
  justify-content: ${(props) => props.config.align.horizontal};
  align-items: ${(props) => props.config.align.vertical};
`; 

export const SlideCTAWrapper = styled.div`
  margin-top: 21px;
  text-align: ${(props) => props.config.align};
`;

export const Title = styled.h1`
  background-color: ${(props) => {
    const {bgColor} = props.config;
    return makeColor(bgColor, 'transparent');
  }};
  color: ${(props) => {
    const {color} = props.config;
    return makeColor(color, '#000000');
  }};
`;

export const SectionImgCard = styled.div`
  height: 300px;
  background: grey;
  position: relative;
  cursor: pointer;
  @media only screen and (max-width: 927px){
    height: 240px;
  }
`;

export const Posters = styled.div`
  display: flex;
  align-items: center;
  overflow: scroll;
`;

export const PosterImgCol = styled.div`
  min-width: 300px;
  margin-left: 7px;
  margin-right: 7px;
  &:first-of-type{
    margin-left: auto;
  }
  &:last-of-type{
    margin-right: auto;
  }
  @media only screen and (max-width: 927px){
    min-width: 240px;
  }
`;

//feature section component

export const BgSection = styled(Section)`
  background: ${props => makeColor(props.bgColor, '#ffffff')};
  padding: 71px 0;
`;

BgSection.defaultProps = {
  bgColor: '#f9f9f9'
}

export const FeatureWrapper = styled(Col)`
  color: #525252;
  text-align: center;
`;

export const FeatureDescription = styled(SmallText)`
  color: #7c7c7c;
`;

//blog posts section component

export const BlogPostsCol = styled.div`
  text-align: center;
  padding-left: 15px;
  padding-right: 15px;
  &.firstItem{
    padding-left: 0;
  }
  &.lastItem{
    padding-right: 0;
  }
`;

export const BlogImageWrapper = styled.div`
  position: relative;
  padding-top: 50%;
`;

export const BlogPostMeta = styled.div`
  padding: 15px;
`;

export const BlogPostTitle = styled.h4`
`;

export const BlogPostMetaDescription = styled(SmallText)`
  color: #787878;
  margin-bottom: 5px;
  margin-top: 5px;
`;


//NEWSLETTER

export const NewsletterSection = styled(BgSection)`
  text-align: center;
  p{
    color: #787878;
  }
`;

export const Form = styled(BaseForm)`
  max-width: 500px;
  margin: auto;
  margin-top: 51px;
`;

export const NewsletterTitle = styled.h3`
  margin-bottom: 15px;
`;