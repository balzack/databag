import login from './login.png';
import { AppContextProvider } from './context/AppContext';
import { Root } from './components/Root';
import 'antd/dist/antd.css'; 

function App() {

  return (
    <AppContextProvider>
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#8fbea7' }}>
        <img src={login} alt="" style={{ position: 'absolute', width: '33%', bottom: 0, right: 0 }}/>
      </div>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', top: 0, left: 0, width: '100%', height: '100%' }}>     
        <Root />
      </div>
    </AppContextProvider>
  );
}

export default App;
