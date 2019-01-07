import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Item, Image, Input, Button, Feed, Icon, Loader } from 'semantic-ui-react';

import url from '../url';
import Header from '../Home/Header';

class ActivityList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      profile_image: ''
    }
  }

  componentDidMount() {
    this.mounted = true;
  }

  makeRemoteRequest(user) {
    fetch(url + `/${user}/profile-image`)
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

  renderAct(operation) {
    var userParam = this.props.match.params["user"];
    // follow, unfollow
    if (operation[0] === 'custom_json') {
      var action = operation[1]["id"];
      var json = JSON.parse(operation[1]["json"])[1];
      var who = json["follower"];
      var whom = json["following"];
      if (action === "follow") {
        if (json["what"].length === 0) {
          action = "unfollow";
        }
      }
      if (who === this.props.match.params["user"]) {
        this.makeRemoteRequest(userParam);
        action = action.charAt(0).toUpperCase() + action.slice(1) + "ed";
        return (
          <span className="comment-text">
            <span>{action} </span>
            <Link style={{ textDecoration: 'none' }} to={`/@${whom}`}>
              <span style={{ color: '#000000' }} className="comment-author">{whom}</span>
            </Link>
          </span>
        )
      } else {
        this.makeRemoteRequest(who);
        action = action + "ed";
        return (
          <span className="comment-text">
            <Link style={{ textDecoration: 'none' }} to={`/@${who}`}>
              <span style={{ color: '#000000' }} className="comment-author">{who} </span>
            </Link>
            <span>{action} </span>
            <Link style={{ textDecoration: 'none' }} to={`/@${whom}`}>
              <span style={{ color: '#000000' }} className="comment-author">{whom}</span>
            </Link>
          </span>
        )
      }
    } else {
      var action = operation[0];
      // comment, vote
      if (action === 'comment' || action === 'vote') {
        var who, whom, author, permlink;
        if (action === 'comment') {
          author = operation[1]["author"];
          if (author !== this.props.match.params["user"]) {
            this.makeRemoteRequest(who);
            who = author;
            action = 'replied to ';
            whom = operation[1]["parent_author"]
            permlink = operation[1]["parent_permlink"];
            return (
              <span className="comment-text">
                <Link style={{ textDecoration: 'none' }} to={`/@${who}`}><span style={{ color: '#000000' }} className="comment-author">{who} </span></Link>
                <span>{action} </span>
                <Link style={{ textDecoration: 'none' }} to={`/@${whom}`}><span style={{ color: '#000000' }} className="comment-author">{whom} </span></Link>
                <Link to={`/post/${whom}/${permlink}`}><span>{permlink}</span></Link>
              </span>
            )
          } else {
            this.makeRemoteRequest(userParam);
            action = 'Replied to ';
            whom = operation[1]["parent_author"]
            permlink = operation[1]["parent_permlink"];
            return (
              <span className="comment-text">
                <span>{action} </span>
                <Link style={{ textDecoration: 'none' }} to={`/@${whom}`}><span style={{ color: '#000000' }} className="comment-author">{whom} </span></Link>
                <Link to={`/post/${whom}/${permlink}`}><span>{permlink}</span></Link>
              </span>
            )
          }

        } else {
          var voter = operation[1]["voter"];
          if (voter !== this.props.match.params["user"]) {
            this.makeRemoteRequest(voter);
            action = 'upvoted';
            author = operation[1]["author"]
            permlink = operation[1]["permlink"];
            return (
              <span className="comment-text">
                <Link style={{ textDecoration: 'none' }} to={`/@${voter}`}><span style={{ color: '#000000' }} className="comment-author">{voter} </span></Link>
                <span>{action} </span>
                <Link style={{ textDecoration: 'none' }} to={`/@${author}`}><span style={{ color: '#000000' }} className="comment-author">{author} </span></Link>
                <Link to={`/post/${author}/${permlink}`}><span>{permlink}</span></Link>
              </span>
            )
          } else {
            this.makeRemoteRequest(userParam);
            action = 'Upvoted';
            author = operation[1]["author"]
            permlink = operation[1]["permlink"];
            return (
              <span className="comment-text">
                <span>{action} </span>
                <Link style={{ textDecoration: 'none' }} to={`/@${author}`}><span style={{ color: '#000000' }} className="comment-author">{author} </span></Link>
                <Link to={`/post/${author}/${permlink}`}><span>{permlink}</span></Link>
              </span>
            )
          }
        }
      }
      // transfer
      if (action === 'transfer') {
        this.makeRemoteRequest(userParam);
        var to = operation[1]["to"];
        var from = operation[1]["from"];
        var amount = operation[1]["amount"];
        var whom;
        if (this.props.match.params["user"] === to) {
          action = 'Received from';
          whom = from;
          amount = '+' + amount
        } else {
          action = 'Transferred to';
          whom = to;
          amount = '-' + amount
        }
        return (
          <span className="comment-text">
            <span>{action} </span>
            <Link style={{ textDecoration: 'none' }} to={`/@${whom}`}><span style={{ color: '#000000' }} className="comment-author">{whom} </span></Link>
            <span>{amount} </span>
          </span>
        )
      }
      // claim reward
      if (action === 'claim_reward_balance') {
        action = 'Claim Reward: ';
        var reward = operation[1]["reward_steem"] + operation[1]["reward_sbd"];
        return (
          <span className="comment-text">
            <span>{action} </span>
            <span>{reward} </span>
          </span>
        )
      }
      // curation_reward
      if (action === 'curation_reward') {
        action = 'Curation Reward:';
        // - action: item[0]
        // - reward: item[1][reward]
        // - comment_author, comment_permlink
        var reward = operation[1]["reward"] + ' for';
        var whom = operation[1]["comment_author"];
        var permlink = operation[1]["comment_permlink"];
        return (
          <span className="comment-text">
            <span>{action} </span>
            <span>{reward} </span>
            <Link style={{ textDecoration: 'none' }} to={`/@${whom}`}><span style={{ color: '#000000' }} className="comment-author">{whom}</span></Link>
            <Link to={`/post/${whom}/${permlink}`}><span>{permlink}</span></Link>
          </span>
        )
      }
      var action = operation[0]
      return (
        <span className="comment-text">
          <span> {action} </span>
        </span>
      )
    }
  }

  render() {
    const { act, index } = this.props;
    var trx = act[1]["trx_id"]
    var time = act[1]["timestamp"];
    var operation = act[1]["op"];
    return (
      <Feed.Event key={index + '-' + 'activity' + trx}>
        <Feed.Label style={{ marginLeft: "20px", display: "flex", alignItems: "center" }}>
          <img
            onError={(e) => {e.target.onerror = null; e.target.src='https://react.semantic-ui.com/images/wireframe/square-image.png'}}
            style={{ width: "45px", height: "45px"}}
            src={ this.state.profile_image
              ? this.state.profile_image
              : 'https://react.semantic-ui.com/images/wireframe/square-image.png'
          }/>
        </Feed.Label>
        <Feed.Content >
          {/* avatar, who, action, whom 시간 */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* avatar, who, action, whom */}
            <Feed.Summary>
              {this.renderAct(operation)}
            </Feed.Summary>
            {/* 추천하기, 답글달기, 시간 */}
            <Feed.Meta style={{ margin: "0px" }}>
              <Feed.Like>{moment(time).fromNow()}</Feed.Like>
            </Feed.Meta>
          </div>
        </Feed.Content>
      </Feed.Event>
    )
  }
}


class Activity extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activity: [],
      loading: true,
      limit: 10,
      loadingMore: false,
      profile_image: ''
    }
  }

  componentDidMount() {
    this.mounted = true;
    console.log("mounting activity");
    var user = this.props.match.params["user"]
    this.makeRemoteRequest(user);
  }

  makeRemoteRequest(user) {
    var limit = this.state.limit;
    fetch(url + `/${user}/activity?from=-1&to=${limit}`)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          console.log("successful");
          if (this.mounted) {
            var reversed = responseJson.activity.slice().reverse();
            this.setState({
              activity: reversed,
              loading: false,
              loadingMore: false
            })
          }
        } else {
          console.log("Failed");
        }
      })
      .catch((err) => {
        console.log("Error in getting activity ", err);
      })
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.match.params["user"] !== this.props.match.params["user"]) {
      this.setState({
        loading: true
      })
      this.makeRemoteRequest(this.props.match.params["user"]);
    }
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
    return (
      <div>
        { !this.state.loading
          ? <Feed style={{ width: "800px", display: "flex", flexDirection: "column", border: "solid 1px #e6e6e6", paddingTop: "20px", paddingBottom: "20px" }}>
              {this.state.activity.map((act, index) =>
                // this.renderActivityList(act, index)
                <ActivityList key={'activity-wrapper-' + index} match={this.props.match} act={act} index={index} />
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


Activity.propTypes = {
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
)(Activity);
