import React from 'react';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Home from './Components/Home';
import Landing from './Components/Landing';
import Register from './Components/Register';
import EditFriend from './Components/EditFriend';
import EditFavorite from './Components/EditFavorite';
import PrivateRoute from './hocs/PrivateRoute';
import UnPrivateRoute from './hocs/UnPrivateRoute';
import {BrowserRouter as Router, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar/>
      <Route exact path="/" component={Home}/>
      <UnPrivateRoute path="/login" component={Login}/>
      <UnPrivateRoute path="/register" component={Register}/>
      <PrivateRoute path="/landing"  component={Landing}/>
      <PrivateRoute path="/user/friend/:id" component={EditFriend}/>
      <PrivateRoute path="/user/favorites/:id" component={EditFavorite}/>
    </Router>
  );
}

export default App;
