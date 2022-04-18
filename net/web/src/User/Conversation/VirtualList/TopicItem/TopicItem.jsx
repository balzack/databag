import React, { useEffect } from 'react';
import { TopicItemWrapper } from './TopicItem.styled';
import ReactResizeDetector from 'react-resize-detector';

export function TopicItem({ topic, padding, onHeight }) {

  return (
      <ReactResizeDetector handleHeight={true}>
        {({ height }) => {
          if (typeof height !== 'undefined' && height > 0) {
            onHeight(height);
          }
          return (
            <TopicItemWrapper style={{ paddingTop: padding }}>
              <div>{ JSON.stringify(topic) }</div>
            </TopicItemWrapper>
          )
        }}
      </ReactResizeDetector>
    )
}

