import login from './login.png';
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
import 'antd/dist/antd.min.css'; 

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
                        <div style={{ position: 'absolute', width: '100vw', height: '100vh', backgroundColor: '#8fbea7' }}>
                          <img src={login} alt="" style={{ position: 'absolute', width: '33%', bottom: 0, right: 0 }}/>
                        </div>
                        <div style={{ position: 'absolute', width: '100vw', height: '100vh' }}>
                        </div>
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
