import React from 'react';
import Head from 'next/head';
import { Theme, makeStyles, createStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Link from '../components/Link';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
    },
  })
);

function Home() {
  const classes = useStyles({});

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript-material-ui)</title>
      </Head>
      <div className={classes.root}>
        <Typography gutterBottom>
          <Link href="/Sniper">Go to the next page</Link>
        </Typography>
      </div>
    </React.Fragment>
  );
};

export default Home;
