import { Section, Container, ImageWrapper } from "@/base/index";
import { SectionTitle } from "@/base/Section/Section";
import { Row, Col, Card, Divider, Tag, Alert } from "antd";
import Image from "next/image";
import cartStore from './store.js';
import storeContext from '../../../../store/store';
import { useContext, useEffect, useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { Select, RemoveButton, PriceSpan, Space, CheckoutButton, CostCol, ProductsCol, SummaryCol, MainRow, ProductImageCol, ItemActionsRow, CenterText } from "./styles";
import { useAsyncFetch } from "themes/utils/hooks.js";
import { getProductsByIds } from "./api/index.js";
import { getVariationGroupBySelection } from '../../../utils';
import { CURRENCY } from "../../../../constants";

const ItemActions = ({mobile, price, stock, quantity, onQuantityChange, removeItem}) => (
  <ItemActionsRow gutter={15} mobile={mobile}>
    <Col>
      <p><PriceSpan>{CURRENCY}{price}</PriceSpan> <span>x</span></p>
    </Col>
    <Col>
      <Select value={quantity} onChange={onQuantityChange}>
        {
          Array(stock).fill('').map((_, i) => (
            <Select.Option key={i} value={i+1}>{i+1}</Select.Option>
          ))
        }
      </Select>
    </Col>
    <Col>
      <RemoveButton type="text" onClick={removeItem}>Remove</RemoveButton>
    </Col>
  </ItemActionsRow>
);

const Cart = observer(() => {
  const router = useRouter();
  const cart = useContext(cartStore);
  const store = useContext(storeContext);
  const [productError, setProductError] = useState({});
  const {store: storeSettings = {}} = store.settings || {};

  const {
    isLoading: fetchingProducts,
    success: fetchProductsSuccess,
    response: productsResponse,
    refetch: refetchProducts
  } = useAsyncFetch(false, getProductsByIds);

  useEffect(() => {
    if (fetchProductsSuccess) {
      let hasError = false;
      const updatedProducts = cart.items.map(item => {
        const updatedProduct = productsResponse.data.products.find(product => Number(product.id) === Number(item.id));
        if (item.variations && item.variations.length) {
          var variationGroup = getVariationGroupBySelection(updatedProduct.productVariationStocks, item.variations);
        }

        let updatedStock = updatedProduct.stock;

        if (variationGroup[0]) {
          updatedStock = Number(variationGroup[0].stock) || updatedStock;
        }

        if (updatedStock < item.quantity) {
          if (updatedStock === 0) {
            setProductError(errors => ({...errors, [item.id]: 'Out of stock'}));
          } else {
            setProductError(errors => ({...errors, [item.id]: 'Stock updated since you last added in your cart. Please change quantity.'}));
          }
          
          hasError = true;
        }
        
        const productToSet = {
          ...updatedProduct,
          ...item,
        }

        delete productToSet.productVariationStocks;
        delete productToSet.productVariationStocks;

        return productToSet;
      });

      cart.setItems({items: updatedProducts});

      if (!hasError) {
        cart.setTotalAmount(makeTotal());
        router.push('/checkout');
      }
    }
  }, [cart, fetchProductsSuccess, makeTotal, productsResponse.data, router]);

  const makeSubtotal = useCallback(() => {
    return cart.items.reduce((acc, item) => {
      acc+=Number(item.price) * Number(item.quantity);
      return acc; 
    }, 0);
  }, [cart.items]);

  const onQuantityChange = (value, item) => {
    const updated = {...item, quantity: value};
    cart.addItem(updated);
  }

  const removeItem = (id) => {
    cart.removeItem(id);
  }

  const makeChargeByType = useCallback((type) => {
    if (isNaN(storeSettings[type])) return 0;
    if (storeSettings[type].type === 'VALUE') return storeSettings[type].value;
    const subTotal = makeSubtotal();
    return (subTotal * storeSettings[type].value) / 100;
  }, [makeSubtotal, storeSettings])

  const makeTotal = useCallback(() => {
    return makeSubtotal() + makeChargeByType('otherCharges') + makeChargeByType('tax');
  }, [makeChargeByType, makeSubtotal]);

  const onCheckout = () => {
    refetchProducts({id: cart.items.map(({id}) => id)});
  }

  return(
    <main>
      <Section>
        <Container $maxWidth="1300px">
          <SectionTitle orientation="left"><h4>Your cart</h4></SectionTitle>
          {
            cart.items.length < 1 ?
            <Space direction="vertical">
              <CenterText>No items to show...</CenterText>
            </Space> :
              <MainRow>
              <ProductsCol>
              <Space direction="vertical">
                {
                  cart.items.map((item) => (
                    <Card key={item.id}>
                      <Space direction="vertical">
                        <Row gutter={16}>
                          <ProductImageCol sm={4}>
                            <ImageWrapper top="133%">
                              <Image src={item.image.url} alt={item.name+`'s image`} layout="fill"/>
                            </ImageWrapper>
                          </ProductImageCol>
                          <Col xs={13} sm={17}>
                            <Space direction="vertical">
                              <h6>{item.name}</h6>
                              <div>
                                {
                                  item.variations.map(({variationName, option}) => (
                                    <Tag key={variationName}>{variationName}: {option}</Tag>
                                  ))
                                }
                              </div>
                              <ItemActions mobile={false} 
                                stock={item.allowedQuantity} 
                                removeItem={() => removeItem(item.id)}
                                price={item.price} 
                                quantity={item.quantity} 
                                onQuantityChange={(e) => onQuantityChange(e, item)}/>
                            </Space>
                          </Col>
                          <ItemActions mobile={true} 
                            stock={item.stock} 
                            removeItem={() => removeItem(item.id)}
                            price={item.price} 
                            quantity={item.quantity} 
                            onQuantityChange={(e) => onQuantityChange(e, item)}/>
                        </Row>
                        {
                          productError[item.id] &&
                          <Alert message={productError[item.id]} type="error" />
                        }
                      </Space>
                    </Card>
                  ))
                }
              </Space>
              </ProductsCol>
              <SummaryCol>
              <Space direction="vertical">
                <Card>
                  <Space direction="vertical">
                    <h5>Summary</h5>
                    <Row justify="space-between">
                      <Col sm={12}>
                          Subtotal
                      </Col>
                      <CostCol sm={12}>
                        {CURRENCY}{makeSubtotal()}
                      </CostCol>
                    </Row>
                   {
                     storeSettings.otherCharges && storeSettings.otherCharges.value &&
                     <Row justify="space-between">
                      <Col sm={12}>
                          Other charges
                      </Col>
                      <CostCol sm={12}>
                        {CURRENCY}{makeChargeByType('otherCharges')}
                      </CostCol>
                    </Row>
                   }
                    {
                      storeSettings.tax && storeSettings.tax.value &&
                      <Row justify="space-between">
                        <Col sm={8}>
                            Tax
                        </Col>
                        <CostCol sm={8}>
                        {CURRENCY}{makeChargeByType('tax')}
                        </CostCol>
                      </Row>
                    }
                    <Divider />
                    <Row justify="space-between">
                      <Col sm={8}>
                        <h6>Total</h6>
                      </Col>
                      <CostCol sm={8}>
                        <h6>{CURRENCY}{makeTotal()}</h6>
                      </CostCol>
                    </Row>
                  </Space>
                </Card>
                  <CheckoutButton style={{width: '100%'}} loading={fetchingProducts} onClick={onCheckout} type="primary" size="large">Checkout</CheckoutButton>
                </Space>
              </SummaryCol>
            </MainRow>
          }
        </Container>
      </Section>
    </main>
  );
});

export default Cart;