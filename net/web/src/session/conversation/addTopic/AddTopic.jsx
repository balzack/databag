import { AddTopicWrapper } from './AddTopic.styled';
import { useAddTopic } from './useAddTopic.hook';
import { Modal, Input, Menu, Dropdown, Spin } from 'antd';
import { useRef } from 'react';
import { SoundOutlined, VideoCameraOutlined, PictureOutlined, FontColorsOutlined, FontSizeOutlined, SendOutlined } from '@ant-design/icons';
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
      addTopic();
    }
  }

  const addTopic = async () => {
    if (state.messageText || state.assets.length) {
      try {
        await actions.addTopic();
      }
      catch (err) {
        console.log(err);
        Modal.error({
          title: 'Failed to Post Message',
          content: 'Please try again.',
        });
      }
    }
  };

  const onSelectImage = (e) => {
    actions.addImage(e.target.files[0]);
    attachImage.current.value = '';
  };

  const onSelectAudio = (e) => {
    actions.addAudio(e.target.files[0]);
    attachAudio.current.value = '';
  };

  const onSelectVideo = (e) => {
    actions.addVideo(e.target.files[0]);
    attachVideo.current.value = '';
  };

  const renderItem = (item, index) => {
    if (item.image) {
      return <img style={{ height: 128, objectFit: 'contain' }} src={item.url} alt="" />
    }
    if (item.audio) {
      return <AudioFile onLabel={(label) => actions.setLabel(index, label)} url={item.url} />
    }
    if (item.video) {
      return <VideoFile onPosition={(pos) => actions.setPosition(index, pos)} url={item.url} />
    }
    return <></>
  };

  const removeItem = (index) => {
    actions.removeAsset(index);
  };

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
      { state.assets.length > 0 && (
        <div class="assets">
          <Carousel pad={32} items={state.assets} itemRenderer={renderItem} itemRemove={removeItem} />
        </div>
      )}
      <div class="message">
        <Input.TextArea ref={msg} placeholder="New Message" spellCheck="true" autoSize={{ minRows: 2, maxRows: 6 }}
            enterkeyhint="send" onKeyDown={(e) => keyDown(e)} onChange={(e) => actions.setMessageText(e.target.value)}
            value={state.messageText} autocapitalize="none" />
      </div>
      <div class="buttons">
        { state.enableImage && (
          <div class="button space" onClick={() => attachImage.current.click()}>
            <PictureOutlined />
          </div> 
        )}
        { state.enableVideo && (
          <div class="button space" onClick={() => attachVideo.current.click()}>
            <VideoCameraOutlined />
          </div> 
        )}
        { state.enableAudio && (
          <div class="button space" onClick={() => attachAudio.current.click()}>
            <SoundOutlined />
          </div> 
        )}
        <div class="bar space" />
        <div class="button space">
          <Dropdown overlay={picker} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="top">
            <FontColorsOutlined />
          </Dropdown>
        </div>
        <div class="button space">
          <Dropdown overlay={sizer} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="top">
            <FontSizeOutlined />
          </Dropdown>
        </div>
        <div class="end">
          <div class="button" onClick={addTopic}>
            { state.busy && (
              <Spin size="small" />
            )}
            { !state.busy && (
              <SendOutlined />
            )}
          </div>
        </div>
      </div>
    </AddTopicWrapper>
  );
}

