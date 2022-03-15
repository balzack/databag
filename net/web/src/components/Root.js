import React, { useContext, useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext';
                                           
export function Root() {

  return (
    <Router>
        <Routes>
          <Route path="/about" element={ <About /> } />
          <Route path="/topic" element={ <Topic /> } />
          <Route path="/" element={ <Empty /> } />
        </Routes>
    </Router>
  )
}

function About() {
  return (<div>ABOUT</div>)
}

function Topic() {
  return (<div>TOPIC</div>)
}

function Empty() {

  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(appContext)
    if (appContext.state) {
      if (appContext.state.appToken) {
        navigate("/topic")
      } else {
        navigate("/about")
      }
    } 
  })

  return (<div>EMPTY</div>)
}

