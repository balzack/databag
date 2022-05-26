import React, { useEffect, useState } from 'react';
import { TopicItemWrapper } from './TopicItem.styled';
import { useTopicItem } from './useTopicItem.hook';
import { VideoAsset } from './VideoAsset/VideoAsset';
import { AudioAsset } from './AudioAsset/AudioAsset';
import { ImageAsset } from './ImageAsset/ImageAsset';
import { Avatar } from 'avatar/Avatar';
import { Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Carousel } from 'Carousel/Carousel';

export function TopicItem({ host, topic }) {

  const { state, actions } = useTopicItem(topic);

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

  const onEdit = () => {
    console.log("EDIT TOPIC");
  }

  const onDelete = () => {
    console.log("DELETE TOPIC");
  }

  const Options = () => {
    if (state.owner) {
      return (
        <div class="buttons">
          <div class="button" onClick={() => onEdit()}>
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
        <div class="message">{ state.message?.text }</div>
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
