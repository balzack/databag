import React, { useEffect, useState } from 'react';
import { TopicItemWrapper } from './TopicItem.styled';
import ReactResizeDetector from 'react-resize-detector';

export function TopicItem({ topic }) {

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
    <TopicItemWrapper>
      <div>{ text }</div>
    </TopicItemWrapper>
  )
}
