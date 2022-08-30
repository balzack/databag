import React, { useRef, useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import ReactResizeDetector from 'react-resize-detector';
import { SelectOutlined, ExpandOutlined, MinusCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { ImageAssetWrapper } from './ImageAsset.styled';
import { useImageAsset } from './useImageAsset.hook';

export function ImageAsset({ thumbUrl, fullUrl }) {

  const { state, actions } = useImageAsset();
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const popout = () => {
    if (dimension.width / dimension.height > window.innerWidth / window.innerHeight) {
      let width = Math.floor(window.innerWidth * 8 / 10);
      let height = Math.floor(width * dimension.height / dimension.width);
      actions.setPopout(width, height);
    }
    else {
      let height = Math.floor(window.innerHeight * 8 / 10);
      let width = Math.floor(height * dimension.width / dimension.height);
      actions.setPopout(width, height);
    }
  }

  const clearPopout = (e) => {
    e.stopPropagation();
    actions.clearPopout();
  }

  return (
    <ImageAssetWrapper>
      <ReactResizeDetector handleWidth={true} handleHeight={true}>
        {({ width, height }) => {
          if (width != dimension.width || height != dimension.height) {
            setDimension({ width, height });
          }
          return <img style={{ height: '100%', objectFit: 'contain' }} src={thumbUrl} alt="" />
        }}
      </ReactResizeDetector>
      { state.display !== 'small' && (
        <div class="viewer">
          <div class="overlay" style={{ width: dimension.width, height: dimension.height }}
              onClick={popout} />
          <Modal centered={true} visible={state.popout} width={state.width + 12} bodyStyle={{ width: '100%', height: 'auto', paddingBottom: 6, paddingTop: 6, paddingLeft: 6, paddingRight: 6, backgroundColor: '#dddddd' }} footer={null} destroyOnClose={true} closable={false} onCancel={actions.clearPopout}>
            <img style={{ width: '100%', objectFit: 'contain' }} src={fullUrl} alt="topic image" />
          </Modal>
        </div>
      )}
      { state.display === 'small' && !state.popout && (
        <div class="viewer" style={{ width: dimension.width, height: dimension.height }} onClick={popout} />
      )}
      { state.display === 'small' && state.popout && (
        <div class="fullscreen" onClick={clearPopout} onTouchEnd={clearPopout}>
          <img class="image" src={fullUrl} />
        </div>
      )}
    </ImageAssetWrapper>
  )
}

