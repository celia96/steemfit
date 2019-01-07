import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from 'react-scroll-up';
import moment from 'moment';
import queryString from 'query-string';

import { Item, Image, Loader, Dropdown } from 'semantic-ui-react';

import url from '../url';
import Header from '../Home/Header';

const removeMd = require('remove-markdown');

// Rendering each post from PostList component
class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile_image: ''
    }
  }

  componentDidMount() {
    this.mounted = true;
    // retrieve author's profile image
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
          style={{ display: "flex", justifyContent: "space-between", width: "800px", border: "solid 1px #f3f3f3",
          paddingTop: "18px", paddingBottom: "18px", paddingLeft: "32px", paddingRight: "32px", margin: "0px" }}
          key={'postlist' + index + post.permlink + '-item' + post.created}>
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
                  <img
                    onError={(e) => {e.target.onerror = null; e.target.src='https://react.semantic-ui.com/images/wireframe/square-image.png'}}
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

// Post List
class PostList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loadingAll: true, // loading all the posts
      loading: false, // when loading more
      category: '',
      query: '',
      active: [false, false],
    }
  }

  componentDidMount() {
    this.mounted = true;
    const query = queryString.parse(this.props.location.search)
    if (query.category) {
      console.log(query.category)
      console.log(query.filter)
      this.setState({
        category: query.category,
        filter: query.filter
      }, () => this.makeRemoteRequest());
    } else {
      this.setState({
        category: 'fashion', // default category
        filter: 'trending' // default filter
      }, () => this.makeRemoteRequest());
    }

  }

  makeRemoteRequest() {
    // retrieve posts with the correspondnig filter and category
    fetch(url + `/posts?filter=trending&tag=${this.state.category}`)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          console.log("successfully mounted posts");
          if (this.mounted) {
            this.setState({
              posts: responseJson.posts,
              loadingAll: false
            })
          }
        }
      })
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadMore() {
    console.log("load more posts");
    this.setState({
      loading: true
    })
    // update posts state
    var postLen = this.state.posts.length;
    fetch(url + `/posts?filter=trending&tag=${this.state.category}&start_permlink=${this.state.posts[postLen-1].permlink}&start_author=${this.state.posts[postLen-1].author}`)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          console.log("successfully mounted posts");
          if (this.mounted) {
            var copy = this.state.posts.slice();
            copy = copy.concat(responseJson.posts.slice(1, 5)); // 5 is a limit
            console.log("copy ", copy);
            this.setState({
              posts: copy,
              loading: false
            })
          }
        }
      })
  }

  changeCategory(e, data) {
    console.log("this.props.history ", this.props.history);
    this.props.history.push(`/posts?category=${data.value}&filter=trending`)
    this.setState({
      loadingAll: true,
      category: data.value
    }, () => this.makeRemoteRequest());
  }

  renderIcon() {
    return (
      <img src='img/rectangle-arrow-down.svg'/>
    )
  }

  renderDropdown() {
    return (
      <Dropdown icon={this.renderIcon()}>
        <Dropdown.Menu>
          <Dropdown.Header icon='tags' content='Filter by category' />
          <Dropdown.Divider />
          {/* fashion / makeup */}
          <Dropdown.Item
            active={this.state.active[0]}
            style={{display: "flex", justifyContent: "center", fontWeight: "bold"}}
            value='fashion' text='Fashion' onClick={(e, data) => this.changeCategory(e, data)} />
          <Dropdown.Item
            active={this.state.active[1]}
            style={{display: "flex", justifyContent: "center", fontWeight: "bold"}}
            value='makeup' text='Makeup' onClick={(e, data) => this.changeCategory(e, data)} />
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  render () {
    return (
        <div style={{ height: "100vh" }}>
            <Header />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "20px", paddingBottom: "20px" }}>
              <div  style={{ width: "800px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{ fontSize: "2em", fontFamily: "Roboto", fontWeight: "bold", fontStyle: "normal",
                  fontStretch: "condensed", lineHeight: "normal", letterSpacing: "normal", color: "#000000" }}>
                  {this.state.category.toUpperCase()}
                </span>
                {/* <img src='img/rectangle-arrow-down.svg'/> */}
                {this.renderDropdown()}
              </div>
            </div>
            { this.state.loadingAll
              ? <div style={{ display: "flex", justifyContent: "center", margin: "30px" }}>
                  <Loader style={{ width: "800px" }} size="big" active inline='centered' />
                </div>
              : <Item.Group style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  {this.state.posts.map((post, index) =>
                    <Post key={'wrapper-' + index + post.permlink + post.created} post={post} index={index} />
                  )}
                </Item.Group>
            }

            { this.state.loadingAll
              ? null
              : this.state.loading
              ? <div style={{ display: "flex", justifyContent: "center", margin: "30px" }}>
                  <Loader style={{ width: "800px" }} size="big" active inline='centered' />
                </div>
              : <div style={{ display: "flex", justifyContent: "center", margin: "30px" }}>
                  <img onClick={() => this.loadMore()} style={{ width: "800px"}} src='img/arrow-down.svg'/>
                </div>
            }

            <ScrollToTop showUnder={100}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
                width: "40px", height: "40px", border: "solid 1px #000000"}}>
                <img src="img/arrow-up.svg" />
              </div>
            </ScrollToTop>

        </div>

    );
  }
}


export default PostList;
