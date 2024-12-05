import { avatar } from '../constants/Icons'
import { Topic, Card, Profile } from 'databag-client-sdk';
import classes from './Message.module.css'
import { Image } from '@mantine/core'
import { ImageAsset } from './imageAsset/ImageAsset';
import { AudioAsset } from './audioAsset/AudioAsset';
import { VideoAsset } from './videoAsset/VideoAsset';
import { BinaryAsset } from './binaryAsset/BinaryAsset';
import type { MediaAsset } from '../conversation/Conversation';
import { useMessage } from './useMessage.hook';

export function Message({ topic, card, profile, host }: { topic: Topic, card: Card | null, profile: Profile | null, host: boolean }) {
  const { state, actions } = useMessage();

  const { locked, data, created, topicId } = topic;
  const { name, handle, node } = profile || card || { name: null, handle: null, node: null }  
  const { text, textColor, textSize, assets } = data || { text: null, textColor: null, textSize: null }
  const textStyle = textColor && textSize ? { color: textColor, fontSize: textSize } : textColor ? { color: textColor } : textSize ? { fontSize: textSize } : {}
  const logoUrl = profile ? profile.imageUrl : card ? card.imageUrl : avatar;
  const timestamp = actions.getTimestamp(created);
  
  const options = [];

  const media = !assets ? [] : assets.map((asset: MediaAsset, index: number) => {
    if (asset.image || asset.encrypted?.type === 'image') {
      return <ImageAsset key={index} topicId={topicId} asset={asset as MediaAsset} />
    } else if (asset.audio || asset.encrypted?.type === 'audio') {
      return <AudioAsset key={index} topicId={topicId} asset={asset as MediaAsset} />
    } else if (asset.video || asset.encrypted?.type === 'video') {
      return <VideoAsset key={index} topicId={topicId} asset={asset as MediaAsset} />
    } else {
      return <></>
    }
  });

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
                <span className={classes.unknown}>{ state.strings.unknownContact }</span>
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
      { media.length > 0 && (
        <div className={classes.assets}>
          { media }
        </div>
      )}
    </div>
  )
}
