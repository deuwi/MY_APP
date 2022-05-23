import { useState } from "react";
import React, { Component } from 'react';

type MyProps = {
  // using `interface` is also ok
  isShowing: Boolean;
};

type MyStates = {
  show: Boolean
}
class ModalUpdateCollection extends Component<MyProps, MyStates> {
  state: MyStates = {
    show: true
  }
  render() {
    return (
      (this.props.isShowing) || this.state.show
      ? (<>
            <a className="modal-overlay" onClick={() => this.setState({show: false})}>
              
              <div className="modal-wrapper">
                <div className="modal">
                  <div className="modal-header">
                    <h4>Modal Header</h4>
                    <button
                      type="button"
                      className="modal-close-button"
                      // onClick={}
                    >
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">Hello Modal Here</div>
                </div>
              </div>
            </a>
          </>
        )
      : null
    );
  }
}

export default ModalUpdateCollection;
