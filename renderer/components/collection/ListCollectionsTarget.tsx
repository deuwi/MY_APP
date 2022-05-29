import React, { Component } from 'react';
import localStorage from 'electron-json-storage';
import FindCollection from './FindCollection';
import ModalUpdateCollection from './ModalUpdateCollection';
import { type } from 'os';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, fa0 } from '@fortawesome/free-solid-svg-icons';
import {useStream} from 'react-fetch-streams';
library.add(fas);
type ArrayCollection = {
    name: String,
    value: Number
}
type MyState = {
    valueLimit: number,
    updatingLimit: any,      
    showModal: Boolean,
    valueLimitPrice: number
};
type ObjectButton = {
    name: String,
    value: Number
}

type MyProps = {
    collections: Array<any[]>,
}
class ListCollectionsTarget extends Component<MyProps, MyState> {
    
    state = {
        valueLimit: null,
        updatingLimit: null,
        showModal: false,
        valueLimitPrice: 0.01
    }
        
    componentDidMount() {
        // if (typeof window !== 'undefined') {
        //     this.setState({collections: localStorage.get('collections') != undefined ? localStorage.get('collections') : []})
        //     // console.log(localStorage.get('collections'))
        // }
        // window.addEventListener('storage', this.localStorageUpdated)
    }
    
    deleteCollectionTargeted = (item) => {
        let newCollectionTargeted = []
        this.props.collections.forEach(collection => {
          if (item['symbol'] != collection['symbol']) {
              console.log(item['symbol'], collection['symbol'])
            newCollectionTargeted.push(collection)
          }
        });
        localStorage.set('collections', newCollectionTargeted, () => {
            window.dispatchEvent(new Event("storage"));
        })

    }
    toggleLimitPriceSetting = (event: Object) => {
        let item = event

        console.log("toogle", item)
        if (this.state.updatingLimit == null) {
            // console.log('ok', item)
            this.setState({updatingLimit: item}) 
        }else {
            this.setState({updatingLimit: null}) 
        }
    }
    setValueLimitPrice = (event) => {
        this.setState({
            valueLimitPrice: Number(event.target.value)
        })
    }
    saveLimitPrice = () => {
        if (this.state.valueLimitPrice && this.state.valueLimitPrice > 0) {
            let collectionUpdated = []
            let item = this.state.updatingLimit
            this.props.collections.forEach((collection) => {
                console.log(item['symbol'], '==', collection['symbol'])
                if (item['symbol'] == collection['symbol']) {
                    //change limit price
                    collection['targetPrice'] = this.state.valueLimitPrice
                }
                collectionUpdated.push(collection)
            })
            // this.setState({updatingLimit: [null, null]})
            localStorage.set('collections', collectionUpdated, () => {

                this.setState({updatingLimit: null})
                console.log( collectionUpdated)
            })
        }
    }
    generateKey = (pre) => {
        return `${pre}_${new Date().getTime()}`;
    }
    renderList() {
        return (
            <>
            <div className='itemExemple'>
            {/* {Loader('big')} */}
            <div  className='detailExemple'>
                <div>Symbol</div>
                <div>Limit</div>
                <div>Floor</div>
  
            </div>
            <div>
            <button 
                title='Update' >
            </button>
            
            
            <button type='button' 
                    title='Delete'>
            </button>
            </div>
          </div>
            {this.props.collections[0] != null ? this.props.collections?.map((item, i) => {
                console.log(item)
                return( 
                    <div key={this.generateKey(item['symbol'])}>
                
                        {/* <ModalUpdateCollection isShowing={this.state.updatingLimit != null} /> */}
                        <FindCollection 
                            symbol={item['symbol']}
                            // price limit
                            priceLimit={item['targetPrice']}
                            button={
                                <div>
                                    <button
                                        title='Update'
                                        onClick={() => this.toggleLimitPriceSetting(item)}>
                                        <FontAwesomeIcon icon={['fas', 'pen-to-square']} />
                                    </button>


                                    <button 
                                        className='deleteButton'
                                        title='Delete'
                                        onClick={() => this.deleteCollectionTargeted(item)}>
                                        <FontAwesomeIcon icon={['fas', 'xmark']} />
                                    </button>
                                </div>} 
                            noStyle={false} 
                            submit={null}/>
                    </div>)  
            }): null}
            </>

        )
    }
    render() {
        console.log(this.state.updatingLimit)
        return (
            <React.Fragment  >
            <div>
                {this.state.updatingLimit != null ? 
                <>
                    <a className="modal-overlay" onClick={() => this.setState({updatingLimit: null})}>
                    </a>
                    <div className="modal-wrapper">
                        <div className="modal">
                            
                        <div className="modal-header">
                            <h2>{this.state.updatingLimit['symbol']}</h2>
                            <div className="modal-body">Update Limit Price</div>
                            <button
                                type="button"
                                className="modal-close-button"
                                // onClick={}
                            >
                                <input 
                                    type={"number"}  step="0.01"
                                    value={this.state.valueLimitPrice != null ? this.state.valueLimitPrice : null}
                                    placeholder={this.state.updatingLimit['targetPrice']}
                                    onChange={this.setValueLimitPrice}
                                />
                            {/* <span>&times;</span> */}
                            </button>
                        </div>
                        <button onClick={this.saveLimitPrice} className="modal-save-button">Save!</button>
                        </div>
                    </div>
                </> : null}
                {this.renderList()}
            </div>
            </React.Fragment  >
        )
    }
}

export default ListCollectionsTarget;