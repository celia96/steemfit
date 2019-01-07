import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import { Item, Image, Input, Button, Feed, Icon, Loader } from 'semantic-ui-react';

import url from '../url';
import Header from '../Home/Header';
import More from './Modals/More';

import { loadProfileImage, openMoreModal, loadCommentDetail } from '../../actions';

class Comments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      loading: true,
      loadingMore: false
    }
  }

  componentDidMount() {
    this.mounted = true;
    console.log("mounting comments");
    var user = this.props.match.params["user"]
    this.makeRemoteRequest(user);
  }

  makeRemoteRequest(user) {
    fetch(url + '/' + user + '/comments')
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          console.log("successfully mounted comments");
          if (this.mounted) {
            this.setState({
              comments: responseJson.comments,
              loading: false
            })
          }
        }
      })
      .catch((err) => {
        console.log("Error in getting comments ", err);
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
    console.log("load more comments");
    this.setState({
      loadingMore: true
    })
    // update comments state
    var len = this.state.comments.length;
    var user = this.props.match.params["user"];
    fetch(url + `/${user}/comments?start_permlink=${this.state.comments[len-1].permlink}&start_author=${this.state.comments[len-1].author}`)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          console.log("successfully fetched comments");
          if (this.mounted) {
            var copy = this.state.comments.slice();
            copy = copy.concat(responseJson.comments.slice(1, 5)); // 5 is a limit
            console.log("copy ", copy);
            this.setState({
              comments: copy,
              loadingMore: false
            })
          }
        }
      })
  }

  openComment(comment) {
    this.props.loadCommentDetail(comment);
    this.props.openModal();
  }

  renderCommentList(comment, index) {
    return (
      <Feed.Event key={index + '-' + 'comment'+ + '-' + comment.parent_permlink}>
        <Feed.Label style={{ marginLeft: "20px" }}>
          <img
            onError={(e) => {e.target.onerror = null; e.target.src='https://react.semantic-ui.com/images/wireframe/square-image.png'}}
            style={{ width: "45px", height: "45px"}} src=
            { this.props.profile_image
              ? this.props.profile_image
              : 'https://react.semantic-ui.com/images/wireframe/square-image.png'
            }
          />
        </Feed.Label>
        <Feed.Content style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          {/* avatar, name, comment, 추천하기, 답글달기, 시간 */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* avatar, name, comment */}
            <Feed.Summary>
              <span className="comment-text">
                <span style={{ paddingRight: "10px" }} className="comment-author">{comment.author}</span>
                <span> {comment.body}</span>
              </span>
            </Feed.Summary>
            {/* 추천하기, 답글달기, 시간 */}
            <Feed.Meta style={{ display: "flex", alignItems: "center" }}>
              <Link to={`/post/${comment.parent_author}/${comment.parent_permlink}`}>
                추천하기
              </Link>
              <div className="oval"></div>
              <Link to={`/post/${comment.parent_author}/${comment.parent_permlink}`}>
                답글달기
              </Link>
              <div className="oval"></div>
              <span>{moment(comment.created).fromNow()}</span>
            </Feed.Meta>
          </div>
          {/* more */}
          <div style={{ display: "flex", marginRight: "20px" }} onClick={() => this.openComment(comment)}>
            <img style={{ cursor: "pointer" }} src='/img/more.svg'/>
          </div>
        </Feed.Content>
      </Feed.Event>
    )
  }

  render() {
    return (
      <div>
        { !this.state.loading
          ? <Feed style={{ width: "800px", display: "flex", flexDirection: "column", border: "solid 1px #e6e6e6", paddingTop: "20px", paddingBottom: "20px" }}>
              {this.state.comments.map((comment, index) =>
                this.renderCommentList(comment, index)
              )}
            </Feed>
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


Comments.propTypes = {
    openModal: PropTypes.func,
    loadCommentDetail: PropTypes.func,
    loadProfileImage: PropTypes.func,
    profile_image: PropTypes.string
};

const mapStateToProps = (state) => {
    return {
        profile_image: state.profileReducer.profile_image
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        openModal: () => dispatch(openMoreModal()),
        loadCommentDetail: (comment) => dispatch(loadCommentDetail(comment)),
        loadProfileImage: (img) => dispatch(loadProfileImage(img))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Comments);
