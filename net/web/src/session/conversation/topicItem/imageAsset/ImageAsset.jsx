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
    if (dimension.width == 0 || dimension.height == 0) {
      actions.setPopout('50%', '50%');
    }
    else {
      if (dimension.width / dimension.height > window.innerWidth / window.innerHeight) {
        actions.setPopout('80%', 'auto');
      }
      else {
        let width = Math.floor(80 * (dimension.width / dimension.height) * (window.innerHeight / window.innerWidth));
        actions.setPopout(width + '%', 'auto');
      }
    }
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
          <div class="overlay" style={{ width: dimension.width, height: dimension.height }}>
            <div class="expand" onClick={popout}>
              <ExpandOutlined style={{ fontSize: 24, color: '#eeeeee', cursor: 'pointer' }} />
            </div>
          </div>
          <Modal visible={state.popout} width={state.width} height={state.height} bodyStyle={{ width: '100%', height: 'auto', paddingBottom: 6, paddingTop: 6, paddingLeft: 6, paddingRight: 6, backgroundColor: '#dddddd' }} footer={null} destroyOnClose={true} closable={false} onCancel={actions.clearPopout}>
            <img style={{ width: '100%', objectFit: 'contain' }} src={fullUrl} alt="" />
          </Modal>
        </div>
      )}
      { state.display === 'small' && !state.popout && (
        <div class="viewer" style={{ width: dimension.width, height: dimension.height }} onClick={popout} />
      )}
      { state.display === 'small' && state.popout && (
        <div class="fullscreen" onClick={actions.clearPopout}>
          <img class="image" src={fullUrl} />
        </div>
      )}
    </ImageAssetWrapper>
  )
}

