import { observer } from "mobx-react-lite";
import { useContext } from "react";
import storeContext from "store/store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitterSquare, faFacebookSquare, faInstagramSquare } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import styled from 'styled-components';

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10%;
  margin: 0 15px;
`;

const Wrapper = styled.div`
  margin: 15px;
  p{
    color: #686868;
  }
`;

const SocialLink = styled.a`
  font-size: 35px;
  margin-right: 10px;
`;

const Contact = () => {
  const store = useContext(storeContext);
  const { officeAddress, phone, facebook, twitter, instagram } = store?.settings?.footer || {};

  return(
    <Main>
      <div>
        <h3>We would love to hear from you!</h3>
        <h5>Get in touch.</h5>
        {
          officeAddress &&
          <Wrapper>
            <h6>Office:</h6>
            <p>{officeAddress}</p>
          </Wrapper>
        }
        {
          phone &&
          <Wrapper>
            <h6>Phone:</h6>
            <p>{store.settings.footer.phone}</p>
          </Wrapper>
        }
        {
          (facebook || twitter || instagram) &&
          <Wrapper>
            <h6>Social:</h6>
            <div>
              {
                facebook &&
                <Link href={facebook} passHref>
                  <SocialLink><FontAwesomeIcon icon={faFacebookSquare} /></SocialLink>
                </Link>
              }
              {
                instagram &&
                <Link href={instagram} passHref>
                  <SocialLink><FontAwesomeIcon icon={faTwitterSquare} /></SocialLink>
                </Link>
              }
              {
                twitter &&
                <Link href={twitter} passHref>
                  <SocialLink><FontAwesomeIcon icon={faInstagramSquare} /></SocialLink>
                </Link>
              }
            </div>
          </Wrapper>
        }
      </div>
    </Main>
  );
};

export default observer(Contact);