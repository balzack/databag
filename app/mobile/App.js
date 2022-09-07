import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppContextProvider } from 'context/AppContext';
import { NativeRouter } from "react-router-native";
import { Routes, Route } from 'react-router-dom';
import { Root } from './root/Root';
import { Access } from './access/Access';
import { Session } from './session/Session';
import { Admin } from './admin/Admin';

export default function App() {
  return (
    <AppContextProvider>
      <NativeRouter>
        <Routes>
          <Route path="/" element={ <Root /> } />
          <Route path="/admin" element={ <Admin /> } />
          <Route path="/login" element={ <Access mode="login" /> } />
          <Route path="/create" element={ <Access mode="create" /> } />
          <Route path="/session" element={ <Session/> } />
        </Routes>
      </NativeRouter>
    </AppContextProvider>
  );
}

