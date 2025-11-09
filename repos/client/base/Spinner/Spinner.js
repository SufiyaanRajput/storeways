import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 9px solid #f3f3f3;
  border-top: 9px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 2s linear infinite;
`;

const FullPageSpinnerWrapper = styled.div`
  transform: translate(50%, -50%);
  left: 50%;
  position: absolute;
  top: 30%;
`;

export const FullPageSpinner = () => (
  <FullPageSpinnerWrapper>
    <Spinner />
  </FullPageSpinnerWrapper>
);

export default Spinner;