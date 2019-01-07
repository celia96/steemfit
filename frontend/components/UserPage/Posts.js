import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Item, Image, Input, Button, Feed, Icon, Loader } from 'semantic-ui-react';

import url from '../url';
import Header from '../Home/Header';

const removeMd = require('remove-markdown');

import { loadProfileImage } from '../../actions';

class Posts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
      loadingMore: false
    }
  }

  componentDidMount() {
    this.mounted = true;
    var user = this.props.match.params["user"]
    this.makeRemoteRequest(user);
  }

  makeRemoteRequest(user) {
    fetch(url + '/' + user + '/posts')
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
      .catch((err) => {
        console.log("Error in getting post ", err);
      })
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.match.params["user"] !== this.props.match.params["user"]) {
      this.props.loadProfileImage('');
      this.setState({
        loading: true
      })
      this.makeRemoteRequest(this.props.match.params["user"]);
    }
  }

  loadMore() {
    console.log("load more posts");
    this.setState({
      loadingMore: true
    })
    // update posts state
    var postLen = this.state.posts.length;
    var user = this.props.match.params["user"];
    fetch(url + `/${user}/posts?start_permlink=${this.state.posts[postLen-1].permlink}&start_author=${this.state.posts[postLen-1].author}`)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          console.log("successfully fetched posts");
          if (this.mounted) {
            var copy = this.state.posts.slice();
            copy = copy.concat(responseJson.posts.slice(1, 5)); // 5 is a limit
            console.log("copy ", copy);
            this.setState({
              posts: copy,
              loadingMore: false
            })
          }
        }
      })
  }

  renderList(post, index) {
    return (
      <Item
        style={{ display: "flex", justifyContent: "space-between", width: "800px", border: "solid 1px #f3f3f3",
        paddingTop: "18px", paddingBottom: "18px", paddingLeft: "32px", paddingRight: "32px", margin: "0px" }}
        key={index + post.permlink + '-item'}>
        <Item.Content style={{ width: "600px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Item.Meta>
            <span className="post-list-category">
              {post.category.toUpperCase()}
              {/* <span className="post-list-category-rectangle"></span> */}
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
                    src=
                    { this.props.profile_image
                      ? this.props.profile_image
                      : 'https://react.semantic-ui.com/images/wireframe/square-image.png'
                    } avatar />
              </Link>
              <Link
                to={`/@${post.author}`}
                className="link"
                style={{ textDecoration: 'none' }}>
                  <span className="post-list-author" style={{ marginRight: "8px" }}>{post.author}</span>
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
                <img style={{ maringLeft: "20px", width: "150px", height: "150px", objectFit: "contain" }} src={post.image}/>
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

  render() {
    return (
      <div>
        { !this.state.loading
          ? <Item.Group style={{ width: "800px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              {this.state.posts.map((post, index) =>
                <div key={index + post.permlink + '-div'}>
                  {this.renderList(post, index)}
                  <div key={index + post.permlink + '-margin'} style={{ marginBottom: "10px" }}></div>
                </div>
              )}
            </Item.Group>
          : <Loader style={{ width: "800px" }} size="big" active inline='centered' />
        }

        { this.state.loading
          ? null
          : this.state.loadingMore
          ? <div style={{ display: "flex", justifyContent: "center", margin: "30px" }}>
              <Loader style={{ width: "800px" }} size="big" active inline='centered' />
            </div>
          : <div style={{ display: "flex", justifyContent: "center", margin: "30px" }}>
              <img onClick={() => this.loadMore()} style={{ width: "800px"}} src='img/arrow-down.svg'/>
            </div>
        }

      </div>
    )
  }
}


Posts.propTypes = {
    profile_image: PropTypes.string
};

const mapStateToProps = (state) => {
    return {
        profile_image: state.profileReducer.profile_image
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadProfileImage: (img) => dispatch(loadProfileImage(img))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Posts);
