import "antd/dist/antd.css";
import "react-quill/dist/quill.snow.css";
import "normalize.css/normalize.css";
import AppRouter from "./routers/AppRouter";
import GlobalStyle from "./styles/GlobalStyle";

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <AppRouter />
    </div>
  );
}

export default App;

