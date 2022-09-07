import React from 'react';
import { NativeRouter } from "react-router-native";
import { Routes, Route } from 'react-router-dom';
import { Root } from 'src/root/Root';
import { Access } from 'src/access/Access';
import { Session } from 'src/session/Session';
import { Admin } from 'src/admin/Admin';
import { AppContextProvider } from 'context/AppContext';

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

