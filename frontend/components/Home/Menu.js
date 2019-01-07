import React, { Component } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logout, closeMenuModal, closeMenuOpenLogin } from '../../actions'

import url from '../url';

class Menu extends Component {
  constructor(props) {
    super(props);
  }

  logout() {
    console.log("USER, ACCESSTOKEN ", this.props.user, this.props.accessToken);
    console.log("LOG OUT - revoke token");
    // revoke token
    fetch(url + `/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.props.user
      })
    })
    this.props.logout(); // clear user and at from redux storage
    window.history.pushState({}, document.title, "/"); // redirect to '/'
    this.props.closeModal(); // close the modal
  }

  render() {
    const { user, accessToken, closeModal, modalOpen, closeOpen } = this.props;
    return (
      <div>
        <Modal
          basic size='fullscreen'
          open={modalOpen}
          onClose={() => closeModal()}
        >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <img style={{ cursor: "pointer" }} src="/img/x-login.svg" className="x-login" onClick={() => closeModal()} />
            </div>

            <Modal.Actions>
                <div style={{ display: "flex", alignItems: "center", height: "80vh" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                        <div style={{ margin: "10px" }}>
                            <Link to="/" style={{ textDecoration: 'none' }}>
                                <span className="HOME" onClick={() => closeModal()}>HOME</span>
                            </Link>
                        </div>
                        <div style={{ margin: "10px" }}>
                            <Link to="/about" style={{ textDecoration: 'none' }}>
                                <span className="ABOUT" onClick={() => closeModal()}>ABOUT</span>
                            </Link>
                        </div>
                        <div style={{ margin: "10px" }}>
                            <Link to="/contact" style={{ textDecoration: 'none' }}>
                                <span className="CONTACT" onClick={() => closeModal()}>CONTACT</span>
                            </Link>
                        </div>

                        <div className="Line" style={{ margin: "10px" }}></div>

                        { user && accessToken
                          ? <div style={{ margin: "10px" }}>
                              <span
                                style={{ cursor: "pointer" }}
                                className="LOGIN"
                                onClick={() => this.logout()}>LOGOUT</span>
                            </div>
                          : <div style={{ margin: "10px" }}>
                              <span
                                style={{ cursor: "pointer" }}
                                className="LOGIN"
                                onClick={() => closeOpen()}>LOGIN</span>
                            </div>
                        }
                        <div style={{ margin: "10px" }}>
                          <a style={{ textDecoration: 'none' }} href='https://signup.steemit.com/?ref=steemfit' target="_blank">
                            <span className="JOIN" onClick={() => closeModal()}>JOIN</span>
                          </a>
                        </div>
                    </div>
                </div>
            </Modal.Actions>
        </Modal>
      </div>
    )
  }
}


Menu.propTypes = {
    closeModal: PropTypes.func,
    closeOpen: PropTypes.func,
    logout: PropTypes.func,
    modalOpen: PropTypes.bool,
    user: PropTypes.string,
    accessToken: PropTypes.string
};

const mapStateToProps = (state) => {
    return {
        modalOpen: state.modalReducer.menu,
        user: state.userReducer.user,
        accessToken: state.userReducer.accessToken
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal: () => dispatch(closeMenuModal()),
        closeOpen: () => dispatch(closeMenuOpenLogin()),
        logout: () => dispatch(logout())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu);
