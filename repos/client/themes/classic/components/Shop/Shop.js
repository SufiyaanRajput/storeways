import { Container, FullPageSpinner, ButtonWrapper } from "@/base/index";
import { Row, Col, Form, Divider, Drawer } from "antd";
import { useEffect, useRef, useState } from "react";
import { faPlus, faMinus, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProductList } from "themes/classic/common";
import { Fragment } from "react";
import { useAsyncFetch } from "themes/utils/hooks";
import { fetchProducts, fetchFilters } from "themes/api";
import { FormItem, FilterTitle, FilterButton, Checkbox, NotFound, SearchFilter, FiltersCol, ProductsCol, Section } from './styles';
import { useForm } from "antd/lib/form/Form";
import { useRouter } from 'next/router'

const Shop = () => {
  const [visibleFilters, setVisibleFilters] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [form] = useForm();
  const [showMobileFilterDrawer, toggleMobileFilterDrawer] = useState(false);
  const router = useRouter();

  const { isLoading: fetchingProducts, error: fetchProductsError, success: fetchProductSuccess, response: productResponse, refetch: refetchProducts } = useAsyncFetch(false, fetchProducts);
  const { isLoading: fetchingFilters, error: fetchFiltersError, success: fetchFiltersSuccess, response: filtersResponse } = useAsyncFetch(true, fetchFilters);

  useEffect(() => {
    if (fetchFiltersSuccess) {
      setFilters(filtersResponse?.data?.filters || []);
    }
  }, [fetchFiltersSuccess, filtersResponse]);

  useEffect(() => {
    if (router.isReady) {
      let payload = {};
      if (router.query.categories) {
        const categories = router.query.categories.split(',');
        payload = { categories };
        setSelectedFilters(categories.reduce((obj, item) => {
          obj[item] = true;
          return obj;
        }, {}));
      }
      refetchProducts(payload);
    }
  }, [refetchProducts, router]);

  const isFilterOpen = (filter) => visibleFilters.some(f => f == filter);

  const toggleFilters = (filter) => {
    const isOpen = isFilterOpen(filter);

    if (isOpen) {
      setVisibleFilters(state => state.filter(f => f != filter));
      return;
    }

    setVisibleFilters(state => ([ ...state, filter ]));
  }

  const onFilterChange = (e) => {
    setSelectedFilters(state => ({...state, [e.target.value]: e.target.checked}));
  }

  const onFilter = () => {
    const categories = Object.keys(selectedFilters).filter(key => selectedFilters[key]);
    router.push({
      pathname: '/shop',
      query: { categories: categories.join(',') }
    }, undefined, { shallow: true })
    // refetchProducts({categories});
    toggleMobileFilterDrawer(false);
  }

  const Filters = () => {
    if (!filters.length) return null;

    return(
      <Form
        name="basic"
        layout="vertical"
        form={form}
        onFinish={onFilter}
        onFinishFailed={() => {}}
        autoComplete="off">
       {
          filters.map((filter, i) => (
            <Fragment key={i}>
              <FilterTitle onClick={() => toggleFilters(filter.title)}>
                <Divider className="divider" orientation="left"><h6>{filter.title.toUpperCase()}</h6></Divider>
                <FontAwesomeIcon icon={isFilterOpen(filter.title) ? faMinus : faPlus}/>
              </FilterTitle>
              {
                isFilterOpen(filter.title) &&
                <>
                  {/* <SearchFilter placeholder="Search" /> */}
                  <FormItem name={filter.title}>
                  <Row>
                    {
                      filter.options.map((filter, i) => (
                        <Col key={filter.id} span={24}>
                          <Checkbox value={filter.id} checked={selectedFilters[filter.id]} onChange={onFilterChange}>{filter.name}</Checkbox>
                        </Col>
                      ))
                    }
                  </Row>
                </FormItem>
                </>
              }
            </Fragment>
          ))
        }
        <Form.Item>
          <FilterButton htmlType="submit" size="large" >Filter</FilterButton>
        </Form.Item>
      </Form>
    )
  };

  return(
    <main style={{ position: 'relative' }}>
      {
        fetchingProducts && fetchingFilters &&
          <FullPageSpinner />
      }
       <>
          <Drawer
            title="Filters"
            placement="left"
            closable={true}
            onClose={() => toggleMobileFilterDrawer(false)}
            visible={showMobileFilterDrawer}
            key={"left"}>
              <Filters />
          </Drawer>
          <Section>
            <Container $maxWidth="1300px">
              <Row gutter={32}>
                <FiltersCol lg={6} sm={7}>
                  <Filters />
                </FiltersCol>
                <ProductsCol lg={18} sm={15}>
                  <ButtonWrapper align="right">
                    <FilterButton type="mobile" size="small" onClick={() => toggleMobileFilterDrawer(true)}>Filters</FilterButton>
                  </ButtonWrapper>
                  {
                    fetchingProducts ? null :
                    fetchProductSuccess && productResponse.data.products.length ?
                    <ProductList products={productResponse.data.products}/> :
                    <NotFound>No products found!</NotFound>
                  }
                </ProductsCol>
              </Row>
            </Container>
          </Section>
        </>
    </main>
  );
};

export default Shop;