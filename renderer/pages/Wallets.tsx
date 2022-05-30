import React, { Component } from 'react';
import Head from 'next/head';
import FindBalanceWallet from '../components/wallets/FindBalanceWallet';
import * as solanaWeb3 from '@solana/web3.js';
import bs58 from 'bs58';
import localStorage from 'electron-json-storage';
import { Theme, makeStyles, createStyles, Input } from '@material-ui/core';
import Layout from './MyLayout';
import os, { type } from 'os'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
localStorage.setDataPath(os.tmpdir())
// localStorage.set('wallets', [])
type Mystate  = {
  value: Readonly<string>,
  wallets: Readonly<any>
}

class listingWallet extends Component<{} | Mystate>  {
  state: Mystate = {
    value: '',
    wallets: []
  };
  componentDidMount(): void {
    this.localStorageUpdated()
    
    window.addEventListener('storageWallet', this.localStorageUpdated)
  }
  
  localStorageUpdated = () => {
    this.setState({
      wallets: localStorage.getSync("wallets")
    })
    
  }
  handleChange = (event: { target: { value: any; }; }) => {    
    this.setState({value: event.target.value});  
  }
  handleSubmit = (event: { preventDefault: () => void; }) => {
    
    this.addWallet()
    event.preventDefault();
  }
  addWallet = () => {
    try {
        let wallet_key = {
          key: null,
          priority: null
        }
        let wallet = solanaWeb3.Keypair.fromSecretKey(bs58.decode(this.state.value))
        // first add
        let wallets = this.state.wallets
        if (typeof(wallets)  == "undefined") {wallets = []; console.log('considtion')}
        console.log("wallet: ", wallets)
        wallet_key.key = wallet;
        wallet_key.priority = false;
        wallets.push(wallet_key)
        console.log("wallet: ", wallets)
        //update storage
        localStorage.set('wallets', wallets, () => {
          window.dispatchEvent(new Event("storageWallet"));
        })
    } catch (error) {
      alert('error')
    }

  }
  deletWallet = (walletDel: any) => {
    let newWalletsList = []
    this.state.wallets.forEach(wallet => {
      if (walletDel != wallet) {
        newWalletsList.push(wallet)
      }
    });
    localStorage.set('wallets', newWalletsList, () => {
      window.dispatchEvent(new Event("storageWallet"));
    })
  }
  getPublickey = (walletSave: { _keypair: { secretKey: { [s: string]: number; } | ArrayLike<number>; }; }) => {
    //  PUBLIC KEY
    const keypair = solanaWeb3.Keypair.fromSecretKey(
      Uint8Array.from(Object.values(walletSave._keypair.secretKey))
    );
    return new solanaWeb3.PublicKey(keypair.publicKey.toBase58())
  }
  setWalletPriority = (wallet) => {
    let newWallets = this.state.wallets
    newWallets.forEach((walletModif) => {
      if (walletModif == wallet) {
        walletModif.priority = true
      } else {
        walletModif.priority = false
      }
    })

    localStorage.set('wallets', newWallets, () => {
      window.dispatchEvent(new Event("storageWallet"));
    })
  }
  generateKey = (pre) => {
    return `${pre}_${new Date().getTime()}`;
  }
  displayAddress = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;

  bodyGen = () => {
    console.log(localStorage.getSync("wallets"))
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
                          
                          <div className={'item'} key={this.getPublickey(wallet.key).toString()}>
                            <div className='detail'>
                              <div>{this.displayAddress(this.getPublickey(wallet.key).toString())}</div>
                              <FindBalanceWallet  publicKey={this.getPublickey(wallet.key).toString()}/>
                            </div>
                            <div className='option'>
                              {!wallet.priority ? 
                                <input 
                                  type='checkbox' 
                                  title='Priotity'
                                  checked={false}
                                  onChange={() => this.setWalletPriority(wallet)}/> 
                                : <input 
                                  type='checkbox' 
                                  title='Priotity'
                                  disabled
                                  checked
                                  onChange={() => this.setWalletPriority(wallet)}/> 
                              }
                              <button 
                                className='deleteButton'
                                title='Delete' 
                                onClick={() => this.deletWallet(wallet)}>
                                <FontAwesomeIcon icon={['fas', 'xmark']} />
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
      this.bodyGen()
    );
  }
  
};

export default listingWallet;
