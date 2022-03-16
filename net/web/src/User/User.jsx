import React, { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AppContext } from '../AppContext/AppContext';
import { useUser } from './useUser.hook';
import { Input, Button } from 'antd';
                                           
export function User() {

  const { state, actions } = useUser()

  return <Button type="primary" onClick={() => actions.onLogout()} style={{ alignSelf: 'center', marginTop: '16px', width: '33%' }}>Sign Out</Button>
}

