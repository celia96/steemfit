import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Image, Button, Loader } from 'semantic-ui-react';

import url from '../url';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      name: '',
      profile_image: '',
      following_count: '',
      follower_count: '',
      loading: true,
      redirect: false,

      loadingFollowed: true,
      following: false
    }
  }

  componentDidMount() {
    this.mounted = true;
    // user profile info
    var user = this.props.match.params["user"]
    console.log("user ", user );
    // fetch all user data
    this.makeRemoteRequest(user);
  }

  makeRemoteRequest(user) {
    fetch(url + `/${user}/profile`)
      .then((response) => {
        return response.json()
      })
      .then((responseJson) => {
        if (responseJson.success) {
          if (this.mounted) {
            this.setState({
              account: responseJson.user.account,
              profile_image: responseJson.user.userData.profile_image,
              name: responseJson.user.name,
              follower_count: responseJson.user.userData.follower_count,
              following_count: responseJson.user.userData.following_count,
              loading: false
            })
            this.props.loadProfileImage(responseJson.user.userData.profile_image);
            this.props.countFollowers(responseJson.user.userData.follower_count);
            this.props.countFollowings(responseJson.user.userData.following_count);
          }
        } else {
          this.setState({
            redirect: true
          })
        }
      })
      .catch((err) => {
        console.log("Error in fetching profile ", err);
      })
    // check whether logged-in user is following this user
    if (this.props.user) {
      fetch(url + `/${this.props.user}/following/${user}`)
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.following) {
            this.setState({
              loadingFollowed: false,
              following: true
            })
          } else {
            this.setState({
              loadingFollowed: false,
              following: false
            })
          }
        })
    } else {
      this.setState({
        loadingFollowed: false,
      })
    }

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
  }

  submitFollow() {
    console.log("follow");
    var at = this.props.accessToken;
    var user = this.props.user;
    var peek = this.state.account;
    if (user && at) {
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
              "json": `[\"follow\",{\"follower\":\"${user}\",\"following\":\"${peek}\",\"what\":[\"blog\"]}]`
            }]
          ]
        })
      }).then(response => {
        console.log("response ", response);
        if (response.ok) {
          console.log("good");
          this.setState({
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

  renderProfile() {
    const { profile_image, name, account, following_count, follower_count } = this.state;
    const { user, openFollowers, openFollowings, openTransfer } = this.props;
    return (
      <div>
        {/* photo */}
        <div style={{ paddingLeft: "20px" }}>
          { profile_image
            ? <Image
                onError={(e) => {e.target.onerror = null; e.target.src='https://react.semantic-ui.com/images/wireframe/square-image.png'}}
                style={{ width: "60px", height: "60px" }}
                src={profile_image}
                avatar />
            : <Image style={{ width: "60px", height: "60px" }} src='https://react.semantic-ui.com/images/wireframe/square-image.png' avatar />
          }
        </div>
        {/* name (name is from profile json_metadata) and follow*/}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "20px", paddingBottom: "0px", paddingTop: "10px" }}>
          {/* name */}
          <div>
            <span className="profile-name">{name}</span>
          </div>
          {/* follow button */}
          { user === account
            ? null
            : this.state.loadingFollowed
            ? <div className="profile-follow">
                <Loader size="tiny" active inline='centered'/>
              </div>
            : this.state.following
            ? <div className="profile-follow">
                <span className="profile-follow-text">팔로잉</span>
              </div>
            : <div style={{ cursor: "pointer"}} onClick={() => this.submitFollow()} className="profile-follow">
                <span className="profile-follow-text">팔로우</span>
              </div>
          }
        </div>
        {/* account @ */}
        <div>
          <span className="profile-account">@{account}</span>
        </div>
        {/* followings and followers */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* followings */}
          <div style={{ padding: "20px", paddingRight: "10px" }} onClick={() => openFollowings()}>
            <div style={{ cursor: "pointer" }} className="profile-f-text">팔로잉</div>
            <div style={{ cursor: "pointer" }} className="profile-f-num">
              {following_count}
            </div>
          </div>
          {/* followers */}
          <div style={{ padding: "20px", paddingLeft: "10px" }} onClick={() => openFollowers()}>
            <div style={{ cursor: "pointer" }} className="profile-f-text">팔로워</div>
            <div style={{ cursor: "pointer" }} className="profile-f-num">
              {follower_count}
            </div>
          </div>

        </div>
        {/* buttons */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button
            style={{ margin: "20px", marginBottom: "5px", height: "50px", borderRadius: "0px", backgroundColor: "#f7ea73"}}
            onClick={() => openTransfer()}>
            <div className="profile-transfer">TRANSFER</div>
          </Button>
          <Button
            style={{ margin: "20px", marginTop: "5px", height: "50px", borderRadius: "0px", backgroundColor: "#e6e6e6"}}>
            <div className="profile-videochat">화상컨설팅 예약신청</div>
          </Button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        { this.state.loading
          ? <Loader active size="big" inline='centered' />
          : this.renderProfile()
        }

        { this.state.redirect
          ? <Redirect to='/404' />
          : null
        }
      </div>


    )
  }
}

export default Profile;
