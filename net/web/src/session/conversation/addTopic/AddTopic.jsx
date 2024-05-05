import { AddTopicWrapper } from './AddTopic.styled';
import { useAddTopic } from './useAddTopic.hook';
import { Modal, Tooltip, Input, Menu, Dropdown, Spin } from 'antd';
import { useRef } from 'react';
import { FieldBinaryOutlined, SoundOutlined, VideoCameraOutlined, PictureOutlined, FontColorsOutlined, FontSizeOutlined, SendOutlined } from '@ant-design/icons';
import { SketchPicker } from "react-color";
import { AudioFile } from './audioFile/AudioFile';
import { VideoFile } from './videoFile/VideoFile';
import { BinaryFile } from './binaryFile/BinaryFile';
import { Carousel } from 'carousel/Carousel';
import { Gluejar } from '@charliewilco/gluejar'

export function AddTopic({ contentKey }) {

  const { state, actions } = useAddTopic(contentKey);

  const [modal, modalContext] = Modal.useModal();
  const attachImage = useRef(null);
  const attachAudio = useRef(null);
  const attachVideo = useRef(null);
  const attachBinary = useRef(null);
  const msg = useRef();

  const keyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
        modal.error({
          title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
          content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
          bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
        });
      }
    }
  };

  const pasteImage = async (e) => {
    if (e.images.length > 0) {
      var data = await fetch(e.images[0]);
      var blob = await data.blob();
      actions.addImage(blob);
      e.images.length = 0;
    }
  }

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

  const onSelectBinary = (e) => {
    actions.addBinary(e.target.files[0]);
    attachBinary.current.value = '';
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
    if (item.binary) {
      return <BinaryFile onLabel={(label) => actions.setLabel(index, label)} label={item.label} extension={item.extension} url={item.url} />
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
      { modalContext }

      <Gluejar onPaste={files => pasteImage(files)} onError={err => console.error(err)} acceptedFiles={['image/png', 'image/jpeg', 'image/bmp']} />

      <input type='file' name="asset" accept="image/*" ref={attachImage} onChange={e => onSelectImage(e)} style={{display: 'none'}}/>
      <input type='file' name="asset" accept="audio/*" ref={attachAudio} onChange={e => onSelectAudio(e)} style={{display: 'none'}}/>
      <input type='file' name="asset" accept="video/*" ref={attachVideo} onChange={e => onSelectVideo(e)} style={{display: 'none'}}/>
      <input type='file' name="asset" accept="*/*" ref={attachBinary} onChange={e => onSelectBinary(e)} style={{display: 'none'}}/>
      { state.assets.length > 0 && (
        <div className="assets">
          <Carousel pad={32} items={state.assets} itemRenderer={renderItem} itemRemove={removeItem} />
        </div>
      )}
      <div className="message">
        <Input.TextArea ref={msg} placeholder={state.strings.newMessage} spellCheck="true" autoSize={{ minRows: 2, maxRows: 6 }}
            enterkeyhint="send" onKeyDown={(e) => keyDown(e)} onChange={(e) => actions.setMessageText(e.target.value)}
            value={state.messageText} autocapitalize="none" />
      </div>
      <div className="buttons">
        { state.enableImage && (
          <Tooltip placement="top" title={state.display === 'small' ? null : state.strings.attachImage}>
            <div className="button space" onClick={() => attachImage.current.click()}>
              <PictureOutlined />
            </div> 
          </Tooltip>
        )}
        { state.enableVideo && (
          <Tooltip placement="top" title={state.display === 'small' ? null : state.strings.attachVideo}>
            <div className="button space" onClick={() => attachVideo.current.click()}>
              <VideoCameraOutlined />
            </div> 
          </Tooltip>
        )}
        { state.enableAudio && (
          <Tooltip placement="top" title={state.display === 'small' ? null : state.strings.attachAudio}>
            <div className="button space" onClick={() => attachAudio.current.click()}>
              <SoundOutlined />
            </div> 
          </Tooltip>
        )}
        { state.enableBinary && (
          <Tooltip placement="top" title={state.display === 'small' ? null : state.strings.attachFile}>
            <div className="button space" onClick={() => attachBinary.current.click()}>
              <FieldBinaryOutlined />
            </div> 
          </Tooltip>
        )}
        { (state.enableImage || state.enableAudio || state.enableVideo || state.enableBinary) && (
          <div className="bar space" />
        )}
        <div className="button space">
          <Tooltip placement="top" title={state.display === 'small' ? null : state.strings.fontColor}>
            <Dropdown overlay={picker} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="top">
              <FontColorsOutlined />
            </Dropdown>
          </Tooltip>
        </div>
        <div className="button space">
          <Tooltip placement="top" title={state.display === 'small' ? null : state.strings.fontSize}>
            <Dropdown overlay={sizer} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="top">
              <FontSizeOutlined />
            </Dropdown>
          </Tooltip>
        </div>
        <div className="end">
          <div className="button" onClick={addTopic}>
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

