import { useRef, useState, useCallback } from 'react';
import { avatar } from '../constants/Icons'
import { Topic, Card, Profile } from 'databag-client-sdk';
import classes from './Message.module.css'
import { Image, Skeleton, ActionIcon } from '@mantine/core'
import { ImageAsset } from './imageAsset/ImageAsset';
import { AudioAsset } from './audioAsset/AudioAsset';
import { VideoAsset } from './videoAsset/VideoAsset';
import { BinaryAsset } from './binaryAsset/BinaryAsset';
import type { MediaAsset } from '../conversation/Conversation';
import { useMessage } from './useMessage.hook';
import failed from '../images/failed.png'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useResizeDetector } from 'react-resize-detector';

export function Message({ topic, card, profile, host }: { topic: Topic, card: Card | null, profile: Profile | null, host: boolean }) {
  const { state, actions } = useMessage();
  const scroll = useRef(null as HTMLDivElement | null);
  const { locked, data, created, topicId, status, transform } = topic;
  const { name, handle, node } = profile || card || { name: null, handle: null, node: null }  
  const { text, textColor, textSize, assets } = data || { text: null, textColor: null, textSize: null }
  const textStyle = textColor && textSize ? { color: textColor, fontSize: textSize } : textColor ? { color: textColor } : textSize ? { fontSize: textSize } : {}
  const logoUrl = profile ? profile.imageUrl : card ? card.imageUrl : avatar;
  const timestamp = actions.getTimestamp(created);
  
  const [showScroll, setShowScroll] = useState(false);
  const onResize = useCallback(() => {
    setShowScroll(scroll.current ? scroll.current.scrollWidth > scroll.current.clientWidth : false);
  }, []);
  const { ref } = useResizeDetector({ onResize });
  const scrollLeft = () => {
    if (scroll.current) {
      scroll.current.scrollTo({ top: 0, left: scroll.current.scrollLeft+92, behavior: 'smooth' }); 
    }
  }
  const scrollRight = () => {
    if (scroll.current) {
      scroll.current.scrollTo({ top: 0, left: scroll.current.scrollLeft-92, behavior: 'smooth' }); 
    }
  }

  const options = [];

  const media = !assets ? [] : assets.map((asset: MediaAsset, index: number) => {
    if (asset.image || asset.encrypted?.type === 'image') {
      return <ImageAsset key={index} topicId={topicId} asset={asset as MediaAsset} />
    } else if (asset.audio || asset.encrypted?.type === 'audio') {
      return <AudioAsset key={index} topicId={topicId} asset={asset as MediaAsset} />
    } else if (asset.video || asset.encrypted?.type === 'video') {
      return <VideoAsset key={index} topicId={topicId} asset={asset as MediaAsset} />
    } else if (asset.binary || asset.encrypted?.type === 'binary') {
      return <BinaryAsset key={index} topicId={topicId} asset={asset as MediaAsset} />
    } else {
      return <div key={index}></div>
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
          { !locked && status === 'confirmed' && text && (
            <div style={textStyle}>
              <span className={classes.text}>{ text }</span>
            </div>
          )}
          { !locked && status !== 'confirmed' && (
            <div className={classes.unconfirmed}>
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} width="70%" radius="xl" />
            </div>
          )}
          { locked && (
            <div className={classes.locked}>{ state.strings.encrypted }</div>
          )}
        </div>
      </div>
      { !locked && media.length > 0 && transform === 'complete' && (
        <div className={classes.media}>
          <div ref={scroll} className={classes.assets}>
            <div ref={ref} className={classes.thumbs}>
              { media }
            </div>
          </div>
          { showScroll && (
            <div className={classes.goleft}>
              <ActionIcon variant="light" onClick={scrollLeft}>
                <IconChevronLeft size={18} stroke={1.5} />
              </ActionIcon>
            </div>
          )}
          { showScroll && (
            <div className={classes.goright}>
              <ActionIcon variant="light" onClick={scrollRight}>
                <IconChevronRight size={18} stroke={1.5} />
              </ActionIcon>
            </div>
          )}
        </div>
      )}
      { !locked && media.length > 0 && transform === 'incomplete' && (
        <Skeleton height={64} circle mb="xl" />
      )}
      { !locked && media.length > 0 && transform !== 'complete' && transform !== 'incomplete' && (
        <Image className={classes.failed} src={failed} fit="contain" />
      )}
    </div>
  )
}
