import { MainMenu, Footer } from 'themes/classic/common';

function MyApp({ Component, pageProps }) {
  return(
    <>
      <MainMenu />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp
