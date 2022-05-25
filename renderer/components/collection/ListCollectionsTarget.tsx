import React, { Component } from 'react';
import localStorage from 'local-storage';
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
    updatingLimit: object,      
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
    
    constructor(props: MyProps) {
        super(props);
        this.state = {
            valueLimit: undefined,
            updatingLimit: null,
            showModal: false,
            valueLimitPrice: undefined
        }
    }

    
        
    // componentDidMount() {
    //     if (typeof window !== 'undefined') {
    //         this.setState({collections: localStorage.get('collections') != undefined ? localStorage.get('collections') : []})
    //         // console.log(localStorage.get('collections'))
    //         window.addEventListener('storage', this.localStorageUpdated)
    //     }
    // }
    
    // localStorageUpdated = () => {
    //     this.updateState(localStorage.get('collections'))
    // }
    // updateState(value){
    //     this.setState({collections:value})
    // }
    // componentDidMount(): void {
    //     this.setState({
    //         collections: localStorage.get('collections') != 'undefined' ? localStorage.get('collections') : [],
    //     })
    //     const onNext = useCallback(async res => {
    //         const data = await res.json();
            
    //         if (data.floorPrice) {
    //             setData(data);
    //             setError(false)
    //         }else {
    //             setError(true)
    //         }
    //         }, [setData]);
            
    //         if (props.symbol != 'undefined') {
    //             useStream(`http://api-mainnet.magiceden.dev/v2/collections/${props.symbol}/stats`, {onNext});
    //         }
    //     }
    updateValueLimit = (event) => {
        let item = event.target.value
        this.setState({
            valueLimit: item
        })
    }
    deleteCollectionTargeted = (item) => {
        let newCollectionTargeted = []
        this.props.collections.forEach(collection => {
          if (item[0] != collection[0]) {
              console.log(item[0], collection[0])
            newCollectionTargeted.push(collection)
          }
        });

        window.localStorage.set('collections', newCollectionTargeted)
        window.dispatchEvent(new Event("storage"));


        // window.location.reload();
        // this.setState({
        //     collections: newCollectionTargeted
        // })
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
            valueLimitPrice: event.target.value
        })
    }
    saveLimitPrice = () => {
        if (this.state.valueLimitPrice && this.state.valueLimitPrice > 0) {
            let collectionUpdated = []
            let item = this.state.updatingLimit
            this.props.collections.forEach((collection) => {
                console.log(item[0], '==', collection[0])
                if (item[0] == collection[0]) {
                    //change limit price
                    collection[1] = this.state.valueLimitPrice
                }
                collectionUpdated.push(collection)
            })
            // this.setState({updatingLimit: [null, null]})
            window.localStorage.set('collections', collectionUpdated)
            this.setState({updatingLimit: null})
            console.log( collectionUpdated)
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
            <div  className='detail'>
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
            {this.props.collections[0] != null ? this.props.collections.map((item, i) => {
                console.log(this.props.collections)
                return( 
                    <div key={this.generateKey(item)}>
                
                        {/* <ModalUpdateCollection isShowing={this.state.updatingLimit != null} /> */}
                        <FindCollection 
                            symbol={item[0]!}  
                            // price limit
                            priceLimit={<>                  
                                {item[1]}
                            </>} 
                            button={
                                <div>
                                <button 
                                    title='Update' 
                                    onClick={() => this.toggleLimitPriceSetting(item)}>
                                        <FontAwesomeIcon icon={['fas', 'pen-to-square']} />
                                </button>
                                
                                
                                <button type='button' 
                                        title='Delete' 
                                        onClick={() => this.deleteCollectionTargeted(item)}>
                                 <FontAwesomeIcon icon={['fas', 'delete-left']} size="xs" />
                                </button>
                                </div>}
                        />
                    </div>)  
            }): null}
            </>

        )
    }
    render() {
        return (
            <div>
                {this.state.updatingLimit != null ? <>
                    <a className="modal-overlay" onClick={() => this.setState({updatingLimit: null})}>
                    </a>
                    <div className="modal-wrapper">
                        <div className="modal">
                            
                        <div className="modal-header">
                            <h2>{this.state.updatingLimit[0]}</h2>
                            <div className="modal-body">Update Limit Price</div>
                            <button
                                type="button"
                                className="modal-close-button"
                                // onClick={}
                            >
                                <input 
                                    type={"number"}  step="0.01"
                                    value={this.state.valueLimitPrice != null ? this.state.valueLimitPrice : null}
                                    placeholder={this.state.updatingLimit[1]}
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
        )
    }
}

export default ListCollectionsTarget;