import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';


import NoMatch from '../components/NoMatch';


import Home from '../components/Home/Home';
import About from '../components/Home/About';
import Contact from '../components/Home/Contact';


import Menu from '../components/Home/Menu';
import Login from '../components/Home/Login';
import More from '../components/UserPage/Modals/More';


import UserPage from '../components/UserPage/UserPage';
import Posts from '../components/UserPage/Posts';
import Comments from '../components/UserPage/Comments';
import Wallet from '../components/UserPage/Wallet';
import Activity from '../components/UserPage/Activity';


import Editor from '../components/Posts/Editor';
import PostDetail from '../components/Posts/PostDetail';
import PostList from '../components/Posts/PostList';


const Routers = () => (
  <div>
    <Switch>
      {/* put all the routes here */}
      <Route exact path="/" component={Home} />

      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />

      <Route path="/editor" component={Editor} />
      <Route path="/posts" component={PostList} />
      <Route path="/post/:author/:permlink" component={PostDetail} />

      <Route path={`/@:user`} component={UserPage} />

      <Route component={NoMatch}/>

    </Switch>
  </div>
)

const AppContainer = () =>
    <div>
        <Routers />
        {/* Below modals can be opened from any page */}
        <Menu />
        <Login />
    </div>;

export default AppContainer;
