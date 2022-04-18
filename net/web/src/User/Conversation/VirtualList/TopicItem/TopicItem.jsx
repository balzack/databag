import React, { useEffect } from 'react';
import { TopicItemWrapper } from './TopicItem.styled';
import ReactResizeDetector from 'react-resize-detector';

export function TopicItem({ topic, onHeight }) {

  return (
      <ReactResizeDetector handleHeight={true}>
        {({ height }) => {
          if (typeof height !== 'undefined' && height > 0) {
            onHeight(height);
          }
          return (
            <TopicItemWrapper>
              <div>topic</div>
            </TopicItemWrapper>
          )
        }}
      </ReactResizeDetector>
    )
}

