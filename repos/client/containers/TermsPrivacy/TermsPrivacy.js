import styled from "styled-components";
import storeContext from "store/store";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

const Container = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 30px 15px 0 15px;
`;

const TermsPrivacy = ({ type }) => {
  const store = useContext(storeContext);

  return(
    <Container>
      {
        store[type] &&
        <div dangerouslySetInnerHTML={{__html: store[type]}}/>
      }
    </Container>
  )
};

export default observer(TermsPrivacy);