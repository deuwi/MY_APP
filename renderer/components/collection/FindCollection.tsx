import React, { useEffect, useCallback, ReactElement } from 'react';
import Head from 'next/head';
import {useStream} from 'react-fetch-streams';
// import Loader from '../loader';

interface myProps  {
  symbol?: string
  noStyle: boolean,
  priceLimit: string,
  submit: ReactElement<any, any>,
  button: ReactElement<any, any>
}

const FindCollection = (props: myProps ) =>  {
  const [ data, setData ] = React.useState<{
      floorPrice: number,
      symbol: string,
      listedCount: number,
      avgPrice24hr: number,
      volumeAll: number,
    }>();
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
  
  if (props.symbol != null ) {
    useStream(`http://api-mainnet.magiceden.dev/v2/collections/${props.symbol}/stats`, {onNext});
  }
  const generateKey = (pre) => {
    return `${pre}_${new Date().getTime()}`;
  }
  return ( 
    
    <React.Fragment  >
      
      {error || !data ? null : 
        <div  className={props.noStyle ? null :'item'}>
          {/* {Loader('big')} */}
          <div  className={props.noStyle ? 'itemSearch' : 'detail'}>
              <div>{ data?.symbol }</div>
              <div>{props.priceLimit}</div>
              <div>{data?.floorPrice ? ( props.noStyle ? `Floor: ${data?.floorPrice / 1000000000}` : data.floorPrice / 1000000000)  : 0}</div>

          </div>
          {props.submit? props.submit: props.button}
        </div>
      }
      
    </React.Fragment>
  );
};

export default FindCollection;
