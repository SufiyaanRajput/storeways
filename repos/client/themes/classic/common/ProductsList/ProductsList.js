import Image from "next/image";
import { Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/router'
import { ProductCard, ProductImage, ProductMeta, ProductName, Wrapper } from "./styles";
import { CURRENCY } from "../../../../constants";

export const ProductCardContainer = ({ product, className='' }) => {
  const router = useRouter();

  return(
    <Wrapper className={className} onClick={() => router.push(`/products/${product.id}`)}>
      <ProductImage>
        <Image src={product.images?.[0].url || "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjV8fHNuZWFrZXJzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"} alt={product.alt || 'product image'} layout="fill"/>
      </ProductImage>
      <ProductMeta>
        <ProductName>{product.name}</ProductName>
        {
          <><FontAwesomeIcon icon={faStar} color="#F8E71C"/> {product.ratings}</>
        }
        <p>{CURRENCY}{product.price}</p>
      </ProductMeta>
    </Wrapper>
  );
};

const ProductsList = ({products=[], justify='start'}) => {
  return(
    <Row gutter={16} justify={justify}>
      {
        products.map((product, i) => (
          <ProductCard xs={10} sm={8} md={6} lg={6} xl={6} key={i}>
            <ProductCardContainer product={product}/>
          </ProductCard>
        ))
      }
    </Row>
  );
}

export default ProductsList;