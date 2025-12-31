import { Container, Button, FullPageSpinner } from "@/base/index";
import { Row, Col, Carousel, Comment, List, Modal, Space, Tag, Alert, Rate } from "antd";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faStar, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useContext, useEffect, useCallback } from "react";
import { fetchProduct } from '../../../api';
import { useAsyncFetch } from '../../../utils/hooks';
import { useRouter } from 'next/router';
import cartStore from '../Cart/store.js';
import userStore from '../../../../store/users';
import ReviewEditor from "./Reviews/ReviewEditor";
import { createGAEvent } from "themes/utils";
import { 
  CTACartButton, 
  CTACartWrapper, 
  DropdownContent, 
  DropDownTitle, 
  DropDownContainer, 
  ImageWrapper, 
  Price, 
  QauntityWrapper, 
  QuantityInput, 
  QuatityButtons, 
  Thumb, 
  ThumbsWrapper,
  ReviewContainer,
  ProductSlideCol,
  ProductListSection,
  ProductInfoSection,
  VariationWrapper
 } from "./styles";
 import { getVariationGroupBySelection } from '../../../utils';
import { createReview, fetchReviews } from "./api";

const ReviewList = ({ replies }) => (
  <List
    dataSource={replies}
    header={`${replies.length} ${replies.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

const ProductPage = () => {
  const cart = useContext(cartStore);
  const user = useContext(userStore);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviewValues, setReviewValues] = useState({});
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [variationError, setVariationError] = useState(false);
  const [showReviewEditor, setShowReviewEditor] = useState();
  const [openContent, setOpenContent] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [variationGroups, setVariationGroups] = useState([]);
  const [variationGroupPrice, setVariationGroupPrice] = useState(null);
  const [variationGroupMaxOrderQuantity, setVariationGroupMaxOrderQuantity] = useState(null);
  const [variationGroupStock, setVariationGroupStock] = useState(null);
  const slider = useRef();
  const router = useRouter();
  const { productId } = router.query;
  const { CheckableTag } = Tag;

  const { success: productFetched, error, response, isLoading, refetch: refetchProduct } = useAsyncFetch(false, fetchProduct);
  const { name, description, returnPolicy='', price, stock, maxOrderQuantity, images=[], variations, productVariationStocks=[] } = response?.data?.product || {};
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    if (productFetched) {
      setProductImages([...images]);
    }
  }, [images, productFetched]);

  const makeVariationGroupByIndex = useCallback((variationGroup, index, parents=[]) => {
    return variationGroup.reduce((groups, pvs) => {
      if (pvs.variationGroup[index]) {
        const variationGroup = pvs.variationGroup[index];
        const name = variationGroup.name;
        const nameIndex = groups.findIndex(g => g.name === name);
  
        if (nameIndex < 0) {
          groups.push({name, parents, options: [variationGroup]});
          return groups;
        }
  
        if (!groups[nameIndex].options.every(o => o.name === name && o.value === variationGroup.value)) {
          groups[nameIndex].options.push(variationGroup);
        }
      }

      return groups;
    }, [])
  }, []);

  useEffect(() => {
    if (productVariationStocks.length) {
      setVariationGroups(makeVariationGroupByIndex(productVariationStocks, 0));
    }
  }, [makeVariationGroupByIndex, productVariationStocks]);

  const { success: reviewAdded, 
    error: addReviewError, 
    response: addReviewResponse, 
    isLoading: addingReview, 
    refetch: recreateReview } = useAsyncFetch(false, createReview);

  const { success: fetchReviewsSuccess, 
    // error: addReviewError, 
    response: fetchReviewsResponse, 
    isLoading: fetchingReview, 
    refetch: refetcheReviews } = useAsyncFetch(false, fetchReviews);

  useEffect(() => {
    if (reviewAdded) {
      refetcheReviews({productId});
      setReviewValues({});
      setShowReviewEditor(null);
    }
  }, [productId, refetcheReviews, reviewAdded]);

  useEffect(() => {
    if (fetchReviewsSuccess) {
      const onEdit = (review) => {
        setShowReviewEditor(review.id);
        setReviewValues({ratings: review.ratings, content: review.content});
      }

      setReviews(fetchReviewsResponse.data.reviews.map(review => ({
        ...review,
        author: <div>
          <Space>
            <p>{review.author} <FontAwesomeIcon icon={faStar} color="#F8E71C"/>{review.ratings}</p> 
            {user.id === review.authorId ? <p><FontAwesomeIcon icon={faEdit} onClick={() => onEdit(review)}/></p> : ''}
          </Space>
        </div>
      })));
    }
  }, [fetchReviewsSuccess, fetchReviewsResponse, user.id]);

  useEffect(() => {
    if (addReviewError && addReviewError.response.status === 400) {
      const close = () => {
        modal.destroy();
      }
  
      const modal = Modal.error({
        title: '',
        wrapClassName: 'modalInstance',
        content: (
          <div>
            <Space direction="vertical">
              <p>{addReviewError.response.data.message}</p>
              <Button type="primary" onClick={close}>Close</Button>
            </Space>
          </div>
        ),
        maskClosable: true,
        okButtonProps: {style: {display: 'none'}}
      });
    }
  }, [addReviewError]);

  useEffect(() => {
    if(router.isReady) {
      refetchProduct({ id: productId });
      refetcheReviews({ productId });
    }
  }, [productId, refetchProduct, refetcheReviews, router.isReady]);

  const isContentOpen = (id) => {
    return openContent.some((content) => content == id);
  }

  const toggleDropdownById = (id) => {
    setOpenContent((ids) => {
      if(isContentOpen(id)){
        return ids.filter((item) => item != id);
      }

      return [...ids, id];
    });
  }

  const onThumbClick = (i) => {
    slider.current.goTo(i);
    setCurrentSlide(i);
  }

  const makeCollapsibleContentSections = () => {
    const items = [{
      id: 'description',
      title: 'Description',
      content: description
    }];

    if (returnPolicy.replace('<p><br /></p>', '')) {
      items.push({
        id: 'returnPolicy',
        title: 'Shipping & Returns',
        content: returnPolicy
      });
    }

    items.push({
      id: 'reviews',
      title: 'Reviews',
      content: [],
    });

    return items;
  }

  const incrementQuantity = () => {
    const allowedQuantity = (productVariationStocks.length ? (variationGroupMaxOrderQuantity || variationGroupStock) : maxOrderQuantity) || stock;
    setQuantity(q => q === allowedQuantity ? q : q + 1);
  }

  const decrementQuantity = () => {
    setQuantity(q => q == 1 ? q : q - 1);
  }

  const addToCart = () => {
    createGAEvent({action: 'AddToCart', category: 'add_to_cart', label: name, value: price})

    const variationGroup = getVariationGroupBySelection(productVariationStocks, selectedVariations)?.[0];

    if ((productVariationStocks.length && (!selectedVariations.length || !variationGroup)) || (variationGroup.variationGroup.length !== selectedVariations.length)) {
      setVariationError(true);
      return;
    }

    setVariationError(false);

    const hasVaritionGroup = productVariationStocks.length;

    cart.addItem({
      id: productId,
      name,
      price: hasVaritionGroup ? variationGroupPrice : price,
      variations: selectedVariations,
      allowedQuantity: (hasVaritionGroup ? (variationGroupMaxOrderQuantity || variationGroupStock) : maxOrderQuantity) || stock,
      stock: hasVaritionGroup ? variationGroupStock : stock,
      quantity,
      image: productImages[0]
    });

    const onGoToCart = () => {
      modal.destroy();
      router.push('/cart');
    }

    const modal = Modal.success({
      title: '',
      wrapClassName: 'modalInstance',
      content: (
        <div>
          <Space direction="vertical">
            <h6>Added to cart!</h6>
            <p>{name}</p>
            <Button type="primary" onClick={onGoToCart}>Go to cart</Button>
          </Space>
        </div>
      ),
      maskClosable: true,
      okButtonProps: {style: {display: 'none'}}
    });

    setTimeout(() => {
      modal && modal.destroy();
    }, 5000);
  }

  const handleVariationChange = (option, checked, variationName) => {
    setQuantity(1);

    if (checked) {
      const siblingVariation = selectedVariations.find(svo => svo.variationName === variationName);
      var selectedVariationOptions = selectedVariations.filter(sv => {
        if ((sv.variationName === variationName)) return false;
        if (siblingVariation && sv.parents.includes(siblingVariation.option)) return false;

        return true;
      });

      selectedVariationOptions = [...selectedVariationOptions, {option, variationName, parents: selectedVariations.map(svo => svo.option)}];

      var nextOptions = getVariationGroupBySelection(productVariationStocks, selectedVariationOptions);

      const viariationNameIndex = variationGroups.findIndex(vg => vg.name === variationName)
      let nextVariationGroups = variationGroups;

      if (viariationNameIndex >= 0) {
        nextVariationGroups = variationGroups.slice(0, viariationNameIndex + 1);
      }

      const nextOptionsFormatted =  makeVariationGroupByIndex(nextOptions, nextVariationGroups.length, selectedVariationOptions.map(svo => svo.option));

      setVariationGroups([
        ...nextVariationGroups,
        ...nextOptionsFormatted
      ]);

      if (nextOptions[0].images.length) {
        setProductImages(nextOptions[0].images);
      } else {
        setProductImages([...images]);
      }
    } else {
      var selectedVariationOptions = selectedVariations.filter(sv => {
        if ((sv.variationName === variationName && sv.option === option)) return false;
        if (sv.parents.includes(option)) return false;

        return true;
      });

      var nextOptions = getVariationGroupBySelection(productVariationStocks, selectedVariationOptions);
      const nextOptionsFormatted = variationGroups.filter(g => !g.parents.includes(option));

      setVariationGroups(nextOptionsFormatted);
      setProductImages([...images]);
    }

    if (nextOptions.length === 1 && selectedVariationOptions.length === nextOptions[0].variationGroup.length) {
      const { price: variationPrice, maxOrderQuantity, stock: variationStock } = nextOptions[0] || {};

      setVariationGroupPrice(Number(variationPrice) || Number(price));
      setVariationGroupMaxOrderQuantity(Number(maxOrderQuantity));
      setVariationGroupStock(Number(variationStock) || Number(stock));
    } else {
      setVariationGroupPrice(null);
      setVariationGroupMaxOrderQuantity(null);
      setVariationGroupStock(null);
    }

    setSelectedVariations(selectedVariationOptions);
  }

  const onRating = (ratings) => {
    setReviewValues(r => ({...r, ratings}));
  }

  const handleReviewChange = (e) => {
    setReviewValues(r => ({...r, content: e.target.value}));
  }

  const onSubmit = () => {
    if (showReviewEditor) var id = showReviewEditor;

    recreateReview({
      ...reviewValues,
      productId,
      id
    });
  }

  const makePrice = () => {
    if (variationGroupPrice) return `₹${variationGroupPrice}`;

    let minPrice = price, maxPrice = price;

    if (productVariationStocks.length) {
      productVariationStocks.forEach(pvs => {
        if (pvs.price > maxPrice) maxPrice = pvs.price;
        if (pvs.price > 0 && pvs.price < minPrice) minPrice = pvs.price;
      });

      if (minPrice === maxPrice) return `₹${price}`;

      return `₹${minPrice} - ₹${maxPrice}`;
    }

    return `₹${price}`;
  }

  const makeStock = () => {
    if (productVariationStocks.length) {
      return variationGroupStock !== null ? variationGroupStock : -1;
    }

    return stock;
  };

  console.log(productImages);

  return(
    <main style={{ position: 'relative' }}>
      {
        isLoading ?
          <FullPageSpinner /> :
          <>
          <ProductInfoSection>
            <Container $maxWidth="1300px">
              <Row gutter={{ xs: 8, sm: 24, md: 32, lg: 64 }}>
                <ProductSlideCol sm={24} md={10} lg={8}>
                  <Carousel autoplay 
                    ref={e => slider.current = e}
                    afterChange={setCurrentSlide}>
                    {
                      productImages.map((image, i) => (
                        <div key={i}>
                          <ImageWrapper>
                            <Image src={image.url} alt={i} layout="fill"/>
                          </ImageWrapper>
                        </div>
                      ))
                    }
                  </Carousel>
                    <ThumbsWrapper>
                      {
                        productImages.length > 1 && productImages.map((image, i) => (
                          <Thumb key={i} 
                            className={currentSlide == i ? 'selected' : ''}
                            onClick={() => onThumbClick(i)}>
                            <Image src={image.url} alt={i} layout="fill"/>
                          </Thumb>
                        ))
                      }
                    </ThumbsWrapper>
                </ProductSlideCol>
                <Col sm={24} md={10} lg={16}>
                  <h3>{name}</h3>
                  <Price>{makePrice()}</Price>
                  <Space direction="vertical" size="large">
                  {
                    makeStock() > 0 &&
                    <CTACartWrapper>
                      <QauntityWrapper>
                        <QuatityButtons onClick={decrementQuantity}><FontAwesomeIcon icon={faMinus}/></QuatityButtons>
                        <QuantityInput value={quantity} disabled/>
                        <QuatityButtons onClick={incrementQuantity}><FontAwesomeIcon icon={faPlus}/></QuatityButtons>
                      </QauntityWrapper>
                      <CTACartButton size="large" type="primary" onClick={addToCart}>Add to Cart</CTACartButton>
                    </CTACartWrapper> 
                  }
                    {
                      makeStock() === 0 &&
                      <Alert message="Out of stock" type="error" />
                    }
                    <div>
                      {
                        variationError &&
                        <p style={{color: 'red'}}><small>Please select options from below</small></p>
                      }
                        {variationGroups.map((g, i) => (
                          <VariationWrapper key={i}>
                            <h6>{g.name}</h6>
                              {g.options.map(option => (
                                <CheckableTag
                                  key={option.value}
                                  checked={selectedVariations.some(v => v.option === option.value)}
                                  onChange={checked => handleVariationChange(option.value, checked, g.name, g.variationGroupId)}>
                                  {option.value}
                                </CheckableTag>
                              ))}
                          </VariationWrapper>
                        ))}
                    </div>
                  </Space>
                  <DropDownContainer>
                    {
                      makeCollapsibleContentSections().map((dropdown) => (
                        <div key={dropdown.id}>
                          <DropDownTitle orientation="left" 
                            onClick={() => toggleDropdownById(dropdown.id)}>
                              <h6><FontAwesomeIcon className='icon' icon={isContentOpen(dropdown.id) ? faMinus: faPlus}/>{dropdown.title}</h6>
                          </DropDownTitle>
                          <DropdownContent className={isContentOpen(dropdown.id) ? 'show': ''}>
                            {
                              dropdown.id == 'reviews' ?
                              <>
                              {
                                reviews.map(({ replies = [], ...review }, i) => (
                                  showReviewEditor === review.id ?
                                  <Space direction="vertical" style={{width: '100%'}}>
                                    <Rate allowHalf onChange={onRating} value={reviewValues.ratings || 0} defaultValue={0} />
                                    <ReviewEditor
                                      onChange={handleReviewChange}
                                      closeEditor={() => {setReviewValues({}); setShowReviewEditor(null)}}
                                      onSubmit={onSubmit}
                                      id={review.id}
                                      submitting={addingReview}
                                      value={reviewValues.content || ''}
                                    />
                                  </Space> :
                                  <ReviewContainer key={i} {...review} showReviewEditor={showReviewEditor === review.id} userId={user.id}>
                                    {replies.length > 0 && 
                                    <>
                                      <ReviewList replies={replies} />
                                      <Comment
                                        content={
                                          <ReviewEditor
                                            // onChange={this.handleChange}
                                            // onSubmit={this.handleSubmit}
                                            // submitting={submitting}
                                            // value={value}
                                          />
                                        }
                                      />
                                    </>}
                                  </ReviewContainer>
                                ))
                              }
                              {
                                user.id && !showReviewEditor &&
                                <>
                                  <Space direction="vertical" style={{width: '100%'}}>
                                    <Rate allowHalf onChange={onRating} value={reviewValues.ratings || 0} defaultValue={0} />
                                    <ReviewEditor
                                      onChange={handleReviewChange}
                                      onSubmit={onSubmit}
                                      submitting={addingReview}
                                      value={reviewValues.content || ''}
                                    />
                                  </Space>
                                </>
                              }
                              </>
                              :
                              <div style={{ fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: dropdown.content }}/>
                            }
                          </DropdownContent>
                        </div>
                      ))
                    }
                  </DropDownContainer>
                </Col>
              </Row>
            </Container>
          </ProductInfoSection>
          {/* <ProductListSection>
            <Container $maxWidth="1300px">
              <ProductListSlider title="You may also like" products={products}/>
            </Container>
          </ProductListSection> */}
        </>
      }
    </main>
  );
}

export default ProductPage;