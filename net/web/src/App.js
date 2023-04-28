
import 'antd/dist/reset.css';
import Colors from 'constants/Colors';
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { AppContextProvider } from 'context/AppContext';
import { AccountContextProvider } from 'context/AccountContext';
import { ProfileContextProvider } from 'context/ProfileContext';
import { CardContextProvider } from 'context/CardContext';
import { ChannelContextProvider } from 'context/ChannelContext';
import { StoreContextProvider } from 'context/StoreContext';
import { UploadContextProvider } from 'context/UploadContext';
import { ViewportContextProvider } from 'context/ViewportContext';
import { ConversationContextProvider } from 'context/ConversationContext';
import { RingContextProvider } from 'context/RingContext';

import { AppWrapper } from 'App.styled';
import { Root } from './root/Root';
import { Access } from './access/Access';
import { Session } from './session/Session';
import { Dashboard } from './dashboard/Dashboard';

import { ConfigProvider } from 'antd';

function App() {

  return (
    <UploadContextProvider>
      <ChannelContextProvider>
        <CardContextProvider>
          <ProfileContextProvider>
            <StoreContextProvider>
              <AccountContextProvider>
                <RingContextProvider>
                  <ViewportContextProvider>
                    <AppContextProvider>
                      <AppWrapper>
                        <ConfigProvider theme={{ token: {
                            colorPrimary: Colors.primary,
                            colorLink: Colors.primary,
                            colorLinkHover: Colors.background,
                          } }}>
                          <Router>
                            <Routes>
                              <Route path="/" element={ <Root /> } />
                              <Route path="/dashboard" element={ <Dashboard /> } />
                              <Route path="/admin" element={ <Access mode="admin" /> } />
                              <Route path="/login" element={ <Access mode="login" /> } />
                              <Route path="/create" element={ <Access mode="create" /> } />
                              <Route path="/session" element={
                                <ConversationContextProvider>
                                  <Session />
                                </ConversationContextProvider>
                              }>
                              </Route>
                            </Routes>
                          </Router>
                        </ConfigProvider>
                      </AppWrapper>
                    </AppContextProvider>
                  </ViewportContextProvider>
                </RingContextProvider>
              </AccountContextProvider>
            </StoreContextProvider>
          </ProfileContextProvider>
        </CardContextProvider>
      </ChannelContextProvider>
    </UploadContextProvider>
  );
}

export default App;
