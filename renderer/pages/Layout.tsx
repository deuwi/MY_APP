import React from 'react';

import Link from '../components/Link';

const Layout = (props) => {
    return (
        <div>
        <header></header>
        <div className='row'>
            <nav>
                <Link href="/Wallets"><div>Wallet</div></Link>
                <Link href="/Sniper"><div>Sniper</div></Link>
            </nav>
            <props.body/>
        </div>
        </div>
    );
}

export default Layout;