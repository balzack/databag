import React, { useRef, useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import ReactResizeDetector from 'react-resize-detector';
import { SelectOutlined, ExpandOutlined, MinusCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { ImageAssetWrapper } from './ImageAsset.styled';

export function ImageAsset({ thumbUrl, fullUrl }) {

  const [state, setState] = useState({ width: 0, height: 0, popout: false });

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  const onPopOut = () => {
    if (state.width == 0 || state.height == 0) {
      updateState({ popout: true, popWidth: '50%', popHeight: '50%' });
    }
    else {
      if (state.width / state.height > window.innerWidth / window.innerHeight) {
        updateState({ popout: true, popWidth: '80%', popHeight: 'auto' });
      }
      else {
        let width = Math.floor(80 * state.width / state.height);
        updateState({ popout: true, popWidth: width + '%', popHeight: 'auto' });
      }
    }
  }

  return (
    <ImageAssetWrapper>
      <ReactResizeDetector handleWidth={true} handleHeight={true}>
        {({ width, height }) => {
          if (width != state.width || height != state.height) {
            updateState({ width, height });
          }
          return <img style={{ height: '100%', objectFit: 'contain' }} src={thumbUrl} alt="" />
        }}
      </ReactResizeDetector>
      <div class="viewer">
        <div class="overlay" style={{ width: state.width, height: state.height }}>
          <div class="expand" onClick={() => onPopOut()}>
            <ExpandOutlined style={{ fontSize: 24, color: '#eeeeee', cursor: 'pointer' }} />
          </div>
        </div>
      </div>
      <Modal visible={state.popout} width={state.popWidth} height={state.popHeight} bodyStyle={{ width: '100%', height: 'auto', paddingBottom: 6, paddingTop: 6, paddingLeft: 6, paddingRight: 6, backgroundColor: '#dddddd' }} footer={null} destroyOnClose={true} closable={false} onCancel={() => { updateState({ popout: false })}}>
        <img style={{ width: '100%', objectFit: 'contain' }} src={fullUrl} alt="" />
      </Modal>
    </ImageAssetWrapper>
  )
}

