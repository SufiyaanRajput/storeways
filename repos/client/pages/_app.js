import 'antd/dist/antd.css';
import 'react-multi-carousel/lib/styles.css';
import ClassicApp from 'themes/classic/app';
import { fetchStore } from 'themes/api';
import { useAsyncFetch } from 'themes/utils/hooks';
import storeContext from '../store/store';
import userContext from '../store/users';
import Spinner from '@/base/Spinner/Spinner';
import { ThemeProvider } from 'styled-components';
import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import Script from 'next/script'
import '../styles/global.scss';

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const store = useContext(storeContext);
  const user = useContext(userContext);
  const {success: fetchStoreSuccess, error, isLoading: fetchingStore, response: storeResponse} = useAsyncFetch(true, fetchStore);
  const {store: {theme = {}} = {} = {}} = storeResponse?.data?.store?.settings || {};

  useEffect(() => {
    if (!user.name) {
      user.load();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (fetchStoreSuccess) {
      store.setStore(storeResponse.data.store);
    }
  }, [fetchStoreSuccess, store, storeResponse]);

  console.log(router.pathname)

  if (!fetchingStore) {
    if (router.pathname === '/site-not-found') {
      return (
        <Component />
      );
    }
  }

  return(
    <>
        {/* Global site tag (gtag.js) - Google Analytics */}
        {/* {
          googleAnalytics.active &&
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics.tagId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              
                gtag('config', '${googleAnalytics.tagId}');
              `}
            </Script>
          </>
        } */}
        {
           fetchingStore ?
           <div style={{
             position: 'absolute',
             left: '50%',
             top: '50%',
             transform: `translate(-50%, -50%)`}}>
             <Spinner />
           </div> :
           <ThemeProvider theme={theme}>
             <ClassicApp Component={Component} pageProps={pageProps}/>
           </ThemeProvider>
        }
    </>
  );
}

export default MyApp
