import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Access } from './Access';
import { Admin } from './Admin';
import { User } from './User';
import 'antd/dist/antd.css';
                                           
export function Root() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Access /> } />
        <Route path="/admin" element={ <Admin /> } />
        <Route path="/user" element={ <User /> } />
      </Routes>
    </Router>
  )
}

