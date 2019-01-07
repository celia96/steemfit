import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Modal } from 'semantic-ui-react';

import { closeMoreModal } from '../../../actions'

class More extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peek: ''
    }
  }

  componentDidMount() {
    var peek = this.props.match.params["user"]
    this.setState({
      peek: peek
    })
  }

  deleteComment() {
    // this.props.comment
    // fetch post delete comment
    var at = this.props.accessToken;
    console.log("Delete ", this.props.comment);
    fetch('https://steemconnect.com/api/broadcast', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${at}`,
        'Content-Type': 'application/json' // 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({
        "operations": [
           ["delete_comment", {
             "author": this.props.user,
             "permlink": this.props.comment.permlink,
           }]
         ]
      })
    }).then(response => {
      if (response.ok) {
        this.props.closeModal();
      }
    }).catch(err => {
      console.log("Error in deleting a comment ", err);
    })
  }

  componentWillUnmount() {
    this.props.closeModal();
  }

  render() {
    const { user, isOpen, closeModal, comment } = this.props;
    const { parent_author, parent_permlink } = comment;
    return (
      <div>
        {/* if logged-in user exsits and if logged-in user is same as the user in this page */}
        { user && user === this.state.peek
          ? <Modal
              size='tiny'
              style={{ marginTop: "auto", marginBottom: "auto", marginRight: "auto", marginLeft: "auto", height: "200px", borderRadius: "0px" }}
              open={isOpen}
              onClose={() => closeModal()}>
              <div style={{ height: "100px", display: "flex", justifyContent: "center", alignItems: "center"}}>
                {/* /post/:parent_author/:parent_permlink */}
                <Link to={`/post/${parent_author}/${parent_permlink}`}>
                  <span className="comment-modal-txt">원글 보기</span>
                </Link>
              </div>
              <div style={{ height: "100px", display: "flex", justifyContent: "center", alignItems: "center"}}>
                {/* /:peek/comments */}
                <span style={{ cursor: "pointer" }} className="comment-modal-txt" onClick={() => this.deleteComment()}>댓글 삭제</span>
              </div>
            </Modal>
          : <Modal
              size='tiny'
              style={{ marginTop: "auto", marginBottom: "auto", marginRight: "auto", marginLeft: "auto", height: "100px", borderRadius: "0px" }}
              open={isOpen}
              onClose={() => closeModal()}>
              <div style={{ height: "100px", display: "flex", justifyContent: "center", alignItems: "center"}}>
                {/* /post/:parent_author/:parent_permlink */}
                <Link to={`/post/${parent_author}/${parent_permlink}`}>
                  <span className="comment-modal-txt">원글 보기</span>
                </Link>
              </div>
            </Modal>
        }
      </div>
    )
  }

}


More.propTypes = {
    closeModal: PropTypes.func,
    isOpen: PropTypes.bool,
    comment: PropTypes.object,
    user: PropTypes.string,
    accessToken: PropTypes.string
};

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer.more,
        comment: state.commentDetailReducer,
        user: state.userReducer.user,
        accessToken: state.userReducer.accessToken
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal: () => dispatch(closeMoreModal()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(More);
