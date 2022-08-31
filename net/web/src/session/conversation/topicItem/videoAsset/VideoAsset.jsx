import React, { useRef, useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import ReactResizeDetector from 'react-resize-detector';
import { SelectOutlined, ExpandOutlined, VideoCameraOutlined, MinusCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { VideoAssetWrapper } from './VideoAsset.styled';
import { useVideoAsset } from './useVideoAsset.hook';

export function VideoAsset({ thumbUrl, lqUrl, hdUrl }) {

  const { state, actions } = useVideoAsset();
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const video = useRef(null);

  const activate = () => {
    if (dimension.width / dimension.height > window.innerWidth / window.innerHeight) {
      let width = Math.floor(window.innerWidth * 8 / 10);
      let height = Math.floor(width * dimension.height / dimension.width);
      actions.setActive(width, height);
    }
    else {
      let height = Math.floor(window.innerHeight * 8 / 10);
      let width = Math.floor(height * dimension.width / dimension.height);
      actions.setActive(width, height);
    }
  }

  return (
    <VideoAssetWrapper>
      <ReactResizeDetector handleWidth={true} handleHeight={true}>
        {({ width, height }) => {
          if (width != dimension.width || height != dimension.height) {
            setDimension({ width, height });
          }
          return <img style={{ height: '100%', objectFit: 'contain' }} src={thumbUrl} alt="" />
        }}
      </ReactResizeDetector>
      <div class="overlay" style={{ width: dimension.width, height: dimension.height }}>
        { !state.active && (
          <div onClick={activate}>
            <VideoCameraOutlined style={{ fontSize: 32, color: '#eeeeee', cursor: 'pointer' }} />
          </div>
        )}
        <Modal centered={true} visible={state.active} width={state.width + 12} bodyStyle={{ paddingBottom: 0, paddingTop: 6, paddingLeft: 6, paddingRight: 6, backgroundColor: '#dddddd' }} footer={null} destroyOnClose={true} closable={false} onCancel={actions.clearActive}>
          <video autoplay="true" controls src={hdUrl} width={state.width} height={state.height} 
              playsinline="true" />
        </Modal>
      </div>
    </VideoAssetWrapper>
  )
}

