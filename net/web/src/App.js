import login from './login.png';
import { AppContextProvider } from './AppContext/AppContext';
import { ConversationContextProvider } from './ConversationContext/ConversationContext';
import { Home } from './Home/Home';
import { Login } from './Login/Login';
import { Create } from './Create/Create';
import { User } from './User/User';
import { Profile } from './User/Profile/Profile';
import { Contact } from './User/Contact/Contact';
import { Conversation } from './User/Conversation/Conversation';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import 'antd/dist/antd.min.css'; 

function App() {

  return (
    <AppContextProvider>
      <div style={{ position: 'absolute', width: '100vw', height: '100vh', backgroundColor: '#8fbea7' }}>
        <img src={login} alt="" style={{ position: 'absolute', width: '33%', bottom: 0, right: 0 }}/>
      </div>
      <div style={{ position: 'absolute', width: '100vw', height: '100vh' }}>
        <Router>
          <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="/login" element={ <Login /> } />
            <Route path="/create" element={ <Create /> } />
            <Route path="/user" element={ <User /> }>
              <Route path="profile" element={<Profile />} />
              <Route path="contact/:guid" element={<Contact />} />
              <Route path="conversation/:card/:channel" element={
                <ConversationContextProvider>
                  <Conversation />
                </ConversationContextProvider>
              } />
              <Route path="conversation/:channel" element={
                <ConversationContextProvider>
                  <Conversation />
                </ConversationContextProvider>
              } />
            </Route>
          </Routes>
        </Router>   
      </div>
    </AppContextProvider>
  );
}

export default App;
