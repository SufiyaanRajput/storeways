import ErrorPage from "containers/ErrorPage/ErrorPage";

const SiteNotFound = ({ children }) => (
  <ErrorPage>
    <p>Store not found!</p>
  </ErrorPage>
);

export default SiteNotFound;