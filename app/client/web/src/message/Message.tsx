import { useEffect, useState } from 'react';
import { avatar } from '../constants/Icons'
import { Topic, Card, Profile } from 'databag-client-sdk';
import classes from './Message.module.css'
import { Image } from '@mantine/core'

function getTimestamp(created: number, timeFormat: string, dateFormat: string) {
  const now = Math.floor((new Date()).getTime() / 1000)
  const date = new Date(created * 1000);
  const offset = now - created;
  if(offset < 86400) {
    if (timeFormat === '12h') {
      return date.toLocaleTimeString("en-US", {hour: 'numeric', minute:'2-digit'});
    }
    else {
      return date.toLocaleTimeString("en-GB", {hour: 'numeric', minute:'2-digit'});
    }
  }
  else if (offset < 31449600) {
    if (dateFormat === 'mm/dd') {
      return date.toLocaleDateString("en-US", {day: 'numeric', month:'numeric'});
    }
    else {
      return date.toLocaleDateString("en-GB", {day: 'numeric', month:'numeric'});
    }
  }
  else {
    if (dateFormat === 'mm/dd') {
      return date.toLocaleDateString("en-US");
    }
    else {
      return date.toLocaleDateString("en-GB");
    }
  }
}

export function Message({ topic, card, profile, host, getAssetUrl, strings, timeFormat, dateFormat }: { topic: Topic, card: Card | null, profile: Profile | null, host: boolean, getAssetUrl: (topicId: string, assetId: string)=>Promise<string>, strings: any, timeFormat: string, dateFormat: string }) {

  useEffect(() => {
    console.log("NEW MESSAGE");
  }, []);

  const { locked, data, created } = topic;
  const { name, handle, node } = profile || card || { name: null, handle: null, node: null }  
  const { text, textColor, textSize } = data || { text: null, textColor: null, textSize: null }
  const textStyle = textColor && textSize ? { color: textColor, fontSize: textSize } : textColor ? { color: textColor } : textSize ? { fontSize: textSize } : {}
  const logoUrl = profile ? profile.imageUrl : card ? card.imageUrl : avatar;
  const timestamp = getTimestamp(created, timeFormat, dateFormat);
  
  const options = [];
  const assets = [];

  return (
    <div className={classes.topic}>
      <div className={classes.content}>
        <Image radius="sm" className={classes.logo} src={logoUrl} />
        <div className={classes.body}>
          <div className={classes.header}>
            <div className={classes.name}>
              { name && (
                <span>{ name }</span>
              )}
              { !name && handle && (
                <span>{ `${handle}${node ? '/' + node : ''}` }</span>
              )}
              { !name && !handle && (
                <span className={classes.unknown}>{ strings.unknownContact }</span>
              )}
              <span className={classes.timestamp}> { timestamp }</span>
            </div>
            <div className={classes.options}>OPTIONS</div>
          </div>
          { text && (
            <div style={textStyle}>{ text }</div>
          )}
        </div>
      </div>
      <div className={classes.assets}>ASSETS</div>
    </div>
  )
}
