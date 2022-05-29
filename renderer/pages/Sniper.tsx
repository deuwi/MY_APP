import React, { Component, useCallback, useState  } from 'react';
import Head from 'next/head';
import Layout from './MyLayout';
import localStorage from 'electron-json-storage';
import InputSearchCollect from '../components/collection/InputSearchCollect';
import ListCollectionsTarget from '../components/collection/ListCollectionsTarget';
import FetchCollectionInfo from '../components/collection/FetchCollectionInfo';
import os from 'os'
localStorage.setDataPath(os.tmpdir())


let timer = null;

type AnyType = any[]
interface IProps {
}
interface States {
  value?: string,
  valueMs: Number,
  valueLimit: Number,
  collections: Array<Array<object>>,
  collectionSniped: Array<any[]>,
  updatingLimit: Array<AnyType>,
  inputHide: Boolean,
  error: Boolean,
  runSniper: Boolean,
  errorSniper: Boolean,
  time: number,
  mode: string
}

class Sniper extends React.Component < IProps, States>{
    
        state = {
            value: '',
            valueMs: 100,
            valueLimit: 0.01,
            collections: [],
            collectionSniped: [],
            updatingLimit: [null, null],
            inputHide: true,
            error: true,
            runSniper: false,
            errorSniper: false,
            time: 0,
            mode: ''
        };
        // this.inputRef = React.createRef();

         
    componentDidMount() {
      if (typeof window !== 'undefined') {
        
        this.updateState(localStorage.getSync('collections'))
          
        window.addEventListener('storage', this.localStorageUpdated)
      }
      
    }
    localStorageUpdated = () => {
      this.updateState(localStorage.getSync('collections'))
    }
    updateState = (value: any) =>{
      this.setState({collections:value})
    }
    handleChange = (event: any) => {    
      this.setState({value: event.target.value});  
    }
    handleChangeMs = (event: any) => {   
      this.setState({valueMs: event.target.value});  
    }

    setData = (data: any) => {

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

    changeMode = (event) => {
      console.log(event)
      this.setState({
        mode: event.target.value
      })
    } 

    generateKey = (pre) => {
        return `${pre}_${new Date().getTime()}`;
      }

    renderCollectionTarget = () => {
        return (
            <div>
              <div className='list'>
                
                  
                  {this.state.runSniper ? 
                    <div style={{width: '80%'}}>
                      <p>timer: {this.state.time}</p>
                      {this.state.collections.map((collection) => {
                        console.log(collection)
                        return <FetchCollectionInfo collection={collection} msRefresh={this.state.valueMs}/>
                      })}
                    </div>
                  : <>
                    <InputSearchCollect collections={this.state.collections}/>
                    
                    <ListCollectionsTarget collections={this.state.collections}/>
                  </>}

                  <div style={{padding: '10px'}}>
                    {this.state.runSniper ? null : 
                    <>
                    <label>Wallet mode: </label>
                      <select value={this.state.mode} onChange={this.changeMode}>
                        <option value={''} disabled >Mode         </option>
                        <option value={'multi'}   >Multi wallets</option>
                        <option value={'priotity'}>Priority     </option>
                      </select>
                      {this.state.mode == '' ? 
                        null : 
                        <>
                          <input type={'number'} onChange={this.handleChangeMs} placeholder={'ex: 1000 ms (null=default)'} title={'1000 recommanded (null=default)'}></input>                 
                          <button onClick={this.runSniper} className="modal-save-button">{this.state.runSniper ? 'Stop' : 'Run !'}</button>
                        </>
                      }</>
                    }
                  </div>
                  
              </div>
            </div>
        )
    }
      // }
    render() {
      return (
        <React.Fragment>
          <Head>
            <title>Home - Nextron (with-typescript-material-ui)</title>
          </Head>
          {this.renderCollectionTarget()}
        </React.Fragment>
    );
    }
}
  
  
  
export default Sniper;