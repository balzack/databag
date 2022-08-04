
import 'antd/dist/antd.min.css'; 
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { AppContextProvider } from 'context/AppContext';
import { AccountContextProvider } from 'context/AccountContext';
import { ProfileContextProvider } from 'context/ProfileContext';
import { ArticleContextProvider } from 'context/ArticleContext';
import { GroupContextProvider } from 'context/GroupContext';
import { CardContextProvider } from 'context/CardContext';
import { ChannelContextProvider } from 'context/ChannelContext';
import { StoreContextProvider } from 'context/StoreContext';
import { UploadContextProvider } from 'context/UploadContext';
import { ViewportContextProvider } from 'context/ViewportContext';

import { AppWrapper } from 'App.styled';
import { Root } from './root/Root';
import { Access } from './access/Access';
import { Session } from './session/Session';
import { Admin } from './admin/Admin';

function App() {

  return (
    <UploadContextProvider>
      <ChannelContextProvider>
        <CardContextProvider>
          <GroupContextProvider>
            <ArticleContextProvider>
              <ProfileContextProvider>
                <AccountContextProvider>
                  <StoreContextProvider>
                    <ViewportContextProvider>
                      <AppContextProvider>
                        <AppWrapper>
                          <Router>
                            <Routes>
                              <Route path="/" element={ <Root /> } />
                              <Route path="/login" element={ <Access mode="login" /> } />
                              <Route path="/create" element={ <Access mode="create" /> } />
                              <Route path="/session" element={ <Session /> } />
                              <Route path="/admin" element={ <Admin /> } />
                            </Routes>
                          </Router>
                        </AppWrapper>
                      </AppContextProvider>
                    </ViewportContextProvider>
                  </StoreContextProvider>
                </AccountContextProvider>
              </ProfileContextProvider>
            </ArticleContextProvider>
          </GroupContextProvider>
        </CardContextProvider>
      </ChannelContextProvider>
    </UploadContextProvider>
  );
}

export default App;
