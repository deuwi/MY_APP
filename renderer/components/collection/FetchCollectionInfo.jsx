// @flow 
import React, { useEffect, useCallback } from 'react';
import {useStream} from 'react-fetch-streams';
// prop need to contain 
  //limit of collection
  //wallet 
const FetchCollectionInfo = (props) => {
  const [ data, setData ] = React.useState([]);
  const [ error, setError ] = React.useState(false);
  var oldData = []
  const onNext = useCallback(async res => {
    const data = await res.json();
    console.log(data, props.symbol)
    if (data) {
      setData(data);

    }
  }, [setData])

    
  if (props.symbol ) {
    console.log(props.symbol)
    useStream(`http://api-mainnet.magiceden.dev/v2/collections/${props.symbol}/activities?offset=0&limit=1`, {onNext});
  } 
  return (
    <div style={{
      backgroundColor: 'black',
      color: 'white',
      margin: '5px',
      padding: '5px',
      width: '80%'
    }}>
      {props.symbol}
      " "
      {data[0]?.type}
      " "
      {data[0]?.price}
    </div>
  );
};

export default FetchCollectionInfo;