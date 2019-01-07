import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Modal, Image, Loader } from 'semantic-ui-react';

import { closeFollowersModal } from '../../../actions'

import url from '../../url';


class FollowerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {},
      text: '팔로우',
      loading: true,
      following: false,
      profile_image: ''
    }
  }

  componentDidMount() {
    this.mounted = true;
    // check whehter logged-in user is following this user's follower or not
    fetch(url + `/${this.props.follower.follower}/profile-image`)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          if (this.mounted) {
            console.log(responseJson.profile_image);
            this.setState({
              profile_image: responseJson.profile_image
            })
          }
        }
      })
      .catch(err => {
        console.log("err ", err);
      })

    if (this.props.user && this.props.accessToken) {
      fetch(url + `/${this.props.user}/following/${this.props.follower.follower}`)
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.following) {
            console.log("following? ", responseJson.following);
            this.setState({
              following: true,
              text: "팔로잉",
              loading: false
            })
          } else {
            this.setState({
              loading: false
            })
            console.log("now loading ", this.state.loading);
          }
        })
        .catch(err => {
          console.log("err ", err);
        })
    } else {
      this.setState({
        loading: false
      })
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  submitFollow(follower) {
    console.log("follow");
    var at = this.props.accessToken;
    var user = this.props.user;
    if (user && at) {
      this.setState({
        loading: true
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
              "json": `[\"follow\",{\"follower\":\"${user}\",\"following\":\"${follower}\",\"what\":[\"blog\"]}]`
            }]
          ]
        })
      }).then(response => {
        if (response.ok) {
          console.log("good");
          this.setState({
            style: { backgroundColor: "#ffffff", border: "solid 1px #f3f3f3" },
            text: '팔로잉',
            following: true,
            loading: false
          })
        }
      }).catch(err => {
        console.log("Error in follow ", err);
      })
    } else {
      this.props.openLogin();
    }
  }

  render() {
    const { follower, index } = this.props;
    return (
      <div
        key={index + '-' + follower.follower}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px", marginTop: "5px" }}>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            avatar
            // style={{ width: "45px", height: "45px"}}
            onError={(e) => {e.target.onerror = null; e.target.src='https://react.semantic-ui.com/images/wireframe/square-image.png'}}
            src={ this.state.profile_image
              ? this.state.profile_image
              : 'https://react.semantic-ui.com/images/wireframe/square-image.png'
            } />
          <div style={{ marginLeft: "5px" }}>
            <Link style={{ textDecoration: "none" }} to={`/@${follower.follower}`}>
              <span className="follow-name">{follower.follower}</span>
            </Link>
          </div>
        </div>
        { this.state.loading
          ? <div // loading
              className="follow-follow-btn">
                <span style={{ height: "27px", display: "flex", alignItems: "center" }}>
                  <Loader size='mini' active inline='centered'/>
                </span>
            </div>
          : this.state.following
          ? <div // following
              style={{ backgroundColor: "#ffffff", border: "solid 1px #f3f3f3" }}
              className="follow-follow-btn">
                <span className="detail-follow">
                  {this.state.text}
                </span>
            </div>
          : <div // not following
              onClick={() => this.submitFollow(follower.follower)}
              className="follow-follow-btn">
                <span style={{ cursor: "pointer" }} className="detail-follow">
                  {this.state.text}
                </span>
            </div>

        }

      </div>
    )
  }
}


class Followers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      followers: [],
      loading: true,
      limit: 10,
      loadingMore: false
    }
  }

  componentDidMount() {
    this.mounted = true;
    var user = this.props.match.params["user"]
    console.log("followers of ", user);
    this.makeRemoteRequest(user);
  }

  makeRemoteRequest(user) {
    fetch(url + `/${user}/followers?limit=${this.state.limit}`)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          console.log("successful");
          if (this.mounted) {
            this.setState({
              followers: responseJson.followers,
              loading: false,
              loadingMore: false
            })
          }
        } else {
          console.log("Failed");
          this.setState({
            loading: false,
            loadingMore: false
          })
        }
      })
      .catch((err) => {
        console.log("Error in getting followers ", err);
      })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.match.params["user"] !== this.props.match.params["user"]) {
      this.setState({
        loading: true
      })
      this.makeRemoteRequest(this.props.match.params["user"]);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.props.closeModal();
  }

  loadMore() {
    var user = this.props.match.params["user"]
    var limit = this.state.limit;
    limit = limit + 10;
    this.setState({
      limit: limit,
      loadingMore: true
    }, () => this.makeRemoteRequest(user))
  }

  render() {
    const { user, openLogin, isOpen, closeModal, followers_count, accessToken } = this.props;
    return (
      <Modal
        size='tiny'
        style={{ overflow: "auto", marginTop: "auto", marginBottom: "auto", marginRight: "auto", marginLeft: "auto", height: "300px", borderRadius: "0px" }}
        open={this.props.isOpen}
        onClose={() => closeModal()}>
        <Modal.Content style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
          <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <span className="follow-modal-num">
              <span className="follow-modal-txt">팔로워 </span>
              <span>{followers_count}</span>
            </span>
          </div>
          <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
            {this.state.followers.map((follower, index) =>
               <FollowerList
                 openLogin={openLogin}
                 key={index + "-myfollower-list-" + follower.follower}
                 follower={follower}
                 index={index}
                 accessToken={accessToken}
                 user={user}/>
            )}
            { this.state.loading
              ? null
              : this.state.loadingMore
              ? <div style={{ display: "flex", justifyContent: "center", margin: "10px" }}>
                  <Loader size="big" active inline='centered' />
                </div>
              : <div style={{ display: "flex", justifyContent: "center", margin: "10px" }}>
                  <img onClick={() => this.loadMore()} src='img/arrow-down.svg'/>
                </div>
            }
          </div>
        </Modal.Content>
      </Modal>
    )
  }

}


Followers.propTypes = {
    closeModal: PropTypes.func,
    isOpen: PropTypes.bool,
    user: PropTypes.string,
    accessToken: PropTypes.string,
};

const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        accessToken: state.userReducer.accessToken,
        isOpen: state.modalReducer.followers,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal: () => dispatch(closeFollowersModal()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Followers);
