import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player'
import { SketchPicker } from "react-color";
import { Button, Dropdown, Input, Tooltip, Menu } from 'antd';
import { AddTopicWrapper, BusySpin } from './AddTopic.styled';
import { Carousel } from '../../../Carousel/Carousel';
import { useAddTopic } from './useAddTopic.hook';
import { FontColorsOutlined, FontSizeOutlined, PaperClipOutlined, SendOutlined } from '@ant-design/icons';
import { AudioFile } from './AudioFile/AudioFile';
import { VideoFile } from './VideoFile/VideoFile';

export function AddTopic() {

  let [ items, setItems] = useState([]);
  const { state, actions } = useAddTopic();
  const attachImage = useRef(null);
  const attachAudio = useRef(null);
  const attachVideo = useRef(null);

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

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <input type='file' name="asset" accept="image/*" ref={attachImage} onChange={e => onSelectImage(e)} style={{display: 'none'}}/>
        <div onClick={() => attachImage.current.click()}>Attach Image</div>
      </Menu.Item>
      <Menu.Item key="1">
        <input type='file' name="asset" accept="audio/*" ref={attachAudio} onChange={e => onSelectAudio(e)} style={{display: 'none'}}/>
        <div onClick={() => attachAudio.current.click()}>Attach Audio</div>
      </Menu.Item>
      <Menu.Item key="2">
        <input type='file' name="asset" accept="video/*" ref={attachVideo} onChange={e => onSelectVideo(e)} style={{display: 'none'}}/>
        <div onClick={() => attachVideo.current.click()}>Attach Video</div>
      </Menu.Item>
    </Menu>
  );

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

  const onSend = () => {
    if (state.messageText || state.assets.length) {
      actions.addTopic();
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (state.messageText) {
        actions.addTopic();
      }
    }
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

  return (
    <AddTopicWrapper>
      <div class="container noselect">
        <div class="carousel">
          <Carousel ready={true} items={state.assets} itemRenderer={renderItem} itemRemove={removeItem} />
        </div>
        <div class="input">
          <Input.TextArea placeholder="Message" autoSize={{ minRows: 2, maxRows: 6 }} onKeyPress={onKey}
            style={{ color: state.textColor, fontSize: state.textSize }}
            onChange={(e) => actions.setMessageText(e.target.value)} value={state.messageText} />
        </div>
        <div class="buttons">
          <div class="option">
            <Dropdown overlay={menu} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="topRight">
              <Button icon={<PaperClipOutlined />} size="large" />
            </Dropdown>
          </div>
          <div class="option">
            <Dropdown overlay={sizer} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="topRight">
              <Button icon={<FontSizeOutlined />} size="large" />
            </Dropdown>
          </div>
          <div class="option">
            <Dropdown overlay={picker} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="topRight">
              <Button icon={<FontColorsOutlined />} size="large" />
            </Dropdown>
          </div>
          <div class="send">
            <Button icon={<SendOutlined />} onClick={onSend} size="large" loading={state.busy} />
          </div>
        </div>
      </div>
    </AddTopicWrapper>
  );

}
 
