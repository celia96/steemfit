import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '',
      active: '',
      navs: [false, false, false, false]
    }
  }

  componentDidMount() {
    // retrieve navs from pathname
    this.makeRemoteRequest()
  }

  makeRemoteRequest() {
    var path = this.props.location.pathname.split('/');
    var user = path[1].slice(1); // user
    var nav = path[path.length-1]; // navigation (posts, comments, wallet, or activity)
    var navs;
    if (nav === 'comments') {
      navs = [false, true, false, false];
    } else if (nav === 'wallet') {
      navs = [false, false, true, false];
    } else if (nav === 'activity') {
      navs = [false, false, false, true];
    } else {
      // if it's just /@:use without any more params
      console.log("Show default page (posts)");
      navs = [true, false, false, false]
    }
    this.setState({
      navs: navs,
      user: user
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.makeRemoteRequest();
    }
  }


  onChange(navs) {
    this.setState({
      navs: navs
    })
  }

  render() {
    const { navs, user } = this.state;
    return (
      <div style={{ width: "800px", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>

        <div
          style={{ marginRight: "10px" }}
          onClick={() => this.onChange([true, false, false, false])}>
          <Link to={`/@${user}`} style={{ textDecoration: 'none' }}>
            { navs[0]
              ? <div>
                  <span className="Nav-active">포스트</span>
                  <div style={{ width: "50px" }} className="Nav-rectangle-active"></div>
                </div>
              : <div className="Nav-hover">
                  <span className="Nav-inactive">포스트</span>
                  <div style={{ width: "50px" }} className="Nav-rectangle-inactive"></div>
                </div>
            }
          </Link>
        </div>

        <div
          style={{ marginRight: "10px", marginLeft: "10px" }}
          onClick={() => this.onChange([false, true, false, false])}>
          <Link to={`/@${user}/comments`} style={{ textDecoration: 'none' }}>
            { navs[1]
              ? <div>
                  <span className="Nav-active">작성한 댓글</span>
                  <div style={{ width: "90px" }} className="Nav-rectangle-active"></div>
                </div>
              : <div className="Nav-hover">
                  <span className="Nav-inactive">작성한 댓글</span>
                  <div style={{ width: "90px" }} className="Nav-rectangle-inactive"></div>
                </div>
            }
          </Link>
        </div>

        <div
          style={{ marginRight: "10px", marginLeft: "10px" }}
          onClick={() => this.onChange([false, false, true, false])}>
          <Link to={`/@${user}/wallet`} style={{ textDecoration: 'none' }}>
            { navs[2]
              ? <div>
                  <span className="Nav-active">지갑</span>
                  <div style={{ width: "33px" }} className="Nav-rectangle-active"></div>
                </div>
              : <div className="Nav-hover">
                  <span className="Nav-inactive">지갑</span>
                  <div style={{ width: "33px" }} className="Nav-rectangle-inactive"></div>
                </div>
            }
          </Link>
        </div>

        <div
          style={{ marginLeft: "10px" }}
          onClick={() => this.onChange([false, false, false, true])}>
          <Link to={`/@${user}/activity`} style={{ textDecoration: 'none' }}>
            { navs[3]
              ? <div>
                  <span className="Nav-active">활동</span>
                  <div style={{ width: "33px" }} className="Nav-rectangle-active"></div>
                </div>
              : <div className="Nav-hover">
                  <span className="Nav-inactive">활동</span>
                  <div style={{ width: "33px" }} className="Nav-rectangle-inactive"></div>
                </div>
            }
          </Link>
        </div>

      </div>
    )
  }
}


export default Navigation;
