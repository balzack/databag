import React, { useEffect, useState } from 'react';
import { TopicItemWrapper } from './TopicItem.styled';
import ReactResizeDetector from 'react-resize-detector';
import { useTopicItem } from './useTopicItem.hook';
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
      return <img style={{ height: '100%', objectFit: 'container' }} src={actions.getAssetUrl(asset.image.full)} alt="" />
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
        <Carousel items={state.assets} itemRenderer={renderAsset} />
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
