import React, { Component } from 'react';
import Head from 'next/head';
import FindBalanceWallet from '../components/wallets/FindBalanceWallet';
import * as solanaWeb3 from '@solana/web3.js';
import bs58 from 'bs58';
import localStorage from 'electron-json-storage';
import { Theme, makeStyles, createStyles } from '@material-ui/core';
import Layout from './Layout';
import os, { type } from 'os'
localStorage.setDataPath(os.tmpdir())
// localStorage.set('wallets', [])
type Mystate  = {
  value: Readonly<string>,
  wallets: Array<any>
}

class listingWallet extends Component<[] | Mystate>  {
  state: Mystate = {
    value: '',
    wallets: []
  };
  componentDidMount(): void {
      this.setState({
        wallets: localStorage.getSync("wallets")
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
      localStorage.get("wallets", (wallets) => {
        let wallet = solanaWeb3.Keypair.fromSecretKey(bs58.decode(this.state.value))
        console.log("wallet: ", wallet, typeof(wallet), wallets)
        if (!wallets) wallets = []
        wallets.push(wallet)
        localStorage.set('wallets', wallets, () => {
          window.location.reload();
          this.setState({
            wallets
          })
        })
      })
    } catch (error) {
      alert('error')
    }

  }
  deletWallet = (walletDel) => {
    let newWalletsList = []
    this.state.wallets.forEach(wallet => {
      if (walletDel != wallet) {
        newWalletsList.push(wallet)
      }
    });
    localStorage.set('wallets', newWalletsList, () => {
      window.location.reload();
      this.setState({
        wallets: newWalletsList
      })
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
                  ? this.state.wallets.map((wallet) => {
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
    // console.log(this.state.wallets.length, this.state.wallets)
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

export default listingWallet;
