import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Item, Image, Input, Button, Feed, Icon, Loader, Dropdown } from 'semantic-ui-react';
import moment from 'moment';

import url from '../url';
import Header from './Header';

import { onLogin } from '../../actions';
const removeMd = require('remove-markdown');

// Rendering each post in Home Component
class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile_image: ''
    }
  }

  componentDidMount() {
    this.mounted = true;
    fetch(url + `/${this.props.post.author}/profile-image`)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          if (this.mounted) {
            this.setState({
              profile_image: responseJson.profile_image
            })
          }
        }
      })
      .catch(err => console.log("Error: ", err))
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { post, index } = this.props;
    return (
      <Item
        style={{ backgroundColor: "#ffffff", display: "flex", justifyContent: "space-between",
        width: "800px", border: "solid 1px #f3f3f3", paddingTop: "18px", paddingBottom: "18px",
        paddingLeft: "32px", paddingRight: "32px", margin: "0px" }}
        key={index + post.permlink + '-item'}>
        <Item.Content style={{ width: "600px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Item.Meta>
            <span className="post-list-category">
              {post.category.toUpperCase()}
            </span>
          </Item.Meta>
          <Link
            to={`/post/${post.author}/${post.permlink}`}
            className="link"
            style={{ textDecoration: 'none' }}>
              <Item.Header style={{ fontSize: "16px" }}>{post.title}</Item.Header>
          </Link>
          <div
            style={{ overflow: "hidden", height: "50px", margin: "10px", marginLeft: "0px" }}>
            <Link
              to={`/post/${post.author}/${post.permlink}`}
              className="link"
              style={{ textDecoration: 'none' }}>
                <span className="post-content-preview">{removeMd(post.body).slice(0, 180) + '...'}</span>
            </Link>
          </div>
          <Item.Description style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* profile */}
              <Link
                to={`/@${post.author}`}
                className="link"
                style={{ textDecoration: 'none' }}>
                  <Image
                    onError={(e) => {e.target.onerror = null; e.target.src='https://react.semantic-ui.com/images/wireframe/square-image.png'}}
                    style={{ marginRight: "10px" }}
                    src={ this.state.profile_image
                      ? this.state.profile_image
                      : 'https://react.semantic-ui.com/images/wireframe/square-image.png'
                    } avatar />
              </Link>
              <Link
                to={`/@${post.author}`}
                className="link"
                style={{ textDecoration: 'none' }}>
                  <span className="post-list-author" style={{ marginRight: "8px" }}>
                    {post.author}
                  </span>
              </Link>
              <span className="Divider-dot" style={{ marginRight: "8px" }}></span>
              <span className="post-list-time">{moment(post.created).fromNow()}</span>
            </div>
            <div style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
              {/* reward */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="img/dollar.svg"/>
                <span className="post-list-num">{post.reward.split(' ')[0]}</span>
              </div>
              <span className="Divider-dot" style={{ margin: "10px" }}></span>
              {/* votes */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="img/star.svg"/>
                <span className="post-list-num">{post.votes}</span>
              </div>
              <span className="Divider-dot" style={{ margin: "10px" }}></span>
              {/* comment */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="img/comment.svg"/>
                <span className="post-list-num">{post.children}</span>
              </div>
            </div>
          </Item.Description>
        </Item.Content>
        {post.image
          ? <Link
              to={`/post/${post.author}/${post.permlink}`}
              className="link"
              style={{ textDecoration: 'none' }}>
                <img
                  style={{ maringLeft: "20px", width: "150px", height: "150px", objectFit: "contain" }}
                  src={post.image}/>
            </Link>
          : <Link
              to={`/post/${post.author}/${post.permlink}`}
              className="link"
              style={{ textDecoration: 'none' }}>
                <img
                  style={{ maringLeft: "20px", width: "150px", height: "150px", objectFit: "contain" }}
                  src='https://react.semantic-ui.com/images/wireframe/image.png'/>
            </Link>
        }
      </Item>
    )
  }

}


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      accessToken: '',
      category: 'fashion',
      posts: [],
      loading: true,
      active: [true, false]
    }
  }

  componentDidMount() {
    this.mounted = true;
    // load posts
    this.makeRemoteRequest();
    console.log("user, access-token ", this.props.user, this.props.accessToken);
    // if user is not saved in redux storage
    if (!this.props.user) {
      let access_token = new URLSearchParams(document.location.search).get('access_token');
      let username = new URLSearchParams(document.location.search).get('username');
      console.log("at, user ", access_token, username);
      if (access_token && username) {
          // clear URL params
          window.history.pushState({}, document.title, "/");
          let userInfo = {
              accessToken: access_token,
              user: username
          }
          // store user and accessToken information in redux storage
          this.props.loadUser(userInfo);
          // set token
          fetch(url + `/set/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              accessToken: access_token,
              username: username
            })
          })
      }
    }
  }

  makeRemoteRequest() {
    // load posts that correspond to the given category
    fetch(url + `/posts?filter=trending&tag=${this.state.category}`)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          console.log("successfully mounted posts");
          if (this.mounted) {
            this.setState({
              posts: responseJson.posts,
              loading: false
            })
          }
        }
      })
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  changeCategory(e, data, active) {
    console.log(active);
    this.setState({
      loading: true,
      active: active,
      category: data.value
    }, () => this.makeRemoteRequest());
  }

  renderIcon() {
    return (
      <img style={{ width: "32px", height: "32px" }} src='img/rectangle-arrow-down.svg'/>
    )
  }

  renderDropdown() {
    // dropdown for changing category: Right now has categories - Fashion & Makeup
    return (
      <Dropdown
        style={{ display: "flex", alignItems: "flex-end", marginBottom: "7px", marginLeft: "20px" }}
        icon={this.renderIcon()}>
        <Dropdown.Menu style={{ left: "-80px", top: "100px", borderRadius: "0px" }}>
          <Dropdown.Header icon='tags' content='Filter by category' />
          <Dropdown.Divider />
          {/* fashion / makeup */}
          <Dropdown.Item
            active={this.state.active[0]}
            style={{display: "flex", justifyContent: "center", fontWeight: "500" }}
            value='fashion' text='Fashion' onClick={(e, data) => this.changeCategory(e, data, [true, false])} />
          <Dropdown.Item
            active={this.state.active[1]}
            style={{display: "flex", justifyContent: "center", fontWeight: "500" }}
            value='makeup' text='Makeup' onClick={(e, data) => this.changeCategory(e, data, [false, true])} />
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  render() {
    return (
      <div>
          <div style={{ height: "100vh" }}>
              {/* Background Image */}
              <img src="img/bg2.png" className="BG-image"/>

              {/* Header */}
              <Header />

              {/* Home Header */}
              <div className="home-header">
                  {/* Filter */}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                      <div>
                        <div className="FILTER">
                            {this.state.category.toUpperCase()}
                        </div>
                        <div className="Rectangle-filter"></div>
                      </div>
                      {this.renderDropdown()}
                  </div>

                  {/* Posts */}
                  { !this.state.loading
                    ? <Item.Group
                        style={{ overflow: "overlay", height: "60vh", display: "flex", flexDirection: "column",
                                  justifyContent: "center", alignItems: "center" }}>
                        {this.state.posts.map((post, index) =>
                          <div key={index + post.permlink + '-div'}>
                            <Post post={post} index={index}/>
                            <div key={index + post.permlink + '-margin'} style={{ marginBottom: "10px" }}></div>
                          </div>
                        )}
                      </Item.Group>
                    : <div style={{ width: "800px", height: "60vh", display: "flex", alignItems: "center" }} >
                        <Loader size="big" active inline='centered' />
                      </div>
                  }

                  {/* 더보기 */}
                  <div
                    style={{ marginBottom: "50px", width: "100px", height: "40px",
                    border: "solid 1px #000000", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Link
                      to={{
                        pathname: "/posts",
                        search: `?category=${this.state.category}&filter=trending`
                      }}
                      style={{ textDecoration: 'none' }}>
                      <div style={{ display: "flex", alignItems: "center"}}>
                        <img src="/img/plus.svg"/>
                        <span style={{ color: '#000000' }}>더보기</span>
                      </div>
                    </Link>
                  </div>

              </div>

          </div>
      </div>
    )
  }
}


Home.propTypes = {
    loadUser: PropTypes.func,
    user: PropTypes.string,
    accessToken: PropTypes.string,
};

const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        accessToken: state.userReducer.accessToken
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadUser: (userInfo) => dispatch(onLogin(userInfo)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
