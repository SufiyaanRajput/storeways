import styled from 'styled-components';
import { Divider } from 'antd';

const Section = styled.section`
  padding-top: 25px;
  padding-bottom: 25px;
`;

export const SectionTitle = styled(Divider)`
  margin-bottom: ${({ space: { bottom = '45px' } = {} }) => bottom} !important;
`;

export default Section;