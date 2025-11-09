import { Section, Container } from "@/base/index";
import { SectionTitle } from "@/base/Section/Section";
import { useEffect } from "react";
import {ProductList} from "themes/classic/common";
import { useAsyncFetch } from "themes/utils/hooks";
import { fetchProducts } from 'themes/api';

const ProductSection = ({layout, justify='center'}) => {
  const { success, error, response, isLoading } = useAsyncFetch(true, fetchProducts, layout.selection);

  return(
    success &&
    <Section>
      <Container $maxWidth="1300px">
        <SectionTitle orientation="center"><h3>Best Picks</h3></SectionTitle>
        <ProductList products={response.data.products} justify={justify}/>
      </Container>
    </Section>
  );
};

export default ProductSection;