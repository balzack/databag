import 'react-native-gesture-handler';
import React from 'react';
import { NativeRouter } from "react-router-native";
import { Routes, Route } from 'react-router-dom';
import { Root } from 'src/root/Root';
import { Access } from 'src/access/Access';
import { Session } from 'src/session/Session';
import { Admin } from 'src/admin/Admin';
import { StoreContextProvider } from 'context/StoreContext';
import { AppContextProvider } from 'context/AppContext';
import { AccountContextProvider } from 'context/AccountContext';
import { ProfileContextProvider } from 'context/ProfileContext';
import { CardContextProvider } from 'context/CardContext';
import { ChannelContextProvider } from 'context/ChannelContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ConversationContextProvider } from 'context/ConversationContext';

export default function App() {

  return (
    <StoreContextProvider>
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
                        <Route path="/admin" element={ <Admin /> } />
                        <Route path="/login" element={ <Access mode="login" /> } />
                        <Route path="/reset" element={ <Access mode="reset" /> } />
                        <Route path="/create" element={ <Access mode="create" /> } />
                        <Route path="/session" element={ <NavigationContainer><Session/></NavigationContainer> } />
                      </Routes>
                    </NativeRouter>
                  </SafeAreaProvider>
                </AppContextProvider>
              </ConversationContextProvider>
            </ProfileContextProvider>
          </AccountContextProvider>
        </ChannelContextProvider>
      </CardContextProvider>
    </StoreContextProvider>
  );
}

