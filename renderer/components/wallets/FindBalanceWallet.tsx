import React, { useEffect, useCallback, FunctionComponent } from 'react';
import Head from 'next/head';
import { Theme, makeStyles, createStyles } from '@material-ui/core';
import {useStream} from 'react-fetch-streams';

type MyProps = {
  publicKey: string
}

type Mystate = {
  data: {
    lamports?: number
  }
}

const Wallet: FunctionComponent<MyProps | Mystate> = (props, lamports = []) =>  {
  const [ data, setData ] = React.useState(lamports);

  const onNext = useCallback(async res => {
    const data = await res.json();
    console.log(data)
    setData(data);
  }, [setData]);

  useStream(`https://public-api.solscan.io/account/${props.publicKey}`, {onNext});
  
  return (
    <React.Fragment>
      <div>{data.lamports ? data.lamports * 0.000000001 : 0}</div>
    </React.Fragment>
  );
};

export default Wallet;
