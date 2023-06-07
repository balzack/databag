import 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { NativeRouter } from "react-router-native";
import { Routes, Route } from 'react-router-dom';
import { StoreContextProvider } from 'context/StoreContext';
import { UploadContextProvider } from 'context/UploadContext';
import { AppContextProvider } from 'context/AppContext';
import { AccountContextProvider } from 'context/AccountContext';
import { ProfileContextProvider } from 'context/ProfileContext';
import { CardContextProvider } from 'context/CardContext';
import { RingContextProvider } from 'context/RingContext'
import { ChannelContextProvider } from 'context/ChannelContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ConversationContextProvider } from 'context/ConversationContext';
import { LogBox, Alert } from 'react-native';
import { Root } from 'src/root/Root';
import { Access } from 'src/access/Access';
import { Dashboard } from 'src/dashboard/Dashboard';
import { Session } from 'src/session/Session';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import {PermissionsAndroid} from 'react-native';

// silence warning: Sending `onAnimatedValueUpdate` with no listeners registered
//LogBox.ignoreLogs(['Sending']);

export default function App() {

  const [sharing, setSharing] = useState();

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

    ReceiveSharingIntent.getReceivedFiles(files => {
      setSharing(files);
    }, 
    (error) =>{
      console.log(error);
    }, 
    'org.coredb.databag'
    );
  }, []);

  const clearSharing = () => {
    setSharing(null);
  };

  return (
    <StoreContextProvider>
      <UploadContextProvider>
        <RingContextProvider>
          <CardContextProvider>
            <ChannelContextProvider>
              <AccountContextProvider>
                <ProfileContextProvider>
                  <ConversationContextProvider>
                    <AppContextProvider>
                      <SafeAreaProvider>
                        <NativeRouter>
                          <Routes>
                            <Route path="/" element={ <Root /> } />
                            <Route path="/admin" element={ <Access mode="admin" /> } />
                            <Route path="/dashboard" element={ <Dashboard /> } />
                            <Route path="/login" element={ <Access mode="login" /> } />
                            <Route path="/reset" element={ <Access mode="reset" /> } />
                            <Route path="/create" element={ <Access mode="create" /> } />
                            <Route path="/session" element={ <Session sharing={sharing} clearSharing={clearSharing} /> } />
                          </Routes>
                        </NativeRouter>
                      </SafeAreaProvider>
                    </AppContextProvider>
                  </ConversationContextProvider>
                </ProfileContextProvider>
              </AccountContextProvider>
            </ChannelContextProvider>
          </CardContextProvider>
        </RingContextProvider>
      </UploadContextProvider>
    </StoreContextProvider>
  );
}

