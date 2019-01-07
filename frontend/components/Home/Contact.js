import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import Header from './Header';


class Contact extends Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {
      Events.scrollEvent.register('begin', function () {
        console.log("begin", arguments);
      });

      Events.scrollEvent.register('end', function () {
        console.log("end", arguments);
      });
    }

    componentWillUnMount() {
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    }

    openContent() {
      console.log("open content");
    }

    renderContent() {
      return (
        <Element
          name="contact"
          className="element"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "150px" }}>
          <div style={{ width: "840px", paddingTop: "20px", paddingBottom: "20px",
            display: "flex", justifyContent : "flex-start"
          }}>
            <span style={{ fontSize: "32px"}} className="contact-context">FAQ</span>
          </div>

          <div style={{ width: "840px", paddingTop: "20px", paddingBottom: "20px",
            borderBottom: "solid 1px #e6e6e6", display: "flex", justifyContent : "space-between" }}>
            <span className="contact-context">What does V-Conference mean?</span>
            <div style={{ cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center",
                width: "32px", height: "32px", border: "solid 1px #000000" }}
                onClick={() => this.openContent()}>
              <img src="img/plus.svg"/>
            </div>
          </div>
          <div style={{ width: "840px", paddingTop: "20px", paddingBottom: "20px",
            borderBottom: "solid 1px #e6e6e6", display: "flex", justifyContent : "space-between" }}>
            <span className="contact-context">What does V-Conference mean?</span>
            <div style={{ cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center",
                width: "32px", height: "32px", border: "solid 1px #000000" }}
                onClick={() => this.openContent()}>
              <img src="img/plus.svg"/>
            </div>
          </div>
          <div style={{ width: "840px", paddingTop: "20px", paddingBottom: "20px",
            borderBottom: "solid 1px #e6e6e6", display: "flex", justifyContent : "space-between" }}>
            <span className="contact-context">What does V-Conference mean?</span>
            <div style={{ cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center",
                width: "32px", height: "32px", border: "solid 1px #000000" }}
                onClick={() => this.openContent()}>
              <img src="img/plus.svg"/>
            </div>
          </div>
          <div style={{ width: "840px", paddingTop: "20px", paddingBottom: "20px",
            borderBottom: "solid 1px #e6e6e6", display: "flex", justifyContent : "space-between" }}>
            <span className="contact-context">What does V-Conference mean?</span>
            <div style={{ cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center",
                width: "32px", height: "32px", border: "solid 1px #000000" }}
                onClick={() => this.openContent()}>
              <img src="img/plus.svg"/>
            </div>
          </div>
          <div style={{ width: "840px", paddingTop: "20px", paddingBottom: "20px",
            borderBottom: "solid 1px #e6e6e6", display: "flex", justifyContent : "space-between" }}>
            <span className="contact-context">What does V-Conference mean?</span>
            <div style={{ cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center",
                width: "32px", height: "32px", border: "solid 1px #000000" }}
                onClick={() => this.openContent()}>
              <img src="img/plus.svg"/>
            </div>
          </div>

        </Element>
      )
    }

    render() {
      return (
          <div className="Rectangle-home">

              {/* Header and Contact Header */}
              <div style={{ height: "100vh" }}>
                  {/* Background Image */}
                  <img src="img/bg.png" className="BG-image"/>

                  {/* Header */}
                  <Header />
                  <div style={{ borderBottom: "solid 1px #ffffff" }}></div>

                  {/* Contact Header*/}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "90vh" }}>
                      <div className="letter-container">
                          <div className="Rectangle-about"></div>
                          <div className="ANY-QUESTION">
                              ANY QEUSTIONS?
                          </div>
                      </div>

                      <div className="Our-mission-is-what" style={{ marginTop: "10px", marginBottom: "50px" }}>
                          Our mission is what drives us to do everything possible to expand human potential.
                          We do that by creating groundbreaking sport innovations, by making our products
                          more sustainably, by building a creative and diverse global team and by making
                          a positive impact in communities where we live and work.
                      </div>

                      <Link activeClass="active" to="contact" spy={true} smooth={true} duration={500}>
                        <div style={{ cursor: "pointer" }} className="Rectangle-arrow">
                            <img src="img/arrow-down.svg" className="arrow_down" />
                        </div>
                      </Link>
                  </div>
              </div>

              {/* About Content */}
              {this.renderContent()}

          </div>
      )
    }

};

export default Contact;
