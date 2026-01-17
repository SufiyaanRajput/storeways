import "antd/dist/antd.css";
import "react-quill/dist/quill.snow.css";
import "normalize.css/normalize.css";
import AppRouter from "./routers/AppRouter";
import GlobalStyle from "./styles/GlobalStyle";
import { createContext, useContext } from "react";

const AppConfigContext = createContext(null);

export function useAppConfig() {
  const ctx = useContext(AppConfigContext);
  if (!ctx) throw new Error("AppConfigProvider missing");
  return ctx;
}

function App({ config }) {
  return (
    <AppConfigContext.Provider value={config}>
      <div className="App">
        <GlobalStyle />
        <AppRouter />
      </div>
    </AppConfigContext.Provider>
  );
}

export default App;

