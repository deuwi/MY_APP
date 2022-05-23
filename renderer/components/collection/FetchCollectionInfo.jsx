// @flow 
import React, { useEffect, useCallback } from 'react';
import {useStream} from 'react-fetch-streams';
const FetchCollectionInfo = (props) => {
  const [ data, setData ] = React.useState([]);
  const [ error, setError ] = React.useState(false);
  const onNext = useCallback(async res => {
    const data = await res.json();
    console.log(data, props.symbol)
    if (data) {
      setData(data);
    }
  }, [setData])

    
    
  if (props.symbol ) {
    console.log(props.symbol)
    useStream(`http://api-devnet.magiceden.dev/v2/collections/${props.symbol}/listings?offset=0&limit=20`, {onNext});
  } 
  return (
    <div>
      {props.symbol}
      {/* {data} */}
      {error}
    </div>
  );
};

export default FetchCollectionInfo;