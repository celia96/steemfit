import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import RichTextEditor from 'react-rte';
import { Image, Input, Button, Comment, Form, Divider, TextArea, Loader, Rail } from 'semantic-ui-react';
import moment from 'moment';

import url from '../url';
import Header from '../Home/Header';

const ReactMarkdown = require('react-markdown')

// Rendering each comment of the PostDetail Component
class PostComment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      profile_image: '',
      reply: RichTextEditor.createEmptyValue(),
      isOpen: false,

      replies: [],
      voted: false, // whether the logged-in user has voted on this comment

      loadingVoted: true,
    }
  }

  componentDidMount() {
    this.mounted = true;
    // if the user is logged-in and the logged-in user is same as the comment author
    if (this.props.user) {
      if (this.props.comment.author === this.props.user) { // logged-in user has commented
        this.props.onChangeCommented();
      }
    }
    this.fetchReplies(this.props.comment);
    fetch(url + `/${this.props.comment.author}/profile-image`)
      .then((response) => {
        return response.json()
      })
      .then((responseJson) => {
        if (responseJson.success) {
          if (this.mounted) {
            this.setState({
              profile_image: responseJson.profile_image
            })
          }
        }
        // get active voters of this comment
        return fetch(url + `/post/voters?author=${this.props.comment.author}&permlink=${this.props.comment.permlink}`)
      })
      .then((response2) => response2.json())
      .then((responseJson2) => {
        if (responseJson2.success) {
          if (responseJson2.voters.length === 0) {
            if (this.mounted) {
              this.setState({
                loadingVoted: false
              })
            }
          } else {
            // check whether the logged-in user has voted this comment or not
            responseJson2.voters.forEach(voter => {
              // Use should be logged in and the logged-in user should be same as the voter
              if (this.props.user && voter.voter === this.props.user && voter.weight > 0) {
                if (this.mounted) {
                  this.setState({
                    voted: true,
                  })
                }
              }
              if (this.mounted) {
                this.setState({
                  loadingVoted: false
                })
              }
            })
          }
        }
      })
  }

  fetchReplies(comment) {
    // get replies of this comment
    fetch(url + `/post/comments?author=${comment.author}&permlink=${comment.permlink}`)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          if (this.mounted) {
            this.setState({
              replies: responseJson.comments,
            })
          }
        }
      })
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  submitReply() {
    console.log("submit reply");
    var at = this.props.accessToken;
    var date = new Date();
    date = date.getTime();
    const { comment } = this.props;
    var permlink = comment.author + "-re-" + this.props.user.toLowerCase() + "-" + comment.permlink + "-" + date
    console.log("reply body: ", this.state.reply);
    console.log("body markdown ", this.state.reply.toString("markdown"));
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
               "parent_author": comment.author,
               "parent_permlink": comment.permlink,
               "author": this.props.user,
               "permlink": permlink,
               "title": "",
               "body": this.state.reply.toString("markdown"),
               "json_metadata": JSON.stringify({})
             }]
           ]
        })
      }).then(response => {
        console.log("response ok? ", response.ok);
        if (response.ok) {
          this.fetchReplies(comment)
        }
      }).catch(err => {
        console.log("Error in posting ", err);
      })
    } else {
      console.log("open log in modal");
      this.props.openLogin();
    }
  }

  voteComment(comment, weight) {
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
               "author": comment.author,
               "permlink": comment.permlink,
               "weight": 10000
             }]
           ]
        })
      }).then(response => {
        console.log("response ok? ", response.ok);
        if (response.ok) {
          console.log("good");
          this.setState({
            voted: true,
            loadingVoted: false
          })
        }
      }).catch(err => {
        console.log("Error in posting ", err);
      })
    } else {
      console.log("open log in modal");
      this.props.openLogin();
    }
  }

  openReply() {
    // toggle reply
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  onChangeSource(e) {
    let source = e.target.value; // markdown string
    let oldValue = this.state.reply; // editorstate
    this.setState({
      reply: oldValue.setContentFromString(source, 'markdown'),
    });
  }

  markdownInput() {
    // write in markdown
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Form style={{ width: "calc(100% - 40px)" }}>
              <TextArea
                style={{ height: "100px", border: "0px" }}
                placeholder='글에 대해서 이야기를 나누어 보세요! @username 태그를 사용할 수 있습니다.'
                value={this.state.reply.toString("markdown")}
                onChange={(e) => this.onChangeSource(e)}
              />
            </Form>
            <div style={{ width: "calc(100% - 40px)", display: "flex", justifyContent: "flex-end", backgroundColor: "#ffffff" }}>
              <div className="comment-submit" onClick={() => this.submitReply()}>
                <span style={{ cursor: "pointer" }} className="comment-submit-txt">확인</span>
              </div>
            </div>
            <Divider style={{ width: "calc(100% - 40px)" }} />
            <div style={{ width: "calc(100% - 40px)" }} >
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
              value={this.state.reply}
              className="preview-reply"
              placeholder=""
              toolbarClassName="demo-toolbar"
              editorClassName="demo-editor"
              readOnly={true}
            />
        </div>
    )
  }

  render() {
    const { comment, index, user, accessToken, openLogin } = this.props;
    return (
      <Comment style={{ width: "100%" }} key={"comment-" + index + "-" + comment.permlink + comment.created}>
        <div key={"div-comment-" + index + "-" + comment.created} style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "100%" }}>
            <Comment.Avatar
              onError={(e) => {e.target.onerror = null; e.target.src='https://react.semantic-ui.com/images/wireframe/square-image.png'}}
              style={{ width: "45px", height: "45px", margin: "10px", marginLeft: "0px" }}
              as='a'
              src=
              { this.state.profile_image
                ? this.state.profile_image
                : 'https://react.semantic-ui.com/images/wireframe/square-image.png'
              }
            />
            <Comment.Content style={{ display: "flex", flexDirection: "column", padding: "10px", paddingLeft: "0px" }}>
              <div style={{ display: "flex" }}>
                <Comment.Author as='a'>{comment.author}</Comment.Author>
                <Comment.Metadata>
                  <span>{moment(comment.created).fromNow()}</span>
                </Comment.Metadata>
              </div>
              <Comment.Text className="comment-body">
                <ReactMarkdown source={comment.body} escapeHtml={false}/>
              </Comment.Text>
              <Comment.Actions>
                {/* will open comment editor */}
                <a onClick={() => this.openReply()}>Reply</a>
              </Comment.Actions>
            </Comment.Content>
          </div>
          <div style={{ marginTop: "10px", paddingTop: "10px" }}>
            <Comment.Actions>
              { this.state.loadingVoted
                ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px" }}>
                    <Loader size="tiny" active inline='centered'/>
                  </div>
                : this.state.voted
                ? <img src='../../img/star-fill.svg'/>
                : <img style={{ cursor: "pointer" }} onClick={() => this.voteComment(comment)} src='../../img/star.svg'/>
              }
            </Comment.Actions>
          </div>
        </div>
        { this.state.isOpen
          ? this.markdownInput()
          : null
        }
        { this.state.replies.length > 0
          ? <div style={{ marginLeft: "40px" }} >
              {this.state.replies.map((reply, i) =>
                <PostComment
                  key={index + "-reply-" + i + reply.permlink + reply.created}
                  user={user}
                  accessToken={accessToken}
                  openLogin={openLogin}
                  comment={reply}
                  index={i}
                  onChangeCommented={() => this.props.onChangeCommented()}/>
              )}
            </div>
          : null
        }
      </Comment>
    )
  }

}


export default PostComment;
