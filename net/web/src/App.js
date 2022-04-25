import login from './login.png';
import { AppContextProvider } from './AppContext/AppContext';
import { AccountContextProvider } from './AppContext/AccountContext';
import { ProfileContextProvider } from './AppContext/ProfileContext';
import { ArticleContextProvider } from './AppContext/ArticleContext';
import { GroupContextProvider } from './AppContext/GroupContext';
import { CardContextProvider } from './AppContext/CardContext';
import { ChannelContextProvider } from './AppContext/ChannelContext';
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
    <ChannelContextProvider>
      <CardContextProvider>
        <GroupContextProvider>
          <ArticleContextProvider>
            <ProfileContextProvider>
              <AccountContextProvider>
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
                          <Route path="conversation/:cardId/:channelId" element={
                            <ConversationContextProvider>
                              <Conversation />
                            </ConversationContextProvider>
                          } />
                          <Route path="conversation/:channelId" element={
                            <ConversationContextProvider>
                              <Conversation />
                            </ConversationContextProvider>
                          } />
                        </Route>
                      </Routes>
                    </Router>   
                  </div>
                </AppContextProvider>
              </AccountContextProvider>
            </ProfileContextProvider>
          </ArticleContextProvider>
        </GroupContextProvider>
      </CardContextProvider>
    </ChannelContextProvider>
  );
}

export default App;
