import React, { useEffect, useState } from 'react';
import { TopicItemWrapper } from './TopicItem.styled';
import { useTopicItem } from './useTopicItem.hook';
import { VideoAsset } from './VideoAsset/VideoAsset';
import { AudioAsset } from './AudioAsset/AudioAsset';
import { ImageAsset } from './ImageAsset/ImageAsset';
import { Avatar } from 'avatar/Avatar';
import { CommentOutlined } from '@ant-design/icons';
import { Carousel } from 'Carousel/Carousel';

export function TopicItem({ topic }) {

  const { state, actions } = useTopicItem(topic);

  let name = state.name ? state.name : state.handle;
  let nameClass = state.name ? 'set' : 'unset';
  let d = new Date();
  let offset = d.getTime() / 1000 - state.created;

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

  return (
    <TopicItemWrapper>
      <div class="avatar">
        <Avatar imageUrl={state.imageUrl} />
      </div>
      <div class="topic">
        <div class="info">
          <div class={nameClass}>{ name }</div>
          <div>{ getTime(offset) }</div>
          <div class="comments">
            <CommentOutlined />
          </div>
        </div>
        <Carousel ready={state.ready} items={state.assets} itemRenderer={renderAsset} />
        <div class="message">{ state.message?.text }</div>
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
