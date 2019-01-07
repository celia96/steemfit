import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal, Form } from 'semantic-ui-react';

import { closeTransferModal } from '../../../actions'

import url from '../../url';
import Input from 'react-validation/build/input';


class Transfer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      to: '',
      amount: '',
      memo: '',
      type: 'STEEM',
      clicked: [true, false]
    }
  }

  componentWillUnmount() {
    this.props.closeModal();
  }

  continue() {
    // redirect to SteemConnect Transfer url
    console.log("pressed continue");
    const { to, amount, type, memo } = this.state;
    if (to && amount) {
      fetch(url + `/transfer?to=${to}&amount=${amount}&type=${type}&memo=${memo}`)
        .then(response => {
          console.log("response ", response);
          if (response.ok) {
            this.props.closeModal();
            window.open(response.url, "_blank");
          }
        })
    } else {
      console.log("required!");
    }
  }

  onChangeTo(e) {
    console.log(e.target.value);
    this.setState({
      to: e.target.value
    })
  }
  onChangeAmount(e) {
    console.log(e.target.value);
    this.setState({
      amount: e.target.value
    })
  }
  onChangeType(type, clicked) {
    console.log("type ", type);
    this.setState({
      type: type,
      clicked: clicked
    })
  }
  onChangeMemo(e) {
    console.log(e.target.value);
    this.setState({
      memo: e.target.value
    })
  }

  render() {
    return (
      <Modal
        size='tiny'
        style={{ marginTop: "auto", marginBottom: "auto", marginRight: "auto", marginLeft: "auto", height: "360px", borderRadius: "0px" }}
        open={this.props.isOpen}
        onClose={() => this.props.closeModal()}>
        <div style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "center", margin: "20px", marginTop: "0px" }}>
            <span className="transfer-txt">Transfer Funds</span>
          </div>
          <Form>
            <Form.Field required>
              <label>To</label>
              <input onChange={(e) => this.onChangeTo(e)} style={{ border: "0px", borderRadius: "2px", backgroundColor: "#f3f3f3" }} placeholder='@username' />
            </Form.Field>
            <Form.Field required>
              <label>Amount</label>
              <div style={{ display: "flex" }}>
                <input onChange={(e) => this.onChangeAmount(e)} style={{ border: "0px", borderRadius: "2px", marginRight: "5px", backgroundColor: "#f3f3f3" }} placeholder='5.0000' />
                <Button.Group style={{ marginLeft: "5px" }}>
                  { this.state.clicked[0]
                    ? <Button style={{ display: "flex", justifyContent: "center", width: "70px", border: "solid 1px #267aff", backgroundColor: "#ffffff" }}>
                        {/* active */}
                        <span style={{ color: "#267aff" }}>STEEM</span>
                      </Button>
                    : <Button
                        onClick={() => this.onChangeType('STEEM', [true, false])}
                        style={{ display: "flex", justifyContent: "center", width: "70px", backgroundColor: "#267aff" }}>
                        {/* inactive */}
                        <span style={{ color: "#ffffff" }}>STEEM</span>
                      </Button>
                  }
                  { this.state.clicked[1]
                    ? <Button style={{ display: "flex", justifyContent: "center", width: "70px", border: "solid 1px #267aff", backgroundColor: "#ffffff" }}>
                        {/* active */}
                        <span style={{ color: "#267aff" }}>SBD</span>
                      </Button>
                    : <Button
                        onClick={() => this.onChangeType('SBD', [false, true])}
                        style={{ display: "flex", justifyContent: "center", width: "70px", backgroundColor: "#267aff" }}>
                        {/* inactive */}
                        <span style={{ color: "#ffffff" }}>SBD</span>
                      </Button>
                  }
                </Button.Group>
              </div>
            </Form.Field>
            <Form.Field>
              <label>Memo</label>
              <input onChange={(e) => this.onChangeMemo(e)} style={{ border: "0px", borderRadius: "2px", backgroundColor: "#f3f3f3" }} placeholder='5.0000' />
            </Form.Field>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                style={{ display: "flex", justifyContent: "center", width: "100px", borderRadius: "2px", marginRight: "5px", backgroundColor: "#9e9e9e" }}
                onClick={() => this.props.closeModal()}>
                <span style={{ color: "#ffffff" }}>CANCEL</span>
              </Button>
              <Button
                style={{ display: "flex", justifyContent: "center", width: "100px", borderRadius: "2px", marginLeft: "5px", backgroundColor: "#267aff"}}
                onClick={() => this.continue()}>
                <span style={{ color: "#ffffff" }}>CONTINUE</span>
              </Button>
            </div>
          </Form>
          <div>
            <span className="clikc-here">Click the button below to be redirected to SteemConnect to complete our transaction.</span>
          </div>
        </div>
      </Modal>
    )
  }
}

Transfer.propTypes = {
    closeModal: PropTypes.func,
    isOpen: PropTypes.bool,
};

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer.transfer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal: () => dispatch(closeTransferModal()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Transfer);
