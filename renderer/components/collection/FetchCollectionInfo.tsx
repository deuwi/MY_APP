// @flow 
import React, { useEffect, useCallback } from 'react';
interface myProps {
  msRefresh: number,
  collection: object
}
const FetchCollectionInfo = (props: myProps) => {
  const [ data, setData ] = React.useState<{
    type: string,
    price: number
  }>();
  const [ error, setError ] = React.useState(false);
  const [ newData, setNewData ] = React.useState(false);
  var oldData:any = []
  const onNext = useCallback(async res => {
    const dataNext:Array<any> = await res.json();
    console.log(dataNext)
    if (dataNext[0].signature != oldData.signature) {
      console.log(dataNext[0].signature, oldData.signature)
      oldData = dataNext[0]
      // console.log(dataNext[0], data)
      setData(dataNext[0]);
      setNewData(true)

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
    <div style={{
      fontFamily: 'Consolas',
      backgroundColor: 'black',
      color: 'white',
      padding: '5px',
      width: '80%',
      display: 'flex',
      flexDirection: 'row'
    }}>
      <div style={{width: '33%' }}>{props.collection['symbol']} </div>
      <div style={{width: '33%', 
        textAlign: 'center'}}>{data?.type} == list </div>
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