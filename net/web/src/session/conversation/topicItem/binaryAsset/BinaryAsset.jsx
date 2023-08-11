import React, { useState, useRef } from 'react';
import { Progress, Modal, Spin } from 'antd';
import ReactResizeDetector from 'react-resize-detector';
import { DownloadOutlined } from '@ant-design/icons';
import { BinaryAssetWrapper } from './BinaryAsset.styled';
import { useBinaryAsset } from './useBinaryAsset.hook';
import Colors from 'constants/Colors';

import background from 'images/audio.png';

export function BinaryAsset({ asset }) {

  const [width, setWidth] = useState(0);

  const { actions, state } = useBinaryAsset(asset);

  return (
    <BinaryAssetWrapper>
      <ReactResizeDetector handleWidth={false} handleHeight={true}>
        {({ height }) => {
          if (height !== width) {
            setWidth(height);
          }
          return <div style={{ height: '100%', width: width }} />
        }}
      </ReactResizeDetector>
      <div class="player" style={{ backgroundColor: '#888888', borderRadius: 4, width: width, height: width }}>
        <div class="label">{ asset.label }</div>
        <div class="control" onClick={actions.download}>
          <DownloadOutlined style={{ fontSize: 32, color: '#eeeeee', cursor: 'pointer' }} />
        </div>
        <div class="unsealing">
          { state.unsealing && (
            <Progress percent={Math.floor(100 * state.block / state.total)} size="small" showInfo={false} trailColor={Colors.white} strokeColor={Colors.background} />
          )}
        </div>
        <div class="extension">{ asset.extension }</div>
      </div>
    </BinaryAssetWrapper>
  )
}

