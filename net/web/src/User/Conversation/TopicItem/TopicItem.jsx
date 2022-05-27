import React, { useEffect, useState } from 'react';
import { TopicItemWrapper } from './TopicItem.styled';
import { useTopicItem } from './useTopicItem.hook';
import { VideoAsset } from './VideoAsset/VideoAsset';
import { AudioAsset } from './AudioAsset/AudioAsset';
import { ImageAsset } from './ImageAsset/ImageAsset';
import { Avatar } from 'avatar/Avatar';
import { Space, Button, Input } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Carousel } from 'Carousel/Carousel';

export function TopicItem({ host, topic }) {

  const { state, actions } = useTopicItem(topic);
  const [ edit, setEdit ] = useState(null);

  let name = state.name ? state.name : state.handle;
  let nameClass = state.name ? 'set' : 'unset';
  let d = new Date();
  let offset = d.getTime() / 1000 - state.created;
  
  if (name == null) {
    name = "unknown contact"
    nameClass = "unknown"
  }

  const renderAsset = (asset) => {
    if (asset.image) {
      return <ImageAsset thumbUrl={actions.getAssetUrl(asset.image.thumb)}
          fullUrl={actions.getAssetUrl(asset.image.full)} />
    }
    if (asset.video) {
      return <VideoAsset thumbUrl={actions.getAssetUrl(asset.video.thumb)}
          lqUrl={actions.getAssetUrl(asset.video.lq)} hdUrl={actions.getAssetUrl(asset.video.hd)} />
    }
    if (asset.audio) {
      return <AudioAsset label={asset.audio.label} audioUrl={actions.getAssetUrl(asset.audio.full)} />
    }
    return <></>
  }

  const Options = () => {
    if (state.editing) {
      return <></>;
    }
    if (state.owner) {
      return (
        <div class="buttons">
          <div class="button" onClick={() => actions.setEditing(true)}>
            <EditOutlined />
          </div>
          <div class="button" onClick={() => actions.removeTopic()}>
            <DeleteOutlined />
          </div>
        </div>
      );
    }
    if (host) {
      return (
        <div class="buttons">
          <div class="button" onClick={() => actions.removeTopic()}>
            <DeleteOutlined />
          </div>
        </div>
      );
    }
    return <></>;
  }

  const Message = () => {
    if (state.editing) {
      return (
        <div class="editing">
          <Input.TextArea style={{ resize: 'none' }} defaultValue={state.message?.text} placeholder="message"
            style={{ color: state.textColor, fontSize: state.textSize }}
            onChange={(e) => actions.setEdit(e.target.value)} rows={3} bordered={false}/>
          <div class="controls">
          <Space>
            <Button onClick={() => actions.setEditing(false)}>Cancel</Button>
            <Button type="primary" onClick={() => actions.setMessage()} loading={state.body}>Save</Button>
          </Space>
          </div>
        </div>
      );
    }
    return <div style={{ color: state.textColor, fontSize: state.textSize }}>{ state.message?.text }</div>
  }

  return (
    <TopicItemWrapper>
      <div class="avatar">
        <Avatar imageUrl={state.imageUrl} />
      </div>
      <div class="topic">
        <div class="info">
          <div class={nameClass}>{ name }</div>
          <div>{ getTime(offset) }</div>
        </div>
        <Carousel ready={state.ready} items={state.assets} itemRenderer={renderAsset} />
        <div class="message">
          <Message />
        </div>
        <div class="options">
          <Options />
        </div>
      </div>
    </TopicItemWrapper>
  )
}

function getTime(offset) {
  if (offset < 1) {
    return ''
  }
  if (offset < 60) {
    return Math.floor(offset) + "s";
  }
  offset /= 60;
  if (offset < 60) {
    return Math.floor(offset) + "m";
  }
  offset /= 60;
  if (offset < 24) {
    return Math.floor(offset) + "h";
  }
  offset /= 24;
  if (offset < 366) {
    return Math.floor(offset) + "d";
  }
  offset /= 365.25;
  return Math.floor(offset) + "y";
}
