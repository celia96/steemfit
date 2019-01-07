import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Header, Icon, Modal, Image } from 'semantic-ui-react';

import url from '../url';

import { closeLoginModal } from '../../actions'


class Login extends Component {
  constructor(props) {
    super(props);
  }

  login() {
    console.log("pressed login");
    // authorize user by redirecting to Steemconnect login url
    fetch(url + `/authorize`)
      .then(response => {
        console.log("response ", response);
        if (response.ok) {
          this.props.closeModal();
          window.open(response.url, "_self");
        }
      })
  }

  render() {
    const { closeModal, modalOpen } = this.props;
    return(
      <Modal
        size='tiny'
        style={{ marginTop: "auto", marginBottom: "auto", marginRight: "auto", marginLeft: "auto",height: "300px", borderRadius: "0px" }}
        open={modalOpen}
        onClose={() => closeModal()}>
        <div style={{ height: "100%", backgroundColor: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ marginTop: "20px" }}>
            <div className="welcome-rectangle"></div>
            <span className="WELCOME">Welcome</span>
          </div>
          <div style={{ marginBottom: "10px" }} className="how-to-login">
            스팀잇으로 로그인해주세요
          </div>
          <div style={{ cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center",
            height: "60px", margin: "10px", borderRadius: "2px", backgroundColor: "#267aff", width: "300px"}}
              onClick={() => this.login()}>
            <span className="Login-with-Steemit">Login with Steemit</span>
          </div>
          <div style={{ margin: "20px" }} className="signup">
            아이디가 없으세요? 스팀잇으로 <a href='https://signup.steemit.com/?ref=steemfit' target="_blank">회원가입</a>
          </div>
        </div>
      </Modal>
    )
  }
}

Login.propTypes = {
    closeModal: PropTypes.func,
    modalOpen: PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
        modalOpen: state.modalReducer.login
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal: () => dispatch(closeLoginModal())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
