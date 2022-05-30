import React, {useState} from 'react';
import localStorage from 'electron-json-storage';

import Link from '../components/Link';
import Sniper from './Sniper';
import Wallets from './Wallets';
const Layout = () => {
    const [pages, setPages] = useState("sniper");
    return (
        <div>
            <header></header>
            <div className='row'>
                <nav>
                    <button onClick={() => setPages('wallets')}><div>Wallet</div></button>
                    <button onClick={() => setPages('sniper')}><div>Sniper</div></button >
                </nav>
                {pages == "wallets" ? <Wallets/>  : null }
                {pages == "sniper"  ? <Sniper wallets={localStorage.getSync("wallets")} changePage={setPages}/>   : null }
                
                {/* <props.body/> */}
            </div>
        </div>
    )
}

export default Layout;