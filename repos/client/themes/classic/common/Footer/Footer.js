import { Row, Col } from "antd";
import { Container, SmallText, NoStyleList } from "@/base/index";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitterSquare, faFacebookSquare, faInstagramSquare } from '@fortawesome/free-brands-svg-icons';
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { imageKitLoader } from "themes/utils";
import storeContext from '../../../../store/store';
import Link from 'next/link';
import { 
  FooterTag, 
  CompanyMetaWrapper, 
  LogoText, 
  QuickLink, 
  QuickLinksTitle, 
  Social, 
  SocialLink,
  CopyrightSocial
 } from "./styles";
import { useContext } from "react";

const Footer = observer(() => {
  const store = useContext(storeContext);
  const { footer = {}, store: {logoText} = {} } = store.settings || {};

  return(
    <FooterTag bgColor={footer.bgColor}>
      <Container $maxWidth="1300px">
        <Row gutter={51} justify="center">
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <CompanyMetaWrapper>
              {
                footer.logo ?
                <Image src={footer.logo.url.replace(/https:\/\/ik.imagekit.io\/oceanlabs/g, '')} 
                  loader={({src, width, quality}) => imageKitLoader({src, width, quality, height: '60'})} 
                  alt="footer logo" 
                  width={150} 
                  height={60}/> :
                <LogoText>{logoText}</LogoText>
              }
              <SmallText>{footer.summary}</SmallText>
            </CompanyMetaWrapper>
            <NoStyleList>
              <QuickLink><SmallText>{footer.address}</SmallText></QuickLink>
              <QuickLink><SmallText>{footer.phone}</SmallText></QuickLink>
              <QuickLink><SmallText>{footer.email}</SmallText></QuickLink>
            </NoStyleList>
          </Col>
          {
            footer.sections && footer.sections.map((section, i) => (
              <Col xs={24} sm={24} md={12} lg={6} xl={6} key={i}>
                <div>
                  <QuickLinksTitle>{section.title}</QuickLinksTitle>
                  <NoStyleList>
                    {
                      section.links && section.links.map((link, i) => (
                        <QuickLink key={i}>
                          <SmallText>
                            <Link href={link.link}>
                              <a>{link.title}</a>
                            </Link>
                          </SmallText>
                        </QuickLink>
                      ))
                    }
                  </NoStyleList>
                </div>
              </Col>
            ))
          }
        </Row>
        <CopyrightSocial>
          <SmallText>{footer.copyrightText}</SmallText>
          <Social>
            {
              footer.facebook &&
                <SocialLink>
                  <Link href={footer.facebook}>
                    <a><FontAwesomeIcon icon={faFacebookSquare} /></a>
                  </Link>
                </SocialLink>
            }
            {
              footer.instagram &&
                <SocialLink>
                  <Link href={footer.instagram}>
                    <a><FontAwesomeIcon icon={faTwitterSquare} /></a>
                  </Link>
                </SocialLink>
            }
            {
              footer.twitter &&
                <SocialLink>
                  <Link href={footer.twitter}>
                    <a><FontAwesomeIcon icon={faInstagramSquare} /></a>
                  </Link>
                </SocialLink>
            }
          </Social>
        </CopyrightSocial>
      </Container>
    </FooterTag>
  );
});

export default Footer;