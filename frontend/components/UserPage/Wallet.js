import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import { Item, Image, Input, Button, Feed, Icon, Loader } from 'semantic-ui-react';

import url from '../url';
import Header from '../Home/Header';


class WalletHisotry extends Component {

  constructor(props) {
    super(props);
    this.state = {
      profile_image: ''
    }
  }

  componentDidMount() {
    this.mounted = true;
    var from = this.props.item[1]["op"][1]["from"];
    fetch(url + `/${from}/profile-image`)
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
    const { item, index } = this.props;
    var trx = item[1]["trx_id"]
    var action = item[1]["op"][0];
    var time = item[1]["timestamp"];
    var from = item[1]["op"][1]["from"];
    var to = item[1]["op"][1]["to"];
    return (
      <Feed.Event key={index + '-' + 'wallet-list' + trx} style={{ marginTop: "5px", marginBottom: "5px" }}>
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
          <Feed.Summary>
            <span className="comment-text">
              <span className="comment-author">{from} </span>
              <span> {action} </span>
              <span className="comment-author">{to} </span>
              <span>{moment(time).fromNow()}</span>
            </span>
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    )
  }
}


class Wallet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      wallet: null,
      history: [],
      loading: true
    }
  }

  componentDidMount() {
    this.mounted = true;
    console.log("mounting wallet");
    var user = this.props.match.params["user"]
    this.makeRemoteRequest(user);
  }

  makeRemoteRequest(user) {
    fetch(url + `/${user}/wallet`)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          console.log("successful");
          if (this.mounted) {
            this.setState({
              wallet: responseJson.wallet,
              loading: false
            })
          }
        } else {
          console.log("Failed");
        }
      })
      .catch((err) => {
        console.log("Error in getting wallet ", err);
      })
    fetch(url + `/${user}/wallet/history?from=-1&to=500`)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          console.log("successful - loading wallet history");
          this.setState({
            history: responseJson.transfers
          })
        }
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

  renderWalletHistory() {
    return (
      <Feed style={{ width: "800px", display: "flex", flexDirection: "column", border: "solid 1px #e6e6e6", paddingTop: "20px", paddingBottom: "20px" }}>
        {this.state.history.map((item, index) =>
          <WalletHisotry key={'wallet-history-wrapper' + index} item={item} index={index}/>
        )}
      </Feed>
    )
  }

  renderWallet() {
    const { wallet } = this.state;
    return (
      <div style={{ width: "800px", height: "300px", display: "flex", flexDirection: "column", border: "solid 1px #e6e6e6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
          <div>
            <span className="wallet-text">STEEM</span>
          </div>
          <span className="wallet-text">
            <span className="wallet-number">{wallet.steem}</span>
            <span> STEEM</span>
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
          <div>
            <span className="wallet-text">STEEM Power</span>
          </div>
          <span className="wallet-text">
            <span className="wallet-number">{wallet.steemPower}</span>
            <span> SP</span>
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
          <div>
            <span className="wallet-text">STEEM Dollar</span>
          </div>
          <span className="wallet-text">
            <span className="wallet-number">{wallet.steem_dollars}</span>
            <span> SBD</span>
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
          <div>
            <span className="wallet-text">Savings</span>
          </div>
          <span className="wallet-text">
            <span className="wallet-number">{wallet.savings.savings_balance}</span>
            <span> STEEM  </span>
            <span className="wallet-number">{wallet.savings.sbd_balance}</span>
            <span> SBD</span>
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
          <div>
            <span className="wallet-text">Est. Account Value</span>
          </div>
          <span className="wallet-text">
            <span className="wallet-number">${wallet.accountValue}</span>
          </span>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        { !this.state.loading
          ? this.renderWallet()
          : <Loader style={{ width: "800px" }} size="big" active inline='centered' />
        }
        { !this.state.loading
          ? this.renderWalletHistory()
          : null
        }
      </div>
    )
  }

}


Wallet.propTypes = {
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
)(Wallet);
