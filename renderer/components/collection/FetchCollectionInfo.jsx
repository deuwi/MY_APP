// @flow 
import React, { useEffect, useCallback } from 'react';
import {useStream} from 'react-fetch-streams';
// prop need to contain 
  //limit of collection
  //wallet 
const FetchCollectionInfo = (props) => {
  const [ data, setData ] = React.useState([]);
  const [ error, setError ] = React.useState(false);
  const [ newData, setNewData ] = React.useState(false);
  var oldData = []
  const onNext = useCallback(async res => {
    const dataNext = await res.json();
    if (dataNext[0].signature != oldData.signature) {
      console.log(dataNext[0].signature, oldData.signature)
      oldData = dataNext[0]
      // console.log(dataNext[0], data)
      setData(dataNext[0]);
      setNewData(true)

      setTimeout(() => {
        setNewData(false)
      }, 3000)
    }
  }, [setData])

  // if (props.symbol ) {
  //   useStream(`http://api-mainnet.magiceden.dev/v2/collections/${props.symbol}/activities?offset=0&limit=2`, {onNext});
  // } 
  let msRefresh = 1000
  if (props.msRefresh) {
    msRefresh = props.msRefresh
  }
  setTimeout(() => {
    fetch(`http://api-mainnet.magiceden.dev/v2/collections/${props.collection[0]}/activities?offset=0&limit=1`).then(onNext)
  }, 1000)
  return (
    <div style={{
      backgroundColor: 'black',
      color: 'white',
      margin: '5px',
      padding: '5px',
      width: '80%',
      display: 'flex',
      flexDirection: 'row',
    }}>
      <div style={{width: '33%'}}>{props.collection[0]}</div>
      <div style={{width: '33%', textAlign: 'center'}}>{data?.type} == list</div>
      <div style={{width: '33%', textAlign: 'right', display:'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <div>{data?.price + ' <= ' + props.collection[1] }</div>
        <div>{(data?.price <= props.collection[1] && data?.type === 'list' ? <span style={{color: 'green'}}>true</span> : <span style={{color: 'red'}}>false</span>)}</div>
        
      </div>
      {newData ? <div style={{width: '10%', display: 'flex', flexDirection: 'row-reverse', color: 'green', marginRight: '-100%'}}>{'New!'}</div>: null}
    </div>
  );
};

export default FetchCollectionInfo;