import React, { Component } from 'react';
import localStorage from 'electron-json-storage';
import FindCollection from './FindCollection';
import os from 'os'
localStorage.setDataPath(os.tmpdir())

type MyState = {
    value: string;
    collectionBool: Boolean;
}

type CollectionType = {
    symbol: string,
    targetPrice: number
}

type Props = {
    collections: Array<Object>;
}
class InputSearchCollect extends Component <Props, MyState> {
    props: Props
    state:MyState = {
        value: '',
        collectionBool: false
    };
    handleChange = (event) => {    
        console.log(event.target.value)
        this.setState({value: event.target.value});  
    }
    handleSubmit = (event) => {
      this.addCollection()
      event.preventDefault();
    }
    addCollection = () => {
        try {
            let collections = this.props.collections
            let finded = false
            if (collections.length ) {
                collections.forEach(element => {
                    console.log(element['symbol'], this.state.value)
                    if (element['symbol'] == this.state.value) {
                        finded = true
                    }
                    else {
                        console.log(element['symbol'] , this.state.value)
                    }
                });
            } else {
                collections = []
            }
            if (finded) {
                alert('Deja register')
            }else {
                collections.push({symbol: this.state.value,targetPrice: 0.01})
                localStorage.set('collections', collections, (err) => {
                    
                    window.dispatchEvent(new Event("storage"));
                })
                
                this.setState({value: ''}); 
                // setTimeout(()=> {
                //     window.location.reload();
                // }, 500)
            }
        } catch (error) {
            // alert('error')
        }
    }
    render() {
        return (
            <React.Fragment  >
            <div className='collectionForm'>
                <h2>Target Collection :</h2> 
                <form className='inputRow' onSubmit={this.handleSubmit}>
                    <label>
                    <input 
                        type="text" 
                        value={this.state.value} 
                        onChange={this.handleChange} 
                        placeholder="idCollection"/>        
                    </label>
                    
                <div>
                    {this.state.value != '' ? <FindCollection noStyle={true} symbol={this.state.value} submit={<input type="submit" value="Envoyer" />} priceLimit={''} button={undefined} /> : null}
                    
                </div>
                </form>
            
            </div>
            </React.Fragment>
        );
    }
}

export default InputSearchCollect;