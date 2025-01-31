import { React } from 'react';
import classes from './Calling.module.css'
import { useCalling } from './useCalling.hook';

export function Calling() {
  const { state, actions } = useCalling();

  return <div className={classes.inactive}></div>
}

