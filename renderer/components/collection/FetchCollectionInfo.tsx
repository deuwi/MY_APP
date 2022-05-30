// @flow 
import React, { useEffect, useCallback } from 'react';
import * as solanaWeb3 from '@solana/web3.js';

interface myProps {
  msRefresh: number,
  collection: object,
  wallet: {
    key: { _keypair: { secretKey: { [s: string]: number; } | ArrayLike<number>; }; }
  }
}
function generateKey (pre) {
  return `${pre}_${new Date().getTime()}`;
}
function getPublickey  (walletSave: { _keypair: { secretKey: { [s: string]: number; } | ArrayLike<number>; }; }) {
  //  PUBLIC KEY
  const keypair = solanaWeb3.Keypair.fromSecretKey(
    Uint8Array.from(Object.values(walletSave._keypair.secretKey))
  );
  return new solanaWeb3.PublicKey(keypair.publicKey.toBase58())
}
const FetchCollectionInfo = (props: myProps) => {
  const [ data, setData ] = React.useState<{
    type: string,
    price: number
  }>();
  const [ error, setError ] = React.useState(false);
  const [ newData, setNewData ] = React.useState(false);
  var oldData:any = []

  const sendBuyTransaction = useCallback(async res => {
    console.log(res)
    res.json().then((res) => {
      console.log(res)
    })
  }, [])
  const onNext = useCallback(async res => {
    const dataNext:Array<any> = await res.json();
    if (dataNext[0].signature != oldData.signature) {
      oldData = dataNext[0]
      // console.log(dataNext[0], data)
      setData(dataNext[0]);
      setNewData(true)
      console.log(dataNext[0], dataNext[0].type, dataNext[0].price <= props.collection['targetPrice'] , props.wallet)
      if (dataNext[0].type != 'list' && dataNext[0].price <= props.collection['targetPrice']) {
        console.log('send buy request')
        let buyerPubKey = solanaWeb3.Keypair.fromSecretKey(Uint8Array.from(Object.values(props.wallet.key._keypair.secretKey))).publicKey.toBase58()
        let sellerPubKey = dataNext[0].seller
        let auctionHouseAddress = ''
        let tokenMint = dataNext[0].tokenMint
        let price = dataNext[0].price
        let tokenAta = ''
        console.log(dataNext[0])
        fetch(`https://api-mainnet.magiceden.dev/v2/instructions/buy_now?buyer=${buyerPubKey}&seller=${sellerPubKey}&auctionHouseAddress=${auctionHouseAddress}&tokenMint=${tokenMint}&tokenATA=${tokenAta}&price=${price}&buyerReferral=&sellerReferral=&buyerExpiry=&sellerExpiry=0`).then(sendBuyTransaction)
        // 'buyer=               BR5yr7fMRsmKLCt8LAn3UjkaWERyPhmJZQkRxkKX29Lq'
        // 'seller=              EdUK2ijRsAotd33aHFoLAtdSFfe6KxQnwC81Up37WFfj'
        // 'auctionHouseAddress= E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe&'
        // 'tokenMint=           DY95JfPRtwnRB259coEFe3xdBLikDSoo14DbnnpjXhhc&'
        // 'tokenATA=            GhBVuTNXeavyVDznEfSaU9wK3VzKRvoXk3YzPqjZcPwT'
        // 'sellerReferral=      autMW8SgBkVYeBgqYiTuJZnkvDZMVU2MHJh9Jh7CSQ2'
      }

      //timeOut for New Activity
      setTimeout(() => {
        setNewData(false)

      }, 3000)
    }
  }, [setData])
  // if (props.symbol ) {
  //   useStream(`http://api-mainnet.magiceden.dev/v2/collections/${props.symbol}/activities?offset=0&limit=2`, {onNext});
  // } 
  if (props.collection['symbol']) {
    setTimeout(() => {
      fetch(`http://api-mainnet.magiceden.dev/v2/collections/${props.collection['symbol']}/activities?offset=0&limit=1`).then(onNext)
    }, props.msRefresh ? props.msRefresh : 1000)
  }
  return (
    <div
      key={generateKey(props.collection['symbol'])} 
      style={{
      fontFamily: 'Consolas',
      backgroundColor: 'black',
      color: 'white',
      padding: '5px',
      width: '80%',
      display: 'flex',
      flexDirection: 'row'
    }}>
      <div style={{width: '33%' }}>{props.collection['symbol']} </div>
      {/* <div style={{width: '33%', 
        textAlign: 'center'}}>{data?.type} == list </div> */}
      <div style={{width: '33%', 
                  textAlign: 'right', 
                  display:'flex', 
                  flexDirection: 'row', 
                  justifyContent: 'space-between'}}>
        <div>{data?.price + ' <= ' + props.collection['targetPrice'] }</div>
        <div>{(data?.price <= props.collection['targetPrice'] && data?.type === 'list' ? 
          <span style={{color: 'green'}}>true</span> : 
          <span style={{color: 'red'}}>false</span>)}
        </div>
      </div>
      {newData ? <div style={{width: '10%', display: 'flex', flexDirection: 'row-reverse', color: 'green', marginRight: '-100%'}}>{'New!'}</div>: null}
    </div>
  );
};

export default FetchCollectionInfo;