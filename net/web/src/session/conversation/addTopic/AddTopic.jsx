import { AddTopicWrapper } from './AddTopic.styled';
import { useAddTopic } from './useAddTopic.hook';
import { Input, Menu, Dropdown } from 'antd';
import { useRef, useState } from 'react';
import { SoundOutlined, VideoCameraOutlined, PictureOutlined, FontColorsOutlined, FontSizeOutlined, PaperClipOutlined, SendOutlined } from '@ant-design/icons';
import { SketchPicker } from "react-color";
import { AudioFile } from './audioFile/AudioFile';
import { VideoFile } from './videoFile/VideoFile';
import { Carousel } from 'carousel/Carousel';

export function AddTopic({ cardId, channelId }) {

  const { state, actions } = useAddTopic(cardId, channelId);
  const attachImage = useRef(null);
  const attachAudio = useRef(null);
  const attachVideo = useRef(null);
  const msg = useRef();

  const keyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      msg.current.blur();
    }
  }

  const onSelectImage = (e) => {
    actions.addImage(e.target.files[0]);
    attachImage.current.value = '';
  }

  const onSelectAudio = (e) => {
    actions.addAudio(e.target.files[0]);
    attachAudio.current.value = '';
  }

  const onSelectVideo = (e) => {
    actions.addVideo(e.target.files[0]);
    attachVideo.current.value = '';
  }

  const renderItem = (item, index) => {
    if (item.image) {
      return <img style={{ height: '100%', objectFit: 'contain' }} src={item.url} alt="" />
    }
    if (item.audio) {
      return <AudioFile onLabel={(label) => actions.setLabel(index, label)}/>
    }
    if (item.video) {
      return <VideoFile onPosition={(pos) => actions.setPosition(index, pos)} url={item.url} />
    }
    return <></>
  }

  const removeItem = (index) => {
    actions.removeAsset(index);
  }

  const picker = (
    <Menu style={{ backgroundColor: 'unset', boxShadow: 'unset' }}>
      <SketchPicker disableAlpha={true}
        color={state.textColor}
        onChange={(color) => {
          actions.setTextColor(color.hex);
        }} />
    </Menu>
  );

  const sizer = (
    <Menu>
      <Menu.Item key={8}><div onClick={() => actions.setTextSize(8)}>Small</div></Menu.Item>
      <Menu.Item key={14}><div onClick={() => actions.setTextSize(14)}>Medium</div></Menu.Item>
      <Menu.Item key={20}><div onClick={() => actions.setTextSize(20)}>Large</div></Menu.Item>
    </Menu>
  );

  return (
    <AddTopicWrapper>
      <input type='file' name="asset" accept="image/*" ref={attachImage} onChange={e => onSelectImage(e)} style={{display: 'none'}}/>
      <input type='file' name="asset" accept="audio/*" ref={attachAudio} onChange={e => onSelectAudio(e)} style={{display: 'none'}}/>
      <input type='file' name="asset" accept="video/*" ref={attachVideo} onChange={e => onSelectVideo(e)} style={{display: 'none'}}/>
      <div class="carousel">
        { state.assets.length > 0 && (
          <Carousel ready={true} items={state.assets} itemRenderer={renderItem} itemRemove={removeItem} />
        )}
      </div>
      <div class="message">
        <Input.TextArea ref={msg} placeholder="New Message" spellCheck="true" autoSize={{ minRows: 2, maxRows: 6 }}
            autocapitalize="none" enterkeyhint="send" onKeyDown={(e) => keyDown(e)} />
      </div>
      <div class="buttons">
        <div class="button space" onClick={() => attachImage.current.click()}>
          <PictureOutlined />
        </div> 
        <div class="button space" onClick={() => attachVideo.current.click()}>
          <VideoCameraOutlined />
        </div> 
        <div class="button space" onClick={() => attachAudio.current.click()}>
          <SoundOutlined />
        </div> 
        <div class="bar space" />
        <div class="button space">
          <Dropdown overlay={sizer} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="topLeft">
            <FontSizeOutlined />
          </Dropdown>
        </div>
        <div class="button space">
          <Dropdown overlay={picker} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="topLeft">
            <FontColorsOutlined />
          </Dropdown>
        </div>
        <div class="end">
          <div class="button"><SendOutlined /></div>
        </div>
      </div>
    </AddTopicWrapper>
  );
}

