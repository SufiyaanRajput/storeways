import {useEffect, useState} from 'react';
import DragAndDrop from '../DragAndDrop/DragAndDrop';
import { PageHeader, LayoutContent, FullPageSpinner } from "../../styles";
import { Button, notification } from 'antd';
import {useAsyncFetch} from '../../../../utils/hooks';
import { ButtonWrapper } from './styles';
import { fetchLayout, updateLayout } from '../api';

const Home = () => {
  const [items, setItems] = useState([]);

  const {
    isLoading: isFetchingLayout,
    success: fetchLayoutSuccess,
    error: fetchLayoutError,
    refetch: refetchLayout,
    response: layoutResponse
  } = useAsyncFetch(true, fetchLayout, {page: 'home'});

  const {
    isLoading: isUpdatingLayout,
    success: updateLayoutSuccess,
    error: updateLayoutError,
    refetch: reUpdateLayout
  } = useAsyncFetch(false, updateLayout);

  useEffect(() => {
    if(fetchLayoutSuccess) {
      setItems(layoutResponse.data.layout?.layout || []);
    }
  }, [fetchLayoutSuccess, layoutResponse]);

  useEffect(() => {
    if (updateLayoutSuccess) {
      notification.success({
        message: 'Layout updated successfully!',
        placement: 'bottomRight'
      });
    }
  }, [updateLayoutSuccess]);

  useEffect(() => {
    if (updateLayoutError) {
      notification.error({
        message: 'Layout updated unsuccessfull!',
        placement: 'bottomRight'
      });
    }
  }, [updateLayoutError]);

  const onSubmit = () => {
    reUpdateLayout({page: 'home', layout: items});
  }

  return(
    <>
      <PageHeader
        title="Customise home page"
        // breadcrumb={{ routes }} 
      />
      <LayoutContent>
        {
          isFetchingLayout ?
          <FullPageSpinner /> : 
          <>
            <DragAndDrop refetchLayout={refetchLayout} items={items} setItems={setItems}/>
            <ButtonWrapper>
              <Button disabled={isUpdatingLayout} onClick={onSubmit} type="primary" size="large">Save</Button>
            </ButtonWrapper>
          </>
        }
      </LayoutContent>
    </>
  );
}

export default Home;