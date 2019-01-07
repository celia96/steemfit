import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { Item, Image, Input, Button, Feed, Icon, Dimmer, Loader } from 'semantic-ui-react';

import Header from '../Home/Header';

// No Match
import NoMatch from '../NoMatch';

// Components
import Navigation from './Navigation';
import Profile from './Profile';
import Posts from './Posts';
import Comments from './Comments';
import Wallet from './Wallet';
import Activity from './Activity';

// Modals
import More from './Modals/More';
import Followers from './Modals/Followers';
import Followings from './Modals/Followings';
import Transfer from './Modals/Transfer';

import {
  loadProfileImage,
  countFollowers,
  countFollowings,
  openFollowersModal,
  openFollowingsModal,
  openTransferModal,
  closeMenuOpenLogin
} from '../../actions'

const Routes = () => (
    <Switch>
        <Route exact path={`/@:user`} component={Posts} />
        <Route path={`/@:user/comments`} component={Comments} />
        <Route path="/@:user/wallet" component={Wallet} />
        <Route path="/@:user/activity" component={Activity} />
        <Route component={NoMatch}/>
    </Switch>
)

const UserPage = ({ match, location, user, loadProfileImage, countFollowers, countFollowings, openLogin, openFollowers, openFollowings, openTransfer, followers_count, followings_count }) => (
    <div style={{ height: "100vh" }}>
        <Header />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "row", padding: "20px" }}>
                <Navigation match={match} location={location} />
                <div style={{ width: "384px" }}></div>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
                {/* places where Posts/Comments/Wallet/Activity will be rendered */}
                <Routes/>
                <div style={{ width: "384px", height: "372px" }}>
                    <Profile
                      match={match}
                      user={user}
                      loadProfileImage={loadProfileImage}
                      countFollowers={countFollowers}
                      countFollowings={countFollowings}
                      openLogin={() => openLogin()}
                      openFollowers={() => openFollowers()}
                      openFollowings={() => openFollowings()}
                      openTransfer={() => openTransfer()}/>
                </div>
            </div>
        </div>

        <More match={match} />
        <Followers openLogin={openLogin} followers_count={followers_count} match={match}/>
        <Followings openLogin={openLogin} followings_count={followings_count} match={match}/>
        <Transfer />
    </div>
)

UserPage.propTypes = {
    openFollowers: PropTypes.func,
    openFollowings: PropTypes.func,
    openTransfer: PropTypes.func,
    openLogin: PropTypes.func,
    countFollowers: PropTypes.func,
    countFollowings: PropTypes.func,
    loadProfileImage: PropTypes.func,
    user: PropTypes.string,
    accessToken: PropTypes.string,
    followings_count: PropTypes.number,
    followers_count: PropTypes.number,
};

const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        accessToken: state.userReducer.accessToken,
        followings_count: state.profileReducer.followings_count,
        followers_count: state.profileReducer.followers_count,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        openFollowers: () => dispatch(openFollowersModal()),
        openFollowings: () => dispatch(openFollowingsModal()),
        openTransfer: () => dispatch(openTransferModal()),
        openLogin: () => dispatch(closeMenuOpenLogin()),
        countFollowers: (num) => dispatch(countFollowers(num)),
        countFollowings: (num) => dispatch(countFollowings(num)),
        loadProfileImage: (img) => dispatch(loadProfileImage(img))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPage);
