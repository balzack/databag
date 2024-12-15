import React, {useState, useEffect, useRef, useCallback} from 'react'
import { Focus } from 'databag-client-sdk'
import classes from './Conversation.module.css'
import { useConversation } from './useConversation.hook';
import { IconSend, IconTextSize, IconTextColor, IconVideo, IconFile, IconDisc, IconCamera, IconX, IconSettings, IconHome, IconServer, IconShield, IconLock, IconExclamationCircle } from '@tabler/icons-react'
import { Menu, Divider, Text, Textarea, ActionIcon, Loader } from '@mantine/core'
import { Message } from '../message/Message';
import { modals } from '@mantine/modals'
import { ImageFile } from './imageFile/ImageFile';
import { VideoFile } from './videoFile/VideoFile';
import { AudioFile } from './audioFile/AudioFile';
import { BinaryFile } from './binaryFile/BinaryFile';
import { SketchPicker } from "react-color";

const PAD_HEIGHT = (1024 - 64);
const LOAD_DEBOUNCE = 1000;

export type MediaAsset = {
  encrypted?: { type: string, thumb: string, label: string, extension: string, parts: { blockIv: string, partId: string }[] },
  image?: { thumb: string, full: string },
  audio?: { label: string, full: string },
  video?: { thumb: string, lq: string, hd: string },
  binary?: { label: string, extension: string, data: string }
}

export function Conversation() {
  const thread = useRef(null as HTMLDivElement | null);
  const scrollPos = useRef(0);
  const debounce = useRef(false);
  const [sending, setSending] = useState(false);
  const { state, actions } = useConversation();
  const attachImage = useRef({ click: ()=>{} } as HTMLInputElement);
  const attachVideo = useRef({ click: ()=>{} } as HTMLInputElement);
  const attachAudio = useRef({ click: ()=>{} } as HTMLInputElement);
  const attachBinary = useRef({ click: ()=>{} } as HTMLInputElement);

  const addImage = (image: File | undefined) => {
    if (image) {
      actions.addImage(image);
    }
  }

  const addVideo = (video: File | undefined) => {
    if (video) {
      actions.addVideo(video);
    }
  }

  const addAudio = (audio: File | undefined) => {
    if (audio) {
      actions.addAudio(audio);
    }
  }

  const addBinary = (binary: File | undefined) => {
    if (binary) {
      actions.addBinary(binary);
    }
  }

  const sendMessage = async () => {
    if (!sending) {
      setSending(true);
      try {
        await actions.send();
      } catch (err) {
        console.log(err);
        showError();
      }
      setSending(false);
    }
  }

  const showError = () => {
    modals.openConfirmModal({
      title: state.strings.operationFailed,
      withCloseButton: true,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Text>{state.strings.tryAgain}</Text>,
      cancelProps: { display: 'none' },
      confirmProps: { display: 'none' },
    })
  }

  const onScroll = () => {
    if (thread.current) {
      const { scrollHeight, clientHeight, scrollTop } = thread.current;
      if (thread.current && state.loadingMore) {
        thread.current.scrollTop = scrollPos.current;
      } else {
        if (scrollPos.current > scrollTop && scrollHeight - (clientHeight - scrollTop) < PAD_HEIGHT) {
          if (scrollTop < scrollPos.current) {
            actions.more();
          }
          scrollPos.current = (clientHeight - scrollHeight) + PAD_HEIGHT;
          thread.current.scrollTop = scrollPos.current;
        } else {
          if (scrollTop < (clientHeight - scrollHeight) + PAD_HEIGHT) {
            scrollPos.current = (clientHeight - scrollHeight) + PAD_HEIGHT; 
          } else {
            scrollPos.current = scrollTop;
          }
        }
      }
    }
  };

  const topics = state.topics.map((topic, idx) => {
    const { host } = state;
    const card = state.cards.get(topic.guid) || null;
    const profile = state.profile?.guid === topic.guid ? state.profile : null;
    return (
      <Message
        key={idx}
        topic={topic}
        card={card}
        profile={profile}
        host={host}
      />
    )
  })

  const media = state.assets.map((asset, index: number) => {
    if (asset.type === 'image') {
      return <ImageFile key={index} source={asset.file} />
    } else if (asset.type === 'video') {
      return <VideoFile key={index} source={asset.file} thumbPosition={(position: number) => actions.setThumbPosition(index, position)} disabled={sending} />
    } else if (asset.type === 'audio') {
      return <AudioFile key={index} source={asset.file} updateLabel={(label: string) => actions.setLabel(index, label)} disabled={sending} />
    } else {
      return <BinaryFile key={index} source={asset.file} />
    }
  });

  return (
    <div className={classes.conversation}>
      <div className={classes.header}>
        <div className={classes.status}>
          <ActionIcon variant="subtle"> 
            <IconSettings size={24} />
          </ActionIcon>
          <Divider size="sm" orientation="vertical" />
          { state.detailSet && state.host === true && (
            <IconHome size={24} />
          )}
          { state.detailSet && state.host === false && (
            <IconServer size={24} />
          )}
          { state.detailSet && state.sealed === true && (
            <IconShield size={24} />
          )}
          { state.detailSet && state.access === false && (
            <IconExclamationCircle size={24} />
          )}
        </div>
        <div className={classes.title}> 
          { state.detailSet && state.subject && (
            <Text className={classes.label}>{ state.subject }</Text>
          )}
          { state.detailSet && state.host && !state.subject && state.subjectNames.length == 0 && (
            <Text className={classes.label}>{ state.strings.notes }</Text>
          )}
          { state.detailSet && !state.subject && state.subjectNames.length > 0 && (
            <Text className={classes.label}>{ state.subjectNames.join(', ') }</Text>
          )}
          { state.detailSet && !state.subject && state.unknownContacts > 0 && (
            <Text className={classes.unknown}>{ `, ${state.strings.unknownContact} (${state.unknownContacts})` }</Text>
          )}
        </div>
        <div className={classes.control}>
          <IconX size={24} className={classes.close} onClick={actions.close} />
        </div>
      </div>
      <div ref={thread} className={classes.frame} style={state.loadingMore ? { overflow: 'hidden' } : { overflow: 'auto' }} onScroll={onScroll}>
        { state.loaded && (
          <div className={classes.thread}>
            <div className="topicPad" />
            {topics}
          </div>
        )}
        { state.loadingMore && (
          <div className={classes.topSpinner}>
            <Loader size={32} />
          </div>
        )}
        { !state.loaded && (
          <div className={classes.bottomSpinner}>
            <Loader size={48} />
          </div>
        )}
      </div>
      <div className={classes.divider} />
      <div className={classes.add}>
        <input type='file' name="asset" accept="image/*" ref={attachImage} onChange={e => addImage(e.target?.files?.[0])} style={{display: 'none'}}/>
        <input type='file' name="asset" accept="video/*" ref={attachVideo} onChange={e => addVideo(e.target?.files?.[0])} style={{display: 'none'}}/>
        <input type='file' name="asset" accept="audio/*" ref={attachAudio} onChange={e => addAudio(e.target?.files?.[0])} style={{display: 'none'}}/>
        <input type='file' name="asset" accept="*/*" ref={attachBinary} onChange={e => addBinary(e.target?.files?.[0])} style={{display: 'none'}}/>
        <div className={classes.files}>
          { media }
        </div>
        <Textarea className={classes.message} placeholder={state.strings.newMessage} styles={{ input: {color: state.textColorSet ? state.textColor : null, fontSize: state.textSizeSet ? state.textSize : null }}} value={state.message} onChange={(event) => actions.setMessage(event.currentTarget.value)} disabled={!state.detail || state.detail.locked || sending} />
        <div className={classes.controls}>
          <ActionIcon className={classes.attach} variant="light" disabled={!state.detail || state.detail.locked || sending} onClick={() => attachImage.current.click()}> 
            <IconCamera />
          </ActionIcon>
          <ActionIcon className={classes.attach} variant="light" disabled={!state.detail || state.detail.locked || sending} onClick={() => attachVideo.current.click()}> 
            <IconVideo />
          </ActionIcon>
          <ActionIcon className={classes.attach} variant="light" disabled={!state.detail || state.detail.locked || sending} onClick={() => attachAudio.current.click()}> 
            <IconDisc />
          </ActionIcon>
          <ActionIcon className={classes.attach} variant="light" disabled={!state.detail || state.detail.locked || sending} onClick={() => attachBinary.current.click()}>
            <IconFile />
          </ActionIcon>
          <Divider size="sm" orientation="vertical" />
          <Menu shadow="md" position="top">
            <Menu.Target>
              <ActionIcon className={classes.attach} variant="light" disabled={!state.detail || state.detail.locked || sending}> 
                <IconTextSize />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => actions.setTextSize(12)}>
                { state.strings.textSmall }
              </Menu.Item>
              <Menu.Item onClick={() => actions.setTextSize(16)}>
                { state.strings.textMedium }
              </Menu.Item>
              <Menu.Item onClick={() => actions.setTextSize(20)}>
                { state.strings.textLarge }
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Menu shadow="md" position="top">
            <Menu.Target>
              <ActionIcon className={classes.attach} variant="light" disabled={!state.detail || state.detail.locked || sending}> 
                <IconTextColor />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <SketchPicker disableAlpha={true}
                color={state.textColor}
                onChange={(color) => {
                  actions.setTextColor(color.hex);
                }} />
            </Menu.Dropdown>
          </Menu>
          <div className={classes.send}>
            <ActionIcon className={classes.attach} variant="light" disabled={(!state.message && state.assets.length === 0) || !state.detail || state.detail.locked || sending} onClick={sendMessage} loading={sending}> 
              <IconSend />
            </ActionIcon>
          </div>
        </div> 
      </div>
    </div>
  );
}
