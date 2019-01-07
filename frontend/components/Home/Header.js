import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logout, openMenuModal } from '../../actions';

import url from '../url';

const HomeButton = () => (
    <Link to="/" style={{ textDecoration: 'none' }}>
        <span className="STEEM-FIT">
            <span>STEEM </span><span className="text-style-1">FIT</span>
        </span>
    </Link>
)

const WriteButton = () => (
    <Link to="/editor" style={{ textDecoration: 'none' }}>
        <img src="/img/write.svg" className="header-icon"/>
    </Link>
)

const UserButton = ({ user }) => (
    <Link to={`/@${user}`} style={{ textDecoration: 'none' }}>
        <img src="/img/user.svg" className="header-icon" />
    </Link>
)

const MenuButton = ({ openModal }) => (
    <img style={{ cursor: "pointer" }} src="/img/menu.svg" className="header-icon" onClick={() => openModal()}/>
)

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      accessToken: this.props.accessToken
    }
  }

  componentWillReceiveProps(newProps) {
    // When user is logged-in => will receive new user and accessToken props
    if (newProps.user !== this.props.user && newProps.accessToken !== this.props.accessToken) {
      this.setState({
        user: newProps.user,
        accessToken: newProps.accessToken
      })
    }
  }

  render() {
    const { openModal, user } = this.props;
    return (
      <div className="Header">
          <div style={{ marginLeft: "50px" }}>
            <HomeButton />
          </div>
          <div style={{ marginRight: "50px" }}>
            {/* if a user is logged-in, show write and user buttons */}
            { this.state.user && this.state.accessToken
              ? <span>
                  <WriteButton />
                  <UserButton user={this.state.user} />
                </span>
              : null
            }
            <MenuButton openModal={() => openModal()} />
          </div>
      </div>
    )
  }
}


Header.propTypes = {
    openModal: PropTypes.func,
    logout: PropTypes.func,
    user: PropTypes.string,
    accessToken: PropTypes.string,
};

const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        accessToken: state.userReducer.accessToken
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        openModal: () => dispatch(openMenuModal()),
        logout: () => dispatch(logout())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
