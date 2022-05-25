import React, { Component } from 'react';
import Head from 'next/head';
import FindBalanceWallet from '../components/wallets/FindBalanceWallet';
import * as solanaWeb3 from '@solana/web3.js';
import bs58 from 'bs58';
import localStorage from 'local-storage';
import { Theme, makeStyles, createStyles } from '@material-ui/core';
import Layout from './Layout';
// localStorage.set('wallets', [])

const { BrowserWindow } = require ("electron");

type Mystate = {

  value: string,
  wallets: Array<any>
}
class ListingWallet extends Component <[]| Readonly<Mystate>> {
  constructor(props: Mystate) {
      super(props);
      this.state = {
        value: '',
        wallets: []
      };
    }
  componentDidMount(): void {
    console.log(window.localStorage.getItem("wallets"))
    this.setState({
      wallets: []
    })
  }
  handleChange = (event) => {    
    this.setState({value: event.target.value});  
  }
  handleSubmit = (event) => {
    
    this.addWallet()
    event.preventDefault();
  }
  addWallet = () => {
    try {
      BrowserWindow.webContents
      .executeJavaScript('({...localStorage});', true)
      .then(localStorage => {
        console.log(localStorage);
      });
      let wallets = window.localStorage.getItem("wallets") 
      let wallet = solanaWeb3.Keypair.fromSecretKey(bs58.decode(this.state.value))

      console.log("wallet: ", wallet, typeof(wallet), wallets)
      if (!wallets) {
        wallets = []
      }
      wallets.push(JSON.stringify(wallet))
      console.log(wallets)
      window.localStorage.setItem('wallets', wallets)
      // window.location.reload();
      this.setState({
        wallets: wallets
      })
    } catch (error) {
      alert('error')
    }

  }
  deletWallet = (walletDel) => {
    let newWalletsList: Array<any> = []
    this.state.wallets.forEach(wallet => {
      if (walletDel != wallet) {
        newWalletsList.push(wallet)
      }
    });
    window.localStorage.setItem('wallets', newWalletsList)
    window.location.reload();
    this.setState({
      wallets: newWalletsList
    })
  }
  getPublickey = (walletSave) => {
    //  PUBLIC KEY
    const keypair = solanaWeb3.Keypair.fromSecretKey(
      Uint8Array.from(Object.values(walletSave._keypair.secretKey))
    );
    return new solanaWeb3.PublicKey(keypair.publicKey.toBase58())
  }
  generateKey = (pre) => {
    return `${pre}_${new Date().getTime()}`;
  }
  displayAddress = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;

  bodyGen = () => {
    console.log(this.state.wallets)
    return (
      <div >
            <div className='list'>
                <div>
                  <h2>Add Wallet :</h2> 
                  <form className='inputRow' onSubmit={this.handleSubmit}>
                      <label>
                        <input 
                          type="text" 
                          value={this.state.value} 
                          onChange={this.handleChange} 
                          placeholder="privetKey"/>        
                      </label>
                      <input type="submit" value="Envoyer" />
                  </form>
                </div>
                <div className={'itemList'}>
                {this.state.wallets.length > 0
                  ? this.state.wallets?.map((wallet) => {
                      return (
                          
                          <div className={'item'} key={this.getPublickey(wallet).toString()}>
                            <div className='detail'>
                              <div>{this.displayAddress(this.getPublickey(wallet).toString())}</div>
                              <FindBalanceWallet  publicKey={this.getPublickey(wallet).toString()}/>
                            </div>
                            <div className='option'>
                              <button title='Delete' onClick={() => this.deletWallet(wallet)}>
                                x
                              </button>

                              {/* <div>I</div> */}
                            </div>
                          </div>
                        )
                    })
                  : <div>No wallet register</div>
                }
                </div>
                          
            </div>
        
        {/* <FindBalanceWallet  publicKey={'LBrXAu2muqDXDFyoGsVGwEp87iAzJTdmQCM9aUNRdMu'}/> */}
      </div>
    )
  }

  render () {
    return (
      <React.Fragment>
        <Head>
          <title>Home - Nextron (with-typescript-material-ui)</title>
        </Head>
        <Layout body={this.bodyGen}/>
      </React.Fragment>
    );
  }
  
};

export default ListingWallet;
