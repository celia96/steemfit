import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import RichTextEditor from 'react-rte';
import { Image, Input, Button, Comment, Form, Divider, TextArea, Loader, Rail } from 'semantic-ui-react';
import ScrollToTop from 'react-scroll-up';
import { StickyContainer, Sticky } from 'react-sticky';
import { Link as ScrollLink, Events } from 'react-scroll'
import moment from 'moment';
import queryString from 'query-string';

import url from '../url';
import Header from '../Home/Header';
import PostComment from './PostComment';

const ReactMarkdown = require('react-markdown')

import { closeMenuOpenLogin } from '../../actions';

class PostDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      value: undefined,
      comment: RichTextEditor.createEmptyValue(),
      following: false,
      contextRef: null,

      commented: false, // whether the logged-in user has commented on this post
      voted: false, // whether the logged-in user has voted this post
      following: false, // whehter the logged-in use is following the author of this post

      loadingVoted: false, // loading until checking whehter the logged-in user has voted this post is done
      loadingFollowed: true, // loading until checking whehter the logged-in user has followed the author of this post is done
      loadingComments: false, // loading until checking whehter the logged-in user has replied to this post is done

      category: '',
      title: '',
      created: '',
      author: '',
      profile_image: '',
      body: '',
      reward: '',
      tags: [],
      permlink: '',
      votes: '',
      children: '',
      voters: []
    }

  }

  componentDidMount() {
    this.mounted = true;
    // load post detail
    var path = this.props.location.pathname.split('/');
    console.log("path ", path);
    var permlink = path[path.length-1];
    var author = path[path.length-2];
    fetch(url + `/post/details?author=${author}&permlink=${permlink}`)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          console.log("detail ", responseJson.detail);
          const { category, title, created, author, body, reward, tags, permlink, votes, children, voters } = responseJson.detail;
          if (this.mounted) {
            this.setState({
              category: category,
              title: title,
              created: created,
              author: author,
              body: body,
              reward: reward,
              tags: tags,
              permlink: permlink,
              votes: votes,
              children: children,
              voters: voters,
              loadingComments: true
            })
            // check whehter the logged-in user has voted this post or not
            voters.forEach(voter => {
              if (this.props.user && voter.voter === this.props.user) {
                if (voter.weight > 0) {
                  this.setState({
                    voted: true
                  })
                  console.log("voted");
                }
              }
            })
          }
        }
        // load author's profile image
        return fetch(url + `/${author}/profile-image`)
      })
      .then((response2) => response2.json())
      .then((responseJson2) => {
        if (responseJson2.success) {
          if (this.mounted) {
            this.setState({
              profile_image: responseJson2.profile_image
            })
          }
        }
        // load post comments
        return fetch(url + `/post/comments?author=${author}&permlink=${permlink}`)
      })
      .then((response3) => response3.json())
      .then((responseJson3) => {
        if (responseJson3.success) {
          console.log("comments ", responseJson3.comments);
          if (this.mounted) {
            this.setState({
              comments: responseJson3.comments,
              loadingComments: false
            })
          }
        }
      })

    // check whether the logged-in user is following the author of this post
    if (this.props.user) {
      fetch(url + `/${this.props.user}/following/${author}`)
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.following) {
            this.setState({
              following: true,
              loadingFollowed: false
            })
          } else {
            this.setState({
              following: false,
              loadingFollowed: false
            })
          }
        })
    } else {
      this.setState({
        loadingFollowed: false
      })
    }
    // Scroll Up
    Events.scrollEvent.register('begin', function () {
      console.log("begin", arguments);
    });
    Events.scrollEvent.register('end', function () {
      console.log("end", arguments);
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  makeRemoteRequest() {
    // this function should be called after replying to this post
    console.log("new remote request");
    fetch(url + `/post/comments?author=${this.state.author}&permlink=${this.state.permlink}`)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          if (this.mounted) {
            this.setState({
              comments: responseJson.comments,
              children: responseJson.comments.length,
              comment: RichTextEditor.createEmptyValue()
            })
            console.log("comments ", this.state.comments);
          }
        }
      })
  }

  onChangeCommented() {
    this.setState({
      commented: true
    })
  }

  submitFollow(author) {
    console.log("follow");
    var at = this.props.accessToken;
    var user = this.props.user;
    var author = author;
    if (this.props.user && at) {
      this.setState({
        loadingFollowed: true
      })
      fetch('https://steemconnect.com/api/broadcast', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${at}`,
          'Content-Type': 'application/json' // 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          "operations": [
            ["custom_json", {
              "required_auths": [],
              "required_posting_auths": [`${user}`],
      		    "id": "follow",
              "json": `[\"follow\",{\"follower\":\"${user}\",\"following\":\"${author}\",\"what\":[\"blog\"]}]`
            }]
          ]
        })
      }).then(response => {
        console.log("response ", response);
        if (response.ok) {
          console.log("good");
          this.setState({
            following: true,
            loadingFollowed: false
          })
        }
      }).catch(err => {
        console.log("Error in follow ", err);
      })
    } else {
      console.log("log in please");
      this.props.openLogin();
    }
  }

  submitComment() {
    console.log("submit comment");
    var at = this.props.accessToken;
    var date = new Date();
    date = date.getTime();
    var permlink = this.state.author + "-re-" + this.props.user.toLowerCase() + "-" + this.state.permlink + "-" + date
    console.log("comment body: ", this.state.comment);
    console.log("body markdown ", this.state.comment.toString("markdown"));
    if (this.props.user && at) {
      fetch('https://steemconnect.com/api/broadcast', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${at}`,
          'Content-Type': 'application/json' // 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          "operations": [
             ["comment", {
               "parent_author": this.state.author,
               "parent_permlink": this.state.permlink,
               "author": this.props.user,
               "permlink": permlink,
               "title": "",
               "body": this.state.comment.toString("markdown"),
               "json_metadata": JSON.stringify({})
             }]
           ]
        })
      }).then(response => {
        console.log("response ok? ", response.ok);
        if (response.ok) {
          this.makeRemoteRequest();
        }
      }).catch(err => {
        console.log("Error in posting ", err);
      })
    } else {
      console.log("open log in modal");
      this.props.openLogin();
    }
  }

  submitVote() {
    console.log("submit a vote");
    var at = this.props.accessToken;
    if (this.props.user && at) {
      this.setState({
        loadingVoted: true
      })
      fetch('https://steemconnect.com/api/broadcast', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${at}`,
          'Content-Type': 'application/json' // 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          "operations": [
             ["vote", {
               "voter": this.props.user,
               "author": this.state.author,
               "permlink": this.state.permlink,
               "weight": 10000
             }]
           ]
        })
      }).then(response => {
        console.log("response ok? ", response.ok);
        console.log("response ", response);
        if (response.ok) {
          console.log("good");
          this.setState({
            voted: true,
            votes: this.state.votes + 1,
            loadingVoted: false
          })
        } else {
          console.log("error in voting");
        }
      }).catch(err => {
        console.log("Error in posting ", err);
      })

    } else {
      console.log("open log in modal");
      this.props.openLogin();
    }
  }


  onChangeSource(e) {
    let source = e.target.value; // markdown string
    let oldValue = this.state.comment; // editorstate
    this.setState({
      comment: oldValue.setContentFromString(source, 'markdown'),
    });
  }

  markdownInput() {
    // write in markdown
    return (
        <div>
            <Form>
              <TextArea
                style={{ height: "100px", width: "800px", border: "0px" }}
                placeholder='글에 대해서 이야기를 나누어 보세요! @username 태그를 사용할 수 있습니다.'
                value={this.state.comment.toString("markdown")}
                onChange={(e) => this.onChangeSource(e)}
              />
            </Form>
            <div style={{ width: "800px", display: "flex", justifyContent: "flex-end", backgroundColor: "#ffffff" }}>
              <div className="comment-submit" onClick={() => this.submitComment()}>
                <span style={{ cursor: "pointer" }} className="comment-submit-txt">확인</span>
              </div>
            </div>
            <Divider />
            <div>
                <span style={{ fontWeight: "500" }}>Preview</span>
                {this.renderPreview()}
            </div>
        </div>
    )
  }

  renderPreview() {
    // preview
    return (
        <div>
            <RichTextEditor
              style={{ height: "150px" }}
              value={this.state.comment}
              className="preview-comment"
              placeholder=""
              readOnly={true}
            />
        </div>
    )
  }

  renderDetail() {
    const { category, title, author, profile_image, created, reward, body, tags, votes, children } = this.state;
    return (
      <StickyContainer style={{ display: "flex", justifyContent: "center", margin: "15px", marginLeft: "50px", marginRight: "50px",
        paddingLeft: "50px", paddingRight: "50px", height: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* category */}
          <div style={{ width: "800px", display: "flex", justifyContent: "center", margin: "10px" }}>
            <span className="detail-category">{category}</span>
          </div>
          {/* title */}
          <div style={{ width: "800px", display: "flex", justifyContent: "center" }}>
            <span className="detail-title">{title}</span>
          </div>
          {/* author & follow button & created & reward */}
          <div className="detail-author">
            {/* author & follow button & created */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "10px" }}>
                <Link to={`/@${author}`} style={{ textDecoration: 'none' }}>
                  <Image
                    onError={(e) => {e.target.onerror = null; e.target.src='https://react.semantic-ui.com/images/wireframe/square-image.png'}}
                    style={{ width: "40px", height: "40px" }}
                    src={ profile_image
                      ? profile_image
                      : 'https://react.semantic-ui.com/images/wireframe/square-image.png'
                    } avatar />
                </Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", marginRight: "10px" }}>
                <Link to={`/@${author}`} style={{ textDecoration: 'none' }}>
                  <span className="detail-author-name">{author}</span>
                </Link>
                <span className="detail-created">{moment(created).fromNow()}</span>
              </div>
              { this.state.loadingFollowed
                ? <div className="detail-follow-btn">
                    <Loader size="tiny" active inline='centered'/>
                  </div>
                : this.state.following
                ? <div className="detail-follow-btn">
                    <span
                      style={{ display: "flex", alignItems: "center" }}
                      className="detail-follow">팔로잉</span>
                  </div>
                : <div onClick={() => this.submitFollow(author)} className="detail-follow-btn">
                    <span
                      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                      className="detail-follow">팔로우</span>
                  </div>
              }
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div><img src="../../img/dollar.svg"/></div>
              <div><span className="detail-price">{reward.split(' ')[0]}</span></div>
            </div>
          </div>
          {/* body */}
          <div className="detail-body">
            <ReactMarkdown source={body} escapeHtml={false}/>
          </div>

          {/* divider */}
          <div style={{ margin: "40px" }}></div>
          <div style={{ width: "792px", height: "1px", backgroundColor: "#e6e6e6" }}></div>
          <div style={{ margin: "10px" }}></div>

          {/* tags */}
          <div className="detail-tag-container">
            <div style={{ margin: "5px" }}><span className="detail-tag">TAGS</span></div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {tags.map((tag, index) =>
                <div key={index + '-' + tag} className="detail-tags">
                  <span style={{ display: "flex", alignItems: "center" }} className="detail-tags-text">{tag}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {this.renderSticky()}

      </StickyContainer>
    )
  }

  renderSticky() {
    return (
      <Sticky>
        {({ style }) =>
        <div style={Object.assign({}, style, { display: "flex", width: "0px" })}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center",
            width: "40px", height: "80px" }}>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "center",
              width: "40px", height: "40px" }}>
              <span className="detail-sticky">{this.state.children}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
              width: "40px", height: "40px" }}>
              <span className="detail-sticky">{this.state.votes}</span>
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", justifyContent: "center",
            width: "40px", height: "80px", border: "solid 1px #e6e6e6", zIndex: "2" }}>
            <ScrollLink activeClass="active" to="comment" spy={true} smooth={true} duration={500}>
              <div
                style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                width: "40px", height: "40px" }}>
                  { this.state.commented
                    ? <img src='img/comment-fill.svg'/>
                    : <img src='img/comment.svg'/>
                  }
              </div>
            </ScrollLink>
            <div
              style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              width: "40px", height: "40px" }}>
                { this.state.loadingVoted
                  ? <Loader size="tiny" active inline='centered'/>
                  : this.state.voted
                  ? <img src='img/star-fill.svg'/>
                  : <img onClick={() => this.submitVote()} src='img/star.svg'/>
                }
            </div>
          </div>
        </div>
        }
      </Sticky>
    )
  }

  renderComments() {
    const { user, accessToken, openLogin } = this.props;
    return (
      <div name="comment" style={{ backgroundColor: "#f8f8f8" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* number of comments */}
          <div style={{ display: "flex", alignItems: "center", width: "800px", marginTop: "20px", marginBottom: "20px" }}>
            <div className="detail-comment-title">댓글 </div>
            <div className="detail-comment-num">{this.state.children}</div>
          </div>
          {/* comment text area */}
          <div>
            {this.markdownInput()}
          </div>
          { this.loadingComments
            ? <Loader style={{ width: "800px", marginTop: "20px", marginBottom: "20px" }} size="big" active inline='centered' />
            : <Comment.Group style={{ width: "800px", maxWidth: "800px" }}>
                {this.state.comments.map((comment, index) =>
                  <PostComment
                    key={index + "-comment-" + comment.permlink + "wrapper" + comment.created}
                    user={user}
                    accessToken={accessToken}
                    openLogin={openLogin}
                    comment={comment}
                    index={index}
                    onChangeCommented={() => this.onChangeCommented()}
                  />
                )}
              </Comment.Group>
          }
        </div>
      </div>
    )
  }


  render() {
    return (
      <div>
        <Header />
        <div style={{ display: "flex", flexDirection: "column"}}>
          { this.state.title
            ? this.renderDetail()
            : <Loader style={{ width: "800px", marginTop: "20px", marginBottom: "20px" }} size="big" active inline='centered' />
          }
          {this.renderComments()}
        </div>
        <ScrollToTop style={{ right: "50px" }} showUnder={100}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
            width: "40px", height: "40px", border: "solid 1px #000000"}}>
            <img src="img/arrow-up.svg" />
          </div>
        </ScrollToTop>
      </div>
    )
  }

}

PostDetail.propTypes = {
    user: PropTypes.string,
    accessToken: PropTypes.string,
    openLogin: PropTypes.func,
};

const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        accessToken: state.userReducer.accessToken
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        openLogin: () => dispatch(closeMenuOpenLogin()),
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostDetail);
