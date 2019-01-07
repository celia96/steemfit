import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import Header from './Header';


class About extends Component {

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

    renderContent() {
      return (
        <Element name="about" className="element" style={{ display: "flex", flexDirection: "column" }}>

          <div className="About-box" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

            <div style={{ position: "relative", left: "120px" }} className="About-pic"></div>
            <div style={{ position: "relative", left: "50px", bottom: "50px" }} className="About-sub">
              FASHION
            </div>
            <div
              style={{ position: "relative", width: "450px", height: "100px", right: "120px", top: "50px" }}
              className="About-content">
              V-Conference wants to know your favorite places for Fashion & Beauty!
              Share your own happy memories from fabulous Shop and get upvotes.
              Lots of people want to read your guide!
            </div>

          </div>

          <div className="About-box" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", left: "120px" }} className="About-pic"></div>
            <div style={{ position: "relative", left: "50px", bottom: "50px" }} className="About-sub">
              FASHION
            </div>
            <div
              style={{ position: "relative", width: "450px", height: "100px", right: "120px", top: "50px" }}
              className="About-content">
              V-Conference wants to know your favorite places for Fashion & Beauty!
              Share your own happy memories from fabulous Shop and get upvotes.
              Lots of people want to read your guide!
            </div>
          </div>

          <div className="About-box" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

            <div style={{ position: "relative", left: "120px" }} className="About-pic"></div>
            <div style={{ position: "relative", left: "50px", bottom: "50px" }} className="About-sub">
              FASHION
            </div>
            <div
              style={{ position: "relative", width: "450px", height: "100px", right: "120px", top: "50px" }}
              className="About-content">
              V-Conference wants to know your favorite places for Fashion & Beauty!
              Share your own happy memories from fabulous Shop and get upvotes.
              Lots of people want to read your guide!
            </div>

          </div>
        </Element>
      )
    }

    render() {
      return (
          <div className="Rectangle-home">

              {/* Header and About Header */}
              <div style={{ height: "100vh" }}>

                  {/* Background Image */}
                  <img src="img/bg.png" className="BG-image"/>

                  {/* Header */}
                  <Header />
                  <div style={{ borderBottom: "solid 1px #ffffff" }}></div>

                  {/* ABOUT STEEMFIT Header*/}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "90vh" }}>
                      <div className="letter-container">
                          <div className="Rectangle-about"></div>
                          <span className="ABOUT-STEEMFIT">
                              <span className="text-style-1">ABOUT</span><span> STEEMFIT</span>
                          </span>
                      </div>

                      <div className="Our-mission-is-what" style={{ marginTop: "10px", marginBottom: "50px" }}>
                          Our mission is what drives us to do everything possible to expand human potential.
                          We do that by creating groundbreaking sport innovations, by making our products
                          more sustainably, by building a creative and diverse global team and by making
                          a positive impact in communities where we live and work.
                      </div>

                      <Link activeClass="active" to="about" spy={true} smooth={true} duration={500}>
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

export default About;
