import React, { useEffect, useCallback } from 'react';
import Head from 'next/head';
import {useStream} from 'react-fetch-streams';
// import Loader from '../loader';
const FindCollection = (props ) =>  {
  const [ data, setData ] = React.useState([]);
  const [ error, setError ] = React.useState(false);

  const onNext = useCallback(async res => {
    const data = await res.json();
    
    if (data.floorPrice) {
      setData(data);
      setError(false);
    }else {
      setError(true);
    }
  }, [setData]);
  
  if (props.symbol != 'undefined' ) {
    useStream(`https://api-mainnet.magiceden.dev/v2/collections/${props.symbol}/stats`, {onNext});
  }
  const generateKey = (pre) => {
    return `${pre}_${new Date().getTime()}`;
  }
  return ( 
    
    <React.Fragment  >
      
      {error || data.length>0 ? null : 
        <div  className={props.noStyle ? null :'item'}>
          {/* {Loader('big')} */}
          <div  className={props.noStyle ? 'itemSearch' : 'detail'}>
              <div>{ data.symbol ? data.symbol : null}</div>
              <div>{props.priceLimit}</div>
              <div>{data.floorPrice ? ( props.noStyle ? `Floor: ${data.floorPrice / 1000000000}` : data.floorPrice / 1000000000)  : 0}</div>

          </div>
          {props.submit? props.submit: props.button}
        </div>
      }
      
    </React.Fragment>
  );
};

export default FindCollection;
