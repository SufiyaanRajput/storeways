import styled from "styled-components";
import { Card as AntCard, Button as AntButton } from "antd";

export const Header = styled.header`
  text-align: center;
  padding: 32px 0 16px;
  img {
    height: 48px;
  }
`;

export const Main = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const Card = styled(AntCard)`
  max-width: 420px;
  width: 100%;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

export const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 24px;
`;

