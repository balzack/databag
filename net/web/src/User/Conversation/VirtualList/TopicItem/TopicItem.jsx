import React, { useEffect, useState } from 'react';
import { TopicItemWrapper } from './TopicItem.styled';
import ReactResizeDetector from 'react-resize-detector';

export function TopicItem({ topic, padding, onHeight }) {

  const [ text, setText ] = useState(null);

  useEffect(() => {
    try {
      setText(JSON.parse(topic.data.topicDetail.data).text);
    }
    catch(err) {
      console.log("invalid topic", topic);
    }
  }, [topic]);

  return (
      <ReactResizeDetector handleHeight={true}>
        {({ height }) => {
          if (typeof height !== 'undefined' && height > 0) {
            onHeight(height);
          }
          return (
            <TopicItemWrapper style={{ paddingTop: padding }}>
              <div>{ text }</div>
            </TopicItemWrapper>
          )
        }}
      </ReactResizeDetector>
    )
}

