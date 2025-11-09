import { Fragment } from "react";
import { SectionTitle } from "@/base/Section/Section";
import { ProductCarousel } from "./styles";
import { ProductCardContainer } from "../ProductsList/ProductsList";

const ProductListSlider = ({ title, products=[], orientation }) => (
  <Fragment>
    <SectionTitle orientation={orientation} space={{ bottom: '25px' }}><h3>{title}</h3></SectionTitle>
    <ProductCarousel responsive={{
      superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 6
      },
      desktop: {
        breakpoint: { max: 3000, min: 1025 },
        items: 6
      },
      tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 4
      },
      mobile: {
        breakpoint: { max: 768, min: 0 },
        items: 2
      }
    }}
    ssr={true}>
    {
      products.map((product, i) => (
        <ProductCardContainer product={product} key={i}/>
      ))
    }
  </ProductCarousel>
</Fragment>
);

export default ProductListSlider;