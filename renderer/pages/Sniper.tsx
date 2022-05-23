import React, { Component, useCallback, useState  } from 'react';
import Layout from './layout';
import FindCollection from '../components/collection/FindCollection'
import localStorage from 'local-storage';
import InputSearchCollect from '../components/collection/InputSearchCollect';
import modifLogo from '../public/images/icons8-crayon.gif'
import ListCollectionsTarget from '../components/collection/ListCollectionsTarget';
import Modal from '../components/collection/ModalUpdateCollection';
import {useStream} from 'react-fetch-streams';
import { app, BrowserWindow, ipcMain } from "electron";
import axios from 'axios';
import FetchCollectionInfo from '../components/collection/FetchCollectionInfo';



class Sniper extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            valueLimit: 0.01,
            collections: [],
            collectionSniped: [],
            updatingLimit: [null, null],
            inputHide: true,
            error: true,
            runSniper: false,
            errorSniper: false
        };
        // this.inputRef = React.createRef();

    }
         
    componentDidMount() {
      if (typeof window !== 'undefined') {
          this.setState({collections: localStorage.get('collections') != 'undefined' ? localStorage.get('collections') : []})
          window.addEventListener('storage', this.localStorageUpdated)
      }
      
    }
    // componentDidUpdate() {
    //   if (this.state.runSniper) {
    //     findCollectionData('okay_bears')
    //   }
    // }
    
    localStorageUpdated = () => {
      this.updateState(localStorage.get('collections'))
    }
    updateState = (value) =>{
      this.setState({collections:value})
    }
    handleChange = (event) => {    
      this.setState({value: event.target.value});  
    }
    handleSubmit = (event) => {
      console.log('submit')
    //   this.addCollection()
      event.preventDefault();
    }


    // buyItem = () => {
    //   var data = []
    //   let symbol = this.state.collections[0][0]
    //   // console.log(config)
    //   this.findCollectionData(symbol)

    //   // const childWindow = window.open('', 'modal')
    //   // var newDiv = document.createElement("div");
    //   // var newContent = document.createTextNode('Hi there and greetings!');
    //   // newDiv.appendChild(newContent);
    //   // childWindow.document.body.appendChild(newDiv)

    // }
    setData = (data) => {

      if (data) {
        console.log(data)
        this.setState({
          errorSniper: false
        })
      }else {
        console.log(data)
        this.setState({
          errorSniper: true
        })
      }
    }
    runSniper = () => {
      this.setState({
        runSniper: true
      })
    }
    generateKey = (pre) => {
        return `${pre}_${new Date().getTime()}`;
      }

    renderCollectionTarget = () => {
        
        return (
            <div>
              <div className='list'>
                
                  <InputSearchCollect collections={this.state.collections}/>
                  <ListCollectionsTarget collections={this.state.collections}/>
                  <FetchCollectionInfo symbol={'rotten_ville_sculptures'}/>
                  {/* <button onClick={this.runSniper} className="modal-save-button">Run!</button> */}
              </div>
            </div>
        )
    }
      // }
    render() {
      return (<Layout body={this.renderCollectionTarget}/>)
    }
}
  
  
  
export default Sniper;