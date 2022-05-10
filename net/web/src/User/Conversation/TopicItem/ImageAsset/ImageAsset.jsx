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
    updateState({ popout: true });
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
      <Modal visible={state.popout} width={'80%'} bodyStyle={{ paddingBottom: 6, paddingTop: 6, paddingLeft: 6, paddingRight: 6, backgroundColor: '#dddddd' }} footer={null} destroyOnClose={true} closable={false} onCancel={() => { updateState({ popout: false })}}>
        <img style={{ width: '100%', objectFit: 'contain' }} src={fullUrl} alt="" />
      </Modal>
    </ImageAssetWrapper>
  )
}

