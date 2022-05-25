import React, { Component, useCallback, useState  } from 'react';
import Layout from './Layout';
import localStorage from 'local-storage';
import InputSearchCollect from '../components/collection/InputSearchCollect';
import ListCollectionsTarget from '../components/collection/ListCollectionsTarget';
import FetchCollectionInfo from '../components/collection/FetchCollectionInfo';


let timer = null;

type CollectionType = any[]
type CustomValue = Array<CollectionType>;
type States = {
  value: string,
  valueMs: Number,
  valueLimit: Number,
  collections: Array<any>,
  collectionSniped: Array<string | undefined[]>,
  updatingLimit: Array<any>,
  inputHide: Boolean,
  error: Boolean,
  runSniper: Boolean,
  errorSniper: Boolean,
  time: number,
}

class Sniper extends React.Component < [], States>{
  
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            valueMs: 100,
            valueLimit: 0.01,
            collections: [null],
            collectionSniped: [],
            updatingLimit: [null, null],
            inputHide: true,
            error: true,
            runSniper: false,
            errorSniper: false,
            time: 0,
        };
        // this.inputRef = React.createRef();

    }
         
    componentDidMount() {
      if (typeof window !== 'undefined') {
          let collections =  JSON.parse(window.localStorage.getItem('collections'))
          this.setState({collections:  collections})
          window.addEventListener('storage', this.localStorageUpdated)
      }
      
    }
    componentWillUnmount() {
      clearTimeout(timer);
    }
    localStorageUpdated = () => {
      this.updateState(window.localStorage.getItem('collections'))
    }
    updateState = (value) =>{
      this.setState({collections:value})
    }
    handleChange = (event) => {    
      this.setState({value: event.target.value});  
    }
    handleChangeMs = (event) => {   
      this.setState({valueMs: event.target.value});  
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
        // console.log(data)
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
        runSniper: !this.state.runSniper
      })
      if (!this.state.runSniper) {
        timer = setInterval(() => {
          this.setState({
            time: this.state.time + 1
          })
        }, 1000);
      } else {
        this.setState({
          time: 0
        })
        clearTimeout(timer);
      }
    }
    generateKey = (pre) => {
        return `${pre}_${new Date().getTime()}`;
      }

    renderCollectionTarget = () => {
        return (
            <div>
              <div className='list'>
                
                  <InputSearchCollect collections={this.state.collections}/>

                  {this.state.runSniper ? 
                    <div style={{width: '80%'}}>
                      <p>timer: {this.state.time}</p>
                      {this.state.collections.map((collection) => {
                        return <FetchCollectionInfo key={this.generateKey(collection[0])} collection={collection} msRefresh={this.state.valueMs}/>
                      })}
                    </div>
                  : <ListCollectionsTarget collections={this.state.collections}/>}


                  <div>
                    {this.state.runSniper ? null : <input type={'number'} onChange={this.handleChangeMs} placeholder={'ex: 1000 ms'} title={'1000 recommanded'}></input>}
                    <button onClick={this.runSniper} className="modal-save-button">{this.state.runSniper ? 'Stop' : 'Run !'}</button>
                  </div>
                  
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