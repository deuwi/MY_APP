import React, { Component } from 'react';
import localStorage from 'local-storage';
import FindCollection from './FindCollection';

type MyState = {
    value: string;
    collectionBool: Boolean;
};
type CollectionType = any[]
type CustomValue = Array<CollectionType>;
type Props = {
    collections: CustomValue;
}
class InputSearchCollect extends Component <Props, Readonly<MyState>> {
    constructor(props: Props) {
        super(props)
        this.state = {
            value: '',
            collectionBool: false
        };
    }
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
            if (collections) {
                collections.forEach(element => {
                    console.log(element[0], this.state.value)
                    if (element[0] == this.state.value) {
                        finded = true
                    }
                    else {
                        console.log(element[0] , this.state.value)
                    }
                });
            } else {
                collections = []
            }
               
            if (finded) {
                alert('Deja register')
            }else {
                collections.push([this.state.value, 0.01])
                localStorage.set('collections', collections)
                window.dispatchEvent(new Event("storage"));
                
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
                    <FindCollection noStyle='true' symbol={this.state.value} submit={<input type="submit" value="Envoyer" />} />
                </div>
                </form>
            
            </div>
        );
    }
}

export default InputSearchCollect;