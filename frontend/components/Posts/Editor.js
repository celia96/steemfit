import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { Input, Form, TextArea, Dropdown, Checkbox, Button, Divider } from 'semantic-ui-react';
import RichTextEditor from 'react-rte';

import url from '../url';
import Header from '../Home/Header';

// Post (글 작성하기)
class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      tags: "",
      value: RichTextEditor.createEmptyValue(), // body
      format: "editor",
      readOnly: false,
      rewardOptions: [
          {
            text: 'Declined',
            value: 'Declined',
          },
          {
            text: '50% SBD and 50% SP',
            value: '50% SBD and 50% SP',
          },
          {
            text: '100% Steem Power',
            value: '100% Steem Power',
          },
      ],
      checked: true,
      reward: '',
      accessToken: '',
      posted: false
    }
  }

  submitPost() {
    console.log("submit post");
    var at = this.props.accessToken;
    var permlink = this.state.title.replace(/[^\w\s]|_/g, "").replace(/[0-9]/g, '').replace(/\s+/g, "-").toLowerCase();
    var taglist = this.state.tags.split(' ');
    var parent_permlink = taglist[0];
    if (!parent_permlink) {
      parent_permlink = "no-tag";
    }

    console.log("body: ", this.state.value, at);
    console.log("body markdown ", this.state.value.toString("markdown"));

    fetch('https://steemconnect.com/api/broadcast', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${at}`,
        'Content-Type': 'application/json' // 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({
        "operations": [
           ["comment", {
             "parent_author": "",
             "parent_permlink": parent_permlink,
             "author": "celia96",
             "permlink": permlink,
             "title": this.state.title,
             "body": this.state.value.toString("markdown"),
             "json_metadata": JSON.stringify({ tags: taglist })
           }]
         ]
      })
    }).then(response => {
      if (response.ok) {
        this.setState({
          posted: true
        })
      }
    }).catch(err => {
      console.log("Error in posting ", err);
    })
  }

  toggleCheck() {
    this.setState({
      checked: !this.state.checked
    })
  }

  changeReward(e, v) {
    console.log("v ", v);
    console.log("reward ", v.value);
    this.setState({
      reward: v.value
    })
  }

  changeTitle(e) {
    console.log("value? ", e.target.value);
    this.setState({
      title: e.target.value
    })
  }

  changeTags(e) {
    console.log("value? ", e.target.value);
    this.setState({
      tags: e.target.value
    })
  }

  onChange(value) {
    // console.log("value ", value);
    this.setState({value});
  };

  onChangeSource(e) {
    let source = e.target.value; // markdown string
    let oldValue = this.state.value; // editorstate
    console.log("source ", source);
    console.log("old ", oldValue);
    this.setState({
      value: oldValue.setContentFromString(source, this.state.format),
    });
  }

  onChangeFormat() {
    if (this.state.format === "markdown") {
      this.setState({
        format: "editor",
        readOnly: false
      })
    } else {
      this.setState({
        format: "markdown",
        readOnly: true
      })
    }

  }

  renderEditor() {
    // write in editor
    return (
        <div>
            <RichTextEditor
              style={{ border: "0px" }}
              value={this.state.value}
              className="editor-editor"
              placeholder="내용을 입력해주세요"
              onChange={(e) => this.onChange(e)}
              toolbarClassName="demo-toolbar"
              editorClassName="demo-editor"
              readOnly={this.state.readOnly}
            />
        </div>
    )
  }

  renderMarkdown() {
    // write in markdown
    return (
        <div style={{ display: "flex", flexDirection: "row", width: "800px" }}>
            <Form>
              <TextArea
                style={{ resize: "none", height: "500px", width: "400px", border: "0px" }}
                placeholder='내용을 입력해주세요'
                value={this.state.value.toString("markdown")}
                onChange={(e) => this.onChangeSource(e)}
              />
            </Form>
            <span style={{ display: "flex", border: "solid 0.5px #e6e6e6" }} />
            <div style={{ display: "flex" }}>
                {this.renderPreview()}
            </div>
        </div>
    )
  }

  renderPreview() {
    // preview
    return (
        <div style={{ width: "400px" }}>
            <RichTextEditor
              style={{ width: "400px" }}
              value={this.state.value}
              className="preview"
              placeholder=""
              onChange={(e) => this.onChange(e)}
              toolbarClassName="demo-toolbar"
              editorClassName="demo-editor"
              readOnly={this.state.readOnly}
            />
        </div>
    )
  }


  render () {
    return (
      <div>
        {this.state.posted
          ? <Redirect to="/" />
          : <div style={{ height: "100vh" }}>
              <Header />
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: "100px" }}>

                <div style={{ marginTop: "10px", marginBottom: "25px"}}>
                  <div className="editor-head-rectangle" />
                  <span className="editor-head">지금 어떠한 옷을 입고 계신가요?</span>
                </div>
                <div style={{ display: "flex",  justifyContent: "flex-end", width: "800px" }}>
                  { this.state.format === "markdown"
                    ? <span style={{ cursor: "pointer" }} className="editor-change" onClick={() => this.onChangeFormat()}>Editor</span>
                    : <span style={{ cursor: "pointer" }} className="editor-change" onClick={() => this.onChangeFormat()}>Markdown</span> }
                </div>
                <div style={{ border: "solid 1px #e6e6e6", borderRadius: "5px", padding: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Form style={{ width: "800px"}}>
                    <input
                      style={{ border: "0px", borderRadius: "0px", borderBottom: "1px solid #e6e6e6", padding: "15px", fontSize: "16px" }}
                      placeholder='제목을 입력해주세요'
                      onChange={(e) => this.changeTitle(e)}/>
                  </Form>
                  { this.state.format === "markdown"
                    ? this.renderMarkdown()
                    : this.renderEditor() }
                  <Form style={{ width: "800px"}}>
                    <input
                      style={{ border: "0px", borderRadius: "0px", borderBottom: "1px solid #e6e6e6", borderTop: "1px solid #e6e6e6", padding: "15px", fontSize: "16px" }}
                      placeholder='이야기 주제를 추가하세요. 주제는 쉼표로 구분해주세요.'
                      onChange={(e) => this.changeTags(e)}/>
                  </Form>

                  <Dropdown
                    style={{ width: "800px", border: "0px", marginTop: "10px",  }}
                    placeholder='Select Reward'
                    // defaultValue={this.state.rewardOptions[0].value}
                    scrolling={false}
                    onChange={(e, v) => this.changeReward(e, v)}
                    selection
                    options={this.state.rewardOptions} />
                </div>

                <div style={{ padding: "20px", paddingLeft: "0px", width: "820px" }}>
                  <Checkbox
                    label='Like this post'
                    checked={this.state.checked}
                    onChange={() => this.toggleCheck()}/>
                </div>
                <div style={{ display: "flex", width: "820px" }}>
                  <Button
                    style={{ flex: 1, backgroundColor: "#f7ea73"}}
                    onClick={() => this.submitPost()}>
                    작성하기
                  </Button>
                </div>
              </div>
            </div>
          }
      </div>
    );
  }
}

Editor.propTypes = {
    user: PropTypes.string,
    accessToken: PropTypes.string
};

const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        accessToken: state.userReducer.accessToken
    };
};

export default connect(
    mapStateToProps,
    null
)(Editor);
