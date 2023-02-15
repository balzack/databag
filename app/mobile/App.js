import React from 'react';
import { NativeRouter } from "react-router-native";
import { Routes, Route } from 'react-router-dom';
import { Root } from 'src/root/Root';
import { StoreContextProvider } from 'context/StoreContext';
import { UploadContextProvider } from 'context/UploadContext';
import { AppContextProvider } from 'context/AppContext';
import { AccountContextProvider } from 'context/AccountContext';
import { ProfileContextProvider } from 'context/ProfileContext';
import { CardContextProvider } from 'context/CardContext';
import { ChannelContextProvider } from 'context/ChannelContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ConversationContextProvider } from 'context/ConversationContext';
import { LogBox } from 'react-native';

// silence warning: Sending `onAnimatedValueUpdate` with no listeners registered
//LogBox.ignoreLogs(['Sending']);

export default function App() {

  return (
    <StoreContextProvider>
      <UploadContextProvider>
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
                        </Routes>
                      </NativeRouter>
                    </SafeAreaProvider>
                  </AppContextProvider>
                </ConversationContextProvider>
              </ProfileContextProvider>
            </AccountContextProvider>
          </ChannelContextProvider>
        </CardContextProvider>
      </UploadContextProvider>
    </StoreContextProvider>
  );
}

