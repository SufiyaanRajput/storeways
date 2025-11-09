import 'antd/dist/antd.css';
import 'react-quill/dist/quill.snow.css';
import 'normalize.css/normalize.css';
import './styles/index.css';

import AppRouter from './routers/AppRouter';

function App() {
  return (
    <div className="App">
       <AppRouter />
    </div>
  );
}

export default App;
