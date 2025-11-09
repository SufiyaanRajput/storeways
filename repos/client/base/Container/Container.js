import styled from 'styled-components';

const Container = ({ children, className, ...props }) => (<div className={className} {...props}>{children}</div>);

export default styled(Container)`
  max-width: ${({$maxWidth}) => $maxWidth || '100%'};
  margin: auto;
  padding: 0 21px;
`;